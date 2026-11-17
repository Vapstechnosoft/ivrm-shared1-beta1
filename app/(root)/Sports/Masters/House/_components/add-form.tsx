import { GenericForm } from '@/components/ui/form/generic-form';
import { GenericInputField } from '@/components/ui/form/input-fields';
import { masterHouseSchema } from '@/schemas/sports/masters/house';
import { saveMasterHouse } from '@/server/sports/masters/house';
import { useMasterHouses } from '@/hooks/sports/useMasterHouses';
import type { IMasterHouse } from '@/types/sports/masters/house';
import { toast } from 'sonner';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Local definition of GenericSelectField to avoid modifying shared components
interface GenericSelectFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    options: { label: string; value: string }[];
}

function GenericSelectField({
    name,
    label,
    placeholder,
    required,
    disabled,
    className,
    options
}: GenericSelectFieldProps) {
    const {
        control,
        formState: { errors }
    } = useFormContext();
    const error = errors[name];

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <Label htmlFor={name} className={cn(required && "after:ml-0.5 after:text-red-500 after:content-['*']")}>
                {label}
            </Label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                        <SelectTrigger className={cn(error && 'border-destructive focus-visible:ring-destructive')}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {error && <span className='text-xs text-destructive'>{error.message as string}</span>}
        </div>
    );
}

interface AddMasterHouseFormProps {
    selectedRow?: IMasterHouse;
    onSuccess?: () => void;
}

function HiddenField({ name }: { name: string }) {
    const { register, watch } = useFormContext();
    const value = watch(name);
    return <input type="hidden" value={value || ''} {...register(name)} />;
}

export default function AddMasterHouseForm({
    selectedRow,
    onSuccess
}: AddMasterHouseFormProps) {
    const { refetchAll } = useMasterHouses();

    return (
        <GenericForm<IMasterHouse, (typeof masterHouseSchema)['addOrUpdate']>
            schema={masterHouseSchema.addOrUpdate}
            initialValues={{
                spccmH_Id: selectedRow?.spccmH_Id ?? 0,
                spccmH_HouseName: selectedRow?.spccmH_HouseName ?? '',
                spccmH_HouseDescription: selectedRow?.spccmH_HouseDescription ?? '',
                spccmH_Flag: selectedRow?.spccmH_Flag ?? '',
                spccmH_ActiveFlag: selectedRow?.spccmH_ActiveFlag ?? true
            }}
            onSubmit={async (values) => {
                try {
                    const response = await saveMasterHouse(values);

                    // Relaxed validation to handle variable API response flags
                    if (
                        response?.returnVal === true ||
                        response?.returnVal_update === true ||
                        response?.success === true ||
                        response?.message === 'Record Saved Successfully' ||
                        response?.message === 'Record Updated Successfully'
                    ) {
                        toast.success((response.msg as string) || (response.message as string) || `House ${selectedRow ? 'updated' : 'saved'} successfully`);
                        refetchAll();
                        onSuccess?.();
                    } else if (response?.duplicate_caste_name_bool || response?.message === 'duplicate') {
                        toast.error('House Name Already Exists');
                    } else {
                        toast.error((response?.msg as string) || (response?.message as string) || 'Failed to save House');
                    }
                } catch (error: any) {
                    toast.error(error.message || 'Something went wrong');
                }
            }}
            mode={selectedRow ? 'edit' : 'create'}
            successMessage={`House ${selectedRow ? 'updated' : 'added'} successfully`}
            errorMessage={`Failed to ${selectedRow ? 'update' : 'add'} House`}
            onSuccess={() => {
                refetchAll();
                onSuccess?.();
            }}
            className='space-y-4'
        >
            <HiddenField name="spccmH_Id" />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <GenericInputField
                    name='spccmH_HouseName'
                    label='House Name'
                    placeholder='Enter House Name...'
                    required
                />
                <GenericInputField
                    name='spccmH_HouseDescription'
                    label='House Description'
                    placeholder='Enter House Description...'
                    required
                />
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <GenericSelectField
                    name='spccmH_Flag'
                    label='House/Committee'
                    placeholder='--Select--'
                    options={[
                        { label: 'House', value: 'House' },
                        { label: 'Committee', value: 'Committee' }
                    ]}
                    required
                />
            </div>
        </GenericForm>
    );
}
