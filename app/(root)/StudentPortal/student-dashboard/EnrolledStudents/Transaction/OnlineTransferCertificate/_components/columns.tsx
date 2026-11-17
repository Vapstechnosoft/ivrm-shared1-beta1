"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Power } from "lucide-react";

export interface TransferCertificateData {
    id: number;
    studentName: string;
    className: string;
    sectionName: string;
    certificateType: string;
    applyDate: string;
    status: string;
    isActive: boolean;
}

export const certificateColumns: ColumnDef<TransferCertificateData>[] = [
    {
        id: "serialNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SL.No." />
        ),
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: "studentName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Student Name" />
        ),
        cell: ({ row }) => <div>{row.getValue("studentName")}</div>,
    },
    {
        accessorKey: "className",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Class" />
        ),
        cell: ({ row }) => <div>{row.getValue("className")}</div>,
    },
    {
        accessorKey: "sectionName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Section" />
        ),
        cell: ({ row }) => <div>{row.getValue("sectionName")}</div>,
    },
    {
        accessorKey: "certificateType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Certificate Type" />
        ),
        cell: ({ row }) => <div>{row.getValue("certificateType")}</div>,
    },
    {
        accessorKey: "applyDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Apply Date" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("applyDate"));
            // Simple date formatting
            return <div>{date.toLocaleDateString('en-GB')}</div>;
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const status = row.original.status;
            const isActive = row.original.isActive;

            // Logic from legacy: show actions if not Approved/Rejected
            if (status === 'Approved' || status === 'Rejected') {
                return null;
            }

            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>

                    {/* Activate/Deactivate Logic */}
                    {isActive ? (
                        <Button variant="ghost" size="sm" className="h-8 w-auto px-2 py-0 text-red-600 hover:text-red-800 hover:bg-red-100">
                            <span className="text-xs font-semibold">Deactivate</span>
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" className="h-8 w-auto px-2 py-0 text-green-600 hover:text-green-800 hover:bg-green-100">
                            <span className="text-xs font-semibold">Activate</span>
                        </Button>
                    )}
                </div>
            );
        },
    },
];

// Sample Data
export const sampleCertificates: TransferCertificateData[] = [
    {
        id: 1,
        studentName: "John Doe",
        className: "X",
        sectionName: "A",
        certificateType: "Transfer Certificate",
        applyDate: "2024-01-10",
        status: "Pending",
        isActive: true
    }
];
