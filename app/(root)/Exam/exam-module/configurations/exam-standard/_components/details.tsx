'use client';
import { Button } from '@/components/ui/button';
import { InputText } from '@/components/ui/extension/input-text';
import { Save } from 'lucide-react';
import { Controller } from 'react-hook-form';

export default function ExamStandardForm({ control, watch, handleSubmit, onSubmit, formState: { errors, isSubmitting } }: any) {
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-3 gap-10'>
                {/* ============================================================= */}
                {/* ⭐ COLUMN 1 */}
                {/* ============================================================= */}
                <div className='space-y-4'>
                    {/* 🔹 Ranking Method */}
                    <Controller
                        name='ExmConfig_RankingMethod'
                        control={control}
                        render={({ field }) => (
                            <div className='flex justify-around rounded border p-2'>
                                {['Dense', 'Standard'].map((v) => (
                                    <label key={v} className='flex items-center gap-2'>
                                        <input type='radio' value={v} checked={field.value === v} onChange={() => field.onChange(v)} />
                                        {v} Rank
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                    {errors.ExmConfig_RankingMethod && <p className='text-red-500 text-sm'>{errors.ExmConfig_RankingMethod.message}</p>}

                    {/* 🔹 Remarks */}
                    <Controller
                        name='ExmConfig_Remarks'
                        control={control}
                        render={({ field }) => (
                            <div className='flex justify-around rounded border p-2'>
                                {['General', 'Studentwise'].map((v) => (
                                    <label key={v} className='flex gap-2'>
                                        <input type='radio' value={v} checked={field.value === v} onChange={() => field.onChange(v)} />
                                        {v} Remarks
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                    {errors.ExmConfig_Remarks && <p className='text-red-500 text-sm'>{errors.ExmConfig_Remarks.message}</p>}

                    {/* 🔹 Pass / Fail */}
                    <Controller
                        name='ExmConfig_PassFailRankFlag'
                        control={control}
                        render={({ field }) => (
                            <div className='flex justify-around rounded border p-2'>
                                <label className='flex gap-2'>
                                    <input type='radio' value='0' checked={field.value === '0'} onChange={() => field.onChange('0')} />
                                    Less Than Minimum Marks
                                </label>
                                <label className='flex gap-2'>
                                    <input type='radio' value='1' checked={field.value === '1'} onChange={() => field.onChange('1')} />
                                    Special Condition
                                </label>
                            </div>
                        )}
                    />
                    {errors.ExmConfig_PassFailRankFlag && (
                        <p className='text-red-500 text-sm'>{errors.ExmConfig_PassFailRankFlag.message}</p>
                    )}

                    {/* 🔹 Default Column */}
                    <Controller
                        name='ExmConfig_AdmNoRegNoRollNo_DefaultFlag'
                        control={control}
                        render={({ field }) => (
                            <div className='flex justify-around rounded border p-2'>
                                {['Admno', 'Regno', 'Rollno'].map((v) => (
                                    <label key={v} className='flex gap-2'>
                                        <input type='radio' checked={field.value === v} onChange={() => field.onChange(v)} />
                                        {v}
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                    {errors.ExmConfig_AdmNoRegNoRollNo_DefaultFlag && (
                        <p className='text-red-500 text-sm'>{errors.ExmConfig_AdmNoRegNoRollNo_DefaultFlag.message}</p>
                    )}

                    {/* 🔹 Search Type */}
                    <Controller
                        name='ExmConfig_Recordsearchtype'
                        control={control}
                        render={({ field }) => (
                            <select {...field} className='w-full rounded border p-2'>
                                <option value=''>--SELECT SEARCH--</option>
                                <option value='Name'>Name</option>
                                <option value='AdmNo'>Admission No</option>
                                <option value='RollNo'>Roll No</option>
                                <option value='RegNo'>Reg No</option>
                            </select>
                        )}
                    />
                    {errors.ExmConfig_Recordsearchtype && (
                        <p className='text-red-500 text-sm'>{errors.ExmConfig_Recordsearchtype.message}</p>
                    )}

                    {/* 🔹 Fraction */}
                    <div className='space-y-2 rounded border p-3'>
                        <Controller
                            name='ExmConfig_EnableFractionFlg'
                            control={control}
                            render={({ field }) => (
                                <label className='flex gap-2'>
                                    <input type='checkbox' checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                    Enable Fraction
                                </label>
                            )}
                        />

                        {watch('ExmConfig_EnableFractionFlg') && (
                            <>
                                <Controller
                                    name='ExmConfig_NoOfDecimal'
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className='w-full rounded border p-2'>
                                            <option value=''>--DECIMAL--</option>
                                            <option value='1'>1</option>
                                            <option value='2'>2</option>
                                            <option value='3'>3</option>
                                        </select>
                                    )}
                                />
                                {errors.ExmConfig_NoOfDecimal && (
                                    <p className='text-red-500 text-sm'>{errors.ExmConfig_NoOfDecimal.message}</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* 🔹 Round Off */}
                    <div className='space-y-2 rounded border p-3'>
                        <Controller
                            name='ExmConfig_RoundoffFlag'
                            control={control}
                            render={({ field }) => (
                                <label className='flex gap-2'>
                                    <input type='checkbox' checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                    Enable Round Off
                                </label>
                            )}
                        />

                        {watch('ExmConfig_RoundoffFlag') && (
                            <>
                                <Controller
                                    name='ExmConfig_NoOfDecimalValues'
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <select {...field} className='w-full rounded border p-2'>
                                                <option value=''>--DECIMAL--</option>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                            </select>
                                        </>
                                    )}
                                />
                                {errors.ExmConfig_NoOfDecimalValues && (
                                    <p className='mt-1 text-red-500 text-sm'>{errors.ExmConfig_NoOfDecimalValues.message}</p>
                                )}
                            </>
                        )}
                    </div>
                    <InputText
                        label='Apply color for fail'
                        name='ExmConfig_FailColorFlg'
                        control={control}
                        {...control.register('ExmConfig_FailColorFlg')}
                        type='text'
                        placeholder='Enter Color for Fail'
                    />
                </div>

                {/* ============================================================= */}
                {/* ⭐ COLUMN 2 */}
                {/* ============================================================= */}
                <div className='space-y-3'>
                    {[
                        ['ExmConfig_PromotionFlag', 'Promotion Required'],
                        ['ExmConfig_GraceAplFlg', 'Grace Applicable'],
                        ['ExmConfig_BonusAplFlag', 'Bonus Applicable'],
                        ['ExmConfig_MinAttAplFlag', 'Minimum Attendance Required'],
                        ['ExmConfig_MarksMultiply', 'Multiply Marks'],
                        ['ExmConfig_PerRoundoffFlag', 'Percent Round Off'],
                        ['ExmConfig_FeeDefaulterDisplayFlg', 'Show Fee Defaulters'],
                        ['ExmConfig_GroupMarksToResultFlg', 'Group Marks To Result'],
                        ['ExmConfig_EntryDateRestFlg', 'Restrict Entry Date'],
                        ['ExmConfig_AdmnoColumnDisplay', 'Admission No Display'],
                        ['ExmConfig_RegnoColumnDisplay', 'Register No Display'],
                        ['ExmConfig_RollnoColumnDisplay', 'Roll No Display'],
                        ['ExmConfig_SecRankFlg', 'Section Rank Required']
                    ].map(([name, label]) => (
                        <Controller
                            key={name}
                            name={name as any}
                            control={control}
                            render={({ field }) => (
                                <label className='flex gap-2'>
                                    <input type='checkbox' checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                    {label}
                                </label>
                            )}
                        />
                    ))}
                </div>

                {/* ============================================================= */}
                {/* ⭐ COLUMN 3 */}
                {/* ============================================================= */}
                <div className='space-y-3'>
                    {[
                        ['ExmConfig_SectionPositionFlg', 'Section Position Required'],
                        ['ExmConfig_PromSubjRoundoffFlag', 'Subject Roundoff For Promotion'],
                        ['ExmConfig_FailBoldFlg', 'Fail Bold'],
                        ['ExmConfig_FailItalicFlg', 'Fail Italic'],
                        ['ExmConfig_FailUnderscoreFlg', 'Fail Underline'],
                        ['ExmConfig_ClassRankFlg', 'Class Rank Needed'],
                        ['ExmConfig_ClassPositionFlg', 'Class Position'],
                        ['ExmConfig_FailRankFlg', 'Fail Rank'],
                        ['ExmConfig_HallTicketFlg', 'Hall Ticket Required'],
                        ['ExmConfig_AllSubjectAbsentFlg', 'Show All Subject Absent'],
                        ['ExmConfig_GroupwiseMarksFlg', 'Groupwise Marks'],
                        ['ExmConfig_SubjectwiseSecRankFlg', 'Subjectwise Section Rank'],
                        ['ExmConfig_SubjectwiseClassRankFlg', 'Subjectwise Class Rank']
                    ].map(([name, label]) => (
                        <Controller
                            key={name}
                            name={name as any}
                            control={control}
                            render={({ field }) => (
                                <label className='flex gap-2'>
                                    <input type='checkbox' checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                    {label}
                                </label>
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* ============================================================= */}
            {/* ⭐ SUBMIT BUTTON */}
            {/* ============================================================= */}
            <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start md:col-span-2'>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='order-1 w-fit transition-all duration-200 hover:scale-105 sm:order-2'
                    isLoading={isSubmitting}
                    loadingText='Saving...'>
                    <div className='flex items-center'>
                        <Save className='mr-2 h-4 w-4' />
                        Save Exam Standard
                    </div>
                </Button>
            </div>
        </form>
    );
}
