
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare,
    Send,
    X,
    Trash2,
    Paperclip,
    User,
    Clock,
    Reply as ReplyIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { IMessage, ISaveReplyRequest } from '@/types/staff-portal/interactions';

interface ReplyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activeMessage: IMessage | null;
    thread: any[]; // Replied messages in the thread
    onSaveReply: (data: ISaveReplyRequest) => void;
    onDelete: (msg: any) => void;
    currentUserId: number;
}

export default function InteractionsReplyModal({
    open,
    onOpenChange,
    activeMessage,
    thread,
    onSaveReply,
    onDelete,
    currentUserId
}: ReplyModalProps) {
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (!open) {
            setReplyText("");
            setIsSending(false);
        }
    }, [open]);

    const handleSend = () => {
        if (!replyText || !activeMessage) return;
        setIsSending(true);
        onSaveReply({
            ISMINT_Id: activeMessage.ISMINT_Id,
            ISTINT_Interaction: replyText,
            roleflg: activeMessage.ISMINT_ComposedByFlg,
            images_paths: []
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden border-primary/20 shadow-2xl">
                <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <ReplyIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-primary">
                                    {activeMessage?.ISMINT_Subject}
                                </DialogTitle>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Conversation Thread</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden bg-muted/5 flex flex-col">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6">
                            {/* The original message or latest thread items */}
                            {[...(thread || [])].reverse().map((msg, idx) => {
                                const isMe = msg.ISTINT_ComposedById === currentUserId;
                                return (
                                    <div key={idx} className={cn(
                                        "flex flex-col max-w-[85%]",
                                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                                    )}>
                                        <div className="flex items-center gap-2 mb-2 px-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.Sender}</span>
                                            <Clock className="h-2.5 w-2.5 text-muted-foreground/50" />
                                            <span className="text-[10px] text-muted-foreground">{format(new Date(msg.ISTINT_DateTime), 'dd MMM, hh:mm a')}</span>
                                        </div>
                                        <div className={cn(
                                            "relative group p-4 rounded-2xl shadow-sm border",
                                            isMe
                                                ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none"
                                                : "bg-background border-primary/10 rounded-tl-none"
                                        )}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.ISTINT_Interaction}</p>

                                            <div className={cn(
                                                "absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                                isMe ? "-left-10" : "-right-10"
                                            )}>
                                                {msg.ISTINT_ComposedById === currentUserId && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(msg)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            {msg.ISTINT_Attachment && (
                                                <div className="mt-3 pt-3 border-t border-current/10">
                                                    <Button variant="secondary" size="sm" className="h-7 text-[10px] gap-2 py-0 bg-background/20 hover:bg-background/30 text-current border-none shadow-none">
                                                        <Paperclip className="h-3 w-3" /> View Attachment
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {thread.length === 0 && (
                                <div className="text-center py-10 opacity-40">
                                    <MessageSquare className="h-10 w-10 mx-auto mb-2" />
                                    <p className="text-sm font-medium italic">No previous thread discovered</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-6 bg-background border-t">
                        <div className="relative bg-muted/30 rounded-2xl border border-primary/10 p-4 focus-within:border-primary/30 transition-all focus-within:shadow-md">
                            <Textarea
                                placeholder="Type your reply here..."
                                className="min-h-[100px] border-none bg-transparent shadow-none focus-visible:ring-0 p-0 text-base"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <input type="file" id="reply-attach" className="hidden" />
                                    <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/10 text-muted-foreground hover:text-primary bg-background" asChild>
                                        <label htmlFor="reply-attach" className="cursor-pointer">
                                            <Paperclip className="h-3.5 w-3.5" /> Attachment
                                        </label>
                                    </Button>
                                </div>
                                <Button
                                    className="h-10 px-8 gap-3 bg-primary hover:bg-primary/90 font-bold"
                                    onClick={handleSend}
                                    disabled={!replyText || isSending}
                                >
                                    <Send className="h-4 w-4" />
                                    {isSending ? "Sending..." : "Send Reply"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
