'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { GroupItem } from './add-form';

export function ViewExamsModal({ group, onClose }: { group: GroupItem; onClose: () => void }) {
    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-6'>
            <div className='absolute inset-0 bg-black/50' onClick={onClose} />

            <div className='relative z-[10000] w-[90%] max-w-xl overflow-hidden rounded-xl border bg-white shadow-xl'>
                <div className='flex items-center justify-between bg-gray-100 px-4 py-2 font-semibold text-lg'>
                    <span>{group.EMPSG_DisplayName} — EXAM MAPPING</span>
                    <Button
                        type='button'
                        onClick={onClose}
                        variant='ghost'
                        size='sm'
                        className='right-12 w-fit border p-2 shadow-md hover:bg-destructive/10'>
                        <X className='h-4 w-4 text-destructive' /> Close
                    </Button>
                </div>

                <div className='p-4'>
                    <table className='min-w-full border'>
                        <thead className='bg-gray-100 text-sm'>
                            <tr>
                                <th className='w-10 p-2'>Sl.No</th>
                                <th className='p-2'>Exam Name</th>
                                <th className='w-20 p-2'>Marks</th>
                                <th className='w-32 p-2'>Conversion?</th>
                            </tr>
                        </thead>

                        <tbody>
                            {group.Exm_M_Prom_Subj_Group_Exams_master.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className='p-4 text-center'>
                                        No Exams Mapped
                                    </td>
                                </tr>
                            ) : (
                                group.Exm_M_Prom_Subj_Group_Exams_master.map((e, i) => (
                                    <tr key={e.emE_Id} className={`${i % 2 ? 'bg-gray-50' : 'bg-white'} text-sm`}>
                                        <td className='p-2 text-center'>{i + 1}</td>
                                        <td className='p-2 text-center'>{e.emE_ExamName}</td>
                                        <td className='p-2 text-center'>{e.EMPSGE_ForMaxMarkrs}</td>
                                        <td className='p-2 text-center'>{e.EMPSGE_ConvertionReqOrNot ? '✔' : '✖'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
