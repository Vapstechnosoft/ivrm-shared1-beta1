'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw, FileText } from 'lucide-react';
import { sportHouseCommitteeReportSchema, type SportHouseCommitteeReportFormData } from '../schema';
import { useSportHouseCommitteeReport } from '@/hooks/sports/useSportHouseCommitteeReport';
import { MultiSelect } from '@/components/ui/multi-select';
import { useEffect, useState } from 'react';
import { IHouse, ISportHouseCommitteeReport } from '@/types/sports/reports/sport-house-committee-report';

interface ReportFormProps {
    onReportGenerated: (data: ISportHouseCommitteeReport[] | null) => void;
    onReset: () => void;
}

export default function ReportForm({ onReportGenerated, onReset }: ReportFormProps) {
    const { initialData, houseMutation, reportMutation } = useSportHouseCommitteeReport();
    const [houseList, setHouseList] = useState<IHouse[]>([]);

    const form = useForm<SportHouseCommitteeReportFormData>({
        resolver: zodResolver(sportHouseCommitteeReportSchema),
        defaultValues: {
            asmaY_Id: undefined,
            selectedhouselist: [],
        },
    });

    const watchedYear = form.watch('asmaY_Id');

    // Fetch houses when year changes
    useEffect(() => {
        if (watchedYear) {
            houseMutation.mutate(watchedYear, {
                onSuccess: (data) => {
                    setHouseList(data.houseList || []);
                    form.setValue('selectedhouselist', []);
                }
            });
        } else {
            setHouseList([]);
            form.setValue('selectedhouselist', []);
        }
    }, [watchedYear]);

    function onSubmit(data: SportHouseCommitteeReportFormData) {
        const payload = {
            asmaY_Id: data.asmaY_Id,
            selectedhouselist: data.selectedhouselist.map(id => ({ spccmH_Id: id })),
        };

        reportMutation.mutate(payload, {
            onSuccess: (responseData) => {
                onReportGenerated(responseData);
            }
        });
    }

    const handleReset = () => {
        form.reset();
        setHouseList([]);
        onReset();
    };

    return (
        <Card>
            <CardHeader className="bg-primary/5 border-b py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    House Committee Report Filter
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
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
                                                {initialData.data?.asmay_list?.map((year) => (
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

                            {/* House Multi-select */}
                            <FormField
                                control={form.control}
                                name="selectedhouselist"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">House <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={houseList.map(h => ({ value: h.spccmH_Id.toString(), label: h.spccmH_HouseName }))}
                                                onValueChange={(vals) => field.onChange(vals.map(Number))}
                                                defaultValue={field.value?.map(String) || []}
                                                placeholder="Select Houses"
                                                disabled={!watchedYear || houseMutation.isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1 font-bold shadow-md hover:shadow-lg transition-all"
                                    disabled={reportMutation.isPending}
                                >
                                    {reportMutation.isPending ? (
                                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <FileText className="h-4 w-4 mr-2" />
                                    )}
                                    Generate Report
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="px-6 border-2 hover:bg-muted"
                                >
                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
