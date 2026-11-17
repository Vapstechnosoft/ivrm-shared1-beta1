"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IInvRMonthEndReportTableRow } from "@/types/inventory/reports/inv-r-month-end-report";

export const columns: ColumnDef<IInvRMonthEndReportTableRow>[] = [
    {
        accessorKey: "id",
        header: "SL.NO",
    },
    {
        accessorKey: "inventory",
        header: "INVENTORY",
    },
    {
        accessorKey: "count",
        header: "COUNT",
    },
    {
        accessorKey: "sms",
        header: "SMS",
    },
    {
        accessorKey: "email",
        header: "EMAIL",
    },
];
