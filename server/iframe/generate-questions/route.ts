import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Readable } from 'stream';

export const runtime = 'nodejs';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.paper_Groq_api_key || "",
});

// Helper utility to extract chapter content
// Helper utility to extract chapter content
function extractChapterContent(fullText: string, chapters: string[]): string {
    let combinedContent = "";
    // Normalize text for easier matching (keep original for extraction if needed, but simple case-insensitive regex is better)

    // 1. Identify all potential chapter boundaries in the document
    // Patterns: 
    // - "Chapter 5", "Unit 5", "Module 5", "Lesson 5"
    // - "5. Title" (At start of lines)
    const chapterMatches: { number: string, index: number }[] = [];

    // Regex explanation:
    // (?:^|\n) -> Match start of line
    // \s* -> Optional whitespace
    // (?:chapter|unit|lesson|module)\s+ -> Keyword followed by space
    // ([0-9]+(?:\.[0-9]+)*) -> The chapter number (e.g. 5, 5.1) -> Group 1
    //
    // OR
    //
    // (?:^|\n)\s* -> Start of line
    // ([0-9]+(?:\.[0-9]+)*)\.\s+ -> Number, dot, space (e.g. "5. ") -> Group 2
    // [A-Za-z] -> Followed by a letter (Title)
    const regex = /(?:^|\n)\s*(?:chapter|unit|lesson|module)\s+([0-9]+(?:\.[0-9]+)*)|(?:^|\n)\s*([0-9]+(?:\.[0-9]+)*)\.\s+[A-Za-z]/gi;

    let match;
    while ((match = regex.exec(fullText)) !== null) {
        // Group 1 or Group 2 has the number
        const num = match[1] || match[2];
        if (num) {
            chapterMatches.push({
                number: num.toLowerCase(),
                index: match.index
            });
        }
    }

    // Sort by index to ensure order
    chapterMatches.sort((a, b) => a.index - b.index);

    // 2. Extract content for requested chapters
    for (const chapter of chapters) {
        const targetNum = chapter.trim().toLowerCase();

        // Find the start match
        // We look for exact match first (e.g. "5"), or startsWith (e.g. "5" matches "5.1"?? No, strict for now)
        // Let's try exact match of the main number
        const startMatchIndex = chapterMatches.findIndex(m => m.number === targetNum);

        if (startMatchIndex === -1) {
            console.warn(`Chapter ${targetNum} not found in document structure.`);
            continue;
        }

        const startMatch = chapterMatches[startMatchIndex];

        // Find the end: It's the start of the NEXT chapter section
        // We assume the next entry in our map is the next chapter
        let endIndex = fullText.length;
        if (startMatchIndex + 1 < chapterMatches.length) {
            endIndex = chapterMatches[startMatchIndex + 1].index;
        }

        // Safety: If the chunk is unreasonably huge (>50k chars) and there were no intermediate chapters found,
        // it might be that we missed some boundaries. But for now, trust the map.
        // Or if it's the last chapter, limit to say 30k chars.
        if (startMatchIndex === chapterMatches.length - 1) {
            endIndex = Math.min(startMatch.index + 30000, fullText.length);
        }

        const extractedText = fullText.slice(startMatch.index, endIndex);
        combinedContent += `\n\n--- CONTENT FOR CHAPTER ${targetNum} ---\n\n`;
        combinedContent += extractedText;
    }

    // Fallback: If improved extraction fails (regex didn't catch weird formatting), 
    // fall back to previous heuristic 'indexOf' approach for those missing chapters?
    // Or just return what we have.

    if (!combinedContent && chapters.length > 0) {
        // Absolute fallback if Regex failed completely: simple string search
        console.log("Regex extraction failed, trying fallback search...");
        const normalized = fullText.toLowerCase();
        for (const chapter of chapters) {
            const target = chapter.trim().toLowerCase();
            // Simple search for "Chapter 5"
            const idx = normalized.indexOf(`chapter ${target}`);
            if (idx !== -1) {
                combinedContent += fullText.slice(idx, idx + 20000);
            }
        }
    }

    return combinedContent || fullText.slice(0, 30000); // Ultimate fallback
}

