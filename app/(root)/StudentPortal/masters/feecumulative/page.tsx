// file: fee-concession-page.tsx
'use client';

import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useconcessionacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { useCumulativeFeeAnalysisGrid, useStudentFeeDetailsGrid } from '@/hooks/student-portal/useCumulative';
import type { IFeeAnalysisData, IFeeDetailsData } from '@/types/student-portal/masters/cumulative-fee-analysis';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { concessionColumns } from './_components/columns';
import { feeCumulativeColumns } from './_components/feecumulativecolumns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Added Tabs

import { Loader2 } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function FeeConcessionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [MI_ID] = useState<number>(30);
    const [selectedAsmaY_Id, setSelectedAsmaY_Id] = useState<number | null>(null);

    const { data: StudentFeeDetailsresponse, isLoading: isLoadingStudentFee, refetch, refetchAll } = useStudentFeeDetailsGrid(176, 17108);

    const { data: feecumulativeresponse, isLoading: isLoadingCumulative } = useCumulativeFeeAnalysisGrid(17108, 176);

    const { data: academicYearResponse, isLoading: loadingYears } = useconcessionacademicyerdropdowndatafee(MI_ID);

    // Create detailedChartData here
    const detailedChartData = useMemo(() => {
        if (!StudentFeeDetailsresponse?.data || !Array.isArray(StudentFeeDetailsresponse.data)) return [];

        return StudentFeeDetailsresponse.data.map((item: any) => ({
            name: item.fmH_FeeName || 'Unknown',
            Receivable: item.fsS_CurrentYrCharges || 0,
            Concession: item.fsS_ConcessionAmount || 0,
            Collection: item.fsS_PaidAmount || 0,
            Adjustment: 0,
            Balance: 0
            //Balance: (item.fsS_ToBePaid || 0) - (item.fsS_PaidAmount || 0) - (item.fsS_ConcessionAmount || 0)
        }));
    }, [StudentFeeDetailsresponse]);

    const academicYears = useMemo(() => {
        const raw = academicYearResponse?.data ?? [];
        if (!Array.isArray(raw)) return [];
        return raw
            .map((ay: any) => ({
                asmaY_Id: ay.asmaY_Id ?? ay.asmaY_ID ?? ay.ASMAY_Id ?? ay.asmaYId ?? null,
                asmaY_Year: ay.asmaY_Year ?? ay.asmaYYear ?? ay.asmaY ?? String(ay.asmaY_ID ?? ay.asmaY_Id ?? ''),
                _raw: ay
            }))
            .filter((a: any) => a.asmaY_Id != null);
    }, [academicYearResponse]);

    useEffect(() => {
        if (!loadingYears && academicYears.length > 0 && !selectedAsmaY_Id) {
            setSelectedAsmaY_Id(Number(academicYears[0].asmaY_Id));
        }
    }, [academicYears, loadingYears, selectedAsmaY_Id]);

    const handleAcademicYearChange = (value: string) => {
        const newAsmaY_Id = Number.parseInt(value, 10);
        setSelectedAsmaY_Id(newAsmaY_Id);
    };

    return (
        <FormProvider<IFeeDetailsData>>
            <PageContent
                academicYears={academicYears}
                loadingYears={loadingYears}
                selectedAsmaY_Id={selectedAsmaY_Id}
                onAcademicYearChange={handleAcademicYearChange}
                tableDataStudentFeeDetails={StudentFeeDetailsresponse}
                tableDatafeecumulativeresponse={feecumulativeresponse}
                detailedChartData={detailedChartData} // Pass it as prop
                isLoadingStudentFee={isLoadingStudentFee || loadingYears}
                isLoadingCumulative={isLoadingCumulative}
                refetchAll={refetchAll ?? refetch}
                searchParams={searchParams}
                router={router}
                pathname={pathname}
            />
        </FormProvider>
    );
}

