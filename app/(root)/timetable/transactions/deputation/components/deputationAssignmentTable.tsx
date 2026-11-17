'use client';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, UserCheck } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface DeputationAssignmentTableProps {
    data: any; // The result from saveDeputation (contains absentStaffTimeTable)
    masters: any; // Contains all staff for replacement
}

export default function DeputationAssignmentTable({ data, masters }: DeputationAssignmentTableProps) {
    const { control, handleSubmit } = useForm();

    if (!data || !data.absentStaffTimeTable || data.absentStaffTimeTable.length === 0) return null;

    const onFinalSubmit = (formData: any) => {
        console.log('Finalizing Deputations:', formData);
        // Call final save API here if needed
    };

    return (
        <CollapsibleSection title='Assign Replacement Staff' defaultOpen>
            <div className='space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-md'>
                <div className='mb-2 flex items-center gap-2 text-blue-900'>
                    <UserCheck className='h-5 w-5' />
                    <h3 className='font-bold text-lg'>Assign Replacement Staff</h3>
                </div>

                <form onSubmit={handleSubmit(onFinalSubmit)} className='space-y-6'>
                    <div className='overflow-hidden rounded-xl border border-blue-100'>
                        <Table>
                            <TableHeader className='bg-blue-50'>
                                <TableRow>
                                    <TableHead className='w-[100px] font-bold text-blue-900'>Period</TableHead>
                                    <TableHead className='font-bold text-blue-900'>Original Class/Subject</TableHead>
                                    <TableHead className='font-bold text-blue-900'>Assign Replacement Staff</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.absentStaffTimeTable?.map((item: any, index: number) => (
                                    <TableRow key={index} className='transition-colors hover:bg-slate-50'>
                                        <TableCell className='font-bold text-blue-700'>{item.period}</TableCell>
                                        <TableCell>{item.classSubject}</TableCell>
                                        <TableCell>
                                            <Controller
                                                name={`deputations.${index}.replacement_hrE_Id`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className='w-full border-blue-200'>
                                                            <SelectValue placeholder='Select Staff' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {masters?.staffList?.map((staff: any) => (
                                                                <SelectItem key={staff.hrmE_Id} value={staff.hrmE_Id.toString()}>
                                                                    {staff.staffName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className='flex justify-end'>
                        <Button type='submit' className='bg-blue-600 px-8 font-bold shadow-lg hover:bg-blue-700'>
                            <Save className='mr-2 h-4 w-4' /> Confirm All Deputations
                        </Button>
                    </div>
                </form>
            </div>
        </CollapsibleSection>
    );
}
