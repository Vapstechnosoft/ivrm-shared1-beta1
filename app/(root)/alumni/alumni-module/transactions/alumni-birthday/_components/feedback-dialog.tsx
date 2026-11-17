'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { saveFeedback } from '@/server/alumni/alumni-student-birthday';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { feedbackSchema } from './schema';

interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    questions: any[];
}

export default function FeedbackDialog({ open, onOpenChange, questions }: FeedbackDialogProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);

    const currentQuestion = questions?.[currentIndex];

    const form = useForm({
        resolver: zodResolver(feedbackSchema),
        values: {
            FMQE_Id: currentQuestion?.fmqE_Id || 0,
            FMTY_Id: currentQuestion?.fmtY_Id || 0,
            fmoP_Id: 0,
            fsttR_FeedBack: ''
        }
    });

    const onSubmit = async (values: any) => {
        const updatedAnswers = [
            ...answers,
            {
                name: values.fmoP_Id,
                FMOP_FeedbackOptions: currentQuestion.feedbackoptiondata.find((o: any) => o.fmoP_Id === values.fmoP_Id)
                    ?.fmoP_FeedbackOptions,
                FMOP_OptionsValue: currentQuestion.feedbackoptiondata.find((o: any) => o.fmoP_Id === values.fmoP_Id)?.fmoP_OptionsValue,
                FMTY_Id: values.FMTY_Id,
                FMQE_Id: values.FMQE_Id,
                FMQE_FeedbackQuestions: currentQuestion.fmqE_FeedbackQuestions,
                FMTY_FeedbackTypeName: currentQuestion.fmtY_FeedbackTypeName,
                FSTTR_FeedBack: values.fsttR_FeedBack
            }
        ];

        if (currentIndex < questions.length - 1) {
            setAnswers(updatedAnswers);
            setCurrentIndex((prev) => prev + 1);
            form.reset({
                FMQE_Id: questions[currentIndex + 1].fmqE_Id,
                FMTY_Id: questions[currentIndex + 1].fmtY_Id,
                fmoP_Id: 0,
                fsttR_FeedBack: ''
            });
        } else {
            try {
                const res = await saveFeedback({ savemodulefeedback: updatedAnswers });
                if (res.returnval === true) {
                    toast.success('Feedback saved successfully');
                    onOpenChange(false);
                } else {
                    toast.error('Failed to save feedback');
                }
            } catch (error) {
                toast.error('An error occurred');
            }
        }
    };

    if (!questions || questions.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        Feedback - Question {currentIndex + 1} of {questions.length}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='space-y-4'>
                            <h3 className='font-medium text-lg'>{currentQuestion.fmqE_FeedbackQuestions}</h3>

                            <FormField
                                control={form.control}
                                name='fmoP_Id'
                                render={({ field }) => (
                                    <FormItem className='space-y-3'>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value.toString()}
                                                className='flex flex-col space-y-2'>
                                                {currentQuestion.feedbackoptiondata?.map((opt: any) => (
                                                    <FormItem key={opt.fmoP_Id} className='flex items-center space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <RadioGroupItem value={opt.fmoP_Id.toString()} />
                                                        </FormControl>
                                                        <FormLabel className='font-normal'>{opt.fmoP_FeedbackOptions}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='fsttR_FeedBack'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Remarks</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type='submit'>{currentIndex < questions.length - 1 ? 'Next' : 'Submit Feedback'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
