"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export interface AttendanceRecord {
    CLASS_HELD: number;
    TOTAL_PRESENT: number;
    ABSENT_COUNT: number;
    score: number;
    ABSENT_DATES: string;
    MONTH_NAME: string;
}

export const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
    {
        id: "serialNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SL.No." />
        ),
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: "MONTH_NAME",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Month" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("MONTH_NAME")}</div>,
    },
    {
        accessorKey: "CLASS_HELD",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Class Held" />
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("CLASS_HELD")}</div>,
    },
    {
        accessorKey: "TOTAL_PRESENT",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total Present" />
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("TOTAL_PRESENT")}</div>,
    },
    {
        accessorKey: "ABSENT_COUNT",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Absent Count" />
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("ABSENT_COUNT")}</div>,
    },
    {
        accessorKey: "score",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Percentage" />
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("score")}%</div>,
    },
    {
        accessorKey: "ABSENT_DATES",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Absent Dates" />
        ),
        cell: ({ row }) => {
            const dates = row.getValue("ABSENT_DATES") as string;
            return <div className="text-red-500 text-sm">{dates !== "0" ? dates : "-"}</div>;
        },
    },
];
