'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquare, FileText, RotateCcw, Search, Square, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

/* ---------------- UI Components ---------------- */
import { Button } from '@/components/ui/button';
import type { DataTableRef } from '@/components/ui/data-table/data-table';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { FormError } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/* ---------------- Hooks ---------------- */
import {
    useAcademicYearDropdown,
    useConcessionDropdown,
    useMasterClassDropdown,
    useMasterSectionDropdown
} from '@/hooks/admission/preadmission/useMasters';
import { ClasswiseStudentDetails } from '@/hooks/admission/preadmission/useReports';

/* ---------------- Schema ---------------- */
import { classwiseStudentDetailsSchema } from '@/schemas/admission/preadmission/reports';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { getExcelClassWiseStudentReport } from '@/server/admission/preadmission/reports/month_end_report';
/* ---------------- Columns ---------------- */
import { getMasterAdmissionReportColumns } from './_components/columns';
import { ColumnValue } from './_components/columnvalue';

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

type FormFields = z.infer<typeof classwiseStudentDetailsSchema>;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

export default function AdmissionReportPage(props: {
    searchParams: SearchParams;
}) {
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const tableRef = useRef<DataTableRef>(null);

    /* ---------------- Form ---------------- */

    const {
        control,
        watch,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormFields>({
        resolver: zodResolver(classwiseStudentDetailsSchema),
        defaultValues: {
            asmaY_Id: 0,
            fmcC_Id: 0,
            classes: [],
            class_section: [],
            selectedFields: []
        }
    });
    const handleFieldToggle = (fieldId: string) => {
        const current = selectedFields || [];
        const updated = current.includes(fieldId) ? current.filter((f) => f !== fieldId) : [...current, fieldId];
        setValue('selectedFields', updated, { shouldValidate: true });
    };
    const watchedAsmaY_Id = watch('asmaY_Id');
    const [selectedClassItems, setSelectedClassItems] = useState<{ asmcL_Id: string; asmcL_ClassName: string }[]>([]);
    const [selectedSectionItems, setSelectedSectionItems] = useState<{ asmS_Id: string; asmcL_SectionName: string }[]>([]);
    const scopeMap: Record<'newad' | 'totstd' | 'prom' | 'yrloss' | 'deact', number> = {
        newad: 1,
        totstd: 2,
        prom: 3,
        yrloss: 4,
        deact: 5
    };

    const [studentScope, setStudentScope] = useState<'newad' | 'totstd' | 'prom' | 'yrloss' | 'deact'>('newad');

    const [studentStatus, setStudentStatus] = useState<'Tformate' | 'Kformate'>('Tformate');

    const watchedYear = watch('asmaY_Id');
    const watchedStudentCategory = watch('fmcC_Id');
    const selectedFields = watch('selectedFields');

    /* ---------------- Local State ---------------- */

    const [showReport, setShowReport] = useState(false);
    const [requestPayload, setRequestPayload] = useState<any>(null);
    const [resolvedSearchParams, setResolvedSearchParams] = useState<Record<string, string | string[] | undefined>>({});
    const [fieldSearch, setFieldSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* ---------------- Masters ---------------- */

    const { data: academicYear } = useAcademicYearDropdown();
    const { data: masterSection, isLoading: masterSectionLoading } = useMasterSectionDropdown();
    const { data: masterClass, isLoading: masterClassLoading } = useMasterClassDropdown();
    const { data: concession } = useConcessionDropdown();
    const filteredFields = useMemo(() => {
        return ColumnValue.filter((field) => field.columnName.toLowerCase().includes(fieldSearch.toLowerCase()));
    }, [fieldSearch]);

    /* ---------------- Build Payload ---------------- */
    const handleClassSelection = (selectedValues: string[]) => {
        const selectedClasses = selectedValues.map((value) => {
            const cls = (masterClass?.data as any)?.find((c: any) => String(c.asmcL_Id) === String(value));
            return {
                asmcL_Id: value.toString(),
                asmcL_ClassName: cls?.asmcL_ClassName ?? ''
            };
        });

        setSelectedClassItems(selectedClasses);
    };
    const handleSectionSelection = (selectedValues: string[]) => {
        const selectedSections = selectedValues.map((value) => {
            const section = (masterSection?.data as any)?.find((s: any) => String(s.asmS_Id) === String(value));
            return {
                asmS_Id: value.toString(),
                asmcL_SectionName: section?.asmC_SectionName ?? ''
            };
        });

        setSelectedSectionItems(selectedSections);
    };

    /* ---------------- Resolve Search Params ---------------- */

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await props.searchParams;
            setResolvedSearchParams(resolved);
        };
        resolveParams();
    }, [props.searchParams]);

    /* ---------------- API ---------------- */

    const {
        data: response,
        isFetching,
        error,
        refetch
    } = ClasswiseStudentDetails(watchedYear, scopeMap[studentScope], watchedStudentCategory ?? 0, requestPayload, resolvedSearchParams);

    /* ---------------- Table ---------------- */

    const columns = useMemo(() => getMasterAdmissionReportColumns(selectedFields), [selectedFields]);

    const transformedResponse = useMemo(() => {
        if (!response) return response;
        return {
            ...response,
            data: (response.data as any)?.printdatatable ?? []
        };
    }, [response]);

    const tableProps = useDataTableProps(transformedResponse);
    const handleSelectAllFields = () => {
        if (selectedFields.length === filteredFields.length) {
            setValue('selectedFields', [], { shouldValidate: true });
        } else {
            setValue(
                'selectedFields',
                filteredFields.map((f) => f.columnID),
                { shouldValidate: true }
            );
        }
    };

    /* ---------------- Handlers ---------------- */

    const getValidatedPayload = () => {
        const fromData = watch();

        if (!fromData.asmaY_Id) {
            toast.error('Please Select Academic Year');
            return null;
        }

        if (!fromData.classes || fromData.classes.length === 0) {
            toast.error('Please Select Class');
            return null;
        }

        if (!fromData.class_section || fromData.class_section.length === 0) {
            toast.error('Please Select Section');
            return null;
        }

        if (!fromData.selectedFields || fromData.selectedFields.length === 0) {
            toast.error('Please Select Search Fields');
            return null;
        }

        return {
            classdetailsdata: fromData.classes.map((id: any) => {
                const cls = (masterClass?.data as any)?.find((c: any) => String(c.asmcL_Id) === String(id));
                return {
                    asmcL_Id: id.toString(),
                    asmcL_ClassName: cls?.asmcL_ClassName ?? ''
                };
            }),
            sectionsdetailsdata: fromData.class_section.map((id: any) => {
                const section = (masterSection?.data as any)?.find((s: any) => String(s.asmS_Id) === String(id));
                return {
                    asmS_Id: id.toString(),
                    asmcL_SectionName: section?.asmC_SectionName ?? ''
                };
            }),
            tempararyArrayheadList: fromData.selectedFields.map((id: string) => {
                const field = ColumnValue.find((f) => f.columnID === id);
                return {
                    columnID: id,
                    columnName: field?.columnName || ''
                };
            })
        };
    };

    const handleReport = async () => {
        setIsLoading(true);
        try {
            const payload = getValidatedPayload();
            if (!payload) {
                setIsLoading(false);
                return;
            }

            setRequestPayload(payload);
            setShowReport(true);

            const params = new URLSearchParams(currentSearchParams.toString());
            params.set('page', '1');
            router.push(`?${params.toString()}`, { scroll: false });

            toast.success('Generating report...');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate report');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        reset();
        setShowReport(false);
        setRequestPayload(null);
        setSelectedClassItems([]);
        setSelectedSectionItems([]);
        tableRef.current?.resetSelection();
        router.push(window.location.pathname, { scroll: false });
        toast.success('Filters reset successfully');
    };

    const handleCancel = () => {
        setShowReport(false);
        tableRef.current?.resetSelection();
        toast.info('Report cancelled');
    };

    const downloadExcel = async () => {
        try {
            const payload = getValidatedPayload();
            if (!payload) {
                return;
            }

            toast.loading('Downloading Excel...', { id: 'excel-download' });

            const response = await getExcelClassWiseStudentReport(
                watchedYear,
                scopeMap[studentScope],
                watchedStudentCategory ?? 0,
                payload,
                resolvedSearchParams
            );

            // Ensure we have a Blob
            const blob =
                response instanceof Blob
                    ? response
                    : new Blob([new Uint8Array(response)], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ClassWiseStudentReport.xlsx';
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.dismiss('excel-download');
            toast.success('Excel downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            toast.dismiss('excel-download');
            toast.error('Failed to download Excel');
        }
    };

    /* -------------------------------------------------------------------------- */
    /* Render */
    /* -------------------------------------------------------------------------- */

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <CollapsibleSection title='Admission Register' defaultOpen>
                <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2'>
                    {/* Academic Year */}
                    <div>
                        <Label>Academic Year *</Label>
                        <Controller
                            name='asmaY_Id'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Academic Year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYear?.data?.map((yr) => (
                                            <SelectItem key={yr.asmaY_Id} value={String(yr.asmaY_Id)}>
                                                {yr.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.asmaY_Id && <FormError>{errors.asmaY_Id.message}</FormError>}
                    </div>

                    {/* Class */}
                    <div>
                        <Label>Class *</Label>
                        <Controller
                            name='classes'
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    options={
                                        masterClass?.data?.map((c) => ({
                                            label: c.asmcL_ClassName,
                                            value: String(c.asmcL_Id)
                                        })) ?? []
                                    }
                                    onValueChange={(selectedValues) => {
                                        field.onChange(selectedValues);
                                        handleClassSelection(selectedValues);
                                    }}
                                    defaultValue={selectedClassItems.map((data) => data.asmcL_Id)}
                                    value={selectedClassItems.map((data) => data.asmcL_Id)}
                                    placeholder='Select Classes'
                                    variant='inverted'
                                    disabled={!watchedAsmaY_Id || masterClassLoading}
                                />
                            )}
                        />
                        {errors.classes && <FormError>{errors.classes.message}</FormError>}
                    </div>

                    {/* Section */}
                    <div>
                        <Label>Section *</Label>
                        <Controller
                            name='class_section'
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    options={
                                        masterSection?.data?.map((s) => ({
                                            label: s.asmC_SectionName,
                                            value: String(s.asmS_Id)
                                        })) ?? []
                                    }
                                    onValueChange={(selectedValues) => {
                                        field.onChange(selectedValues);
                                        handleSectionSelection(selectedValues);
                                    }}
                                    defaultValue={selectedSectionItems.map((data) => data.asmS_Id)}
                                    value={selectedSectionItems.map((data) => data.asmS_Id)}
                                    placeholder='Select Sections'
                                    variant='inverted'
                                    disabled={masterSectionLoading}
                                />
                            )}
                        />
                        {errors.class_section && <FormError>{errors.class_section.message}</FormError>}
                    </div>

                    {/* Fields */}
                    <div className='space-y-3'>
                        <div className='relative'>
                            <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search fields...'
                                value={fieldSearch}
                                onChange={(e) => setFieldSearch(e.target.value)}
                                className='w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                            />
                        </div>

                        <div
                            onClick={handleSelectAllFields}
                            className={cn(
                                'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-medium text-sm transition-all',
                                selectedFields.length === filteredFields.length && filteredFields.length > 0
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-300 hover:border-primary/40'
                            )}>
                            {selectedFields.length === filteredFields.length && filteredFields.length > 0 ? (
                                <CheckSquare className='h-4 w-4 text-primary' />
                            ) : (
                                <Square className='h-4 w-4 text-gray-400' />
                            )}
                            <span>Select All</span>
                        </div>

                        <div className='max-h-60 space-y-1 overflow-y-auto rounded-md border border-gray-300 p-2'>
                            {filteredFields.map((field) => {
                                const selected = selectedFields.includes(field.columnID);
                                return (
                                    <div
                                        key={field.columnID}
                                        onClick={() => handleFieldToggle(field.columnID)}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all',
                                            selected
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                                        )}>
                                        {selected ? (
                                            <CheckSquare className='h-4 w-4 text-primary' />
                                        ) : (
                                            <Square className='h-4 w-4 text-gray-400' />
                                        )}
                                        <span>{field.columnName}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.selectedFields && <FormError>{errors.selectedFields.message}</FormError>}
                    </div>
                    <div>
                        <Label>Student Category</Label>
                        <Controller
                            name='fmcC_Id'
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Student Category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {concession?.data?.map((yr: any) => (
                                            <SelectItem key={yr.fmcC_Id} value={String(yr.fmcC_Id)}>
                                                {yr.fmcC_ConcessionName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.fmcC_Id && <FormError>{errors.fmcC_Id.message}</FormError>}
                    </div>
                </div>
                {/* Radios */}
                <div className='space-y-4 border-t pt-6'>
                    <RadioGroup
                        value={studentScope}
                        onValueChange={(v) => setStudentScope(v as 'newad' | 'totstd' | 'prom' | 'yrloss' | 'deact')}
                        className='flex flex-wrap justify-center gap-6'>
                        <RadioGroupItem value='newad' /> <Label>New Admission</Label>
                        <RadioGroupItem value='totstd' /> <Label>Total Students</Label>
                        <RadioGroupItem value='prom' /> <Label>Promoted</Label>
                        <RadioGroupItem value='yrloss' /> <Label>Year Loss</Label>
                        <RadioGroupItem value='deact' /> <Label>Deactivated</Label>
                    </RadioGroup>

                    <RadioGroup
                        value={studentStatus}
                        onValueChange={(v) => setStudentStatus(v as any)}
                        className='flex justify-center gap-6'>
                        <RadioGroupItem value='Tformate' /> <Label>Table Format</Label>
                        <RadioGroupItem value='Kformate' /> <Label>Kendo Format</Label>
                    </RadioGroup>
                </div>

                {/* Buttons */}
                <div className='flex gap-3 p-4'>
                    <Button onClick={handleReport} isLoading={isLoading} loadingText='Generating...'>
                        <FileText className='mr-2 h-4 w-4' />
                        Report
                    </Button>
                    <Button variant='outline' onClick={handleReset}>
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Reset
                    </Button>
                    <Button onClick={downloadExcel} className='w-fit'>
                        Export to Excel
                    </Button>
                    <Button variant='outline' onClick={handleCancel}>
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                    </Button>
                </div>
            </CollapsibleSection>

            {/* Report */}
            {showReport && (
                <CollapsibleSection title='Class Wise Student Report' defaultOpen>
                    <GenericDataTable
                        {...tableProps}
                        ref={tableRef}
                        columns={columns}
                        isLoading={isFetching}
                        error={error}
                        showViewOptions={false}
                        isPaginationRequired
                        loadingMessage='Loading Admission Report...'
                        noDataTitle='No Records Found'
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
