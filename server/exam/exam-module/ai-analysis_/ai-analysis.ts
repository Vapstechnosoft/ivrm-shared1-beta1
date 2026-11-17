'use server';

import type {
    ClassAnalysis,
    IndividualAnalysis,
    StudentPerformance
} from '@/types/exam/exam-module/ai-analysis';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function analyzeClassPerformance(classData: any): Promise<ClassAnalysis> {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not defined');
    }

    const prompt = `You are an educational performance analyst. Analyze this class performance data and identify weak and top performers.

Class Data:
${JSON.stringify(classData, null, 2)}

Provide detailed analysis in JSON format:
{
  "weakPerformers": [
    {
      "name": "student name",
      "averageScore": number,
      "totalScore": number,
      "analysis": "detailed explanation of why this student is struggling, which subjects are weakest, and specific concerns",
      "recommendations": "actionable advice for improvement"
    }
  ],
  "topPerformers": [
    {
      "name": "student name", 
      "averageScore": number,
      "totalScore": number,
      "analysis": "detailed explanation of what makes this student successful, strongest subjects, and consistency",
      "praise": "positive recognition and encouragement"
    }
  ],
  "classOverview": "overall class performance summary with key insights"
}

Identify exactly 5 weak performers and 5 top performers. Focus on overall performance, consistency, and specific subject strengths/weaknesses.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert educational analyst. Always respond with valid JSON only, no additional text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 3000
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Basic JSON extraction (in case of markdown blocks)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return JSON.parse(content);
    } catch (error: any) {
        console.error('Class Analysis failed:', error);
        throw new Error(`Class Analysis failed: ${error.message}`);
    }
}

export async function analyzeStudentPerformance(reportData: any): Promise<IndividualAnalysis> {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not defined');
    }

    const prompt = `You are an educational performance analyst. Analyze the following student report data and provide a detailed analysis.

Student Report Data:
${JSON.stringify(reportData, null, 2)}

Please analyze this data and provide:
1. **Weakest Subject**: Identify the subject with the lowest performance and explain why
2. **Subjects Needing Improvement**: List 2-3 subjects that need attention with specific recommendations
3. **Strong Subjects**: Identify subjects where the student is performing well
4. **Overall Assessment**: Provide an overall performance summary with actionable advice
5. **Improvement Strategy**: Suggest a focused study plan

Format your response as JSON with this structure:
{
  "weakestSubject": {"name": "subject name", "score": number, "analysis": "detailed analysis"},
  "needsImprovement": [{"name": "subject", "score": number, "recommendation": "specific advice"}],
  "strongSubjects": [{"name": "subject", "score": number, "praise": "positive note"}],
  "overallAssessment": "detailed summary",
  "improvementStrategy": "actionable study plan"
}`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert educational analyst. Always respond with valid JSON only, no additional text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return JSON.parse(content);
    } catch (error: any) {
        console.error('Individual Analysis failed:', error);
        throw new Error(`Individual Analysis failed: ${error.message}`);
    }
}

export async function extractStudentDataFromPdf(base64Pdf: string): Promise<StudentPerformance[]> {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not defined');
    }

    try {
        const buffer = Buffer.from(base64Pdf, 'base64');
        // Lazy load pdf-parse
        // biome-ignore lint/style/useNodejsImportProtocol: <explanation>
        const pdf = require('pdf-parse/lib/pdf-parse.js');
        const data = await pdf(buffer);
        const text = data.text;

        if (!text || text.trim().length < 10) {
            throw new Error('Could not extract meaningful text from PDF');
        }

        const prompt = `Extract student performance data from the provided text which was converted from a PDF school report.
The text contains a table or list with student names, subjects, and marks.

**Text to analyze:**
${text.slice(0, 30000)}

**Instructions:**
1. Identify each student and their respective scores in various subjects.
2. For each student, find their name and a list of subjects with their numeric scores.
3. If a cell contains both a score and a grade (e.g., "88 A"), extract ONLY the numeric score (88).
4. Calculate 'totalScore', 'averageScore' (total / count), and 'subjectCount' for each student.
5. Provide the output in a clean JSON format.

**Return ONLY a JSON object with this structure:**
{
  "students": [
    {
      "name": "string",
      "subjects": [
        { "subject": "string", "score": number, "maxScore": 100, "percentage": number }
      ],
      "totalScore": number,
      "averageScore": number,
      "subjectCount": number
    }
  ]
}

Ensure all scores are numbers. If a score is missing or invalid, skip that subject for that student.`;

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a precise data extraction expert. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 4000,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API Error: ${response.status} - ${error}`);
        }

        const resData = await response.json();
        const content = resData.choices[0].message.content;
        const parsed = JSON.parse(content);

        if (!parsed.students || !Array.isArray(parsed.students)) {
            throw new Error('Invalid data format returned from AI');
        }

        return parsed.students.map((s: any, idx: number) => ({
            ...s,
            index: idx + 1
        }));

    } catch (error: any) {
        console.error('PDF Extraction failed:', error);
        throw new Error(`Failed to parse PDF: \${error.message}`);
    }
}
