'use client';

import { FormProvider } from 'react-hook-form';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useCumulativeFeeAnalysis } from '@/hooks/student-portal/masters/useCumulativeFeeAnalysis';

import { CumulativeFeeAnalysisCharts } from './_components/cumulative-fee-analysis-chart';
import { CumulativeFeeAnalysisFilter } from './_components/cumulative-fee-analysis-filter';
import { CumulativeFeeAnalysisTable } from './_components/cumulative-fee-analysis-table';
import { StudentFeeDetailsTable } from './_components/student-fee-details-table';

export default function CumulativeFeeAnalysisPage() {
    const { form, initialData, isInitialLoading, feeAnalysisList, studentFeeDetails, handleReport, isReportLoading } =
        useCumulativeFeeAnalysis();

    // Helper to trigger report when year changes (since legacy auto-refreshes on change?)
    // Legacy: data-ng-change="onreport(ASMAY_Id)"
    const onYearChange = (yearId: string) => {
        handleReport({ asmaY_Id: yearId });
    };

    if (isInitialLoading) {
        return <div className='p-4 text-center'>Loading initial data...</div>;
    }

    return (
        <div className='min-h-screen p-4'>
            <div className='container space-y-4'>
                <h3 className='mb-4 font-bold text-2xl text-primary'>Cumulative Fee Analysis</h3>

                <FormProvider {...form}>
                    <CollapsibleSection title='Cumulative Fee Analysis' defaultOpen={true} variant='default'>
                        <CumulativeFeeAnalysisFilter
                            yearList={Array.isArray(initialData?.data) ? initialData.data : []}
                            onYearChange={onYearChange}
                        />
                    </CollapsibleSection>
                </FormProvider>

                {isReportLoading && <div className='p-4 text-center'>Loading report data...</div>}

                {!isReportLoading && feeAnalysisList && feeAnalysisList.length > 0 && (
                    <CollapsibleSection title='Fee Analysis List' defaultOpen={true} variant='default'>
                        <CumulativeFeeAnalysisTable data={feeAnalysisList} />
                    </CollapsibleSection>
                )}

                {!isReportLoading && studentFeeDetails && studentFeeDetails.length > 0 && (
                    <CollapsibleSection title='Student Fee Details' defaultOpen={true} variant='default'>
                        <StudentFeeDetailsTable data={studentFeeDetails} />
                    </CollapsibleSection>
                )}

                {/* Legacy Charts: Shown if data exists */}
                {!isReportLoading && feeAnalysisList && feeAnalysisList.length > 0 && (
                    <CumulativeFeeAnalysisCharts data={feeAnalysisList} />
                )}
            </div>
        </div>
    );
}
