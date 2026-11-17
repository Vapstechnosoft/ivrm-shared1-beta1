'use client';

import { useState } from 'react';
import { InteractionMessage } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Users, Paperclip, Trash2, Reply } from 'lucide-react';
import { ViewReplyModal } from './view-reply-modal';
import { deleteInteraction } from '../actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface InboxTabProps {
    messages: InteractionMessage[];
    currentUserId: number;
    onRefresh: () => void;
}

export function InboxTab({ messages, currentUserId, onRefresh }: InboxTabProps) {
    const [selectedMessage, setSelectedMessage] = useState<InteractionMessage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedMsgId, setExpandedMsgId] = useState<number | null>(null);

    const handleViewReply = (msg: InteractionMessage) => {
        setSelectedMessage(msg);
        setIsModalOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent, msg: InteractionMessage) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this interaction?')) return;

        try {
            const data = { ISMINT_Id: msg.ISMINT_Id, ISMINT_ComposedById: msg.ISMINT_ComposedById };
            const response = await deleteInteraction(data);
            if (response && response.returnval === true) {
                toast.success("Deleted", { description: "Message deleted successfully." });
                onRefresh();
            } else {
                toast.error("Error", { description: "Failed to delete message." });
            }
        } catch (e) {
            console.error(e);
            toast.error("Error", { description: "Error deleting message." });
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedMsgId(expandedMsgId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 bg-primary/10 p-3 rounded-md border border-primary/20">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <Mail className="h-5 w-5" />
                    Message Inbox
                    <Badge variant="secondary" className="ml-2 bg-white text-primary hover:bg-white/90">{messages.length}</Badge>
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2 hidden md:inline">Blue colour indicates unread</span>
                    <Button variant="outline" size="sm" onClick={onRefresh} className="h-8">
                        <span className="sr-only">Refresh</span>
                        <i className="fa fa-refresh" /> Refresh
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                {messages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No messages found.</div>
                ) : (
                    messages.map((msg) => {
                        const isExpanded = expandedMsgId === msg.ISTINT_Id;
                        const isUnread = msg.ISTINT_ReadFlg === 0 || msg.ISTINT_ReadFlg === null;

                        return (
                            <div key={msg.ISTINT_Id} className="border rounded-md shadow-sm bg-white overflow-hidden transition-all duration-200">
                                {/* Header */}
                                <div
                                    className={cn(
                                        "p-4 cursor-pointer flex flex-wrap items-center gap-4 hover:bg-slate-50 transition-colors",
                                        isExpanded ? "bg-slate-50 border-b" : ""
                                    )}
                                    onClick={() => toggleExpand(msg.ISTINT_Id)}
                                >
                                    {/* Icon Column (Col 1) */}
                                    <div className="w-8 flex justify-center">
                                        {msg.ISMINT_GroupOrIndFlg === 'Group' ? (
                                            <Users className="h-5 w-5 text-blue-600" />
                                        ) : (
                                            <User className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>

                                    {/* Subject Column (Col 5) */}
                                    <div className="flex-1 min-w-[200px]">
                                        <span className={cn(
                                            "block font-medium truncate",
                                            isUnread ? "text-blue-600 font-bold" : "text-slate-800"
                                        )}>
                                            {msg.ISMINT_Subject}
                                        </span>
                                    </div>

                                    {/* Sender/Receiver Column (Col 3) */}
                                    <div className="w-[200px] hidden md:block text-right text-sm">
                                        {msg.ISMINT_GroupOrIndFlg === 'Individual' ? (
                                            msg.ISMINT_ComposedById === currentUserId ? (
                                                <span className="text-muted-foreground"><span className="font-bold text-slate-700">To:</span> {msg.Receiver}</span>
                                            ) : (
                                                <span className="text-muted-foreground"><span className="font-bold text-slate-700">From:</span> {msg.Sender}</span>
                                            )
                                        ) : (
                                            <span className="text-muted-foreground"><span className="font-bold text-slate-700">From:</span> {msg.Sender}</span>
                                        )}
                                    </div>

                                    {/* Date Column (Col 2) */}
                                    <div className="w-[140px] text-right text-xs font-semibold text-slate-600">
                                        {msg.ISMINT_DateTime ? format(new Date(msg.ISMINT_DateTime), 'dd/MM/yyyy h:mma') : ''}
                                    </div>

                                    {/* Icon Action Column (Col 1) */}
                                    <div className="w-8 flex justify-center">
                                        {msg.ISMINT_ComposedById === currentUserId ? (
                                            <Paperclip className="h-4 w-4 text-dodgerblue" /> // Using generic icon to match legacy "paper-plane" intent for sent
                                        ) : (
                                            <Mail className="h-4 w-4 text-blue-800" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="p-4 bg-slate-50/50 animate-in slide-in-from-top-2">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="text-sm font-medium text-slate-700">Message:</div>
                                                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                                    {msg.ISMINT_Interaction}
                                                </p>

                                                {/* Attachments (Legacy Logic) */}
                                                {(msg.ISTINT_Attachment || msg.ISMINT_Attachment) && (
                                                    <div className="mt-4 flex items-center gap-2">
                                                        <Paperclip className="h-4 w-4 text-slate-400" />
                                                        <span className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-800">
                                                            View Attachment
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex md:flex-col gap-2 justify-end md:justify-start min-w-[120px]">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="w-full bg-primary hover:bg-primary/90"
                                                    onClick={(e) => { e.stopPropagation(); handleViewReply(msg); }}
                                                >
                                                    <Reply className="h-3 w-3 mr-2" />
                                                    View & Reply
                                                </Button>

                                                {msg.ISMINT_ComposedById === currentUserId && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={(e) => handleDelete(e, msg)}
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-2" />
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <ViewReplyModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); onRefresh(); }}
                message={selectedMessage}
                currentUserId={currentUserId}
            />
        </div>
    );
}
