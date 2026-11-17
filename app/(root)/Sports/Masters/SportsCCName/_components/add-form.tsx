'use client';

import { useFieldArray, useForm } from 'react-hook-form';
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
import { sportsCCNameSchema } from '@/schemas/sports/masters/sports-cc-name';
import { saveSportsCCName } from '@/server/sports/masters/sports-cc-name';
import { SportsCCNameDTO, SportsCCNameGroupDTO } from '@/types/sports/masters/sports-cc-name';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface AddFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    groupNameList: SportsCCNameGroupDTO[];
}

export const AddForm = ({ onSuccess, onCancel, groupNameList }: AddFormProps) => {

    const form = useForm<z.infer<typeof sportsCCNameSchema.addOrUpdate>>({
        resolver: zodResolver(sportsCCNameSchema.addOrUpdate),
        defaultValues: {
            spccmscC_Id: 0,
            spccmsccG_Id: 0,
            spccmscC_SportsCCName: '',
            spccmscC_SportsCCDesc: '',
            spccmscC_SGFlag: 'Single',
            spccmscC_NoOfMembers: 1,
            spccmscC_RecHighLowFlag: 'High',
            spccmscC_RecInfo: '',
            spccmscC_MultiAttemptFlg: false,
            spccmscC_NoOfAttempts: null,
            tempDatas: [{ spccmsccG_UnderEvent: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "tempDatas",
    });

    const watchSGFlag = form.watch('spccmscC_SGFlag');
    const watchMultiAttempt = form.watch('spccmscC_MultiAttemptFlg');

    // Effect for SG Flag
    useEffect(() => {
        if (watchSGFlag === 'Single') {
            form.setValue('spccmscC_NoOfMembers', 1, { shouldValidate: true });
        }
    }, [watchSGFlag, form]);

    const onSubmit = async (values: z.infer<typeof sportsCCNameSchema.addOrUpdate>) => {
        try {
            const payload = {
                ...values,
                spccmscC_Id: 0,
                spccmsccG_Id: Number(values.spccmsccG_Id),
                spccmscC_NoOfMembers: Number(values.spccmscC_NoOfMembers),
                spccmscC_NoOfAttempts: values.spccmscC_NoOfAttempts ? Number(values.spccmscC_NoOfAttempts) : null,
                tempDatas: values.tempDatas?.map(t => ({
                    spccmsccG_UnderEvent: t.spccmsccG_UnderEvent || ''
                })),
            };
            const result = await saveSportsCCName(payload);
            if (result.success) {
                toast.success(result.message);
                form.reset();
                onSuccess();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
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
                            name="spccmsccG_Id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group/Main Event <span className="text-red-500">*</span></FormLabel>
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
                                            {groupNameList.map((item) => (
                                                <SelectItem key={item.spccmsccG_Id} value={item.spccmsccG_Id.toString()}>
                                                    {item.spccmsccG_SportsCCGroupName}
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
                            name="spccmscC_SportsCCDesc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter Description..." maxLength={250} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccmscC_NoOfMembers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No.Of Members <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter No.Of Members..."
                                            type="number"
                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                            readOnly={watchSGFlag === 'Single'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccmscC_SGFlag"
                            render={({ field }) => (
                                <FormItem className="space-y-3 p-3 border rounded-md">
                                    <FormLabel>SG Flag <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                            className="flex space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Single" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Single
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Group" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Group
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccmscC_RecHighLowFlag"
                            render={({ field }) => (
                                <FormItem className="space-y-3 p-3 border rounded-md">
                                    <FormLabel>High/Low Flag <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                            className="flex space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="High" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    High
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Low" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Low
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
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
                            name="spccmscC_RecInfo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rec Info</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Rec Info" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spccmscC_SportsCCName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sports Name / Sub Event <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Sports Name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col space-y-4 p-3 border rounded-md">
                            <FormField
                                control={form.control}
                                name="spccmscC_MultiAttemptFlg"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Number Of Attempts?
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {watchMultiAttempt && (
                                <FormField
                                    control={form.control}
                                    name="spccmscC_NoOfAttempts"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>Number Of Attempts</FormLabel> */}
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Number Of Attempts..."
                                                    type="number"
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* Sub Sub Event Dynamic Table */}
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="p-2 text-center w-16">Sl.No.</th>
                                        <th className="p-2">Sub Sub Event</th>
                                        <th className="p-2 text-center w-20">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="border-t">
                                            <td className="p-2 text-center">{index + 1}</td>
                                            <td className="p-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`tempDatas.${index}.spccmsccG_UnderEvent`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Sub Sub Event" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    {/* Add Button for any row to append */}
                                                    {index === fields.length - 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => append({ spccmsccG_UnderEvent: '' })}
                                                        >
                                                            <Plus className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                    )}

                                                    {/* Remove Button (if more than 1 row) */}
                                                    {fields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : 'Save'}
                    </Button>
                    <Button type="button" variant="destructive" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
};