function PageContent({
    academicYears,
    loadingYears,
    selectedAsmaY_Id,
    onAcademicYearChange,
    tableDataStudentFeeDetails,
    tableDatafeecumulativeresponse,
    detailedChartData, // Receive it here
    isLoadingStudentFee,
    isLoadingCumulative
}: {
    academicYears: any[];
    loadingYears: boolean;
    selectedAsmaY_Id: number | null;
    onAcademicYearChange: (value: string) => void;
    tableDataStudentFeeDetails: any;
    tableDatafeecumulativeresponse: any;
    detailedChartData: any[]; // Add type for detailedChartData
    isLoadingStudentFee: boolean;
    isLoadingCumulative: boolean;
    refetchAll: () => void;
    searchParams: ReturnType<typeof useSearchParams>;
    router: ReturnType<typeof useRouter>;
    pathname: string;
}) {
    // Create separate table props for each table
    const studentFeeTableProps = useDataTableProps(tableDataStudentFeeDetails?.data);
    const cumulativeTableProps = useDataTableProps(tableDatafeecumulativeresponse?.data);

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto space-y-6 p-6'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <div className='flex min-w-[240px] flex-col gap-2'>
                            <Label className='font-medium'>
                                Academic Year <span className='text-red-500'>*</span>
                            </Label>
                            <Select value={selectedAsmaY_Id?.toString() || ''} onValueChange={onAcademicYearChange} disabled={loadingYears}>
                                <SelectTrigger className='h-12'>
                                    <SelectValue placeholder={loadingYears ? 'Loading...' : 'Select Academic Year'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((ay: any) => (
                                        <SelectItem key={String(ay.asmaY_Id)} value={String(ay.asmaY_Id)}>
                                            {ay.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Cumulative Fee Analysis Table */}
                <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='rounded-xl border bg-white shadow-xl'>
                    <GenericDataTable<IFeeAnalysisData>
                        {...cumulativeTableProps}
                        columns={feeCumulativeColumns}
                        isLoading={isLoadingCumulative}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Cumulative Fee Analysis...'
                        noDataTitle='No Cumulative Fee Analysis Records Found'
                        noDataDescription='No records exist for the selected filters.'
                        data={tableDatafeecumulativeresponse?.data || []}
                        total={tableDatafeecumulativeresponse?.total || 0}
                    />
                </CollapsibleSection>

                {/* Student Fee Details Table */}
                <CollapsibleSection defaultOpen={true} variant='default' size='lg' className='rounded-xl border bg-white shadow-xl'>
                    <GenericDataTable<IFeeDetailsData>
                        {...studentFeeTableProps}
                        columns={concessionColumns}
                        isLoading={isLoadingStudentFee}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage='Loading Student Fee details...'
                        noDataTitle='No Student Fee Details Records Found'
                        noDataDescription='No records exist for the selected filters.'
                        data={tableDataStudentFeeDetails?.data || []}
                        total={tableDataStudentFeeDetails?.total || 0}
                    />
                </CollapsibleSection>

                {/* Charts Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Analysis Charts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue='bar'>
                            <TabsList className='mb-4'>
                                <TabsTrigger value='bar'>Bar Chart</TabsTrigger>
                                <TabsTrigger value='line'>Area Chart</TabsTrigger>
                            </TabsList>

                            <TabsContent value='bar' className='mt-0 h-[500px]'>
                                {isLoadingStudentFee ? (
                                    <div className='flex h-[500px] items-center justify-center'>
                                        <Loader2 className='h-8 w-8 animate-spin' />
                                    </div>
                                ) : detailedChartData.length === 0 ? (
                                    <div className='flex h-[500px] items-center justify-center'>
                                        <p className='text-gray-500'>No chart data available</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <BarChart data={detailedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray='3 3' vertical={false} />
                                            <XAxis dataKey='name' />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey='Receivable' fill='#3498DB' radius={[4, 4, 0, 0]} />
                                            <Bar dataKey='Concession' fill='#76D7C4' radius={[4, 4, 0, 0]} />
                                            <Bar dataKey='Collection' fill='#808B96' radius={[4, 4, 0, 0]} />
                                            <Bar dataKey='Adjustment' fill='#80DEEA' radius={[4, 4, 0, 0]} />
                                            <Bar dataKey='Balance' fill='#C5E1A5' radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </TabsContent>

                            <TabsContent value='line' className='mt-0 h-[500px]'>
                                {isLoadingStudentFee ? (
                                    <div className='flex h-[500px] items-center justify-center'>
                                        <Loader2 className='h-8 w-8 animate-spin' />
                                    </div>
                                ) : detailedChartData.length === 0 ? (
                                    <div className='flex h-[500px] items-center justify-center'>
                                        <p className='text-gray-500'>No chart data available</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <AreaChart data={detailedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray='3 3' vertical={false} />
                                            <XAxis dataKey='name' />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Area type='monotone' dataKey='Receivable' stackId='1' stroke='#3498DB' fill='#3498DB' />
                                            <Area type='monotone' dataKey='Concession' stackId='1' stroke='#76D7C4' fill='#76D7C4' />
                                            <Area type='monotone' dataKey='Collection' stackId='1' stroke='#808B96' fill='#808B96' />
                                            <Area type='monotone' dataKey='Adjustment' stackId='1' stroke='#80DEEA' fill='#80DEEA' />
                                            <Area type='monotone' dataKey='Balance' stackId='1' stroke='#C5E1A5' fill='#C5E1A5' />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
