'use client';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { useExamStandard } from '@/hooks/exam/exammodule/configuration';
import { examStandardSchema } from '@/schemas/exam/exam-module/configurations';
import { UpdateExamStandard } from '@/server/exam/exam-module/configurations/exam-standard';
import type { IExamStandard } from '@/types/exam/exam-module/configurations';
import { zodResolver } from '@hookform/resolvers/zod';
import { use, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import ExamStandardForm from './_components/details';
type FormFields = z.infer<typeof examStandardSchema.Update>;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ExamStandardPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error, refetchAll } = useExamStandard(searchParams);

    return (
        <FormProvider<IExamStandard>>
            <ExamStandardPageContent response={response} isLoading={isLoading} error={error} refetchAll={refetchAll} />
        </FormProvider>
    );
}

function ExamStandardPageContent({
    response
}: {
    response: any;
    isLoading: boolean;
    error: any;
    refetchAll: any;
}) {
    const { control, watch, reset, handleSubmit, formState } = useForm<FormFields>({
        resolver: zodResolver(examStandardSchema.Update),

        defaultValues: {
            ExmConfig_Id: null,
            // mI_Id: 30,
            ExmConfig_RankingMethod: 'Dense',
            ExmConfig_Remarks: 'General',
            ExmConfig_PassFailRankFlag: '0',
            ExmConfig_AdmNoRegNoRollNo_DefaultFlag: 'Admno',
            ExmConfig_Recordsearchtype: '',

            ExmConfig_EnableFractionFlg: false,
            ExmConfig_NoOfDecimal: '',
            ExmConfig_RoundoffFlag: false,
            ExmConfig_NoOfDecimalValues: '',

            ExmConfig_PromotionFlag: false,
            ExmConfig_GraceAplFlg: false,
            ExmConfig_BonusAplFlag: false,
            ExmConfig_MinAttAplFlag: false,
            ExmConfig_MarksMultiply: false,
            ExmConfig_PerRoundoffFlag: false,
            ExmConfig_FailBoldFlg: false,
            ExmConfig_FailItalicFlg: false,
            ExmConfig_FailUnderscoreFlg: false,
            ExmConfig_ClassRankFlg: false,
            ExmConfig_ClassPositionFlg: false,
            ExmConfig_FailRankFlg: false,
            ExmConfig_FeeDefaulterDisplayFlg: false,
            ExmConfig_GroupMarksToResultFlg: false,
            ExmConfig_EntryDateRestFlg: false,
            ExmConfig_AdmnoColumnDisplay: false,
            ExmConfig_RegnoColumnDisplay: false,
            ExmConfig_RollnoColumnDisplay: false,
            ExmConfig_HallTicketFlg: false,
            ExmConfig_AllSubjectAbsentFlg: false,
            ExmConfig_SecRankFlg: false,
            ExmConfig_SectionPositionFlg: false,
            ExmConfig_GroupwiseMarksFlg: false,
            ExmConfig_SubjectwiseSecRankFlg: false,
            ExmConfig_SubjectwiseClassRankFlg: false,
            ExmConfig_PromSubjRoundoffFlag: false,
            ExmConfig_FailColorFlg: ''
        }
    });
    useEffect(() => {
        if (response?.data) {
            reset({
                ExmConfig_Id: response.data.exmConfig_Id ?? null,
                // mI_Id: 30,

                ExmConfig_RankingMethod:
                    response.data.exmConfig_RankingMethod === 'Dense' || response.data.exmConfig_RankingMethod === 'Standard'
                        ? response.data.exmConfig_RankingMethod
                        : 'Dense',

                ExmConfig_Remarks:
                    response.data.exmConfig_Remarks === 'General' || response.data.exmConfig_Remarks === 'Studentwise'
                        ? response.data.exmConfig_Remarks
                        : 'General',

                ExmConfig_PassFailRankFlag: response.data.exmConfig_PassFailRankFlag ? '1' : '0',
                ExmConfig_AdmNoRegNoRollNo_DefaultFlag:
                    response.data.exmConfig_AdmNoRegNoRollNo_DefaultFlag === 'string'
                        ? 'Admno'
                        : response.data.exmConfig_AdmNoRegNoRollNo_DefaultFlag,
                ExmConfig_Recordsearchtype: response.data.exmConfig_Recordsearchtype ?? '',

                ExmConfig_EnableFractionFlg: response.data.exmConfig_EnableFractionFlg ?? false,
                ExmConfig_NoOfDecimal: response.data.exmConfig_NoOfDecimal?.toString() || '',
                ExmConfig_RoundoffFlag: response.data.exmConfig_RoundoffFlag ?? false,
                ExmConfig_NoOfDecimalValues: response.data.exmConfig_NoOfDecimalValues?.toString() || '',

                ExmConfig_PromotionFlag: response.data.exmConfig_PromotionFlag ?? false,
                ExmConfig_GraceAplFlg: response.data.exmConfig_GraceAplFlg ?? false,
                ExmConfig_BonusAplFlag: response.data.exmConfig_BonusAplFlag ?? false,
                ExmConfig_MinAttAplFlag: response.data.exmConfig_MinAttAplFlag ?? false,
                ExmConfig_MarksMultiply: response.data.exmConfig_MarksMultiply ?? false,
                ExmConfig_PerRoundoffFlag: response.data.exmConfig_PerRoundoffFlag ?? false,
                ExmConfig_FailBoldFlg: response.data.exmConfig_FailBoldFlg ?? false,
                ExmConfig_FailItalicFlg: response.data.exmConfig_FailItalicFlg ?? false,
                ExmConfig_FailUnderscoreFlg: response.data.exmConfig_FailUnderscoreFlg ?? false,
                ExmConfig_ClassRankFlg: response.data.exmConfig_ClassRankFlg ?? false,
                ExmConfig_ClassPositionFlg: response.data.exmConfig_ClassPositionFlg ?? false,
                ExmConfig_FailRankFlg: response.data.exmConfig_FailRankFlg ?? false,
                ExmConfig_FeeDefaulterDisplayFlg: response.data.exmConfig_FeeDefaulterDisplayFlg ?? false,
                ExmConfig_GroupMarksToResultFlg: response.data.exmConfig_GroupMarksToResultFlg ?? false,
                ExmConfig_FailColorFlg: response.data.exmConfig_FailColorFlg !== 'string' ? response.data.exmConfig_FailColorFlg : '',
                // ✅ NEWLY ADDED
                ExmConfig_PromSubjRoundoffFlag: response.data.exmConfig_PromSubjRoundoffFlag ?? false,

                ExmConfig_EntryDateRestFlg: response.data.exmConfig_EntryDateRestFlg ?? false,
                ExmConfig_AdmnoColumnDisplay: response.data.exmConfig_AdmnoColumnDisplay ?? false,
                ExmConfig_RegnoColumnDisplay: response.data.exmConfig_RegnoColumnDisplay ?? false,
                ExmConfig_RollnoColumnDisplay: response.data.exmConfig_RollnoColumnDisplay ?? false,
                ExmConfig_HallTicketFlg: response.data.exmConfig_HallTicketFlg ?? false,
                ExmConfig_AllSubjectAbsentFlg: response.data.exmConfig_AllSubjectAbsentFlg ?? false,
                ExmConfig_SecRankFlg: response.data.exmConfig_SecRankFlg ?? false,
                ExmConfig_SectionPositionFlg: response.data.exmConfig_SectionPositionFlg ?? false,
                ExmConfig_GroupwiseMarksFlg: response.data.exmConfig_GroupwiseMarksFlg ?? false,
                ExmConfig_SubjectwiseSecRankFlg: response.data.exmConfig_SubjectwiseSecRankFlg ?? false,
                ExmConfig_SubjectwiseClassRankFlg: response.data.exmConfig_SubjectwiseClassRankFlg ?? false
            });
        }
    }, [response]);
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Submitted Data:', data);
            const payload = {
                ...data,
                ExmConfig_NoOfDecimalValues: Number(data.ExmConfig_NoOfDecimalValues),
                ExmConfig_NoOfDecimal: Number(data.ExmConfig_NoOfDecimal),
                // biome-ignore lint/complexity/noUselessTernary: <explanation>
                ExmConfig_PassFailRankFlag: data.ExmConfig_PassFailRankFlag === '1' ? true : false
            };
            const res = await UpdateExamStandard(payload);
            if (res.success) {
                toast.success(res.message || 'Exam Standard Updated Successfully');
            } else {
                toast.error(res.message || 'Failed to update mapping');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update mapping');
        }
    };

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                <CollapsibleSection
                    title='Add Configuration'
                    description='Add a new configuration'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='slide-in-from-top-4 animate-in shadow-lg duration-300'>
                    <ExamStandardForm
                        control={control}
                        watch={watch}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        formState={formState}
                    />
                </CollapsibleSection>
            </div>
        </div>
    );
}
