"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { FeeStructure } from "../types";
import { Input } from "@/components/ui/input";

export const columns: ColumnDef<FeeStructure>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "index",
        header: "SLNO",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "fmH_FeeName",
        header: "Head Name",
    },
    {
        accessorKey: "ftI_Name",
        header: "Installment Name",
    },
    {
        accessorKey: "fsS_OBArrearAmount",
        header: "Opening Balance",
        cell: ({ row }) => (
            <Input
                className="w-24 text-right"
                value={row.original.fsS_OBArrearAmount}
                disabled
            />
        )
    },
    {
        accessorKey: "fsS_NetAmount",
        header: "Receivable",
        cell: ({ row }) => (
            <Input
                className="w-24 text-right"
                value={row.original.fsS_NetAmount}
                disabled
            />
        )
    },
    {
        accessorKey: "fsS_TotalToBePaid",
        header: "Charges",
        cell: ({ row }) => (
            <Input
                className="w-24 text-right"
                value={row.original.fsS_TotalToBePaid}
                disabled
            />
        )
    },
    {
        accessorKey: "fsS_ConcessionAmount",
        header: "Concession",
        cell: ({ row }) => (
            <Input
                className="w-24 text-right"
                value={row.original.fsS_ConcessionAmount}
                disabled
            />
        )
    },
    {
        accessorKey: "fsS_FineAmount",
        header: "Fine",
        cell: ({ row }) => (
            <Input
                className="w-24 text-right"
                value={row.original.fsS_FineAmount}
                disabled
            />
        )
    },
    {
        accessorKey: "fsS_ToBePaid",
        header: "Payable Amount",
        cell: ({ row }) => (
            <Input
                className="w-24 text-right"
                value={row.original.fsS_ToBePaid}
                disabled
            />
        )
    },
];
