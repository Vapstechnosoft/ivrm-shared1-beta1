'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useMasterPayrollStandard } from '@/hooks/hrms/useMasters';
import type { IMasterPayrollStandardList } from '@/types/hrms/hrms-config/master';
import { AlertCircle, Loader2 } from 'lucide-react';
import PayrollStandardForm from './_components/add-form';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function MasterPayrollStandardPage(_props: { searchParams: SearchParams }) {
    const { data: response, isLoading, error } = useMasterPayrollStandard();
    const dataItem = Array.isArray(response?.data) ? response?.data[0] : response?.data;
    // Only treat as existing data if hrC_Id > 0 (update), otherwise treat as new record (hrC_Id = 0)
    const existingData: IMasterPayrollStandardList | undefined = dataItem && dataItem.hrC_Id > 0 ? dataItem : undefined;

    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-1'>
                {/* Loading State */}
                {isLoading && (
                    <div className='flex items-center justify-center py-12'>
                        <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        <span className='ml-2 text-muted-foreground'>Loading payroll configuration...</span>
                    </div>
                )}
                {/* Error State */}
                {error && !isLoading && (
                    <div className='flex items-center justify-center py-12'>
                        <div className='flex flex-col items-center gap-2 text-center'>
                            <AlertCircle className='h-12 w-12 text-destructive' />
                            <h3 className='font-semibold text-lg'>Error Loading Payroll Configuration</h3>
                            <p className='text-muted-foreground text-sm'>{error.message || 'An error occurred while loading data'}</p>
                        </div>
                    </div>
                )}
                {/* Form - Always Visible (No Table) */}
                {!isLoading && !error && (
                    <CollapsibleSection
                        title='Master Payroll Standard'
                        description='Configure organization-wide payroll standards and calculation rules'
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <PayrollStandardForm existingData={existingData} />
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