export async function POST(req: NextRequest) {
    const logs: string[] = [];
    const log = (msg: string) => {
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] ${msg}`;
        logs.push(entry);
        console.log(entry);
    };

    try {
        log('Start processing request');

        // Lazy load modules to ensure they don't break build
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const busboy = require('busboy');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdf = require('pdf-parse/lib/pdf-parse.js');

        if (!req.body) {
            return NextResponse.json({ error: "No request body" }, { status: 400 });
        }

        log('Streaming request body...');

        const bb = busboy({ headers: { 'content-type': req.headers.get('content-type') || '' } });

        let fileBuffer: Buffer | null = null;
        let fileName = '';
        const formFields: Record<string, string> = {};

        await new Promise((resolve, reject) => {
            bb.on('file', (name: string, file: any, info: any) => {
                const { filename } = info;
                fileName = filename;
                const chunks: any[] = [];
                file.on('data', (data: any) => chunks.push(data));
                file.on('end', () => {
                    fileBuffer = Buffer.concat(chunks);
                });
            });

            bb.on('field', (name: string, val: string) => {
                formFields[name] = val;
            });

            bb.on('close', resolve);
            bb.on('error', reject);

            try {
                // @ts-ignore
                const nodeStream = Readable.fromWeb(req.body);
                nodeStream.pipe(bb);
            } catch (err) {
                reject(err);
            }
        });

        if (!fileBuffer) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Assert non-null for TS
        const pdfBuffer = fileBuffer as Buffer;

        log(`File parsed: ${fileName}, Size: ${pdfBuffer.length}`);

        const rawMarkConfig = JSON.parse(formFields["markConfig"] || "[]");
        let markConfigArray: { markValue: number, count: number, isMCQ?: boolean }[] = [];

        if (Array.isArray(rawMarkConfig)) {
            markConfigArray = rawMarkConfig;
        } else {
            // Fallback for object format { "1": 5 }
            markConfigArray = Object.entries(rawMarkConfig).map(([mark, count]) => ({
                markValue: Number(mark),
                count: Number(count),
                isMCQ: Number(mark) === 1
            }));
        }

        const difficultyConfig = JSON.parse(formFields["difficultyConfig"] || "{}");
        const chapters = formFields["chapters"] ? formFields["chapters"].split(",").map((c) => c.trim()) : [];

        log(`PDF Buffer ready, length: ${pdfBuffer.length}`);

        // Extract Text from PDF
        let pdfText = "";
        try {
            log('Starting PDF parsing with pdf-parse v1...');
            const data = await pdf(pdfBuffer);

            if (!data || !data.text) {
                throw new Error("PDF parsing returned empty data");
            }

            pdfText = data.text;
            log(`PDF parsed successfully. Text length: ${pdfText.length}`);
        } catch (e: any) {
            log(`PDF Parsing Error: ${e.message}\nStack: ${e.stack}`);
            return NextResponse.json({
                error: "Failed to parse PDF: " + e.message,
                details: logs.join('\n')
            }, { status: 500 });
        }

        // Filter content
        const contextContent = chapters.length > 0
            ? extractChapterContent(pdfText, chapters)
            : pdfText.slice(0, 30000);
        log(`Content filtered. Length: ${contextContent.length}`);

        if (contextContent.length < 50) {
            log('WARNING: Content length is very small!');
        }

        // Construct Prompt
        const totalMarks = markConfigArray.reduce((acc, curr) => acc + (Number(curr.markValue) * Number(curr.count)), 0);

        let questionsRequirement = "";
        for (const cfg of markConfigArray) {
            if (Number(cfg.count) > 0) {
                let typeDesc = "Descriptive/Subjective";
                if (cfg.markValue === 1) {
                    typeDesc = cfg.isMCQ ? "MCQ with 4 options" : "Short Answer / Fill in the blank (No Options)";
                }
                questionsRequirement += `- ${cfg.count} questions of ${cfg.markValue} marks each (Type: ${typeDesc})\n`;
            }
        }

        const prompt = `
            You are an expert educator creating a question paper. Analyze the textbook content provided below and generate a structured question paper.

            **Configuration:**
            - Chapters Targeted: ${chapters.join(", ") || "All Content"}
            - Total Marks (Target): ${totalMarks}
      
            **Question Requirements:**
            ${questionsRequirement}

            **Difficulty Distribution:**
            - Easy: ${difficultyConfig.easy || "30"}%
            - Medium: ${difficultyConfig.medium || "40"}%
            - Hard: ${difficultyConfig.hard || "30"}%

            **Content:**
            ${contextContent.slice(0, 50000)} ... [truncated]

            **Instructions:**
            1. **Content Source:** Create questions based ONLY on the provided text content.
            2. **Quantity:** Ensure the exact number of questions for each mark category is generated.
            3. **Chapter Distribution:** **CRITICAL:** Distribute the questions **EQUALLY** across all the chapters provided in the content. Do not focus only on the first chapter.
            4. **Question Types:** 
               - If "MCQ", provide 4 options (A, B, C, D) and mark the correct one with *.
               - If "Short Answer", provide direct questions answerable in one word or one sentence. **DO NOT** use "Fill in the blank" format.
            5. **Quality Control (STRICT):**
               - **NEGATIVE CONSTRAINT:** **NEVER** ask questions about the chapter metadata (e.g., "What is the chapter number?", "What is the name of the chapter?", "The chapter is usually numbered as...").
               - Questions must be purely **ACADEMIC** (concepts, definitions, laws, applications, diagrams).
               - Avoid trivial questions.
            6. For higher marks (3+), require deeper analysis or detailed explanation.
            7. Output MUST be valid JSON.

            **JSON Format Output:**
            {
            "title": "AI Question Paper",
            "totalMarks": ${totalMarks},
            "sections": [
                {
                "markValue": 1,
                "questions": [
                    {
                    "id": 1,
                    "text": "Question text...",
                    "type": "MCQ",
                    "options": ["A) Op1", "B) Op2", "C) Op3 *", "D) Op4"],
                    "difficulty": "Easy",
                    "topic": "Topic Name"
                    }
                ]
                },
                {
                    "markValue": 5,
                    "questions": [
                    {
                        "id": 10,
                        "text": "Explain in detail...",
                        "type": "Long Answer",
                        "difficulty": "Hard",
                        "topic": "Topic Name"
                    }
                    ]
                }
            ]
            }
        `;

        // Call Groq
        log('Calling Groq API...');
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" },
        });

        const outputContent = chatCompletion.choices[0]?.message?.content;
        log(`Groq response received. Length: ${outputContent?.length}`);

        if (!outputContent) {
            throw new Error("No content received from LLM");
        }

        const jsonResponse = JSON.parse(outputContent);
        log('JSON parsed successfully. Sending response.');

        return NextResponse.json(jsonResponse);

    } catch (error: any) {
        log(`API CRITICAL ERROR: ${error.message}\nStack: ${error.stack}`);

        if (error.response) {
            log(`Groq Response Error: ${JSON.stringify(error.response.data)}`);
        }

        return NextResponse.json(
            {
                error: error.message || "Internal Server Error",
                details: logs.join('\n')
            },
            { status: 500 }
        );
    }
}
