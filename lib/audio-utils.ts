export function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type });
}

export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const result = new DataView(new ArrayBuffer(44 + buffer.length * numChannels * 2));
    let offset = 0;

    const writeString = (view: DataView, o: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(o + i, str.charCodeAt(i));
        }
    };

    writeString(result, offset, 'RIFF');
    offset += 4;
    result.setUint32(offset, 36 + buffer.length * numChannels * 2, true);
    offset += 4;
    writeString(result, offset, 'WAVE');
    offset += 4;

    writeString(result, offset, 'fmt ');
    offset += 4;
    result.setUint32(offset, 16, true);
    offset += 4;
    result.setUint16(offset, 1, true);
    offset += 2;
    result.setUint16(offset, numChannels, true);
    offset += 2;
    result.setUint32(offset, sampleRate, true);
    offset += 4;
    result.setUint32(offset, sampleRate * numChannels * 2, true);
    offset += 4;
    result.setUint16(offset, numChannels * 2, true);
    offset += 2;
    result.setUint16(offset, 16, true);
    offset += 2;

    writeString(result, offset, 'data');
    offset += 4;
    result.setUint32(offset, buffer.length * numChannels * 2, true);
    offset += 4;

    for (let i = 0; i < buffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            result.setInt16(offset, intSample, true);
            offset += 2;
        }
    }

    return new Blob([result], { type: 'audio/wav' });
}

export async function enhanceAndConvertToWav(webmBlob: Blob): Promise<Blob> {
    try {
        const arrayBuffer = await webmBlob.arrayBuffer();
        const ctx = new OfflineAudioContext(1, 44100 * 5, 44100);
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        // Normalize
        const data = audioBuffer.getChannelData(0);
        const peak = Math.max(...data.map(Math.abs));
        const gain = peak > 0.1 ? 0.95 / peak : 1;
        for (let i = 0; i < data.length; i++) data[i] *= gain;

        // Compressor + boost
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;

        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, ctx.currentTime);
        compressor.knee.setValueAtTime(30, ctx.currentTime);
        compressor.ratio.setValueAtTime(12, ctx.currentTime);
        compressor.attack.setValueAtTime(0.003, ctx.currentTime);
        compressor.release.setValueAtTime(0.25, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.value = 4; // +12 dB

        source.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start();

        const rendered = await ctx.startRendering();
        return audioBufferToWavBlob(rendered);
    } catch (e) {
        console.warn('Enhancement failed, using original', e);
        return webmBlob;
    }
}
