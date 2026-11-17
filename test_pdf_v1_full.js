const fs = require('fs');
const pdf = require('pdf-parse');
const Groq = require('groq-sdk');

async function testFullFlow() {
    try {
        console.log("Starting full flow test...");

        let pdfText = "This is a dummy text content for chapter 1. Biology is the study of life. Chapter 1 Introduction. The cell is the basic unit of life.";

        if (fs.existsSync('test.pdf')) {
            console.log("Found test.pdf, attempting to parse...");
            const buffer = fs.readFileSync('test.pdf');
            const data = await pdf(buffer);
            pdfText = data.text;
            console.log("PDF Parsed successfully. Text length:", pdfText.length);
        } else {
            console.log("No test.pdf found, using dummy text.");
        }

        // Hardcoded key for testing to bypass dotenv issues
        const apiKey = "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";
        console.log("Using API Key:", apiKey.slice(0, 10) + "...");

        const groq = new Groq({ apiKey });

        const prompt = `
            Generate a JSON question paper based on this text: "${pdfText.slice(0, 100)}..."
            Format: { "title": "Test", "totalMarks": 10, "sections": [] }
        `;

        console.log("Sending request to Groq...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" },
        });

        const output = chatCompletion.choices[0]?.message?.content;
        console.log("Groq Response received.");

        const json = JSON.parse(output);
        console.log("JSON Parsed Successfully:", JSON.stringify(json, null, 2));

    } catch (e) {
        console.error("Test Failed:", e);
    }
}

testFullFlow();
