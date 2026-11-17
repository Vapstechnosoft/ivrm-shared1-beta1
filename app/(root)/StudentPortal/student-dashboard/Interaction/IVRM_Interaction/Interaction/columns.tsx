"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InteractionMessage } from "./types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2, Paperclip, Users, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface InteractionColumnProps {
    onViewReply: (msg: InteractionMessage) => void;
    onDelete: (msg: InteractionMessage) => void;
    currentUserId: number;
}

// We need a function to generate columns because we need to pass down the action handlers
export const createColumns = ({ onViewReply, onDelete, currentUserId }: InteractionColumnProps): ColumnDef<InteractionMessage>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
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
        accessorKey: "ISMINT_Subject",
        header: "Subject",
        cell: ({ row }) => {
            const isRead = row.original.ISTINT_ReadFlg;
            return (
                <div className="flex flex-col">
                    <span className={`font-medium ${!isRead ? "font-bold text-blue-700" : ""}`}>
                        {row.getValue("ISMINT_Subject")}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {row.original.ISMINT_Interaction}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "Sender",
        header: "Sender / Receiver",
        cell: ({ row }) => {
            const isSent = row.original.ISMINT_ComposedById === currentUserId;
            return (
                <div className="flex flex-col text-sm">
                    {isSent ? (
                        <span className="text-muted-foreground">To: <span className="text-foreground">{row.original.Receiver}</span></span>
                    ) : (
                        <span className="text-muted-foreground">From: <span className="text-foreground">{row.original.Sender}</span></span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "ISMINT_DateTime",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.ISMINT_DateTime), "PP p"),
    },
    {
        accessorKey: "Type",
        header: "Type",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                {row.original.ISMINT_GroupOrIndFlg === 'Group' ?
                    <Badge variant="outline" className="text-blue-600 border-blue-200"><Users className="h-3 w-3 mr-1" /> Group</Badge> :
                    <Badge variant="outline" className="text-green-600 border-green-200"><User className="h-3 w-3 mr-1" /> Individual</Badge>
                }
                {row.original.ISTINT_Attachment && <Paperclip className="h-4 w-4 text-muted-foreground" />}
            </div>
        )
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const msg = row.original;
            const isSent = msg.ISMINT_ComposedById === currentUserId;

            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewReply(msg)} title="View & Reply">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </Button>
                    {isSent && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(msg)} title="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            );
        },
    },
];
