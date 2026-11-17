'use client';
// Force rebuild after rename

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import {
    getBirthdayInitialData,
    getFeedbackQuestions,
    getParticipantList,
    sendBirthdayMessages
} from '@/server/alumni/alumni-student-birthday';
import html2canvas from 'html2canvas';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BirthdayForm from './_components/birthday-form';
import BirthdayTemplate from './_components/birthday-template';
import FeedbackDialog from './_components/feedback-dialog';
import ParticipantTable from './_components/participant-table';
import type { IBirthdayFormValues } from './_components/schema';

export default function AlumniStudentBirthdayPage() {
    const [initialData, setInitialData] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [sending, setSending] = useState(false);

    // Category Type
    const [category, setCategory] = useState('student');

    // Feedback State
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackQuestions, setFeedbackQuestions] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const [initRes, feedbackRes] = await Promise.all([getBirthdayInitialData(), getFeedbackQuestions({ Flag: 'BirthDay' })]);

            setInitialData(initRes);

            if ((feedbackRes as any)?.feedbackquestion?.length > 0) {
                // Enrich questions with options
                const enriched = (feedbackRes as any).feedbackquestion.map((fq: any) => ({
                    ...fq,
                    feedbackoptiondata: (feedbackRes as any).feedbackoption.filter(
                        (fo: any) => fo.fmtY_Id === fq.fmtY_Id && fo.fmqE_Id === fq.fmqE_Id
                    )
                }));
                setFeedbackQuestions(enriched);
                setFeedbackOpen(true);
            }

            // Initial participant fetch
            handleCategoryChange('student');
        } catch (error) {
            console.error('Initial fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCategoryChange = async (type: string) => {
        setCategory(type);
        setSearching(true);
        try {
            const res = await getParticipantList({ rdbbutton: type });
            if (type === 'Staff') {
                setParticipants((res as any).staffList || []);
            } else {
                setParticipants((res as any).studentlist || []);
            }
        } catch (error) {
            toast.error('Failed to fetch participants');
        } finally {
            setSearching(false);
        }
    };

    const handleSendWishes = async (values: IBirthdayFormValues) => {
        if (selectedRows.length === 0) {
            toast.error('Please select at least one recipient');
            return;
        }

        setSending(true);
        try {
            const wishesPayload = [];

            for (const person of selectedRows) {
                const id = category === 'Staff' ? person.hrmE_Id : person.amsT_Id;
                const element = document.getElementById(`birthday-card-${id}`);

                let imageBase64 = null;
                if (element && (values.Whatsapp || values.email)) {
                    const canvas = await html2canvas(element, {
                        useCORS: true,
                        scale: 2
                    });
                    imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                }

                wishesPayload.push({
                    ...person,
                    image_base_64: imageBase64
                });
            }

            const res = await sendBirthdayMessages({
                selectedStudent: category !== 'Staff' ? wishesPayload : [],
                selectedEmployees: category === 'Staff' ? wishesPayload : [],
                rdbbutton: category,
                smsflag: values.sms,
                emailflag: values.email,
                WhatsappFlag: values.Whatsapp
            });

            if (res.smsStatus || res.emailStatus || res.whatsappstatus) {
                toast.success('Birthday wishes sent successfully');
                setSelectedRows([]);
            } else {
                toast.error('Failed to send wishes');
            }
        } catch (error) {
            console.error('Send failed:', error);
            toast.error('An error occurred while sending');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className='flex h-[80vh] items-center justify-center'>
                <Loader2 className='h-12 w-12 animate-spin text-primary' />
            </div>
        );
    }

    return (
        <div className='container space-y-6 p-6'>
            <div className='border-b pb-4'>
                <h1 className='font-bold text-3xl tracking-tight'>Alumni Student Birthday</h1>
                <p className='text-muted-foreground'>Celebrate birthdays by sending personalized wishes to the community.</p>
            </div>

            <BirthdayForm onTypeChange={handleCategoryChange} onSubmit={handleSendWishes} isLoading={sending} />

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
                <div className='lg:col-span-8'>
                    <CollapsibleSection title={`${category.charAt(0).toUpperCase() + category.slice(1)} List`} defaultOpen={true}>
                        <ParticipantTable
                            data={participants}
                            type={category}
                            selectedRows={selectedRows}
                            onRowSelectionChange={setSelectedRows}
                            isLoading={searching}
                        />
                    </CollapsibleSection>
                </div>

                <div className='lg:col-span-4'>
                    <CollapsibleSection title='Wish Preview' defaultOpen={true}>
                        <div className='flex max-h-[800px] flex-col items-center gap-6 overflow-y-auto p-2'>
                            {selectedRows.length > 0 ? (
                                selectedRows.map((person) => (
                                    <BirthdayTemplate
                                        key={category === 'Staff' ? person.hrmE_Id : person.amsT_Id}
                                        participant={person}
                                        type={category}
                                    />
                                ))
                            ) : (
                                <div className='flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground'>
                                    <p>Select participants to see preview</p>
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>
                </div>
            </div>

            <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} questions={feedbackQuestions} />
        </div>
    );
}
