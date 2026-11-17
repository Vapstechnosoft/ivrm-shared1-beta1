'use client';

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InboxTab } from './inbox-tab';
import { ComposeTab } from './compose-tab';
import { getInteractionLoadData } from '../actions';
import { InteractionMessage } from '../types';
import { Loader2 } from 'lucide-react';

interface InteractionTabsProps {
    initialData: any;
}

export function InteractionTabs({ initialData }: InteractionTabsProps) {
    const [activeTab, setActiveTab] = useState('inbox');
    const [messages, setMessages] = useState<InteractionMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [composeMode, setComposeMode] = useState<'Group' | 'Individual'>('Individual');

    const {
        roletype,
        configflag,
        userhrmE_Id,
        getinboxmsg
    } = initialData;

    // Determine Role Flag
    const roleFlag = roletype?.[0]?.ivrmrT_Role || 'Student'; // Default or extracted

    useEffect(() => {
        // Initializing inbox messages from server load
        if (getinboxmsg) {
            setMessages(getinboxmsg);
        }
    }, [getinboxmsg]);

    const refreshInbox = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getInteractionLoadData({});
            if (response && response.getinboxmsg) {
                setMessages(response.getinboxmsg);
            }
        } catch (error) {
            console.error("Failed to refresh inbox", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'group') {
            setComposeMode('Group');
        } else if (value === 'individual') {
            setComposeMode('Individual');
        } else if (value === 'compose') {
            setComposeMode('Individual'); // Student compose defaults to individual usually
        }
    };

    const handleComposeSuccess = () => {
        setActiveTab('inbox');
        refreshInbox();
    };

    const isStaff = roleFlag === 'Staff' || roleFlag === 'HOD' || roleFlag === 'Principal';

    return (
        <Card className="w-full shadow-lg border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <CardTitle className="text-2xl font-bold text-primary">Interactions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-8 mx-auto md:mx-0 gap-2">
                        <TabsTrigger value="inbox">Inbox</TabsTrigger>
                        {isStaff && (
                            <>
                                <TabsTrigger value="group">Group</TabsTrigger>
                                <TabsTrigger value="individual">Individual</TabsTrigger>
                            </>
                        )}
                        {!isStaff && (
                            <TabsTrigger value="compose">Compose</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="inbox" className="mt-0">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <InboxTab
                                messages={messages}
                                currentUserId={userhrmE_Id}
                                onRefresh={refreshInbox}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="group" className="mt-0">
                        <ComposeTab
                            roleFlg={roleFlag}
                            configFlag={configflag}
                            userHrmIds={userhrmE_Id}
                            onSuccess={handleComposeSuccess}
                            isGroup={true}
                            initialData={initialData}
                        />
                    </TabsContent>

                    <TabsContent value="individual" className="mt-0">
                        <ComposeTab
                            roleFlg={roleFlag}
                            configFlag={configflag}
                            userHrmIds={userhrmE_Id}
                            onSuccess={handleComposeSuccess}
                            isGroup={false}
                            initialData={initialData}
                        />
                    </TabsContent>

                    <TabsContent value="compose" className="mt-0">
                        <ComposeTab
                            roleFlg={roleFlag}
                            configFlag={configflag}
                            userHrmIds={userhrmE_Id}
                            onSuccess={handleComposeSuccess}
                            isGroup={false}
                            initialData={initialData}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
