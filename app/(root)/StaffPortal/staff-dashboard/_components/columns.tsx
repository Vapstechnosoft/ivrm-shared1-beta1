import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Ban, Download, FileText, FileImage, FileVideo, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type {
    INoticeBoard,
    IAsset,
    IPurchase,
    IBookFile,
    IEvent,
    INoticeAttachment
} from '@/types/staff-portal/dashboard';

// Helper to determine file icon
const getFileIcon = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return <FileText className="h-4 w-4" />;
        case 'jpg':
        case 'jpeg':
        case 'png': return <FileImage className="h-4 w-4" />;
        case 'mp4':
        case 'wmv': return <FileVideo className="h-4 w-4" />;
        case 'mp3': return <FileAudio className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
    }
};

export const noticeColumns: ColumnDef<INoticeBoard>[] = [
    {
        accessorKey: 'index',
        header: 'SL NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'INTB_Title',
        header: 'Notice Title',
    },
    {
        accessorKey: 'INTB_Description',
        header: 'Description',
    },
    {
        accessorKey: 'INTB_StartDate',
        header: 'Start Date',
        cell: ({ row }) => format(new Date(row.original.INTB_StartDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'INTB_EndDate',
        header: 'End Date',
        cell: ({ row }) => format(new Date(row.original.INTB_EndDate), 'dd/MM/yyyy'),
    },
    {
        id: 'actions',
        header: 'View Attachment',
        cell: ({ row, table }) => {
            const hasFiles = row.original.Filecount > 0;
            const meta = table.options.meta as any;
            return hasFiles ? (
                <Button variant="ghost" size="sm" onClick={() => meta?.onViewDetails?.(row.original)}>
                    <Eye className="h-4 w-4 text-primary" />
                </Button>
            ) : (
                <Ban className="h-4 w-4 text-muted-foreground" />
            );
        },
    },
];

export const noticeAttachmentColumns: ColumnDef<INoticeAttachment>[] = [
    {
        accessorKey: 'index',
        header: 'SL NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'INTBFL_FileName',
        header: 'File Name/URL',
    },
    {
        id: 'view',
        header: 'View/Click',
        cell: ({ row, table }) => {
            const isHyperlink = row.original.INTB_Attachment === 'HyperLink';
            const meta = table.options.meta as any;
            return isHyperlink ? (
                <a href={row.original.INTBFL_FilePath} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Click Here
                </a>
            ) : (
                <Button variant="ghost" size="sm" onClick={() => meta?.onPreview?.(row.original.INTBFL_FilePath)}>
                    <Eye className="h-4 w-4 text-primary" />
                </Button>
            );
        },
    },
    {
        id: 'download',
        header: 'Download',
        cell: ({ row }) => {
            const isHyperlink = row.original.INTB_Attachment === 'HyperLink';
            return isHyperlink ? (
                <Ban className="h-4 w-4 text-muted-foreground" />
            ) : (
                <a href={row.original.INTBFL_FilePath} download>
                    <Download className="h-4 w-4 text-primary" />
                </a>
            );
        },
    },
];

export const assetColumns: ColumnDef<IAsset>[] = [
    {
        accessorKey: 'index',
        header: 'SL NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'INVMI_ItemName',
        header: 'Item Name',
    },
    {
        accessorKey: 'INVMS_StoreName',
        header: 'Store Name',
    },
    {
        accessorKey: 'INVACO_CheckOutQty',
        header: 'Quantity',
    },
    {
        accessorKey: 'INVACO_CheckoutDate',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.INVACO_CheckoutDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'INVACO_ReceivedBy',
        header: 'Given By',
    },
];

export const purchaseColumns: ColumnDef<IPurchase>[] = [
    {
        accessorKey: 'index',
        header: 'SL NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'INVMI_ItemName',
        header: 'Item Name',
    },
    {
        accessorKey: 'INVMS_SupplierName',
        header: 'Supplier Name',
    },
    {
        accessorKey: 'INVTPR_PRQty',
        header: 'Requested Qty',
    },
    {
        accessorKey: 'INVTPO_POQty',
        header: 'Approved Qty',
    },
    {
        accessorKey: 'INVMPR_PRDate',
        header: 'Requested Date',
        cell: ({ row }) => format(new Date(row.original.INVMPR_PRDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'INVTPO_ExpectedDeliveryDate',
        header: 'Delivery Date',
        cell: ({ row }) => format(new Date(row.original.INVTPO_ExpectedDeliveryDate), 'dd/MM/yyyy'),
    },
];

export const bookFileColumns: ColumnDef<IBookFile>[] = [
    {
        accessorKey: 'index',
        header: 'SL NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'LMB_BookTitle',
        header: 'Book Title',
    },
    {
        accessorKey: 'LMBFILE_FileName',
        header: 'File Name',
    },
    {
        id: 'view',
        header: 'View',
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            return (
                <Button variant="ghost" size="sm" onClick={() => meta?.onPreview?.(row.original.LMBFILE_FilePath)}>
                    <Eye className="h-4 w-4 text-primary" />
                </Button>
            );
        },
    },
];

export const coeColumns: ColumnDef<IEvent>[] = [
    {
        accessorKey: 'index',
        header: 'SL NO',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'eventName',
        header: 'Event',
    },
    {
        accessorKey: 'coeE_EStartDate',
        header: 'Month',
        cell: ({ row }) => format(new Date(row.original.coeE_EStartDate), 'MMMM'),
    },
    {
        accessorKey: 'coeE_EStartDate',
        header: 'Start Date',
        cell: ({ row }) => format(new Date(row.original.coeE_EStartDate), 'dd/MM/yyyy'),
    },
    {
        accessorKey: 'coeE_EEndDate',
        header: 'End Date',
        cell: ({ row }) => format(new Date(row.original.coeE_EEndDate), 'dd/MM/yyyy'),
    },
];
