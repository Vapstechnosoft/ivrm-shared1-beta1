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
import { MasterSportsCCNameUOMSchema, type ISportsCCName, type IUOM } from '@/types/sports/masters/sports-cc-name-uom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

interface AddMasterSportsCCNameUOMFormProps {
    onSuccess: () => void;
    sportsCCNameList: ISportsCCName[];
    uomList: IUOM[];
}

export default function AddMasterSportsCCNameUOMForm({ onSuccess, sportsCCNameList, uomList }: AddMasterSportsCCNameUOMFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof MasterSportsCCNameUOMSchema>>({
        resolver: zodResolver(MasterSportsCCNameUOMSchema),
        defaultValues: {
            spccmsccuoM_Id: 0,
            spccmscC_Id: undefined,
            spccmuoM_Id: undefined,
            spccmsccuoM_ActiveFlag: true
        },
        mode: 'onChange'
    });

    const onSubmit = async (values: z.infer<typeof MasterSportsCCNameUOMSchema>) => {
        try {
            const result = await saveMasterSportsCCNameUOM(values);
            if (result?.returnVal === 'saved' || result?.message === 'saved' || result?.success) {
                toast.success('Record saved successfully');
                queryClient.invalidateQueries({ queryKey: ['master-sports-cc-name-uom'] });
                form.reset();
                onSuccess();
            } else if (result?.returnVal === 'duplicate' || result?.message === 'duplicate') {
                toast.warning('Record already exists');
            } else {
                toast.error('Failed to save record');
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
                                Saving...
                            </>
                        ) : (
                            'Save'
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
