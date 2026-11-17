'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Trash, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

interface FileUploadSectionProps {
    name: string;
    label: string;
    files: any[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpload: (index: number, file: File) => void;
}

export function FileUploadSection({ name, label, files, onAdd, onRemove, onUpload }: FileUploadSectionProps) {
    const { control } = useFormContext();

    const handleFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(index, e.target.files[0]);
        }
    };

    return (
        <div className='space-y-2 rounded-md border p-4'>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-sm'>{label}</h3>
                <Button type='button' variant='outline' size='sm' onClick={onAdd} disabled={files.length >= 10}>
                    <Upload className='mr-2 h-4 w-4' /> Add
                </Button>
            </div>

            <table className='w-full text-sm'>
                <thead>
                    <tr className='border-b'>
                        <th className='p-2 text-center'>Sl.No</th>
                        <th className='p-2 text-center'>File</th>
                        <th className='p-2 text-center'>View</th>
                        <th className='p-2 text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={file.id || index} className='border-b last:border-0'>
                            <td className='p-2 text-center'>{index + 1}</td>
                            <td className='p-2 text-center'>
                                <Input
                                    type='file'
                                    className='cursor-pointer'
                                    accept='image/*, application/pdf, video/mp4, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
                                    onChange={(e) => handleFileChange(index, e)}
                                />
                                {file.lpmtR_FileName && <span className='mt-1 block text-green-600 text-xs'>{file.lpmtR_FileName}</span>}
                            </td>
                            <td className='p-2 text-center'>
                                {file.lpmtR_Resources && (
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        title='View'
                                        onClick={() => window.open(file.lpmtR_Resources, '_blank')}>
                                        <Eye className='h-4 w-4 text-blue-500' />
                                    </Button>
                                )}
                            </td>
                            <td className='p-2 text-center'>
                                {files.length > 1 && (
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => onRemove(index)}
                                        className='text-red-500'>
                                        <Trash className='h-4 w-4' />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
