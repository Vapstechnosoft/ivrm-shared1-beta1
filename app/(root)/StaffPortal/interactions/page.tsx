
'use client';

import React, { useState, useEffect } from 'react';
import { useInteractions } from '@/hooks/staff-portal/useInteractions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Users, User, MessageSquare, Search, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import InteractionsInbox from './_components/interactions-inbox';
import InteractionsCompose from './_components/interactions-compose';
import InteractionsReplyModal from './_components/interactions-reply-modal';
import FeedbackModal from './_components/feedback-modal';

import type { IMessage, ISaveInteractionRequest, ISaveReplyRequest } from '@/types/staff-portal/interactions';

export default function InteractionsPage() {
    const {
        initialData,
        isLoadingInitial,
        getRecipients,
        getSections,
        getStudents,
        save,
        reply,
        deleteMsg,
        feedback,
        saveFeedback,
        refresh
    } = useInteractions();

    const [activeTab, setActiveTab] = useState("inbox");
    const [activeMessage, setActiveMessage] = useState<IMessage | null>(null);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [thread, setThread] = useState<any[]>([]);

    useEffect(() => {
        if (activeMessage) {
            // In a real scenario, we might fetch the full thread here
            // For now, we use the message list and filter by ISMINT_Id if applicable
            const conversation = initialData?.getinboxmsg.filter(m => m.ISMINT_Id === activeMessage.ISMINT_Id) || [];
            setThread(conversation);
        }
    }, [activeMessage, initialData]);

    const handleSend = (data: ISaveInteractionRequest) => {
        save.mutate(data, {
            onSuccess: (res) => {
                if (res.data?.returnval) {
                    toast.success("Message sent successfully");
                    setActiveTab("inbox");
                    refresh();
                } else {
                    toast.error("Failed to send message");
                }
            },
            onError: (err) => {
                toast.error("An error occurred: " + err);
            }
        });
    };

    const handleReply = (data: ISaveReplyRequest) => {
        reply.mutate(data, {
            onSuccess: (res) => {
                if (res.data?.returnval) {
                    toast.success("Reply sent successfully");
                    setIsReplyOpen(false);
                    refresh();
                } else {
                    toast.error("Failed to send reply");
                }
            },
            onError: (err) => {
                toast.error("An error occurred: " + err);
            }
        });
    };

    const handleDelete = (msg: IMessage) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        deleteMsg.mutate({ ISMINT_Id: msg.ISMINT_Id, ISTINT_Id: msg.ISTINT_Id }, {
            onSuccess: (res) => {
                if (res.data?.returnval) {
                    toast.success("Message deleted");
                    if (isReplyOpen) setIsReplyOpen(false);
                    refresh();
                }
            }
        });
    };

    const handleSaveFeedback = (responses: any[]) => {
        saveFeedback.mutate({ savemodulefeedback: responses }, {
            onSuccess: (res) => {
                if (res.data?.returnval) {
                    toast.success("Feedback submitted. Thank you!");
                }
            }
        });
    };

    if (isLoadingInitial) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading interactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-primary/10">
                <div className="flex items-center gap-4">
                    <div className="bg-primary shadow-lg shadow-primary/20 p-3 rounded-2xl">
                        <MessageSquare className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Interactions</h1>
                        <p className="text-sm text-muted-foreground font-medium">Connect and communicate with students, parents, and staff</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-8 gap-2 bg-primary/5 border-primary/10 text-primary font-bold px-4">
                        <User className="h-4 w-4" />
                        Role: {initialData?.roletype?.[0]?.ivrmrT_Role || 'Staff'}
                    </Badge>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="flex justify-center">
                    <TabsList className="bg-muted/50 p-1 h-14 rounded-2xl border border-primary/10 shadow-sm">
                        <TabsTrigger value="inbox" className="h-12 px-8 rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md gap-2 font-bold transition-all">
                            <Mail className="h-4 w-4" /> Inbox
                        </TabsTrigger>
                        <TabsTrigger value="group" className="h-12 px-8 rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md gap-2 font-bold transition-all">
                            <Users className="h-4 w-4" /> Group
                        </TabsTrigger>
                        <TabsTrigger value="individual" className="h-12 px-8 rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md gap-2 font-bold transition-all">
                            <User className="h-4 w-4" /> Individual
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="inbox" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InteractionsInbox
                        messages={initialData?.getinboxmsg || []}
                        currentUserHrmEId={initialData?.userhrmE_Id || 0}
                        totalCount={initialData?.getinboxmsg.length || 0}
                        onRefresh={refresh}
                        onDelete={handleDelete}
                        onReply={(msg) => {
                            setActiveMessage(msg);
                            setIsReplyOpen(true);
                        }}
                    />
                </TabsContent>

                <TabsContent value="group" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InteractionsCompose
                        initialData={initialData || undefined}
                        mode="Group"
                        onCancel={() => setActiveTab("inbox")}
                        onSend={handleSend}
                        getRecipients={async (r) => {
                            const res = await getRecipients.mutateAsync({ roleflg: initialData?.roletype?.[0]?.ivrmrT_Role || 'Staff', userflag: r });
                            return res.data?.getdetails || [];
                        }}
                        getSections={async (c) => {
                            const res = await getSections.mutateAsync({ asmcL_Id: c, asmaY_Id: 0, roleflg: initialData?.roletype?.[0]?.ivrmrT_Role || 'Staff' });
                            return res.data?.sectionList || [];
                        }}
                        getStudents={async (c, s) => {
                            const res = await getStudents.mutateAsync({ asmcL_Id: c, asmS_Id: s });
                            return res.data?.get_student || [];
                        }}
                    />
                </TabsContent>

                <TabsContent value="individual" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <InteractionsCompose
                        initialData={initialData || undefined}
                        mode="Individual"
                        onCancel={() => setActiveTab("inbox")}
                        onSend={handleSend}
                        getRecipients={async (r) => {
                            const res = await getRecipients.mutateAsync({ roleflg: initialData?.roletype?.[0]?.ivrmrT_Role || 'Staff', userflag: r });
                            return res.data?.getdetails || [];
                        }}
                        getSections={async (c) => {
                            const res = await getSections.mutateAsync({ asmcL_Id: c, asmaY_Id: 0, roleflg: initialData?.roletype?.[0]?.ivrmrT_Role || 'Staff' });
                            return res.data?.sectionList || [];
                        }}
                        getStudents={async (c, s) => {
                            const res = await getStudents.mutateAsync({ asmcL_Id: c, asmS_Id: s });
                            return res.data?.get_student || [];
                        }}
                    />
                </TabsContent>
            </Tabs>

            <InteractionsReplyModal
                open={isReplyOpen}
                onOpenChange={setIsReplyOpen}
                activeMessage={activeMessage}
                thread={thread}
                onSaveReply={handleReply}
                onDelete={handleDelete}
                currentUserId={initialData?.userhrmE_Id || 0}
            />

            <FeedbackModal
                questions={feedback?.feedbackquestion}
                onSave={handleSaveFeedback}
            />
        </div>
    );
}
