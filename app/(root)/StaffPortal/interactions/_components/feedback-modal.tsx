
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { IFeedbackQuestion } from '@/types/staff-portal/interactions';

interface FeedbackModalProps {
    questions?: IFeedbackQuestion[];
    onSave: (responses: any[]) => void;
}

export default function FeedbackModal({ questions, onSave }: FeedbackModalProps) {
    const [open, setOpen] = useState(false);
    const [localQuestions, setLocalQuestions] = useState<IFeedbackQuestion[]>([]);

    useEffect(() => {
        if (questions && questions.length > 0) {
            setLocalQuestions(questions.map(q => ({ ...q, name: undefined, fsttR_FeedBack: '' })));
            setOpen(true);
        }
    }, [questions]);

    const handleOptionChange = (qId: number, oId: string) => {
        setLocalQuestions(prev => prev.map(q => q.fmqE_Id === qId ? { ...q, name: Number(oId) } : q));
    };

    const handleRemarkChange = (qId: number, val: string) => {
        setLocalQuestions(prev => prev.map(q => q.fmqE_Id === qId ? { ...q, fsttR_FeedBack: val } : q));
    };

    const handleSubmit = () => {
        const responses: any[] = [];
        for (const q of localQuestions) {
            if (!q.name) {
                toast.error(`Please answer question: ${q.fmqE_FeedbackQuestions}`);
                return;
            }
            if (!q.fsttR_FeedBack) {
                toast.error(`Please provide a remark for: ${q.fmqE_FeedbackQuestions}`);
                return;
            }
            const option = q.feedbackoptiondata.find(o => o.fmoP_Id === q.name);
            responses.push({
                name: q.name,
                FMOP_FeedbackOptions: option?.fmoP_FeedbackOptions,
                FMOP_OptionsValue: option?.fmoP_OptionsValue,
                FMTY_Id: q.fmtY_Id,
                FMQE_Id: q.fmqE_Id,
                FMQE_FeedbackQuestions: q.fmqE_FeedbackQuestions,
                FMTY_FeedbackTypeName: q.fmtY_FeedbackTypeName,
                FSTTR_FeedBack: q.fsttR_FeedBack
            });
        }
        onSave(responses);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary border-b pb-2">Feedback Survey</DialogTitle>
                </DialogHeader>
                <div className="space-y-8 py-4">
                    {localQuestions.map((q, idx) => (
                        <div key={q.fmqE_Id} className="space-y-4 p-4 rounded-lg bg-muted/30 border border-primary/5">
                            <h4 className="font-semibold text-lg">
                                <span className="text-primary mr-2">{idx + 1}.</span>
                                {q.fmqE_FeedbackQuestions}
                            </h4>
                            <RadioGroup
                                value={q.name?.toString()}
                                onValueChange={(val) => handleOptionChange(q.fmqE_Id, val)}
                                className="flex flex-wrap gap-6"
                            >
                                {q.feedbackoptiondata.map(opt => (
                                    <div key={opt.fmoP_Id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt.fmoP_Id.toString()} id={`opt-${opt.fmoP_Id}`} />
                                        <Label htmlFor={`opt-${opt.fmoP_Id}`} className="cursor-pointer">{opt.fmoP_FeedbackOptions}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <div className="space-y-2 pt-2">
                                <Label className="text-sm font-medium">Remark <span className="text-destructive">*</span></Label>
                                <Textarea
                                    placeholder="Enter your feedback here..."
                                    value={q.fsttR_FeedBack}
                                    onChange={(e) => handleRemarkChange(q.fmqE_Id, e.target.value)}
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Skip</Button>
                    <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">Submit Feedback</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
