'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <Card className='border-2 border-dashed'>
            <CardContent className='flex flex-col items-center justify-center space-y-2 py-4'>
                <div className='rounded-full bg-primary/10 p-2'>
                    <Upload className='h-5 w-5 text-primary' />
                </div>
                <div className='space-y-1 text-center'>
                    <h3 className='font-semibold text-base leading-tight'>Upload Class Cumulative Report</h3>
                    <p className='text-muted-foreground text-xs'>Supported: PDF, CSV, Excel (.xlsx, .xls)</p>
                </div>
                <div className='flex flex-col items-center gap-1'>
                    <input
                        type='file'
                        className='hidden'
                        accept='.csv, .xlsx, .xls, .pdf'
                        onChange={handleFileChange}
                        disabled={isLoading}
                        id='file-upload'
                    />
                    <Button size='sm' disabled={isLoading} onClick={() => document.getElementById('file-upload')?.click()}>
                        Select File
                    </Button>
                    {isLoading && <p className='animate-pulse text-muted-foreground text-[10px]'>Processing...</p>}
                </div>
            </CardContent>
        </Card>
    );
}
