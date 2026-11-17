// Refactored by automation script on 2025-10-28T15:40:35.723Z
// TODO: Complete refactoring by:
// 1. Import columns from _components/columns.tsx
// 2. Import form from _components/resignation-form.tsx
// 3. Extract column definitions and form to the respective files
// 4. Update handlers to use the new structure
'use client';
import { Heading } from '@/components/layout/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputText } from '@/components/ui/extension/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, UserMinus } from 'lucide-react';
import { useState } from 'react';
// import { Alert, AlertDescription } from '@/components/ui/alert'; // Component not found
import { useForm } from 'react-hook-form';
type ResignationFormData = {
    hrManagerName: string;
    hrManagerEmail: string;
    reason: string;
    noticePeriodInDays: number;
    departmentHeadName: string;
    departmentHeadEmail: string;
    resignationRemark: string;
};
// type RelievingFormData = Record<string, unknown>;
export default function EmployeeResignPage() {
    const [activeTab, setActiveTab] = useState('resignation');
    const [showNOCError, setShowNOCError] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ResignationFormData>({
        mode: 'onChange'
    });
    const onSubmitResignation = (_data: ResignationFormData) => {
        // Handle resignation submission
    };
    const onSubmitRelieving = () => {
        // Check NOC approval status
        setShowNOCError(true);
        // Handle relieving submission
    };
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setShowNOCError(false);
        reset();
    };
    return (
        <div className='min-h-screen'>
            <div className='container space-y-6 p-1'>
                {/* Header */}
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                        <Heading
                            title='Employee Resignation/Relieving Application'
                            description='Submit resignation or relieving applications with proper approval workflow'
                        />
                    </div>
                </div>
                {/* Main Application Section */}
                <Card className='shadow-lg'>
                    <CardHeader>
                        <CardTitle className='font-semibold text-gray-800 text-lg'>EMPLOYEE RESIGNATION/RELIEVING APPLICATION</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='resignation' className='flex items-center gap-2'>
                                    <UserMinus className='h-4 w-4' />
                                    Resignation Apply
                                </TabsTrigger>
                                <TabsTrigger value='relieving' className='flex items-center gap-2'>
                                    <FileText className='h-4 w-4' />
                                    Relieving Apply
                                </TabsTrigger>
                            </TabsList>
                            {/* Resignation Apply Tab */}
                            <TabsContent value='resignation' className='space-y-6'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='font-semibold text-gray-800 text-lg'>EMPLOYEE DATA FOR RESIGNATION</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit(onSubmitResignation)} className='space-y-6'>
                                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                                {/* HR Manager Name */}
                                                <div className='space-y-2'>
                                                    <label htmlFor='hr-manager-name-input' className='font-medium text-gray-700 text-sm'>
                                                        HR Manager Name
                                                    </label>
                                                    <InputText
                                                        id='hr-manager-name-input'
                                                        placeholder='Enter HR Manager Name'
                                                        {...register('hrManagerName')}
                                                        error={errors.hrManagerName?.message}
                                                    />
                                                </div>
                                                {/* HR Manager Email */}
                                                <div className='space-y-2'>
                                                    <label htmlFor='hr-manager-email-input' className='font-medium text-gray-700 text-sm'>
                                                        HR Manager Mail-Id
                                                    </label>
                                                    <InputText
                                                        id='hr-manager-email-input'
                                                        type='email'
                                                        placeholder='Enter Manager EmailId'
                                                        {...register('hrManagerEmail', {
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: 'Invalid email address'
                                                            }
                                                        })}
                                                        error={errors.hrManagerEmail?.message}
                                                    />
                                                </div>
                                                {/* Reason */}
                                                <div className='space-y-2'>
                                                    <label htmlFor='reason-select' className='font-medium text-gray-700 text-sm'>
                                                        Reason <span className='text-red-500'>*</span>
                                                    </label>
                                                    <Select value={watch('reason')} onValueChange={(value) => setValue('reason', value)}>
                                                        <SelectTrigger id='reason-select'>
                                                            <SelectValue placeholder='--Select Reason--' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value='Personal'>Personal</SelectItem>
                                                            <SelectItem value='Better Opportunity'>Better Opportunity</SelectItem>
                                                            <SelectItem value='Career Growth'>Career Growth</SelectItem>
                                                            <SelectItem value='Health Issues'>Health Issues</SelectItem>
                                                            <SelectItem value='Family Reasons'>Family Reasons</SelectItem>
                                                            <SelectItem value='Other'>Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.reason && <p className='text-red-500 text-sm'>{errors.reason.message}</p>}
                                                </div>
                                                {/* Notice Period */}
                                                <div className='space-y-2'>
                                                    <label htmlFor='notice-period-input' className='font-medium text-gray-700 text-sm'>
                                                        Notice Period In Days <span className='text-red-500'>*</span>
                                                    </label>
                                                    <InputText
                                                        id='notice-period-input'
                                                        type='number'
                                                        placeholder='Enter Notice Period'
                                                        {...register('noticePeriodInDays', {
                                                            required: 'Notice period is required',
                                                            valueAsNumber: true,
                                                            min: { value: 1, message: 'Notice period must be at least 1 day' }
                                                        })}
                                                        error={errors.noticePeriodInDays?.message}
                                                    />
                                                </div>
                                                {/* Department Head Name */}
                                                <div className='space-y-2'>
                                                    <label htmlFor='dept-head-name-input' className='font-medium text-gray-700 text-sm'>
                                                        Department Head Name
                                                    </label>
                                                    <InputText
                                                        id='dept-head-name-input'
                                                        placeholder='Enter Department Head Name'
                                                        {...register('departmentHeadName')}
                                                        error={errors.departmentHeadName?.message}
                                                    />
                                                </div>
                                                {/* Department Head Email */}
                                                <div className='space-y-2'>
                                                    <label htmlFor='dept-head-email-input' className='font-medium text-gray-700 text-sm'>
                                                        Department Head Mail-Id
                                                    </label>
                                                    <InputText
                                                        id='dept-head-email-input'
                                                        type='email'
                                                        placeholder='Enter Department Head EmailId'
                                                        {...register('departmentHeadEmail', {
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: 'Invalid email address'
                                                            }
                                                        })}
                                                        error={errors.departmentHeadEmail?.message}
                                                    />
                                                </div>
                                            </div>
                                            {/* Resignation Remark */}
                                            <div className='space-y-2'>
                                                <label htmlFor='resignation-remark-textarea' className='font-medium text-gray-700 text-sm'>
                                                    Resignation Remark
                                                </label>
                                                <Textarea
                                                    id='resignation-remark-textarea'
                                                    placeholder='Enter your resignation remarks...'
                                                    rows={4}
                                                    {...register('resignationRemark')}
                                                    className='resize-none'
                                                />
                                            </div>
                                            {/* Form Actions */}
                                            <div className='flex justify-end gap-3 pt-4'>
                                                <Button type='button' variant='outline' onClick={() => reset()}>
                                                    Reset
                                                </Button>
                                                <Button type='submit' disabled={isSubmitting}>
                                                    {isSubmitting ? 'Submitting...' : 'Submit Resignation'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            {/* Relieving Apply Tab */}
                            <TabsContent value='relieving' className='space-y-6'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='font-semibold text-gray-800 text-lg'>EMPLOYEE DATA FOR RELIEVING</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {showNOCError ? (
                                            <div className='flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4'>
                                                <AlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-red-600' />
                                                <div className='text-red-800'>
                                                    <p className='font-medium'>NOC Not Approved</p>
                                                    <p className='text-sm'>
                                                        Your NOC Is Not Approved By Management So You Can't Apply For Relieving Letter
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='space-y-6'>
                                                <div className='py-8 text-center'>
                                                    <FileText className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                                                    <h3 className='mb-2 font-medium text-gray-600 text-lg'>Relieving Application</h3>
                                                    <p className='mb-4 text-gray-500'>
                                                        Submit your relieving application after NOC approval
                                                    </p>
                                                    <Button
                                                        onClick={onSubmitRelieving}
                                                        className='bg-blue-600 text-white hover:bg-blue-700'>
                                                        Check NOC Status & Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
