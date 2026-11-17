'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
    getSearchDetailsTransaction,
    getStaffPeriodTransactionInitialData,
    saveStaffPeriodTransaction
} from '../../../../../../server/lesson-planner/transactions/school-staff-period-transaction';
import type { ISchoolStaffPeriodTransactionGridItem } from '../../../../../../types/lesson-planner/transactions/school-staff-period-transaction';
import SearchForm from './_components/search-form';
import TransactionGrid from './_components/transaction-grid';

const formSchema = z.object({
    ASMAY_Id: z.number().min(1, 'Academic Year Required'),
    HRME_Id: z.number().min(1, 'Employee Required'),
    ASMCL_Id: z.number().min(1, 'Class Required'),
    ASMS_Id: z.number().min(1, 'Section Required'),
    ISMS_Id: z.number().min(1, 'Subject Required'),
    classes: z.array(z.any()).optional(),
    sections: z.array(z.any()).optional(),
    subjects: z.array(z.any()).optional()
});

export default function SchoolStaffPeriodTransactionPage() {
    const [initialData, setInitialData] = useState<{ masteryear: any[]; employeedetails: any[] }>({ masteryear: [], employeedetails: [] });
    const [gridData, setGridData] = useState<ISchoolStaffPeriodTransactionGridItem[] | null>(null);
    const [isPending, startTransition] = useTransition();

    const methods = useForm({
        resolver: zodResolver(formSchema)
    });

    useEffect(() => {
        getStaffPeriodTransactionInitialData().then((res: any) => {
            if (res) {
                // API response has data nested under res.data
                const responseData: any = res.data || res;
                if (Array.isArray(responseData)) {
                    setInitialData({
                        masteryear: responseData,
                        employeedetails: [] // Assuming employees fetched elsewhere or missing for now
                    });
                } else {
                    setInitialData({
                        masteryear: responseData.masteryear || [],
                        employeedetails: responseData.employeedetails || []
                    });
                    // Legacy: Auto select first employee if exists
                    if (responseData.employeedetails && responseData.employeedetails.length > 0) {
                        methods.setValue('HRME_Id', responseData.employeedetails[0].hrmE_Id);
                    }
                }
            }
        });
    }, [methods]);

    const handleSearch = (data: any) => {
        startTransition(async () => {
            try {
                const res = await getSearchDetailsTransaction(data.ASMAY_Id, data.HRME_Id, data.ASMCL_Id, data.ASMS_Id, data.ISMS_Id);

                const responseData = res.data || res;
                const dates = responseData.getalldates || [];
                const topics = responseData.gettopicdetails || [];

                if (dates.length > 0) {
                    // Extract topicId with extreme robustness
                    const firstTopic = topics[0] || {};
                    const fallbackTopicId = firstTopic.lpmT_Id || firstTopic.LPMT_Id || firstTopic.lpmt_id || 0;

                    const formatted = dates.map((d: any) => {
                        const dateTopicId = d.lpmT_Id || d.LPMT_Id || d.lpmt_id || fallbackTopicId;
                        return {
                            ...d,
                            lpmT_Id: Number(dateTopicId),
                            minDatedof: d.alldates || d.Alldates || d.allDates
                        };
                    });
                    setGridData(formatted);
                } else if (topics.length > 0) {
                    const formatted = topics.map((t: any) => ({
                        ...t,
                        alldates: t.lplP_LPDate === '0001-01-01T00:00:00' ? null : t.lplP_LPDate,
                        topicname: t.lpmT_TopicName,
                        lpmT_Id: t.lpmT_Id,
                        lplP_Id: t.lplP_Id,
                        // If it's an existing mapping, it might have a taken date
                        lpcswA_TakenDate: t.lplP_CTDate === '0001-01-01T00:00:00' ? null : t.lplP_CTDate,
                        Selected: t.lplP_Id > 0 // Auto select if it looks like an existing record
                    }));
                    setGridData(formatted);
                } else {
                    toast.info('No records found');
                    setGridData(null);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to fetch details');
            }
        });
    };

    const handleSave = async (items: ISchoolStaffPeriodTransactionGridItem[]) => {
        startTransition(async () => {
            try {
                // Defensive: If grid items are somehow missing lpmT_Id, try to recover it from current gridData
                const payload = {
                    asmaY_Id: methods.getValues('ASMAY_Id'),
                    asmcL_Id: methods.getValues('ASMCL_Id'),
                    asmS_Id: methods.getValues('ASMS_Id'),
                    hrmE_Id: methods.getValues('HRME_Id'),
                    ismS_Id: methods.getValues('ISMS_Id'),
                    schoolStaffPeriodMappingsavingTempDTO: items.map((i) => {
                        // Ensure we have lpmT_Id
                        const finalTopicId = i.lpmT_Id || gridData?.find((gd) => gd.lplP_Id === i.lplP_Id)?.lpmT_Id || 0;

                        return {
                            lplP_LPDate: i.alldates,
                            lplP_Id: i.lplP_Id,
                            lpmT_Id: finalTopicId,
                            lplP_CTDate: i.lpcswA_TakenDate,
                            unitFileAttachment: i.estmanssH_AnswerSheet,
                            unitFileLocation: i.estmanssH_FileLocation
                        };
                    })
                };

                const res = await saveStaffPeriodTransaction(payload);
                if (res.success || res.returnval) {
                    toast.success(res.message || 'Saved successfully');
                    setGridData(null);
                } else {
                    toast.error(res.message || 'Failed to save');
                }
            } catch (e) {
                console.error(e);
                toast.error('An error occurred');
            }
        });
    };

    return (
        <div className='container space-y-4 p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-2xl'>Subject Staff Period Transaction</h1>
            </div>

            <FormProvider {...methods}>
                <SearchForm masterYear={initialData.masteryear} employees={initialData.employeedetails} onSearch={handleSearch} />
            </FormProvider>

            {gridData && (
                <CollapsibleSection title='Subject Staff Period Mapping' defaultOpen={true}>
                    <TransactionGrid
                        key={`grid-${gridData.length}-${gridData[0]?.lplP_Id}-${gridData[0]?.lpmT_Id}`}
                        data={gridData}
                        onSave={handleSave}
                        onCancel={() => setGridData(null)}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
