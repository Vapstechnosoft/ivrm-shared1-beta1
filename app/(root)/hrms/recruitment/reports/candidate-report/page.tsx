'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import CandidateReportForm from './_components/report-form';
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
interface Candidate {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    emailId: string;
    mobileNo: string;
    experience?: string;
    currentCompany?: string;
    referenceCode?: string;
    lastCTC?: string;
    expectedCTC?: string;
    resumeCV?: string;
}
export default function CandidateReportPage(props: {
    searchParams: SearchParams;
}) {
    const _searchParams = use(props.searchParams);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleGenerateReport = async (_filters: { institution: string; candidateId: string }) => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await getCandidateReport(filters);
            // setSelectedCandidate(response.data);
            // Mock data for now
            setSelectedCandidate(null);
        } catch (_error: any) {
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <FormProvider<any>>
            <CandidateReportPageContent
                selectedCandidate={selectedCandidate}
                isLoading={isLoading}
                onGenerateReport={handleGenerateReport}
            />
        </FormProvider>
    );
}
function CandidateReportPageContent({
    selectedCandidate,
    isLoading,
    onGenerateReport
}: {
    selectedCandidate: Candidate | null;
    isLoading: boolean;
    onGenerateReport: (filters: { institution: string; candidateId: string }) => void;
}) {
    const session = useSession();
    useEffect(() => {
        if (session?.data?.role === undefined) {
            window.location.reload();
        }
    }, [session?.data?.role]);
    return (
        <div className='min-h-screen'>
            <div className='container mx-auto space-y-6 px-4 py-6 md:px-6 lg:px-8'>
                {/* Report Form - Above Details */}
                <CollapsibleSection
                    title='Candidate Report Generation'
                    description='Select institution and candidate to generate report'
                    defaultOpen={true}
                    variant='outline'
                    size='md'
                    className='shadow-lg duration-300'>
                    <CandidateReportForm onGenerateReport={onGenerateReport} isLoading={isLoading} />
                </CollapsibleSection>
                {/* Candidate Details View */}
                <CollapsibleSection
                    title='Candidate Details View'
                    description='View detailed candidate information'
                    defaultOpen={true}
                    variant='default'
                    size='lg'
                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                    {selectedCandidate ? (
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            {/* Left: Candidate Profile */}
                            <div className='space-y-4 md:col-span-2'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='text-sm'>CANDIDATE PROFILE</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='grid grid-cols-2 gap-4 text-sm'>
                                            <div className='font-medium'>Candidate Name:</div>
                                            <div>
                                                {`${selectedCandidate.firstName} ${selectedCandidate.middleName || ''} ${selectedCandidate.lastName}`.trim()}
                                            </div>
                                            <div className='font-medium'>Mobile No:</div>
                                            <div>{selectedCandidate.mobileNo}</div>
                                            <div className='font-medium'>Email Id:</div>
                                            <div>{selectedCandidate.emailId}</div>
                                            <div className='font-medium'>Experience (Year):</div>
                                            <div>{selectedCandidate.experience || '-'}</div>
                                            <div className='font-medium'>Current Company:</div>
                                            <div>{selectedCandidate.currentCompany || '-'}</div>
                                            <div className='font-medium'>Reference Code:</div>
                                            <div>{selectedCandidate.referenceCode || '-'}</div>
                                            <div className='font-medium'>Last CTC:</div>
                                            <div>{selectedCandidate.lastCTC || '-'}</div>
                                            <div className='font-medium'>Expected CTC:</div>
                                            <div>{selectedCandidate.expectedCTC || '-'}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            {/* Right: Resume Display */}
                            <div className='flex flex-col items-center justify-start gap-3'>
                                <div className='flex h-48 w-full items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50'>
                                    <div className='text-center'>
                                        <div className='mx-auto mb-2 h-12 w-12 text-gray-400'>
                                            <svg
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='1.5'
                                                viewBox='0 0 24 24'
                                                xmlns='http://www.w3.org/2000/svg'>
                                                <path
                                                    d='M2.25 15.75v-1.5A2.25 2.25 0 014.5 12h15a2.25 2.25 0 012.25 2.25v1.5M2.25 15.75h19.5M2.25 15.75l-1-5.25A2.25 2.25 0 015.25 8h13.5A2.25 2.25 0 0120.75 10.5l-1 5.25'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                />
                                            </svg>
                                        </div>
                                        <p className='text-gray-500 text-xs'>Resume Preview</p>
                                    </div>
                                </div>
                                {selectedCandidate.resumeCV && (
                                    <a
                                        className='font-medium text-primary text-sm hover:underline'
                                        href={selectedCandidate.resumeCV}
                                        target='_blank'
                                        rel='noreferrer'
                                        download>
                                        Download Resume
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='py-8 text-center text-muted-foreground text-sm'>
                            Select institution and candidate, then click REPORT to view details.
                        </div>
                    )}
                </CollapsibleSection>
            </div>
        </div>
    );
}
