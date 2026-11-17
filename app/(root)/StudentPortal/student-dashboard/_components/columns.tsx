"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Check, Eye, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

// --- Notice Board / TT / Syllabus ---
export type NoticeBoardData = {
    INTB_Id: number
    INTB_Title: string
    INTB_Description: string
    INTB_StartDate: string
    INTB_EndDate: string
    Filecount?: number
}

export const noticeColumns: ColumnDef<NoticeBoardData>[] = [
    {
        accessorKey: "index",
        header: "SL NO",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "INTB_Title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    },
    {
        accessorKey: "INTB_Description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    },
    {
        accessorKey: "INTB_StartDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("INTB_StartDate"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "INTB_EndDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue("INTB_EndDate"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        header: "View",
        cell: ({ row }) => (
            <Button variant="ghost" size="icon" title="View Details">
                <Eye className="h-4 w-4 text-primary" />
            </Button>
        ),
    },
]

// --- Homework / Classwork ---
export type AssignmentData = {
    ismS_SubjectName: string
    ihW_Assignment?: string
    icW_Topic?: string
    icW_SubTopic?: string
    icW_Content?: string
    ihW_Date?: string
    icW_FromDate?: string
    icW_ToDate?: string
    FilesCount: number
}

export const homeworkColumns: ColumnDef<AssignmentData>[] = [
    {
        accessorKey: "index",
        header: "SL NO",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "ismS_SubjectName",
        header: "Subject",
    },
    {
        accessorKey: "ihW_Assignment",
        header: "Assignment",
    },
    {
        accessorKey: "ihW_Date",
        header: "Date",
        cell: ({ row }) => {
            const val = row.getValue("ihW_Date") as string;
            return val ? <div>{new Date(val).toLocaleDateString()}</div> : null
        },
    },
    {
        id: "actions",
        header: "View",
        cell: ({ row }) => (
            <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4 text-primary" />
            </Button>
        ),
    },
]

export const classworkColumns: ColumnDef<AssignmentData>[] = [
    {
        accessorKey: "index",
        header: "SL NO",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "ismS_SubjectName",
        header: "Subject",
    },
    {
        accessorKey: "icW_Topic",
        header: "Topic",
    },
    {
        accessorKey: "icW_SubTopic",
        header: "Sub Topic",
    },
    {
        accessorKey: "icW_Content",
        header: "Content",
    },
    {
        accessorKey: "icW_FromDate",
        header: "Start Date",
        cell: ({ row }) => {
            const val = row.getValue("icW_FromDate") as string;
            return val ? <div>{new Date(val).toLocaleDateString()}</div> : null
        },
    },
    {
        accessorKey: "icW_ToDate",
        header: "End Date",
        cell: ({ row }) => {
            const val = row.getValue("icW_ToDate") as string;
            return val ? <div>{new Date(val).toLocaleDateString()}</div> : null
        },
    },
    {
        id: "actions",
        header: "View",
        cell: ({ row }) => (
            <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4 text-primary" />
            </Button>
        ),
    },
]

// --- Sports ---
export type SportsData = {
    SPCCMSCC_SportsCCName: string
    SPCCMH_HouseName: string
    SPCCMEV_EventVenue: string
    SPCCE_StartDate: string
    SPCCESTR_Points: number
    SPCCESTR_Rank: string
}

export const sportsColumns: ColumnDef<SportsData>[] = [
    {
        accessorKey: "index",
        header: "SL.No",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "SPCCMSCC_SportsCCName",
        header: "Sport Name",
    },
    {
        accessorKey: "SPCCMH_HouseName",
        header: "House",
    },
    {
        accessorKey: "SPCCMEV_EventVenue",
        header: "Venue",
    },
    {
        accessorKey: "SPCCE_StartDate",
        header: "Date",
        cell: ({ row }) => {
            const val = row.getValue("SPCCE_StartDate") as string;
            return val ? <div>{new Date(val).toLocaleDateString()}</div> : null
        },
    },
    {
        accessorKey: "SPCCESTR_Points",
        header: "Points",
    },
    {
        accessorKey: "SPCCESTR_Rank",
        header: "Rank",
    },
]

// --- Achievements ---
export type AchievementData = {
    StudentName: string
    Class: string
    Section: string
    Date: string
    Achievement: string
}

export const achievementColumns: ColumnDef<AchievementData>[] = [
    {
        accessorKey: "index",
        header: "SL.No",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "StudentName",
        header: "Student Name",
    },
    {
        accessorKey: "Class",
        header: "Class",
    },
    {
        accessorKey: "Section",
        header: "Section",
    },
    {
        accessorKey: "Date",
        header: "Date",
    },
    {
        accessorKey: "Achievement",
        header: "Achievement",
    },
]

// --- Fee Details (Detailed Analysis) ---
export type FeeHeadData = {
    FEE_HEAD: string;
    RECEIVABLE: number;
    CONCESSION: number;
    COLLECTION: number;
    ADJUSTMENT: number;
    BALANCE: number;
}

export const feeDetailsColumns: ColumnDef<FeeHeadData>[] = [
    {
        accessorKey: "index",
        header: "SL.NO",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "FEE_HEAD",
        header: "Fee Head",
    },
    {
        accessorKey: "RECEIVABLE",
        header: "Receivable",
    },
    {
        accessorKey: "CONCESSION",
        header: "Concession",
    },
    {
        accessorKey: "COLLECTION",
        header: "Collection",
        cell: ({ row }) => <div className="text-green-600 font-bold">{row.getValue("COLLECTION")}</div>
    },
    {
        accessorKey: "ADJUSTMENT",
        header: "Adjustment",
    },
    {
        accessorKey: "BALANCE",
        header: "Balance",
        cell: ({ row }) => <div className="text-red-600 font-bold">{row.getValue("BALANCE")}</div>
    },
]
