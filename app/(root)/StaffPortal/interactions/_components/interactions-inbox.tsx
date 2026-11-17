
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MessageSquare,
    Users,
    User,
    Send,
    Trash2,
    Paperclip,
    Search,
    RefreshCw,
    Reply
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { IMessage } from '@/types/staff-portal/interactions';

interface InboxProps {
    messages: IMessage[];
    currentUserHrmEId: number;
    totalCount: number;
    onRefresh: () => void;
    onDelete: (msg: IMessage) => void;
    onReply: (msg: IMessage) => void;
}

export default function InteractionsInbox({
    messages,
    currentUserHrmEId,
    totalCount,
    onRefresh,
    onDelete,
    onReply
}: InboxProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = messages.filter(m =>
        m.ISMINT_Subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.Sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.Receiver.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isUnread = (msg: IMessage) => msg.ISTINT_ReadFlg === '0' || msg.ISTINT_ReadFlg === null;

    return (
        <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                Message Inbox
                                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                    {totalCount}
                                </Badge>
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Items in <span className="text-blue-600 font-bold italic">blue</span> are unread</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-primary/10 bg-background/50 focus:bg-background"
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={onRefresh} className="shrink-0 border-primary/10">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {filtered.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No messages found</p>
                        <p className="text-sm">Your inbox is clear or no messages match your search.</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {filtered.map((msg) => (
                            <AccordionItem key={msg.ISTINT_Id} value={msg.ISTINT_Id.toString()} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                <AccordionTrigger className="hover:no-underline px-6 py-4 data-[state=open]:bg-primary/5">
                                    <div className="flex items-center gap-4 w-full text-left">
                                        <div className="shrink-0">
                                            {msg.ISMINT_GroupOrIndFlg === 'Group' ? (
                                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                            ) : (
                                                <div className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                                                <h4 className={cn(
                                                    "text-sm font-bold truncate transition-colors",
                                                    isUnread(msg) ? "text-blue-600 underline decoration-2 underline-offset-4" : "text-foreground"
                                                )}>
                                                    {msg.ISMINT_Subject}
                                                </h4>
                                                <span className="text-[10px] font-bold text-muted-foreground bg-muted p-1 px-2 rounded-full uppercase">
                                                    {format(new Date(msg.ISMINT_DateTime || msg.ISTINT_DateTime), 'dd MMM yyyy, h:mm a')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                {msg.ISMINT_ComposedById === currentUserHrmEId ? (
                                                    <span className="flex items-center gap-1">
                                                        <Send className="h-3 w-3 text-blue-500" />
                                                        <span className="font-bold text-foreground/80">To:</span> {msg.Receiver}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3 text-primary" />
                                                        <span className="font-bold text-foreground/80">From:</span> {msg.Sender}
                                                    </span>
                                                )}
                                                {msg.ISTINT_Attachment && (
                                                    <Badge variant="outline" className="h-4 text-[9px] py-0 px-1 ml-2 bg-yellow-50/50 text-yellow-700 border-yellow-200">
                                                        <Paperclip className="h-2.5 w-2.5 mr-1" /> Attached
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-primary/5 px-6 pb-6 pt-2">
                                    <div className="space-y-4">
                                        <div className="rounded-xl border bg-background p-5 shadow-sm min-h-[100px] relative">
                                            <div className="absolute top-2 right-2 opacity-10">
                                                <MessageSquare className="h-8 w-8" />
                                            </div>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                                                {msg.ISMINT_Interaction}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-primary/10">
                                            <div className="flex items-center gap-3">
                                                {msg.ISTINT_Attachment && (
                                                    <Button variant="secondary" size="sm" className="h-8 text-[11px] gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-none">
                                                        <Paperclip className="h-3.5 w-3.5" /> View Attachment
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => onReply(msg)}
                                                    className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 shadow-lg shadow-primary/20"
                                                >
                                                    <Reply className="h-3.5 w-3.5" /> View & Reply
                                                </Button>
                                                {msg.ISMINT_ComposedById === currentUserHrmEId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(msg)}
                                                        className="h-9 w-9 p-0 text-destructive hover:text-white hover:bg-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}
