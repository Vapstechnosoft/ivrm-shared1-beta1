'use client';

import AddInteractionForm from '@/app/(root)/alumni/alumni-module/transactions/alumni-interactions/_components/add-form';
import InboxList from '@/app/(root)/alumni/alumni-module/transactions/alumni-interactions/_components/inbox-list';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAlumniInteractionLoadData } from '@/server/alumni/alumni-interactions';
import type { IAlumniInteraction } from '@/types/alumni/alumni-interactions';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function AlumniInteractionsPage() {
    const [activeTab, setActiveTab] = useState('inbox');
    const [inboxData, setInboxData] = useState<IAlumniInteraction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [roleFlg, setRoleFlg] = useState<string>('');
    const [userHrmeId, setUserHrmeId] = useState<number>(0);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAlumniInteractionLoadData();
            if (res.success && res.data) {
                // Legacy logic: filter unique ALSMINT_Id for initial list
                const msgList: IAlumniInteraction[] = [];
                const seen = new Set();
                (res.data.getinboxmsg || []).forEach((mg) => {
                    if (!seen.has(mg.ALSMINT_Id)) {
                        seen.add(mg.ALSMINT_Id);
                        msgList.push(mg);
                    }
                });
                setInboxData(msgList);
                setRoleFlg(res.data.roletype?.[0]?.ivrmrT_Role || '');
                setUserHrmeId(res.data.userhrmE_Id || 0);
                setError(null);
            } else {
                setError('Failed to load data');
            }
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className='container min-h-screen space-y-4 p-4'>
            <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                <div>
                    <h2 className='font-bold text-2xl tracking-tight'>Alumni Interactions</h2>
                    <p className='mt-1 text-muted-foreground text-sm'>Connect with fellow alumni through messages</p>
                </div>
                <div className='rounded-full bg-primary/10 px-3 py-1 text-primary text-sm'>
                    {inboxData.length} message{inboxData.length !== 1 ? 's' : ''} in inbox
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='grid w-full grid-cols-3 lg:w-[500px]'>
                    <TabsTrigger value='inbox' className='relative'>
                        Inbox
                        {inboxData.length > 0 && (
                            <span className='-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs'>
                                {inboxData.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value='group'>Group Message</TabsTrigger>
                    <TabsTrigger value='individual'>Individual Message</TabsTrigger>
                </TabsList>

                <TabsContent value='inbox' className='mt-6'>
                    <div className='rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-1'>
                        <CollapsibleSection title='Message Inbox' defaultOpen={true} variant='default'>
                            {isLoading ? (
                                <div className='flex flex-col items-center justify-center gap-3 p-12'>
                                    <Loader2 className='h-10 w-10 animate-spin text-primary' />
                                    <p className='text-muted-foreground'>Loading your messages...</p>
                                </div>
                            ) : error ? (
                                <div className='rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700'>
                                    <p className='font-medium'>Error loading inbox</p>
                                    <p className='mt-2 text-sm'>{String(error)}</p>
                                </div>
                            ) : (
                                <InboxList messages={inboxData} userHrmeId={userHrmeId} onRefresh={loadData} />
                            )}
                        </CollapsibleSection>
                    </div>
                </TabsContent>

                <TabsContent value='group' className='mt-6'>
                    <CollapsibleSection title='Compose Group Message' defaultOpen={true} variant='outline'>
                        <div className='p-1'>
                            <AddInteractionForm
                                interactionType='Group'
                                roleFlg={roleFlg}
                                onSuccess={() => {
                                    setActiveTab('inbox');
                                    loadData();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </TabsContent>

                <TabsContent value='individual' className='mt-6'>
                    <CollapsibleSection title='Compose Individual Message' defaultOpen={true} variant='outline'>
                        <div className='p-1'>
                            <AddInteractionForm
                                interactionType='Individual'
                                roleFlg={roleFlg}
                                onSuccess={() => {
                                    setActiveTab('inbox');
                                    loadData();
                                }}
                            />
                        </div>
                    </CollapsibleSection>
                </TabsContent>
            </Tabs>
        </div>
    );
}
