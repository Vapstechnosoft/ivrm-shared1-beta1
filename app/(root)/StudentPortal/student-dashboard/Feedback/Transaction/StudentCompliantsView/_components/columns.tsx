"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileText, ImageIcon, File as FileIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StudentComplaint } from "../types"

export const columns: ColumnDef<StudentComplaint>[] = [
    {
        accessorKey: "index",
        header: "Sl.No.",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "AMST_FirstName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Student Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("AMST_FirstName")}</div>,
    },
    {
        accessorKey: "AMST_AdmNo",
        header: "Admission No.",
    },
    {
        accessorKey: "ASMCL_ClassName",
        header: "Class",
    },
    {
        accessorKey: "ASMC_SectionName",
        header: "Section",
    },
    {
        accessorKey: "ASCOMP_Subject",
        header: "Subject",
    },
    {
        accessorKey: "ASCOMP_Complaints",
        header: "Remarks",
    },
    {
        accessorKey: "ASCOMP_Date",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("ASCOMP_Date"))
            return <div>{date.toLocaleDateString('en-GB')}</div>
        },
    },
    {
        id: "file",
        header: "File",
        cell: ({ row }) => {
            const complaint = row.original
            if (!complaint.ASCOMP_FilePath) return null

            const fileType = complaint.filetype?.toLowerCase()
            const fileName = complaint.ASCOMP_FileName || "File"
            const filePath = complaint.ASCOMP_FilePath
            const docPath = complaint.document_Pathnew || filePath

            // Helper to render link with icon
            const renderLink = (url: string, label: string, colorClass: string, icon: React.ReactNode) => (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 font-bold hover:underline ${colorClass}`}
                >
                    {icon}
                    {label}
                </a>
            )

            if (['jpg', 'png', 'jpeg', 'gif', 'svg'].includes(fileType || '')) {
                return renderLink(filePath, "Image", "text-red-600", <ImageIcon className="h-4 w-4" />)
            }

            if (fileType === 'pdf') {
                return renderLink(filePath, "PDF", "text-blue-600", <FileText className="h-4 w-4" />)

            }

            if (['doc', 'docx'].includes(fileType || '')) {
                return renderLink(docPath, "Document", "text-blue-600", <FileIcon className="h-4 w-4" />)

            }

            if (['ppt', 'pptx'].includes(fileType || '')) {
                return renderLink(docPath, "PPT", "text-orange-600", <FileIcon className="h-4 w-4" />)
            }

            if (['xls', 'xlsx'].includes(fileType || '')) {
                return renderLink(docPath, "Excel", "text-green-600", <FileIcon className="h-4 w-4" />)
            }

            // Default fallback
            return (
                <a href={filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {fileName}
                </a>
            )
        },
    },
]
