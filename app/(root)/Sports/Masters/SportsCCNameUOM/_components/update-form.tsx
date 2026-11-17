'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { saveMasterSportsCCNameUOM } from '@/server/sports/masters/sports-cc-name-uom';
import { MasterSportsCCNameUOMSchema, type IMasterSportsCCNameUOM, type ISportsCCName, type IUOM } from '@/types/sports/masters/sports-cc-name-uom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface UpdateMasterSportsCCNameUOMFormProps {
    selectedRow: IMasterSportsCCNameUOM;
    onSuccess: () => void;
    sportsCCNameList: ISportsCCName[];
    uomList: IUOM[];
}

import { editMasterSportsCCNameUOM } from '@/server/sports/masters/sports-cc-name-uom';
import { useEffect } from 'react';

export default function UpdateMasterSportsCCNameUOMForm({ selectedRow, onSuccess, sportsCCNameList, uomList }: UpdateMasterSportsCCNameUOMFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof MasterSportsCCNameUOMSchema>>({
        resolver: zodResolver(MasterSportsCCNameUOMSchema),
        defaultValues: {
            spccmsccuoM_Id: selectedRow.spccmsccuoM_Id,
            spccmscC_Id: selectedRow.spccmscC_Id,
            spccmuoM_Id: selectedRow.spccmuoM_Id,
            spccmsccuoM_ActiveFlag: selectedRow.spccmsccuoM_ActiveFlag
        },
        mode: 'onChange'
    });

    useEffect(() => {
        const loadEditData = async () => {
            try {
                const apiResponse: any = await editMasterSportsCCNameUOM(selectedRow.spccmsccuoM_Id);
                // The API returns data inside a 'data' array based on the example provided
                if (apiResponse && apiResponse.data && apiResponse.data.length > 0) {
                    const data = apiResponse.data[0];
                    form.reset({
                        spccmsccuoM_Id: data.spccmsccuoM_Id,
                        spccmscC_Id: data.spccmscC_Id,
                        spccmuoM_Id: data.spccmuoM_Id,
                        spccmsccuoM_ActiveFlag: data.spccmsccuoM_ActiveFlag
                    });
                }
            } catch (err) {
                console.error("Failed to load edit details", err);
            }
        };

        if (selectedRow) {
            loadEditData();
        }
    }, [selectedRow, form]);

    const onSubmit = async (values: z.infer<typeof MasterSportsCCNameUOMSchema>) => {
        try {
            const result = await saveMasterSportsCCNameUOM(values);
            if (result?.returnVal === 'updated' || result?.message === 'updated' || result?.success) {
                toast.success('Record updated successfully');
                queryClient.invalidateQueries({ queryKey: ['master-sports-cc-name-uom'] });
                form.reset();
                onSuccess();
            } else if (result?.returnVal === 'duplicate' || result?.message === 'duplicate') {
                toast.warning('Record already exists');
            } else {
                toast.error('Failed to update record');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="spccmscC_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sports Name <span className="text-destructive">*</span></FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                    searchable={true}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="--Select Sports Name--" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sportsCCNameList.map((item) => (
                                            <SelectItem key={item.spccmscC_Id} value={item.spccmscC_Id.toString()}>
                                                {item.spccmscC_SportsCCName}
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
                        name="spccmuoM_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>UOM <span className="text-destructive">*</span></FormLabel>
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value?.toString()}
                                    searchable={true}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="--Select UOM--" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {uomList.map((item) => (
                                            <SelectItem key={item.spccmuoM_Id} value={item.spccmuoM_Id.toString()}>
                                                {item.spccmuoM_UOMName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-center gap-4">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update'
                        )}
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => {
                        form.reset();
                        onSuccess();
                    }}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
