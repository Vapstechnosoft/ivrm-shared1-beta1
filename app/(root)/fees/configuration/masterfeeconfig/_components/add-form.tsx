'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/extension/field';
import { useFeeconfiguration } from '@/hooks/fees/useConfiguration';
import { feeConfigSchema } from '@/schemas/fees/configuration';
import { addOrUpdatefeeconfig } from '@/server/fees/configuration/feeconfiguration';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof feeConfigSchema.addOrUpdate>;

interface AddFeeConfigProps {
    onSuccess?: () => void;
    className?: string;
}

export default function AddFeeConfigForm({ onSuccess, className = '' }: AddFeeConfigProps) {
    const { refetchAll } = useFeeconfiguration();

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feeConfigSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {}
    });

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        try {
            const defaultNumber = (value: any): number => (value === null || value === undefined ? 0 : Number(value));
            const defaultString = (value: any): string => (value === null || value === undefined ? '' : String(value));
            let AutoRecieptPrintFlag = false;

            if (data.fmC_AutoRecieptPrintFlag === '1') {
                AutoRecieptPrintFlag = true;
            }
            const payload = {
                // mi_id: 30,
                FMC_id: 0,
                // FMC_AutoRecieptPrintFlag: defaultNumber(data.fmC_AutoRecieptPrintFlag),
                FMC_AutoRecieptPrintFlag: AutoRecieptPrintFlag,
                FMC_RebateTypeFlag: data.FMC_RebateTypeFlag,
                FMC_EnablePartialPaymentFlg: defaultNumber(data.FMC_EnablePartialPaymentFlg),
                FMC_Receipt_Signatory: defaultString(data.FMC_Receipt_Signatory),
                FMC_RClassFlag: defaultNumber(data.FMC_RClassFlag),
                FMC_RSectionFlag: defaultNumber(data.FMC_RSectionFlag),
                FMC_No_Receipt: defaultNumber(data.FMC_No_Receipt),
                FMC_Online_Payment_Aca_Yr_Flag: defaultString(data.FMC_Online_Payment_Aca_Yr_Flag),
                //FMC_GroupOrTermFlg: defaultString(data.FMC_GroupOrTermFlg),
                FMC_GroupOrTermFlg: data.FMC_GroupOrTermFlg,
                FMC_ArrearAfterFlag: defaultNumber(data.FMC_ArrearAfterFlag),
                FMC_Areawise_FeeFlg: defaultNumber(data.FMC_Areawise_FeeFlg),
                FMC_TransportFeeAreaFlag: defaultNumber(data.FMC_TransportFeeAreaFlag),
                FMC_TransportFeeZoneFlag: defaultNumber(data.FMC_TransportFeeZoneFlag),
                FMC_DOACheckFlag: defaultNumber(data.FMC_DOACheckFlag),
                FMC_GroupRemarksFlag: defaultNumber(data.FMC_GroupRemarksFlag),
                FMC_AutoReceiptFeeGroupFlag: defaultNumber(data.FMC_AutoReceiptFeeGroupFlag),
                FMC_Receipt_Format: defaultString(data.FMC_Receipt_Format),
                FMC_EableStaffTrans: defaultNumber(''), // Empty string will be converted to 0
                FMC_EableOtherStudentTrans: defaultNumber(data.FMC_EableOtherStudentTrans),
                FMC_USER_PREVILEDGE: defaultNumber(data.FMC_USER_PREVILEDGE),
                FMC_StaffConcessionCheck: Boolean(data.FMC_StaffConcessionCheck) || false,
                FMC_ShowPreviousFeeFisrtFlg: Boolean(data.FMC_ShowPreviousFeeFisrtFlg) || false,
                FMC_MakerCheckerReqdFlg: Boolean(data.FMC_MakerCheckerReqdFlg) || false,
                FMC_RebateAplicableFlg: Boolean(data.FMC_RebateAplicableFlg) || false,
                FMC_RebateAgainstFullPaymentFlg: Boolean(data.FMC_RebateAgainstFullPaymentFlg) || false,

                FMC_RebateAgainstPartialPaymentFlg: Boolean(data.FMC_RebateAgainstPartialPaymentFlg) || false,
                FMC_RInstallmentsFlag: defaultNumber(data.FMC_RInstallmentsFlag),
                FMC_RInstallmentsMergeFlag: defaultNumber(data.FMC_RInstallmentsMergeFlag),
                FMC_RFineFlag: defaultNumber(data.FMC_RFineFlag),
                FMC_RConcessionFlag: defaultNumber(data.FMC_RConcessionFlag),
                FMC_RWaivedFlag: defaultNumber(data.FMC_RWaivedFlag),
                FMC_RBalanceFlag: defaultNumber(data.FMC_RBalanceFlag),
                FMC_RAmountFlag: defaultNumber(data.FMC_RAmountFlag),
                FMC_RBankFlag: defaultNumber(data.FMC_RBankFlag),
                FMC_ChallanOptionFlag: defaultNumber(data.FMC_ChallanOptionFlag),
                FMC_RDueDateFlag: defaultNumber(data.FMC_RDueDateFlag),
                FMC_RAddressFlag: defaultNumber(data.FMC_RAddressFlag),
                FMC_RFeeHeaderFlag: defaultNumber(data.FMC_RFeeHeaderFlag),
                FMC_FeeSearchNoOfDigits: defaultNumber(data.FMC_FeeSearchNoOfDigits),
                FMC_RUserNameFlag: defaultNumber(data.FMC_RUserNameFlag),
                FMC_RFatherNameFlag: defaultNumber(data.FMC_RFatherNameFlag),
                FMC_MotherNameFlag: defaultNumber(data.FMC_MotherNameFlag),
                FMC_RHeaderTitleFlag: defaultNumber(data.FMC_RHeaderTitleFlag),
                FMC_RPaymentDetailsFlag: defaultNumber(data.FMC_RPaymentDetailsFlag),
                FMC_RAmountReceivedFlag: defaultNumber(data.FMC_RAmountReceivedFlag),
                FMC_RRemarksFlag: defaultNumber(data.FMC_RRemarksFlag),
                FMC_RCurrentDateFlag: defaultNumber(data.FMC_RCurrentDateFlag),
                FMC_Fine_Column: defaultNumber(data.FMC_Fine_Column),
                FMC_ArrearColumn: defaultNumber(data.FMC_ArrearColumn),
                FMC_RFeeGroupFeeHeadFlag: defaultNumber(data.FMC_RFeeGroupFeeHeadFlag),
                FMC_RSplFeeHeadFlag: defaultNumber(data.FMC_RSplFeeHeadFlag),
                FMC_StudentwiseJVFlag: defaultString(data.FMC_StudentwiseJVFlag), // Assuming this is a string
                rolenme: 't',
                FMC_Receipt_SignatoryImage: '',
                finemapping: false,
                fineenabledisable: false
                // userid: 22
            };

            const jsondata = JSON.stringify(payload);

            console.log('Payload to be sent:', jsondata);

            const response = await addOrUpdatefeeconfig(payload);
            if (response.success) {
                toast.success(response.message);
                reset();
                refetchAll();
                onSuccess?.();
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className={`${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid w-full grid-cols-3 gap-6'>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <b>General</b>
                                </div>

                                <div>
                                    {/* className="flex items-center justify-center space-x-6 rounded-lg border border-gray-300 bg-white px-4 py-2" */}
                                    {/* <label className="inline-flex cursor-pointer items-center space-x-4">
                    <input
                      type="radio"
                      name="FMC_GroupOrTermFlg"
                      value="T"
                      className="form-radio h-5 w-5 text-blue-600"
                      defaultChecked
                    />
                    <span className="text-gray-900">Fee Term</span>
                  </label>

                  <label className="inline-flex cursor-pointer items-center space-x-4">
                    <input
                      type="radio"
                      name="FMC_GroupOrTermFlg"
                      value="G"
                      className="form-radio h-5 w-5 text-gray-600"
                    />
                    <span className="text-gray-900">Fee Group</span>
                  </label> */}
                                    <Controller
                                        name='FMC_GroupOrTermFlg'
                                        control={control}
                                        defaultValue='T'
                                        render={({ field }) => (
                                            <div className='flex items-center justify-center space-x-6 rounded-lg border border-gray-300 bg-white px-4 py-2'>
                                                <label className='inline-flex cursor-pointer items-center space-x-4'>
                                                    <input
                                                        type='radio'
                                                        value='T'
                                                        checked={field.value === 'T'}
                                                        onChange={() => field.onChange('T')}
                                                        className='form-radio h-5 w-5 text-blue-600'
                                                    />
                                                    <span className='text-gray-900'>Fee Term</span>
                                                </label>

                                                <label className='inline-flex cursor-pointer items-center space-x-4'>
                                                    <input
                                                        type='radio'
                                                        value='G'
                                                        checked={field.value === 'G'}
                                                        onChange={() => field.onChange('G')}
                                                        className='form-radio h-5 w-5 text-gray-600'
                                                    />
                                                    <span className='text-gray-900'>Fee Group</span>
                                                </label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-2'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_ArrearAfterFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_ArrearAfterFlag'
                                            />
                                            <Label htmlFor='Include Financial Account Concept'>Include Financial Account Concept</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-2'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_Areawise_FeeFlg'
                                    control={control}
                                    defaultValue='0' // default as integer 0 (unchecked)
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')} // send int values
                                                id='FMC_Areawise_FeeFlg'
                                            />
                                            <Label htmlFor='Auto Fee Group Mapping during Promotion'>
                                                Auto Fee Group Mapping during Promotion
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_TransportFeeAreaFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_TransportFeeAreaFlag'
                                            />
                                            <Label htmlFor='Transport Fee Automapping based on area'>
                                                Transport Fee Automapping based on area
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_TransportFeeZoneFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_TransportFeeZoneFlag'
                                            />
                                            <Label htmlFor='Transport Fee Automapping based on Zone'>
                                                Transport Fee Automapping based on Zone
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_DOACheckFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_DOACheckFlag'
                                            />
                                            <Label htmlFor='Date of Admission condition checking'>
                                                Date of Admission condition checking
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_GroupRemarksFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_GroupRemarksFlag'
                                            />
                                            <Label htmlFor='Show fee group remark in fee receipts and reports'>
                                                Show fee group remark in fee receipts and reports
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_AutoReceiptFeeGroupFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_AutoReceiptFeeGroupFlag'
                                            />
                                            <Label htmlFor='Fee Groupwise Auto receipt No'>Fee Groupwise Auto receipt No</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_Receipt_Format'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_Receipt_Format'
                                            />
                                            <Label htmlFor='Fee Receipt Format Display'>Fee Receipt Format Display</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* <div className="group mt-1.5 flex flex-col gap-1.5" >
              <div className="group flex flex-row gap-6">
                <Controller
                  name="FMC_EableStaffTrans"
                  control={control}
                  defaultValue="0" 
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === "1"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "1" : "0")
                        }
                        id="FMC_EableStaffTrans"
                      />
                      <Label htmlFor="Concession Process">
                        Concession Process
                      </Label>
                    </div>
                  )}
                />
              </div>
            </div> */}

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_EableStaffTrans'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_EableStaffTrans'
                                            />
                                            <Label htmlFor='Staff Mapping Entry'>Staff Mapping Entry</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_EableOtherStudentTrans'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_EableOtherStudentTrans'
                                            />
                                            <Label htmlFor='Others Students Entry'>Others Students Entry</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_FineEnableDisable'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_FineEnableDisable'
                                            />
                                            <Label htmlFor=' Fine Applicable'> Fine Applicable</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* <div className="group mt-1.5 flex flex-col gap-1.5">
              <div className="group flex flex-row gap-6">
                <Controller
                  name="FMC_FineMapping"
                  control={control}
                  defaultValue="0"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === "1"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "1" : "0")
                        }
                        id="FMC_FineMapping"
                      />
                      <Label htmlFor="Fine Mapping">Fine Mapping</Label>
                    </div>
                  )}
                />
              </div>
            </div> */}

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_USER_PREVILEDGE'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_USER_PREVILEDGE'
                                            />
                                            <Label htmlFor='User Level Previledge'>User Level Privilege</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_StaffConcessionCheck'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_StaffConcessionCheck'
                                            />
                                            <Label htmlFor='Categorywise block online Payment'>Categorywise block online Payment</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_ShowPreviousFeeFisrtFlg'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_ShowPreviousFeeFisrtFlg'
                                            />
                                            <Label htmlFor='Display Pending/OB Term initially'>Display Pending/OB Term initially</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_MakerCheckerReqdFlg'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_MakerCheckerReqdFlg'
                                            />
                                            <Label htmlFor='Display Pending/OB Term initially'>Enable Maker And Checker</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RebateAplicableFlg'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RebateAplicableFlg'
                                            />
                                            <Label htmlFor='Rebate Applicable'>Rebate Applicable</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RebateAgainstFullPaymentFlg'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RebateAgainstFullPaymentFlg'
                                            />
                                            <Label htmlFor='Rebate Applicable For Full Payment'>Rebate Applicable For Full Payment</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RebateAgainstPartialPaymentFlg'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RebateAgainstPartialPaymentFlg'
                                            />
                                            <Label htmlFor='Rebate Applicable For Partial Payment'>
                                                Rebate Applicable For Partial Payment
                                            </Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* <div className="group mt-1.5 mt-1.5lex flex-col gap-1.5">
              <div className="group flex flex-row gap-6">
                <Controller
                  name="FMC_TransportFeeZoneFlag"
                  control={control}
                  defaultValue="0" 
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === "1"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "1" : "0")
                        }
                        id="FMC_TransportFeeZoneFlag"
                      />
                      <Label htmlFor="Transport Fee Automapping based on Zone">
                        Transport Fee Automapping based on Zone
                      </Label>
                    </div>
                  )}
                />
              </div>
            </div> */}
                    </div>
                    <div>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div>
                                <b>Receipt Settings</b>
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-2'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RInstallmentsFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RInstallmentsFlag'
                                            />
                                            <Label htmlFor='Show Installment'>Show Installment</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-2'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RInstallmentsMergeFlag'
                                    control={control}
                                    defaultValue='0' // default as integer 0 (unchecked)
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')} // send int values
                                                id='FMC_RInstallmentsMergeFlag'
                                            />
                                            <Label htmlFor='Merge Installment'>Merge Installment</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RFineFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RFineFlag'
                                            />
                                            <Label htmlFor='Show Fine'>Show Fine</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RConcessionFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RConcessionFlag'
                                            />
                                            <Label htmlFor='Show Concession'>Show Concession</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RWaivedFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RWaivedFlag'
                                            />
                                            <Label htmlFor='Show Waived Off'>Show Waived Off</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RBalanceFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RBalanceFlag'
                                            />
                                            <Label htmlFor='Show Balance'>Show Balance</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RAmountFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RAmountFlag'
                                            />
                                            <Label htmlFor='Show Amount'>Show Amount</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RBankFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RBankFlag'
                                            />
                                            <Label htmlFor='Show Bank Name'>Show Bank Name</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_ChallanOptionFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_ChallanOptionFlag'
                                            />
                                            <Label htmlFor='Bank Challan'>Bank Challan</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RDueDateFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RDueDateFlag'
                                            />
                                            <Label htmlFor='Due Date'>Due Date</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RAddressFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RAddressFlag'
                                            />
                                            <Label htmlFor='Address'>Address</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        {/* 
            <div className="group mt-1.5 flex flex-row items-center gap-3">
              <label htmlFor="Rebate" className="w-32">
                Rebate(%) :
              </label>
              <input
                id="FMC_RebateTypeFlag"
                type="checkbox" // Change input type to checkbox for boolean value
                {...register("FMC_RebateTypeFlag")} // Registers the input with react-hook-form
                className="rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div> */}

                        <div className='group mt-1.5 flex flex-row items-center gap-3'>
                            <label htmlFor='Receipt Signature:' className='w-32'>
                                Receipt Signature:
                            </label>
                            <input
                                id='FMC_Receipt_Signatory'
                                {...register('FMC_Receipt_Signatory')}
                                className='rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>

                        {/* <div className="group mt-1.5 flex flex-row items-center gap-3">
              <label htmlFor="No. Of Receipt" className="w-32">
                No. Of Receipt :
              </label>
              <input
                id="FMC_No_Receipt"
                {...register("FMC_No_Receipt")}
                className="rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div> */}
                        <div className='group mt-1.5 flex flex-row items-center gap-3'>
                            <label htmlFor='FMC_No_Receipt' className='w-32'>
                                No. Of Receipt :
                            </label>
                            <input
                                id='FMC_No_Receipt'
                                type='text'
                                maxLength={1} // only one character allowed
                                inputMode='numeric' // brings up number keyboard on mobile
                                pattern='[0-9]*' // allows only digits
                                {...register('FMC_No_Receipt', {
                                    maxLength: 1,
                                    pattern: /^[0-9]$/ // only a single digit
                                })}
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.value = target.value.replace(/[^0-9]/g, '').slice(0, 1);
                                }}
                                className='rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>

                        {/* <div className="group mt-1.5 flex flex-row items-center gap-3">
              <label htmlFor=" No. Of Search By Character" className="w-32">
                No. Of Search By Character :
              </label>
              <input
                id="FMC_FeeSearchNoOfDigits"
                {...register("FMC_FeeSearchNoOfDigits")}
                className="rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div> */}

                        <div className='group mt-1.5 flex flex-row items-center gap-3'>
                            <label htmlFor='FMC_FeeSearchNoOfDigits' className='w-32'>
                                No. Of Search By Character :
                            </label>
                            <input
                                id='FMC_FeeSearchNoOfDigits'
                                type='text'
                                maxLength={1} // only one character allowed
                                inputMode='numeric' // brings up numeric keypad on mobile
                                pattern='[0-9]*' // only digits allowed
                                {...register('FMC_FeeSearchNoOfDigits', {
                                    maxLength: 1,
                                    pattern: /^[0-9]$/ // only one digit
                                })}
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    target.value = target.value.replace(/[^0-9]/g, '').slice(0, 1);
                                }}
                                className='rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>

                        <div className='group mt-1.5 flex flex-row items-center gap-3'>
                            <label htmlFor='Online Payment AcademicYear Flag' className='w-32'>
                                Online Payment AcademicYear Flag :
                            </label>
                            <input
                                id='FMC_Online_Payment_Aca_Yr_Flag'
                                {...register('FMC_Online_Payment_Aca_Yr_Flag')}
                                className='rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>

                        {/* <div className="group mt-1.5 flex flex-row items-center gap-3">
              <label htmlFor="Partial Payment" className="w-32">
                Partial Payment :
              </label>
              <input
                id="FMC_EnablePartialPaymentFlg"
                {...register("FMC_EnablePartialPaymentFlg")}
                className="rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div> */}

                        <div className='group mt-1.5 flex flex-row items-center gap-3'>
                            <label htmlFor='FMC_EnablePartialPaymentFlg' className='w-32'>
                                Partial Payment :
                            </label>
                            <input
                                id='FMC_EnablePartialPaymentFlg'
                                type='text'
                                inputMode='numeric'
                                pattern='[0-2]*' // only digits 0,1,2 allowed
                                maxLength={5} // maximum 5 digits
                                {...register('FMC_EnablePartialPaymentFlg', {
                                    pattern: /^[0-2]{0,5}$/, // only 0-2 allowed, up to 5 characters
                                    maxLength: 5
                                })}
                                onInput={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    // remove any characters not 0–2, and limit to 5 characters
                                    target.value = target.value.replace(/[^0-2]/g, '').slice(0, 5);
                                }}
                                className='rounded border px-2 py-1 transition-colors focus:ring-2 focus:ring-primary/20'
                            />
                        </div>
                    </div>
                    <div>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div>
                                <b>Fee Receipt Heads</b>
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-2'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RFeeHeaderFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RFeeHeaderFlag'
                                            />
                                            <Label htmlFor='Header'>Header</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-2'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RClassFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')} // send int values
                                                id='FMC_RClassFlag'
                                            />
                                            <Label htmlFor='Class'>Class</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RSectionFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RSectionFlag'
                                            />
                                            <Label htmlFor='Section'>Section</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RUserNameFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RUserNameFlag'
                                            />
                                            <Label htmlFor='User Name'>User Name</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RFatherNameFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RFatherNameFlag'
                                            />
                                            <Label htmlFor='Father Name'>Father Name</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_MotherNameFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_MotherNameFlag'
                                            />
                                            <Label htmlFor='Mother Name'>Mother Name</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RHeaderTitleFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RHeaderTitleFlag'
                                            />
                                            <Label htmlFor='Payment Header'>Payment Header</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RPaymentDetailsFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RPaymentDetailsFlag'
                                            />
                                            <Label htmlFor='Payment Details'>Payment Details</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RAmountReceivedFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RAmountReceivedFlag'
                                            />
                                            <Label htmlFor='Amount Received'>Amount Received</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RRemarksFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RRemarksFlag'
                                            />
                                            <Label htmlFor='Remarks'>Remarks</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 flex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RCurrentDateFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RCurrentDateFlag'
                                            />
                                            <Label htmlFor='Current Date'>Current Date</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid w-full grid-cols-3 gap-6'>
                    <div>
                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <b>Daily Collection</b>
                        </div>

                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_Fine_Column'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_Fine_Column'
                                            />
                                            <Label htmlFor='Separate fine column'>Separate fine column</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_ArrearColumn'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_ArrearColumn'
                                            />
                                            <Label htmlFor='Separate Arrears column'>Separate Arrears column</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <b>Account Setting</b>
                        </div>

                        <div>
                            {/* className="flex items-center justify-center space-x-6 rounded-lg border border-gray-300 bg-white px-4 py-2" */}
                            {/* <label className="inline-flex cursor-pointer items-center space-x-4">
                <input
                  type="radio"
                  name="FMC_StudentwiseJVFlag"
                  value="T"
                  className="form-radio h-5 w-5 text-blue-600"
                  defaultChecked
                />
                <span className="text-gray-900">Student Wise JV </span>
              </label>

              <label className="inline-flex cursor-pointer items-center space-x-2">
                <input
                  type="radio"
                  name="FMC_StudentwiseJVFlag"
                  value="G"
                  className="form-radio h-5 w-5 text-gray-600"
                />
                <span className="text-gray-900">Fee Head Wise JV</span>
              </label> */}

                            <Controller
                                name='FMC_StudentwiseJVFlag'
                                control={control}
                                defaultValue='T'
                                render={({ field }) => (
                                    <div className='flex items-center justify-center space-x-6 rounded-lg border border-gray-300 bg-white px-4 py-2'>
                                        <label className='inline-flex cursor-pointer items-center space-x-4'>
                                            <input
                                                type='radio'
                                                value='S'
                                                checked={field.value === 'S'}
                                                onChange={() => field.onChange('S')}
                                                className='form-radio h-5 w-5 text-blue-600'
                                            />
                                            <span className='text-gray-900'>Student Wise JV</span>
                                        </label>

                                        <label className='inline-flex cursor-pointer items-center space-x-4'>
                                            <input
                                                type='radio'
                                                value='H'
                                                checked={field.value === 'H'}
                                                onChange={() => field.onChange('H')}
                                                className='form-radio h-5 w-5 text-gray-600'
                                            />
                                            <span className='text-gray-900'>Fee Head Wise JV</span>
                                        </label>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <b>Fee Print Option</b>
                        </div>

                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RFeeGroupFeeHeadFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RFeeGroupFeeHeadFlag'
                                            />
                                            <Label htmlFor='Special fee head group'>Special fee head group</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='FMC_RSplFeeHeadFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='FMC_RSplFeeHeadFlag'
                                            />
                                            <Label htmlFor='Special fee head'>Special fee head</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='group mt-1.5 mt-1.5lex flex-col gap-1.5'>
                            <div className='group flex flex-row gap-6'>
                                <Controller
                                    name='fmC_AutoRecieptPrintFlag'
                                    control={control}
                                    defaultValue='0'
                                    render={({ field }) => (
                                        <div className='flex items-center space-x-2'>
                                            <Checkbox
                                                checked={field.value === '1'}
                                                onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
                                                id='fmC_AutoRecieptPrintFlag'
                                            />
                                            <Label htmlFor='Auto Print Reciept'>Auto Print Reciept</Label>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleReset}
                        disabled={isSubmitting}
                        className='order-2 w-fit transition-all duration-200 hover:scale-105 sm:order-1'>
                        Reset
                    </Button>
                    <Button
                        type='submit'
                        disabled={isSubmitting}
                        className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                        isLoading={isSubmitting}
                        loadingText='Saving...'>
                        <div className='flex items-center'>
                            <Save className='mr-2 h-4 w-4' />
                            Save
                        </div>
                    </Button>
                </div>
            </form>
        </div>
    );
}
