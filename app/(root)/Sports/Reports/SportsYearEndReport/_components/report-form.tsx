'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw, FileText, Loader2 } from 'lucide-react';
import { SportsYearEndReportFormData, sportsYearEndReportSchema } from '../schema';
import { useSportsYearEndReport } from '@/hooks/sports/useSportsYearEndReport';
import { useEffect, useState } from 'react';
import { IClass, ISection } from '../types';

interface ReportFormProps {
    onReportGenerated?: (data: any) => void;
    onReset: () => void;
}

export default function ReportForm({ onReportGenerated, onReset }: ReportFormProps) {
    const { initialData, classMutation, sectionMutation } = useSportsYearEndReport();

    const [classList, setClassList] = useState<IClass[]>([]);
    const [sectionList, setSectionList] = useState<ISection[]>([]);

    const form = useForm<SportsYearEndReportFormData>({
        resolver: zodResolver(sportsYearEndReportSchema),
        defaultValues: {
            asmaY_Id: undefined,
            asmcL_Id: undefined,
            asmS_Id: undefined,
        },
    });

    const watchedYear = useWatch({ control: form.control, name: 'asmaY_Id' });
    const watchedClass = useWatch({ control: form.control, name: 'asmcL_Id' });

    // Fetch Classes when Year changes
    useEffect(() => {
        if (watchedYear) {
            classMutation.mutate({ asmaY_Id: watchedYear }, {
                onSuccess: (data) => {
                    setClassList(data.classList || []);
                    form.setValue('asmcL_Id', undefined as any);
                    form.setValue('asmS_Id', undefined as any);
                    setSectionList([]);
                }
            });
        } else {
            setClassList([]);
            setSectionList([]);
        }
    }, [watchedYear]);

    // Fetch Sections when Class changes
    useEffect(() => {
        if (watchedYear && watchedClass) {
            sectionMutation.mutate({ asmaY_Id: watchedYear, asmcL_Id: watchedClass }, {
                onSuccess: (data) => {
                    setSectionList(data.sectionList || []);
                    form.setValue('asmS_Id', undefined as any);
                }
            });
        } else {
            setSectionList([]);
        }
    }, [watchedYear, watchedClass]);

    function onSubmit(data: SportsYearEndReportFormData) {
        // Placeholder for report generation
        console.log("Submit Data:", data);
        if (onReportGenerated) {
            onReportGenerated(data);
        }
    }

    const handleReset = () => {
        form.reset();
        setClassList([]);
        setSectionList([]);
        onReset();
    };

    return (
        <Card>
            <CardHeader className="bg-primary/5 border-b py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Sports Year End Report Filter
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Academic Year */}
                            <FormField
                                control={form.control}
                                name="asmaY_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Academic Year <span className="text-destructive">*</span></FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                            disabled={initialData.isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Year" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {initialData.data?.yearlist?.map((year) => (
                                                    <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                                        {year.asmaY_Year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Class */}
                            <FormField
                                control={form.control}
                                name="asmcL_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Class <span className="text-destructive">*</span></FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                            disabled={!watchedYear || classMutation.isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classList.map((cls) => (
                                                    <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                                        {cls.asmcL_ClassName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Section */}
                            <FormField
                                control={form.control}
                                name="asmS_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Section <span className="text-destructive">*</span></FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value?.toString()}
                                            disabled={!watchedClass || sectionMutation.isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Section" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sectionList.map((sec) => (
                                                    <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                                        {sec.asmC_SectionName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-4">
                            <Button
                                type="submit"
                                className="min-w-[150px] font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Report
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="min-w-[150px] border-2 hover:bg-muted"
                            >
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
