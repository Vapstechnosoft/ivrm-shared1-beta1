// app/(root)/fees/feereports/feedefaulterreport/page.tsx
'use client';

import {
    useFeeStudentTermWisePaidReportAcademic,
    useFeeStudentTermWisePaidReportClassdrop,
    useFeeStudentTermWisePaidReportSectionDrop,
    useFeeTermforStudentTermWiseReport
} from '@/hooks/fees/useReports';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FormError } from '@/components/ui/extension/field';
import { feeStudentTermWisePaidReportSchema } from '@/schemas/fees/reports';
import { getFeeStudentTermWisePaidReport } from '@/server/fees/reports/feestudenttermwisepaidReport';
import type { FeeStudenttermWisePaidReport, IFeeTermDropdownList } from '@/types/fees/reports/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { exportToExcel, printTable } from './_components/export_and_excel';

type FormFields = z.infer<typeof feeStudentTermWisePaidReportSchema>;

const Checkbox = ({ checked, indeterminate, onCheckedChange, ...props }: any) => {
    const ref = useRef<HTMLButtonElement>(null);
    return <BaseCheckbox ref={ref} checked={checked} onCheckedChange={onCheckedChange} {...props} />;
};

export default function FeeAccountsPositionReport() {
    const {
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(feeStudentTermWisePaidReportSchema),
        defaultValues: {
            academicYearId: undefined,
            termIds: []
        }
    });

    const [feeTerms, setFeeTerms] = useState<IFeeTermDropdownList[]>([]);
    const [reportData, setReportData] = useState<FeeStudenttermWisePaidReport[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [selectedclassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

    // Hooks
    const { data: academicYearData, isLoading: loadingYears } = useFeeStudentTermWisePaidReportAcademic();
    const { data: classListResponse, isLoading: loadingClasses } = useFeeStudentTermWisePaidReportClassdrop();
    const { data: sectionListResponse, isLoading: loadingSections } = useFeeStudentTermWisePaidReportSectionDrop();

    const { data: feetermData, isLoading: loadingfeeterm, error: feetermError } = useFeeTermforStudentTermWiseReport();

    useEffect(() => {
        if (feetermError) toast.error(feetermError?.message || 'Failed to load terms');
        else if (feetermData?.data) setFeeTerms(feetermData.data);
    }, [feetermData, feetermError]);

    const filteredData = useMemo(() => {
        const rows = [...reportData];
        return rows;
    }, [reportData]);

    const handleExportExcel = () => {
        exportToExcel(reportData, selectedTermNames, 'Fee_Term_Wise_Paid_Report');
    };

    const handlePrint = () => {
        const columns = ['Sl No', 'Adm No', 'Student Name', 'Class', 'Section', ...selectedTermNames, 'Total'];

        const printableRows = reportData.map((row, index) => {
            const termData: any = {};

            selectedTermNames.forEach((termName) => {
                termData[termName] = row.termAmounts?.[termName] !== undefined ? row.termAmounts[termName] : '--';
            });

            return {
                'Sl No': index + 1,
                'Adm No': row.admNo,
                'Student Name': row.studentName?.trim(),
                Class: row.className,
                Section: row.sectionName,
                ...termData,
                Total: row.total || 0
            };
        });

        printTable(columns, printableRows);
    };

    const asmayId = watch('academicYearId');
    const asmclId = watch('asmcl_Id');
    const asmsId = watch('asms_Id');
    const selectedTermId = useWatch({
        control,
        name: 'termIds'
    });

    const selectedTermNames = feeTerms.filter((term) => selectedTermId.includes(term.fmT_Id)).map((term) => term.fmT_Name);

    useEffect(() => {
        setReportData([]);
    }, [selectedclassId, selectedSectionId, asmayId, selectedTermId]);

    const fetchReportData = async (selectedIds: number[]) => {
        setReportLoading(true);
        try {
            const payload = {
                asmaY_Id: asmayId,
                class_id: asmclId,
                section_id: asmsId,
                fmT_Ids: selectedIds.map((id) => id)
            };
            const reportArray = await getFeeStudentTermWisePaidReport(payload);
            if (!reportArray.data || reportArray.data.length === 0) {
                toast.info('No Records Found!');
                setReportData([]);
                return;
            }
            toast.success('Report generated successfully!');
            setReportData(reportArray.data || []);
            // console.log("selectedTermNames",selectedTermNames)
        } catch (e) {
            console.error('Failed to load the Fee Student TermWise Paid Report!!', e);
            setReportData([]);
        } finally {
            setReportLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormFields> = async () => {
        fetchReportData(selectedTermId);
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <div className='mx-auto max-w-7xl'>
                    <Card className='border-0 shadow-xl'>
                        <div className='p-8'>
                            {/* <h1 className='mb-8 font-bold text-3xl text-gray-900'>Fee Student Term Wise Paid Report</h1> */}
                            <div className='space-y-8'>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2'>
                                    <div className='space-y-3'>
                                        <div className='space-y-3'>
                                            <Label className='font-semibold text-lg'>
                                                Academic Year <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='academicYearId'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(v) => {
                                                            const num = Number(v);
                                                            field.onChange(num);
                                                        }}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Academic Year--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingYears ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : (
                                                                academicYearData?.data?.map((item: any) => (
                                                                    <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                                        {item.asmaY_Year}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.academicYearId && (
                                                <FormError className='mt-1'>{errors.academicYearId.message}</FormError>
                                            )}{' '}
                                        </div>

                                        <div className='space-y-3'>
                                            <Label htmlFor='asmcl_Id' className='font-semibold text-lg'>
                                                Class <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='asmcl_Id'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            field.onChange(id);
                                                            setSelectedClassId(id);
                                                        }}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Class--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingClasses ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : (
                                                                classListResponse?.data?.map((item) => (
                                                                    <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                                        {item.asmcL_ClassName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        {errors.asmcl_Id && (
                                            <div className='mt-1'>
                                                <Label />
                                                <FormError>{errors.asmcl_Id.message}</FormError>
                                            </div>
                                        )}

                                        {/* Section */}

                                        <div className='space-y-3'>
                                            <Label htmlFor='asms_Id' className='font-semibold text-lg'>
                                                Section <span className='text-red-500'>*</span>
                                            </Label>
                                            <Controller
                                                name='asms_Id'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(val) => {
                                                            const id = Number(val);
                                                            field.onChange(id);
                                                            setSelectedSectionId(id);
                                                        }}>
                                                        <SelectTrigger className='w-full text-center'>
                                                            <SelectValue placeholder='--Select Section--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingSections ? (
                                                                <SelectItem value='loading' disabled>
                                                                    Loading...
                                                                </SelectItem>
                                                            ) : (
                                                                sectionListResponse?.data?.map((item) => (
                                                                    <SelectItem key={item.asmS_Id} value={String(item.asmS_Id)}>
                                                                        {item.asmC_SectionName}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        {errors.asms_Id && (
                                            <div className='mt-1'>
                                                <Label />
                                                <FormError>{errors.asms_Id.message}</FormError>
                                            </div>
                                        )}
                                    </div>
                                    <div className='space-y-3'>
                                        <Label className='font-semibold text-lg'>
                                            Fee Term <span className='text-red-500'>*</span>
                                        </Label>
                                        <Card className='border bg-gray-50 p-4'>
                                            <Controller
                                                name='termIds'
                                                control={control}
                                                render={({ field }) => {
                                                    const selectedIds = field.value ?? [];
                                                    const allIds = feeTerms.map((t) => t.fmT_Id);

                                                    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

                                                    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allIds.length;

                                                    return (
                                                        <div className='max-h-64 space-y-3 overflow-y-auto'>
                                                            {/* SELECT ALL */}
                                                            <Label className='flex cursor-pointer items-center gap-3 rounded border-b bg-white px-2 py-2 font-medium hover:bg-gray-200'>
                                                                <Checkbox
                                                                    checked={isAllSelected}
                                                                    indeterminate={isIndeterminate}
                                                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                        const value = checked === true ? allIds : [];

                                                                        field.onChange(value);
                                                                        setValue('termIds', value, {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                            shouldTouch: true
                                                                        });
                                                                    }}
                                                                />
                                                                <span>Select All</span>
                                                            </Label>

                                                            {/* LOADING */}
                                                            {loadingfeeterm ? (
                                                                <div className='py-4 text-center text-gray-500'>Loading...</div>
                                                            ) : feeTerms.length > 0 ? (
                                                                feeTerms.map((term) => {
                                                                    const checked = selectedIds.includes(term.fmT_Id);

                                                                    return (
                                                                        <Label
                                                                            key={term.fmT_Id}
                                                                            className='flex cursor-pointer items-center gap-3 rounded px-2 py-1 hover:bg-gray-100'>
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                onCheckedChange={(checked: boolean | 'indeterminate') => {
                                                                                    const value =
                                                                                        checked === true
                                                                                            ? [...selectedIds, term.fmT_Id]
                                                                                            : selectedIds.filter(
                                                                                                  (id) => id !== term.fmT_Id
                                                                                              );

                                                                                    field.onChange(value);
                                                                                    setValue('termIds', value, {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                        shouldTouch: true
                                                                                    });
                                                                                }}
                                                                            />
                                                                            <span className='text-sm'>{term.fmT_Name}</span>
                                                                        </Label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className='py-4 text-center text-gray-500'>No terms</div>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </Card>
                                        {errors.termIds && <FormError>{errors.termIds.message}</FormError>}
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-end gap-4 border-t pt-8'>
                                        <Button size='lg' variant='outline' className='px-8' onClick={() => window.location.reload()}>
                                            Cancel
                                        </Button>
                                        <Button type='submit' disabled={reportLoading} className='min-w-32'>
                                            {reportLoading ? 'Generating...' : 'Report'}
                                        </Button>
                                    </div>
                                    {reportData.length > 0 && (
                                        <div className='-mx-8 mt-12 overflow-hidden rounded-lg bg-white shadow-xl'>
                                            {/* Loading State */}
                                            {reportLoading ? (
                                                <div className='p-24 text-center'>
                                                    <div className='inline-block h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                                                    <p className='mt-6 text-lg text-muted-foreground'>Generating report, please wait...</p>
                                                </div>
                                            ) : (
                                                <CollapsibleSection
                                                    defaultOpen={true}
                                                    variant='default'
                                                    size='lg'
                                                    className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                                                    <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                                                        <div className='mb-6 text-center'>
                                                            <h2 className='font-bold text-2xl text-primary'>
                                                                Fee Student Term Wise Paid Report
                                                            </h2>
                                                        </div>
                                                        <div className='flex gap-3'>
                                                            <div className='mb-4 flex justify-end gap-2'>
                                                                <Button
                                                                    size='sm'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handleExportExcel}>
                                                                    Export Excel
                                                                </Button>

                                                                <Button
                                                                    size='sm'
                                                                    variant='outline'
                                                                    className='h-8 w-auto px-3 text-xs'
                                                                    onClick={handlePrint}>
                                                                    Print
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* Table */}
                                                        <div className='overflow-x-auto border'>
                                                            <table className='w-full table-auto border-collapse'>
                                                                <thead className='bg-primary text-white'>
                                                                    <tr>
                                                                        <th className='border px-2 py-2'>Sl No</th>
                                                                        <th className='border px-2 py-2'>Adm No</th>
                                                                        <th className='border px-2 py-2'>Student Name</th>
                                                                        <th className='border px-2 py-2'>Class</th>
                                                                        <th className='border px-2 py-2'>Section</th>
                                                                        {selectedTermNames.length > 0 &&
                                                                            selectedTermNames.map((name, index) => (
                                                                                <th key={index + 1} className='border px-2 py-2'>
                                                                                    {name}
                                                                                </th>
                                                                            ))}
                                                                        <th className='border px-2 py-2'>Total</th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {filteredData.map((row, rowIndex) => (
                                                                        <tr key={row.admNo || rowIndex} className='border-b'>
                                                                            <td className='border px-2 py-2 text-center'>{rowIndex + 1}</td>
                                                                            <td className='border px-2 py-2 text-center'>{row.admNo}</td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.studentName?.trim()}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.className}
                                                                            </td>
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.sectionName}
                                                                            </td>
                                                                            {selectedTermNames.map((termName, index) => {
                                                                                const termAmounts = row.termAmounts as Record<
                                                                                    string,
                                                                                    number
                                                                                >;
                                                                                const amount = termAmounts?.[termName];
                                                                                return (
                                                                                    <td
                                                                                        key={index + 1}
                                                                                        className='border px-2 py-2 text-center'>
                                                                                        {amount !== undefined ? amount : '--'}
                                                                                    </td>
                                                                                );
                                                                            })}
                                                                            <td className='border px-2 py-2 text-center'>
                                                                                {row.total || 0}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </CollapsibleSection>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}
