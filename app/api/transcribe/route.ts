import { blobToFile, enhanceAndConvertToWav } from '@/lib/audio-utils';
import type { NextRequest } from 'next/server';

const TRANSCRIBE_API_URL = 'https://final-speech.onrender.com/transcribe';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('audio') as File | null;

        if (!file) {
            return Response.json({ error: 'No audio file provided' }, { status: 400 });
        }

        if (file.size === 0) {
            return Response.json({ error: 'Audio file is empty' }, { status: 400 });
        }

        // Convert WebM → enhanced WAV
        const webmBlob = new Blob([await file.arrayBuffer()], { type: file.type });
        const wavBlob = await enhanceAndConvertToWav(webmBlob);
        const wavFile = blobToFile(wavBlob, 'enhanced.wav');

        // Forward to ngrok with correct key
        const forwardFormData = new FormData();
        forwardFormData.append('audio', wavFile);

        const res = await fetch(TRANSCRIBE_API_URL, {
            method: 'POST',
            body: forwardFormData
        });

        const text = await res.text();

        if (!res.ok) {
            return Response.json({ error: `Transcription failed: ${text}` }, { status: res.status });
        }

        // Fixed: Explicitly type the json variable
        let json: unknown = null;
        try {
            json = JSON.parse(text);
        } catch {
            return Response.json({ error: 'Invalid JSON', raw: text }, { status: 500 });
        }

        return Response.json(json); // { success: true, text: "hello" }
    } catch (error: unknown) {
        console.error('API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ error: 'Server error', details: errorMessage }, { status: 500 });
    }
}
