'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useDocumentDownload } from '@/hooks/admission/preadmission/useTransactions';
import type { IPreadmissionDocumentView } from '@/types/admission/preadmission/transactions';
import type { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const DocumentViewColoumn: ColumnDef<IPreadmissionDocumentView>[] = [
    {
        accessorKey: 'pasr_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='SL.No' className='w-full pl-6' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        id: 'student_photo',
        accessorKey: 'student_photo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Image' />,
        cell: ({ row }) => {
            const imageUrl: string = row.getValue('student_photo') || '/icons/user.png';
            const [showImageModal, setShowImageModal] = useState(false);

            return (
                <>
                    <button
                        type='button'
                        onClick={() => imageUrl && setShowImageModal(true)}
                        className='flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-gray-100'>
                        <Image
                            src={imageUrl}
                            alt='Preview'
                            width={100}
                            height={100}
                            className='h-full w-full object-cover'
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </button>

                    {showImageModal && (
                        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
                            <DialogContent className='text max-w-3xl'>
                                <DialogHeader>{/* <DialogTitle className='text-center'>Student Photo</DialogTitle> */}</DialogHeader>
                                <div className='flex items-center justify-center p-4'>
                                    <img
                                        src={imageUrl}
                                        alt={row.getValue('student_name') ?? `student-${row.original.pasr_id}`}
                                        className='max-h-[80vh] max-w-full object-contain'
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            );
        },
        enableSorting: true,
        enableHiding: false
    },
    {
        accessorKey: 'student_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => <div>{row.getValue('student_name')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'pasR_RegistrationNo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Registration No' />,
        cell: ({ row }) => <div>{row.getValue('pasR_RegistrationNo') ?? 'N.A'}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'applied_class_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('applied_class_name')}</div>,
        enableSorting: true
    },
    {
        accessorKey: 'application_form',
        header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Application Form' />,
        cell: ({ row }) => {
            const appId = row.original.pasr_id;
            const [showPdfModal, setShowPdfModal] = useState(false);
            const [pdfBase64, setPdfBase64] = useState<string | null>(null);
            const [iframeLoading, setIframeLoading] = useState(false);

            const { mutate: downloadDocument, isPending: isLoading } = useDocumentDownload();

            const handleViewClick = () => {
                setShowPdfModal(true);
                // Only fetch when user clicks
                if (!pdfBase64) {
                    downloadDocument(appId, {
                        onSuccess: (data) => {
                            const base64 =
                                typeof data?.data === 'string'
                                    ? data.data
                                    : Array.isArray(data?.data)
                                      ? ((data.data[0] as unknown as string) ?? null)
                                      : null;
                            setPdfBase64(base64);
                        },
                        onError: (error) => {
                            console.error('Failed to load document:', error);
                            setPdfBase64(null);
                        }
                    });
                }
            };

            useEffect(() => {
                if (showPdfModal && pdfBase64) {
                    setIframeLoading(true);
                }
                if (!showPdfModal) {
                    setIframeLoading(false);
                }
            }, [showPdfModal, pdfBase64]);

            return (
                <>
                    <Button variant='link' className='p-0 text-blue-600 hover:underline' onClick={handleViewClick}>
                        View Application
                    </Button>

                    {showPdfModal && (
                        <Dialog
                            open={showPdfModal}
                            onOpenChange={(open) => {
                                setShowPdfModal(open);
                                if (!open) {
                                    setPdfBase64(null);
                                }
                            }}>
                            <DialogContent
                                className='flex h-[90vh] max-w-5xl flex-col p-0'
                                onInteractOutside={(e) => {
                                    e.preventDefault();
                                }}>
                                <DialogHeader className='p-0'>
                                    <DialogTitle className='pt-3 text-center font-semibold text-lg'>
                                        Pre Admission Application Form
                                    </DialogTitle>
                                </DialogHeader>
                                <div className='relative min-h-0 flex-1 overflow-hidden'>
                                    {/* Spinner while loading PDF */}
                                    {(isLoading || iframeLoading) && (
                                        <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'>
                                            <div className='transition-all'>
                                                <div className='flex flex-col items-center'>
                                                    <Spinner size='lg' className='text-primary' />
                                                    <p className='mt-3 font-medium text-gray-700 text-sm'>Loading document...</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* PDF Viewer */}
                                    <div className='relative h-full min-h-0 w-full'>
                                        {pdfBase64 ? <div className='absolute top-3 right-3 z-30 flex gap-3' /> : null}

                                        {typeof pdfBase64 === 'string' && pdfBase64 ? (
                                            <iframe
                                                src={
                                                    pdfBase64.startsWith('data:') || pdfBase64.startsWith('http')
                                                        ? pdfBase64
                                                        : `data:application/pdf;base64,${pdfBase64}`
                                                }
                                                title='Pre Admission Application Form'
                                                className='h-full min-h-0 w-full border-0'
                                                style={{ display: iframeLoading ? 'none' : 'block' }}
                                                onLoad={() => setIframeLoading(false)}
                                            />
                                        ) : (
                                            <div className='flex h-full items-center justify-center'>
                                                <div className='text-gray-500 text-sm'>
                                                    {isLoading ? 'Loading...' : 'No document available'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            );
        },
        enableSorting: false
    },
    {
        accessorKey: 'studentt_photo',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Student Photo' />,

        cell: ({ row }) => {
            const downloadUrl = row.getValue('student_photo');
            const [isDownloadingPhoto, setIsDownloadingPhoto] = useState(false);

            const handleDownload = async (e: React.MouseEvent) => {
                e.preventDefault();
                if (!downloadUrl) return;
                setIsDownloadingPhoto(true);
                try {
                    if (typeof downloadUrl === 'string' && downloadUrl.startsWith('data:')) {
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = `student-photo-${row.original.pasr_id}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        return;
                    }

                    const resp = await fetch(downloadUrl as string);
                    if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);
                    const blob = await resp.blob();

                    let finalBlob: Blob = blob;
                    if (blob.type?.startsWith('image/') && blob.type !== 'image/jpeg') {
                        try {
                            const convertToJpeg = async (input: Blob): Promise<Blob> => {
                                return await new Promise<Blob>((resolve, reject) => {
                                    const url = URL.createObjectURL(input);
                                    const img = new (
                                        window.Image as {
                                            new (): HTMLImageElement;
                                        }
                                    )();
                                    img.onload = () => {
                                        try {
                                            const canvas = document.createElement('canvas');
                                            canvas.width = img.naturalWidth || img.width;
                                            canvas.height = img.naturalHeight || img.height;
                                            const ctx = canvas.getContext('2d');
                                            if (!ctx) throw new Error('Canvas not supported');
                                            ctx.drawImage(img, 0, 0);
                                            canvas.toBlob(
                                                (b) => {
                                                    if (b) resolve(b);
                                                    else reject(new Error('Conversion to JPEG failed'));
                                                    URL.revokeObjectURL(url);
                                                },
                                                'image/jpeg',
                                                0.92
                                            );
                                        } catch (err) {
                                            URL.revokeObjectURL(url);
                                            reject(err);
                                        }
                                    };
                                    img.onerror = () => {
                                        URL.revokeObjectURL(url);
                                        reject(new Error('Image load error'));
                                    };
                                    // try to avoid tainting canvas
                                    img.crossOrigin = 'anonymous';
                                    img.src = url;
                                });
                            };

                            finalBlob = await convertToJpeg(blob);
                        } catch (err) {
                            console.warn('JPEG conversion failed, using original blob', err);
                            finalBlob = blob;
                        }
                    }

                    const objectUrl = URL.createObjectURL(finalBlob);

                    const link = document.createElement('a');
                    link.href = objectUrl;
                    link.download = `student-photo-${row.original.pasr_id}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
                } catch (err) {
                    console.error('Download failed', err);
                } finally {
                    setIsDownloadingPhoto(false);
                }
            };

            return (
                <div className='flex justify-center'>
                    {downloadUrl ? (
                        // biome-ignore lint/a11y/useButtonType: <explanation>
                        <button
                            onClick={handleDownload}
                            className='text-blue-600 hover:text-blue-800'
                            title='Download Student Photo'
                            aria-label={`Download student photo ${row.original.pasr_id}`}
                        >
                            {isDownloadingPhoto ? <Spinner size='sm' /> : <Download className='h-5 w-5' />}
                        </button>
                    ) : (
                        <span className='group relative'>
                            <Download className='h-5 w-5 text-gray-400 opacity-40' />
                            <span className='-translate-x-1/2 pointer-events-none absolute left-1/2 z-10 mt-1 rounded bg-gray-700 px-2 py-1 text-white text-xs opacity-0 group-hover:opacity-100'>
                                No Photo Available
                            </span>
                        </span>
                    )}
                </div>
            );
        },
        enableSorting: false
    }
];
