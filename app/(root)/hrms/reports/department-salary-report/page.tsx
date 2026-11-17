'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Label } from '@/components/ui/extension/field';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTH_LIST } from '@/constants/hrms-config';
import { useLeaveYearDropdown } from '@/hooks/hrms/useMasters';
import {
    useDepartmentSalaryReport, useReportDepartments, useReportDesignations, useReportGroupTypes
} from '@/hooks/hrms/useReports';
import { Printer, RefreshCw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { printDepartmentSalaryReport } from './_components/print-utils';

export default function DepartmentSalaryReportPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    // Form
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            year: '',
            month: '',
            groupType: [] as string[],
            department: [] as string[],
            designation: [] as string[],
        }
    });

    const watchedGroupType = watch('groupType');
    const watchedDepartment = watch('department');

    // Data Fetching
    const { data: yearsData } = useLeaveYearDropdown();
    const { data: groupTypesData } = useReportGroupTypes();

    // Cascading Filter Logic
    const activeGroupIds = useMemo(() => {
        if (!watchedGroupType || watchedGroupType.length === 0) return '';
        if (watchedGroupType.includes('All')) {
            return groupTypesData?.data?.map((g: any) => g.HRMGT_Id || g.hrmgT_Id).join(',') || '';
        }
        return watchedGroupType.join(',');
    }, [watchedGroupType, groupTypesData]);

    const { data: departmentsData } = useReportDepartments(activeGroupIds);

    const activeDeptIds = useMemo(() => {
        if (!watchedDepartment || watchedDepartment.length === 0) return '';
        if (watchedDepartment.includes('All')) {
            return departmentsData?.data?.map((d: any) => d.HRMD_Id || d.hrmD_Id).join(',') || '';
        }
        return watchedDepartment.join(',');
    }, [watchedDepartment, departmentsData]);

    const { data: designationsData } = useReportDesignations(activeGroupIds, activeDeptIds);

    // Report Query
    const { mutate: fetchReport, isPending: isLoadingReport, data: reportResult } = useDepartmentSalaryReport();
    const [reportData, setReportData] = useState<any>(null);

    // Watch for success
    useEffect(() => {
        // biome-ignore lint/complexity/useOptionalChain: <explanation>
        if (reportResult && reportResult.data && reportResult.data.departmentSalaryDetails) {
            setReportData(reportResult.data);
        } else if (reportResult) {
            setReportData(null);
        }
    }, [reportResult]);

    const onSubmit = (data: any) => {
        if (!data.year || !data.month) {
            toast.error('Please select Year and Month');
            return;
        }
        if (!data.groupType || data.groupType.length === 0) {
            toast.error('Please select at least one Group Type');
            return;
        }
        if (!data.department || data.department.length === 0) {
            toast.error('Please select at least one Department');
            return;
        }

        // Prepare IDs
        const gIds = data.groupType.includes('All') ? groupTypesData?.data?.map((g: any) => g.HRMGT_Id || g.hrmgT_Id).join(',') : data.groupType.join(',');
        const dIds = data.department.includes('All') ? departmentsData?.data?.map((d: any) => d.HRMD_Id || d.hrmD_Id).join(',') : data.department.join(',');
        let desIds = '';
        if (data.designation && data.designation.length > 0) {
            desIds = data.designation.includes('All') ? designationsData?.data?.map((d: any) => d.HRMDES_Id || d.hrmdeS_Id).join(',') : data.designation.join(',');
        } else {
            // If no designation selected, maybe send all? Or validate? 
            // Logic in mass updation sends 0 if empty? Prompt implies explicit select. 
            // Let's assume select all if empty? Or required.
            // User prompt: "hrmdes_ids" : "40,73..." so it is required.
            if (designationsData?.data?.length > 0) {
                desIds = designationsData?.data?.map((d: any) => d.HRMDES_Id || d.hrmdeS_Id).join(',');
            } else {
                desIds = '0';
            }
        }

        // Find Year Name not just ID if needed, but API usually takes ID or Name depending on backend.
        // Prompt says: "hreS_Year": "2025". `yearsData` usually has IDs and Names.
        // Let's map ID to Name.
        const yearObj = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === data.year);
        const yearName = yearObj ? yearObj.hrmlY_LeaveYear : data.year;

        // Month "April"
        const monthObj = MONTH_LIST.find((m: { id: number; name: string }) => m.id.toString() === data.month);
        const monthName = monthObj ? monthObj.name : data.month;

        fetchReport({
            hreS_Year: yearName,
            hreS_Month: monthName,
            hrmgt_ids: gIds,
            hrmd_ids: dIds,
            hrmdes_ids: desIds
        });
    };

    // Columns Configuration
    // Custom Table Layout
    // Legacy grid structure logic implemented directly in JSX
    const columns = useMemo(() => [], []);

    const handlePrint = () => {
        const yearObj = yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === watch('year'));
        const monthObj = MONTH_LIST.find((m) => m.id.toString() === watch('month'));

        // Get Dept Names for display
        // ... Logic to get selected dept names ...

        printDepartmentSalaryReport(
            reportData,
            monthObj?.name || '',
            yearObj?.hrmlY_LeaveYear || '',
            '' // Dept names placeholder
        );
    };

    if (!isClient) return null;

    return (
        <div className='container min-h-screen space-y-4 p-2'>
            <CollapsibleSection defaultOpen={true} title="Department Salary Report">
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {/* Year & Month */}
                        <div className='space-y-2'>
                            <Label>Year <span className='text-red-500'>*</span></Label>
                            <Controller name='year' control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                    <SelectContent>
                                        {yearsData?.data?.map((y: any) => (
                                            <SelectItem key={y.hrmlY_Id} value={y.hrmlY_Id?.toString() || ''}>{y.hrmlY_LeaveYear}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                        <div className='space-y-2'>
                            <Label>Month <span className='text-red-500'>*</span></Label>
                            <Controller name='month' control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                                    <SelectContent>
                                        {MONTH_LIST.map((m) => (
                                            <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {/* Group Type */}
                        <div className='space-y-2'>
                            <Label>Group Type <span className='text-red-500'>*</span></Label>
                            <Controller name='groupType' control={control} render={({ field }) => (
                                <MultiSelect
                                    options={groupTypesData?.data?.map((gt: any) => ({
                                        label: gt.value,
                                        value: gt.key.toString()
                                    })) || []}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Select Group Types"
                                />
                            )} />
                        </div>
                        {/* Department */}
                        <div className='space-y-2'>
                            <Label>Department <span className='text-red-500'>*</span></Label>
                            <Controller name='department' control={control} render={({ field }) => (
                                <MultiSelect
                                    options={[{ label: 'All', value: 'All' }, ...(departmentsData?.data || []).map((d: any) => ({ label: d.HRMD_DepartmentName || d.hrmD_DepartmentName, value: d.HRMD_Id?.toString() || d.hrmD_Id?.toString() || '' }))]}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder="Select Department"
                                    disabled={!activeGroupIds}
                                />
                            )} />
                        </div>
                        {/* Designation */}
                        <div className='space-y-2'>
                            <Label>Designation</Label>
                            <Controller name='designation' control={control} render={({ field }) => (
                                <MultiSelect
                                    options={[{ label: 'All', value: 'All' }, ...(designationsData?.data || []).map((d: any) => ({ label: d.HRMDES_DesignationName || d.hrmdeS_DesignationName, value: d.HRMDES_Id?.toString() || d.hrmdeS_Id?.toString() || '' }))]}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder="Select Designation"
                                    disabled={!activeDeptIds}
                                />
                            )} />
                        </div>
                    </div>

                    <div className='flex justify-end pt-4'>
                        <Button type='submit' disabled={isLoadingReport}>
                            {isLoadingReport ? <RefreshCw className='h-4 w-4 animate-spin mr-2' /> : <Search className='h-4 w-4 mr-2' />}
                            Generate Report
                        </Button>
                    </div>
                </form>
            </CollapsibleSection>

            {reportData && reportData.departmentSalaryDetails && reportData.departmentSalaryDetails.length > 0 && (
                <div className="overflow-x-auto mt-8">
                    <div id="print-section" className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                        {/* Institution Header */}
                        {reportData.institutionDetails && (
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold uppercase tracking-wide text-gray-800">{reportData.institutionDetails.mI_Name}</h4>
                                <h6 className="text-sm text-gray-600">{[
                                    reportData.institutionDetails.mI_Address1,
                                    reportData.institutionDetails.mI_Address2,
                                    reportData.institutionDetails.mI_Address3
                                ].filter(Boolean).join(', ')}</h6>
                                <h6 className="text-sm text-gray-600">{reportData.institutionDetails.ivrmmcT_Name} - {reportData.institutionDetails.mI_Pincode}</h6>
                                <h5 className="mt-4 text-md font-semibold underline decoration-gray-400 underline-offset-4 text-gray-700">
                                    Department Salary Report For the Month of {yearsData?.data?.find((y: any) => y.hrmlY_Id.toString() === watch('year'))?.hrmlY_LeaveYear} - {MONTH_LIST.find((m) => m.id.toString() === watch('month'))?.name}
                                </h5>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse border border-gray-400">
                                <thead className="bg-gray-100 font-bold text-center text-gray-700">
                                    <tr>
                                        <th rowSpan={2} className="border border-gray-400 p-2 min-w-[50px] bg-gray-50">Sl.No</th>
                                        <th rowSpan={2} className="border border-gray-400 p-2 whitespace-nowrap min-w-[150px] bg-gray-50">Department Name</th>

                                        {/* Earnings Group Header */}
                                        {(() => {
                                            const earningHeadsMap = new Map<number, boolean>();
                                            reportData.departmentSalaryDetails.forEach((row: any) => {
                                                row.earningresult?.forEach((e: any) => earningHeadsMap.set(e.hrmeD_Id, true));
                                            });
                                            return earningHeadsMap.size > 0 ? <th colSpan={earningHeadsMap.size} className="border border-gray-400 p-2 bg-blue-50">Earnings</th> : null;
                                        })()}

                                        <th rowSpan={2} className="border border-gray-400 p-2 w-[100px] bg-blue-100">Gross Earning</th>

                                        {/* Deductions Group Header */}
                                        {(() => {
                                            const deductionHeadsMap = new Map<number, boolean>();
                                            reportData.departmentSalaryDetails.forEach((row: any) => {
                                                row.deductionresult?.forEach((d: any) => deductionHeadsMap.set(d.hrmeD_Id, true));
                                            });
                                            return deductionHeadsMap.size > 0 ? <th colSpan={deductionHeadsMap.size} className="border border-gray-400 p-2 bg-red-50">Deductions</th> : null;
                                        })()}

                                        <th rowSpan={2} className="border border-gray-400 p-2 w-[100px] bg-red-100">Gross Deduction</th>
                                        <th rowSpan={2} className="border border-gray-400 p-2 w-[100px] bg-green-100">Net Salary</th>
                                    </tr>
                                    <tr>
                                        {/* Dynamic Earning Headers */}
                                        {(() => {
                                            const earningHeadsMap = new Map<number, { id: number; name: string; order: number }>();
                                            reportData.departmentSalaryDetails.forEach((row: any) => {
                                                row.earningresult?.forEach((e: any) => {
                                                    if (!earningHeadsMap.has(e.hrmeD_Id)) earningHeadsMap.set(e.hrmeD_Id, { id: e.hrmeD_Id, name: e.hrmeD_Name, order: e.hrmeD_Order || 0 });
                                                });
                                            });
                                            const earningHeads = Array.from(earningHeadsMap.values()).sort((a, b) => a.order - b.order || a.id - b.id);
                                            return earningHeads.map(eh => (
                                                <th key={`eh-${eh.id}`} className="border border-gray-400 p-2 whitespace-nowrap bg-blue-50/50">{eh.name}</th>
                                            ));
                                        })()}

                                        {/* Dynamic Deduction Headers */}
                                        {(() => {
                                            const deductionHeadsMap = new Map<number, { id: number; name: string; order: number }>();
                                            reportData.departmentSalaryDetails.forEach((row: any) => {
                                                row.deductionresult?.forEach((d: any) => {
                                                    if (!deductionHeadsMap.has(d.hrmeD_Id)) deductionHeadsMap.set(d.hrmeD_Id, { id: d.hrmeD_Id, name: d.hrmeD_Name, order: d.hrmeD_Order || 0 });
                                                });
                                            });
                                            const deductionHeads = Array.from(deductionHeadsMap.values()).sort((a, b) => a.order - b.order || a.id - b.id);
                                            return deductionHeads.map(dh => (
                                                <th key={`dh-${dh.id}`} className="border border-gray-400 p-2 whitespace-nowrap bg-red-50/50">{dh.name}</th>
                                            ));
                                        })()}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.departmentSalaryDetails.map((row: any, index: number) => {
                                        const earningHeadsMap = new Map<number, { id: number; name: string; order: number }>();
                                        const deductionHeadsMap = new Map<number, { id: number; name: string; order: number }>();

                                        reportData.departmentSalaryDetails.forEach((r: any) => {
                                            r.earningresult?.forEach((e: any) => { if (!earningHeadsMap.has(e.hrmeD_Id)) earningHeadsMap.set(e.hrmeD_Id, { id: e.hrmeD_Id, name: e.hrmeD_Name, order: e.hrmeD_Order || 0 }); });
                                            r.deductionresult?.forEach((d: any) => { if (!deductionHeadsMap.has(d.hrmeD_Id)) deductionHeadsMap.set(d.hrmeD_Id, { id: d.hrmeD_Id, name: d.hrmeD_Name, order: d.hrmeD_Order || 0 }); });
                                        });
                                        const earningHeads = Array.from(earningHeadsMap.values()).sort((a, b) => a.order - b.order || a.id - b.id);
                                        const deductionHeads = Array.from(deductionHeadsMap.values()).sort((a, b) => a.order - b.order || a.id - b.id);

                                        const netSalary = row.netSalary !== undefined ? row.netSalary : (row.grossEarning - row.grossDeduction);

                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="border border-gray-400 p-2 text-center text-gray-600">{index + 1}</td>
                                                <td className="border border-gray-400 p-2 font-medium text-gray-800">
                                                    {row.hrmD_DepartmentName === 'JUNIOR SCHOOL' ? 'Teaching Staff' : row.hrmD_DepartmentName}
                                                </td>

                                                {/* Earnings Data */}
                                                {earningHeads.map(eh => {
                                                    const val = row.earningresult?.find((e: any) => e.hrmeD_Id === eh.id)?.hresD_Amount || 0;
                                                    return <td key={`ed-${index}-${eh.id}`} className="border border-gray-400 p-2 text-right">{val ? Math.round(val).toLocaleString() : 0}</td>
                                                })}

                                                <td className="border border-gray-400 p-2 text-right font-bold text-gray-800 bg-blue-50/20">{Math.round(row.grossEarning).toLocaleString()}</td>

                                                {/* Deductions Data */}
                                                {deductionHeads.map(dh => {
                                                    const val = row.deductionresult?.find((d: any) => d.hrmeD_Id === dh.id)?.hresD_Amount || 0;
                                                    return <td key={`dd-${index}-${dh.id}`} className="border border-gray-400 p-2 text-right">{val ? Math.round(val).toLocaleString() : 0}</td>
                                                })}

                                                <td className="border border-gray-400 p-2 text-right font-bold text-gray-800 bg-red-50/20">{Math.round(row.grossDeduction).toLocaleString()}</td>
                                                <td className="border border-gray-400 p-2 text-right font-bold text-gray-900 bg-green-50/20">{Math.round(netSalary).toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-gray-100 font-bold text-gray-800">
                                    <tr>
                                        <td colSpan={2} className="border border-gray-400 p-2 text-center uppercase tracking-wider">Total</td>

                                        {/* Earning Totals */}
                                        {(() => {
                                            const earningHeadsMap = new Map<number, number>();
                                            const headsMap = new Map<number, any>();
                                            reportData.departmentSalaryDetails.forEach((r: any) => {
                                                r.earningresult?.forEach((e: any) => {
                                                    if (!headsMap.has(e.hrmeD_Id)) headsMap.set(e.hrmeD_Id, { id: e.hrmeD_Id, name: e.hrmeD_Name, order: e.hrmeD_Order || 0 });
                                                });
                                            });
                                            const earningHeads = Array.from(headsMap.values()).sort((a, b) => a.order - b.order || a.id - b.id);

                                            reportData.departmentSalaryDetails.forEach((row: any) => {
                                                earningHeads.forEach(eh => {
                                                    const val = row.earningresult?.find((e: any) => e.hrmeD_Id === eh.id)?.hresD_Amount || 0;
                                                    earningHeadsMap.set(eh.id, (earningHeadsMap.get(eh.id) || 0) + val);
                                                });
                                            });

                                            return earningHeads.map(eh => (
                                                <td key={`et-${eh.id}`} className="border border-gray-400 p-2 text-right">{Math.round(earningHeadsMap.get(eh.id) || 0).toLocaleString()}</td>
                                            ));
                                        })()}

                                        <td className="border border-gray-400 p-2 text-right">
                                            {Math.round(reportData.departmentSalaryDetails.reduce((sum: number, row: any) => sum + (row.grossEarning || 0), 0)).toLocaleString()}
                                        </td>

                                        {/* Deduction Totals */}
                                        {(() => {
                                            const deductionHeadsMap = new Map<number, number>();
                                            const headsMap = new Map<number, any>();
                                            reportData.departmentSalaryDetails.forEach((r: any) => {
                                                r.deductionresult?.forEach((d: any) => {
                                                    if (!headsMap.has(d.hrmeD_Id)) headsMap.set(d.hrmeD_Id, { id: d.hrmeD_Id, name: d.hrmeD_Name, order: d.hrmeD_Order || 0 });
                                                });
                                            });
                                            const deductionHeads = Array.from(headsMap.values()).sort((a, b) => a.order - b.order || a.id - b.id);

                                            reportData.departmentSalaryDetails.forEach((row: any) => {
                                                deductionHeads.forEach(dh => {
                                                    const val = row.deductionresult?.find((d: any) => d.hrmeD_Id === dh.id)?.hresD_Amount || 0;
                                                    deductionHeadsMap.set(dh.id, (deductionHeadsMap.get(dh.id) || 0) + val);
                                                });
                                            });

                                            return deductionHeads.map(dh => (
                                                <td key={`dt-${dh.id}`} className="border border-gray-400 p-2 text-right">{Math.round(deductionHeadsMap.get(dh.id) || 0).toLocaleString()}</td>
                                            ));
                                        })()}

                                        <td className="border border-gray-400 p-2 text-right">
                                            {Math.round(reportData.departmentSalaryDetails.reduce((sum: number, row: any) => sum + (row.grossDeduction || 0), 0)).toLocaleString()}
                                        </td>
                                        <td className="border border-gray-400 p-2 text-right">
                                            {Math.round(reportData.departmentSalaryDetails.reduce((sum: number, row: any) => sum + (row.netSalary !== undefined ? row.netSalary : (row.grossEarning - row.grossDeduction)), 0)).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="mt-12 flex justify-end">
                                <div className="text-center pr-10">
                                    <p className="font-bold border-t border-gray-800 pt-2 inline-block min-w-[200px]">Signature of Authority</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 py-4 no-print">
                        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                            <Printer className="w-4 h-4 mr-2" /> Print Report
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
