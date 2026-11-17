'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileImage, FileVideo, Users, Eye, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ListViewDialogProps {
    title: string;
    trigger: React.ReactNode;
    data?: any[];
    fetchData?: () => Promise<any[]>;
    type: 'image' | 'video' | 'class' | 'employee' | 'other' | 'alumni';
}

export function ListViewDialog({ title, trigger, data: initialData, fetchData, type }: ListViewDialogProps) {
    const [data, setData] = useState<any[]>(initialData || []);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);


    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSelectedItem(null);
        }
        if (open && fetchData && !hasFetched) {
            setIsLoading(true);
            try {
                const result = await fetchData();
                setData(result || []);
                setHasFetched(true);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const hasData = data && data.length > 0;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            );
        }

        if (!hasData) {
            return <div className="p-4 text-center text-muted-foreground">No records found.</div>;
        }

        switch (type) {
            case 'image':
                if (selectedItem) {
                    const paramsUrl = selectedItem;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(paramsUrl);
                    return (
                        <div className="flex flex-col h-full gap-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)} className="self-start">
                                Back to List
                            </Button>
                            <div className="flex-1 overflow-hidden rounded-md border bg-muted flex items-center justify-center p-2 h-[60vh]">
                                {isImage ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={paramsUrl}
                                        alt="Selected"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <iframe
                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(paramsUrl)}&embedded=true`}
                                        className="h-full w-full border-0"
                                        title="Document Viewer"
                                    />
                                )}
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {data.map((item, index) => {
                            const paramsUrl = item.coeeI_Images || item.COEEI_Images;
                            // Try to extract a meaningful name from the URL, or fallback to Attachment N
                            const fileName = paramsUrl.split('/').pop()?.split('?')[0] || `Attachment ${index + 1}`;

                            return (
                                <div
                                    key={index}
                                    className="cursor-pointer group flex flex-col items-center gap-2 p-4 rounded-md border hover:bg-muted/50 transition-colors"
                                    onClick={() => setSelectedItem(paramsUrl)}
                                >
                                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-muted group-hover:bg-background transition-colors">
                                        <FileImage className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-center break-all line-clamp-2" title={fileName}>
                                        {fileName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            case 'video':
                return (
                    <div className="flex flex-col gap-4">
                        {data.map((item, index) => (
                            <div key={index} className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <video controls className="h-full w-full">
                                    <source src={item.COEEV_Videos} />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ))}
                    </div>
                );
            case 'class':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sl. No</TableHead>
                                <TableHead>Class Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.asmcL_ClassName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            case 'employee':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sl. No</TableHead>
                                <TableHead>Department ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.hrmD_Id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            case 'other':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Mobile</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.coeeO_Name}</TableCell>
                                    <TableCell>{item.coeeO_MobileNo}</TableCell>
                                    <TableCell>{item.coeeO_Emailid}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            case 'alumni':
                // Placeholder as no specific list structure is defined in the types yet
                return (
                    <div className="p-4 text-center text-muted-foreground">List data not available.</div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[80vh] w-full max-w-2xl flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                    {renderContent()}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
