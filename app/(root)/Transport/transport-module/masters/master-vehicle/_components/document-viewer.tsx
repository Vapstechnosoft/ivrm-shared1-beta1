'use client';

import { AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { type IMasterVehicle, type IMasterVehicleDocument } from '@/types/transport/transport-module/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DocumentViewerProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: IMasterVehicle;
}

export default function DocumentViewer({ isOpen, onClose, rowData }: DocumentViewerProps) {
    const [selectedDoc, setSelectedDoc] = useState<IMasterVehicleDocument | null>(null);

    const documents = rowData.vehicleDocuments || [];

    const handleViewDocument = (doc: IMasterVehicleDocument) => {
        if (doc.cfilepath) {
            window.open(doc.cfilepath, '_blank');
        } else {
            toast.error('Document path not found');
        }
    };

    const columns: ColumnDef<IMasterVehicleDocument>[] = [
        {
            accessorKey: 'cfilename',
            header: 'File Name',
        },
        {
            accessorKey: 'cfiledesc',
            header: 'Description',
        },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <Button variant='ghost' size='sm' onClick={() => handleViewDocument(row.original)}>
                    <Eye className='mr-2 h-4 w-4' /> View
                </Button>
            ),
        },
    ];

    return (
        <AdaptiveDialog isOpen={isOpen} onClose={onClose} title={`Documents for ${rowData.trmV_VehicleName}`} className='sm:max-w-[700px]'>
            <div className='flex flex-col gap-4'>
                {documents.length > 0 ? (
                    <GenericDataTable
                        columns={columns}
                        data={documents}
                        isLoading={false}
                        isSearchRequired={false}
                        isPaginationRequired={false}
                    />
                ) : (
                    <div className='flex flex-col items-center justify-center p-8 text-muted-foreground'>
                        <FileText className='h-12 w-12 mb-2 opacity-20' />
                        <p>No documents attached to this vehicle.</p>
                    </div>
                )}

                <div className='flex justify-end'>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </AdaptiveDialog>
    );
}
