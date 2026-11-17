// app/exam/exam-module/student-marks-publish/page.tsx
'use client';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import type { IStudentMarksPublish } from '@/types/exam/exam-module/marks-entry';
import { useState } from 'react';
import SearchForm from './_components/search-form';
import StudentMarksPublishDetails from './_components/student-details';

export default function StudentMarksPublishPage() {
    const [searchData, setSearchData] = useState<{
        params: any;
        data: any[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [searchPayload, setSearchPayload] = useState({});

    const handleSearch = async (params: any, data: any[]) => {
        setIsLoading(true);
        setSearchData({ params, data });
        setShowDetails(true);
        setIsLoading(false);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSearchData(null);
    };

    const handleRefreshDetails = async (newParams: any, newData: any[]) => {
        setIsLoading(true);
        setSearchData({ params: newParams, data: newData });
        // Simulate loading
        setTimeout(() => setIsLoading(false), 500);
    };

    return (
        <FormProvider<IStudentMarksPublish>>
            <div className='min-h-screen'>
                <div className='container space-y-4 p-1'>
                    <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
                        <SearchForm
                            onSuccess={handleSearch}
                            onRefresh={handleRefreshDetails}
                            onPayloadChange={(payload: any) => setSearchPayload(payload)}
                        />
                    </div>
                    {showDetails && searchData && (
                        <div className='mt-6'>
                            <CollapsibleSection
                                title='STUDENT DETAILS'
                                description={`Showing ${searchData.data.length} students`}
                                defaultOpen={true}
                                variant='outline'
                                size='lg'
                                className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                                <StudentMarksPublishDetails
                                    searchParams={searchData.params}
                                    studentData={searchData.data}
                                    isLoading={isLoading}
                                    onClose={handleCloseDetails}
                                    onRefresh={handleRefreshDetails}
                                    searchPayload={searchPayload}
                                />
                            </CollapsibleSection>
                        </div>
                    )}
                </div>
            </div>
        </FormProvider>
    );
}
