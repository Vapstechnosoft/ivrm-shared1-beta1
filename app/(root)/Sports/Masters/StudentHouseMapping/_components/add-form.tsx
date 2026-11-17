'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { studentHouseMappingSchema } from '@/schemas/sports/masters/student-house-mapping';
import { saveStudentHouseMapping, getMasterData } from '@/actions/sports/masters/student-house-mapping';
import { StudentHouseMappingDTO, MasterDataDTO } from '@/types/sports/masters/student-house-mapping';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: StudentHouseMappingDTO | null;
}

export const AddForm = ({ onSuccess, onCancel, initialData }: AddFormProps) => {
    const [masterData, setMasterData] = useState<MasterDataDTO | null>(null);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectAll, setSelectAll] = useState(false);

    const form = useForm<z.infer<typeof studentHouseMappingSchema.addOrUpdate>>({
        resolver: zodResolver(studentHouseMappingSchema.addOrUpdate),
        defaultValues: {
            spccsH_Id: 0,
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            spccmH_Id: 0,
            spccsH_Remarks: '',
            studList1: [],
            spccsH_Date: new Date(),
        },
    });

    const asmaY_Id = form.watch('asmaY_Id');
    const asmcL_Id = form.watch('asmcL_Id');
    const asmS_Id = form.watch('asmS_Id');

    // Load Master Data
    useEffect(() => {
        getMasterData().then((data) => {
            setMasterData(data);
            // Set default year if available
            if (data.yearlist && data.yearlist.length > 0) {
                const selectedYear = data.yearlist.find(y => y.Selected);
                if (selectedYear) {
                    form.setValue('asmaY_Id', selectedYear.asmaY_Id);
                }
            }
        });
    }, [form]);

    // Handle Initial Data for Edit
    useEffect(() => {
        if (initialData) {
            form.reset({
                spccsH_Id: initialData.spccsH_Id,
                asmaY_Id: initialData.asmaY_Id,
                asmcL_Id: initialData.asmcL_Id,
                asmS_Id: initialData.asmS_Id,
                spccmH_Id: initialData.spccmH_Id,
                spccsH_Remarks: initialData.spccsH_Remarks,
                spccsH_Date: initialData.spccsH_Date ? new Date(initialData.spccsH_Date) : new Date(),
                studList1: initialData.spccsH_Id ? [] : [], // We need to handle this carefully.
            });
        }
    }, [initialData, form.reset]);

    // Reset Class and Section when Academic Year changes
    useEffect(() => {
        if (asmaY_Id !== 0) { // Only reset if a year is selected (not initial 0)
            form.setValue('asmcL_Id', 0, { shouldValidate: true });
            form.setValue('asmS_Id', 0, { shouldValidate: true });
            form.setValue('spccmH_Id', 0, { shouldValidate: true });
            form.setValue('studList1', [], { shouldValidate: true });
            setSelectAll(false);
        }
    }, [asmaY_Id, form]);

    // Reset Section when Class changes
    useEffect(() => {
        if (asmcL_Id !== 0) { // Only reset if a class is selected (not initial 0)
            form.setValue('asmS_Id', 0, { shouldValidate: true });
            form.setValue('spccmH_Id', 0, { shouldValidate: true });
            form.setValue('studList1', [], { shouldValidate: true });
            setSelectAll(false);
        }
    }, [asmcL_Id, form]);

    // Reset House and Student list when Section changes
    useEffect(() => {
        if (asmS_Id !== 0) { // Only reset if a section is selected (not initial 0)
            form.setValue('spccmH_Id', 0, { shouldValidate: true });
            form.setValue('studList1', [], { shouldValidate: true });
            setSelectAll(false);
        }
    }, [asmS_Id, form]);

    const onSubmit = async (values: z.infer<typeof studentHouseMappingSchema.addOrUpdate>) => {
        try {
            const result = await saveStudentHouseMapping(values);
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    // Update Filtered Students
    const filteredStudents = masterData?.studentList.filter(student => {
        const matchesSearch = student.studentname.toLowerCase().includes(searchStudent.toLowerCase()) ||
            student.amsT_AdmNo.toLowerCase().includes(searchStudent.toLowerCase());

        // Strict filtering based on cascading dropdowns
        const matchesClass = asmcL_Id ? student.asmcL_Id === asmcL_Id : false;
        const matchesSection = asmS_Id ? student.asmS_Id === asmS_Id : false;

        return matchesSearch && matchesClass && matchesSection;
    }) || [];

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            // Select only filtered students
            const allStudents = filteredStudents.map(s => ({ amsT_Id: s.amsT_Id }));
            form.setValue('studList1', allStudents, { shouldValidate: true });
        } else {
            form.setValue('studList1', [], { shouldValidate: true });
        }
    };

    const handleStudentToggle = (studentId: number, checked: boolean) => {
        const currentList = form.getValues('studList1') || [];
        if (checked) {
            form.setValue('studList1', [...currentList, { amsT_Id: studentId }], { shouldValidate: true });
        } else {
            form.setValue('studList1', currentList.filter(item => item.amsT_Id !== studentId), { shouldValidate: true });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Left Column */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="asmaY_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Year <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="--Select--" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {masterData?.yearlist.map((item) => (
                                                <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="asmS_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        disabled={!asmcL_Id} // Disabled until Class selected
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Section" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {masterData?.sectionDropdown.map((item) => (
                                                <SelectItem key={item.asmS_Id} value={item.asmS_Id.toString()}>
                                                    {item.asmC_SectionName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccmH_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>House <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        disabled={!asmS_Id} // Disabled until Section selected
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select House" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {masterData?.houseList.map((item) => (
                                                <SelectItem key={item.spccmH_Id} value={item.spccmH_Id.toString()}>
                                                    {item.spccmH_HouseName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccsH_Date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date <span className="text-red-500">*</span></FormLabel>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        placeholder="Select Date"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccsH_Remarks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter remarks" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="asmcL_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Name <span className="text-red-500">*</span></FormLabel>
                                    <Select
                                        disabled={!asmaY_Id} // Disabled until Year selected
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? field.value.toString() : ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {masterData?.classList.map((item) => (
                                                <SelectItem key={item.asmcL_Id} value={item.asmcL_Id.toString()}>
                                                    {item.asmcL_ClassName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="border rounded-md p-4">
                            <FormLabel className="block mb-2">Student Name <span className="text-red-500">*</span></FormLabel>

                            <Input
                                placeholder="Search here..."
                                value={searchStudent}
                                onChange={(e) => setSearchStudent(e.target.value)}
                                className="mb-2"
                            />

                            <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded">
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="font-semibold">All</span>
                            </div>

                            <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                                {filteredStudents.map((student) => {
                                    const isSelected = (form.watch('studList1') || []).some(item => item.amsT_Id === student.amsT_Id);
                                    return (
                                        <div key={student.amsT_Id} className="flex items-center space-x-2 py-1">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) => handleStudentToggle(student.amsT_Id, !!checked)}
                                            />
                                            <span className="text-sm">
                                                {student.studentname} : {student.amsT_AdmNo}
                                            </span>
                                        </div>
                                    )
                                })}
                            </ScrollArea>
                            {form.formState.errors.studList1 && (
                                <p className="text-sm font-medium text-destructive mt-2">
                                    {form.formState.errors.studList1.message}
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                    <Button type="button" variant="destructive" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};
