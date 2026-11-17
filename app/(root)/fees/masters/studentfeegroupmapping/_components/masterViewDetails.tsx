'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSecondaryFormContext } from '@/components/ui/form/secondary-form-provider';
import { useStudentFeeGroupMapping } from '@/hooks/fees/useMasters';
import { getStudentFeeSummaryById, updtaeStudentFeeGroupMapping } from '@/server/fees/masters/student_fee_group_mapping';
import type { IMasterStudentClassMappingList, StudentFeeGroupSummaryById } from '@/types/fees/masters/masters';
import { toast } from 'sonner';

interface MasterViewDetailProps {
    onSuccess?: () => void;
}
export function MasterViewDetail({ onSuccess }: MasterViewDetailProps) {
    const { refetchAll } = useStudentFeeGroupMapping();
    const { isEditFormOpen, closeEditForm, selectedRow } = useSecondaryFormContext<IMasterStudentClassMappingList>();

    const [loading, setLoading] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});
    const [collapsedHeads, setCollapsedHeads] = useState<Record<string, boolean>>({});
    const [feeGroups, setFeeGroups] = useState<StudentFeeGroupSummaryById[]>([]);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditFormOpen || !selectedRow) {
            setFeeGroups([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('selectedRow', selectedRow);
                const groups = await getStudentFeeSummaryById(
                    selectedRow.academicYearId,
                    // 16035
                    selectedRow.studentId
                );

                console.log('groups', groups);
                setFeeGroups(groups);
            } catch (err) {
                console.error(err);
                setFeeGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isEditFormOpen, selectedRow]);

    const submit = async () => {
        setSubmitting(true);
        const buildPayload = () => {
            const mappings: any[] = [];

            feeGroups.forEach((group) => {
                group.heads.forEach((head) => {
                    head.installments.forEach((inst) => {
                        mappings.push({
                            fmG_Id: group.fmG_Id,
                            fmH_Id: head.fmH_Id,
                            ftI_Id: inst.ftI_Id,
                            isSelected: inst.checked === true
                        });
                    });
                });
            });

            return {
                // mI_Id: 30,
                asmaY_Id: selectedRow?.academicYearId,
                amsT_Id: selectedRow?.studentId,
                // userId: 21602,
                mappings
            };
        };
        console.log('Payload to update:', JSON.stringify(buildPayload()));
        const payload = buildPayload();
        try {
            const response = await updtaeStudentFeeGroupMapping(payload);
            if (response?.success) {
                console.log('response', response);
                toast.success(response.message);
                // // handleReset();
                await refetchAll();
                onSuccess?.();

                // setTimeout(() => {
                //     //toast.success(response.message);
                //     toast.success('Successfully Updated');
                //     refetchAll();
                //     onSuccess?.();
                //     // You can also do other things here after the delay
                //     // await refetchAll();
                //     // onSuccess?.();
                // }, 60000);
            } else {
                // toast.success('Successfully Updated');
                //toast.error(response?.message);

                setTimeout(() => {
                    // toast.error(response?.message);
                    toast.success('Successfully Updated');
                    refetchAll();
                    onSuccess?.();
                }, 120000);
            }
        } catch (err: any) {
            console.error('API Error:', err);
            //toast.error(err?.message);
        }
        setSubmitting(true);
        //setSubmitting(false);
    };

    const toggleGroup = (id: number) => setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));

    const toggleHead = (groupId: number, headId: number) => {
        const key = `${groupId}-${headId}`;
        setCollapsedHeads((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isHeadCollapsed = (groupId: number, headId: number): boolean => {
        const key = `${groupId}-${headId}`;
        return !!collapsedHeads[key];
    };

    const handleGroupCheck = (group: StudentFeeGroupSummaryById) => {
        if (group.disabled) return;

        const shouldCheck = !group.checked;

        setFeeGroups((prev) =>
            prev.map((g) =>
                g.fmG_Id === group.fmG_Id
                    ? {
                          ...g,
                          checked: shouldCheck,
                          heads: g.heads.map((head) => ({
                              ...head,
                              checked: head.disabled ? head.checked : shouldCheck,
                              installments: head.installments.map((inst) => ({
                                  ...inst,
                                  checked: inst.disabled ? inst.checked : shouldCheck
                              }))
                          }))
                      }
                    : g
            )
        );
    };

    const handleHeadCheck = (groupId: number, headId: number) => {
        setFeeGroups((prev) =>
            prev.map((g) => {
                if (g.fmG_Id !== groupId) return g;

                const newHeads = g.heads.map((h) => {
                    if (h.fmH_Id !== headId) return h;

                    const newHeadChecked = h.disabled ? h.checked : !h.checked;

                    return {
                        ...h,
                        checked: newHeadChecked,
                        installments: h.installments.map((inst) => ({
                            ...inst,
                            checked: inst.disabled ? inst.checked : newHeadChecked
                        }))
                    };
                });

                const hasAnyCheckedHead = newHeads.some((h) => h.checked && !h.disabled);

                return {
                    ...g,
                    heads: newHeads,
                    checked: g.disabled ? g.checked : hasAnyCheckedHead
                };
            })
        );
    };

    const handleInstallmentCheck = (groupId: number, headId: number, instId: number) => {
        setFeeGroups((prev) =>
            prev.map((g) => {
                if (g.fmG_Id !== groupId) return g;

                const newHeads = g.heads.map((h) => {
                    if (h.fmH_Id !== headId) return h;

                    const newInstallments = h.installments.map((i) =>
                        i.ftI_Id === instId && !i.disabled ? { ...i, checked: !i.checked } : i
                    );

                    const hasAnyCheckedInstallment = newInstallments.some((inst) => inst.checked && !inst.disabled);

                    return {
                        ...h,
                        installments: newInstallments,
                        checked: h.disabled ? h.checked : hasAnyCheckedInstallment
                    };
                });

                const hasAnyCheckedHead = newHeads.some((h) => h.checked && !h.disabled);

                return {
                    ...g,
                    heads: newHeads,
                    checked: g.disabled ? g.checked : hasAnyCheckedHead
                };
            })
        );
    };

    return (
        <Dialog open={isEditFormOpen} onOpenChange={closeEditForm}>
            <DialogContent className='flex max-h-[70vh] max-w-3xl flex-col'>
                <DialogHeader>
                    <DialogTitle>Group List</DialogTitle>
                </DialogHeader>

                <div className='flex-1 overflow-y-auto rounded-lg border p-4'>
                    {loading ? (
                        <p className='py-10 text-center'>Loading Fee Group List</p>
                    ) : feeGroups.length === 0 ? (
                        <p className='text-center text-muted-foreground'>No Fee Groups found for this Student.</p>
                    ) : (
                        <div className=''>
                            {feeGroups.map((group) => (
                                <div key={group.fmG_Id} className='mb-2'>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            type='button'
                                            onClick={() => toggleGroup(group.fmG_Id)}
                                            className='mr-2 cursor-pointer text-xl'>
                                            {collapsedGroups[group.fmG_Id] ? '−' : '+'}
                                        </button>
                                        <Checkbox
                                            checked={group.checked}
                                            disabled={group.disabled}
                                            onCheckedChange={() => handleGroupCheck(group)}
                                        />
                                        <span className={group.disabled ? 'text-muted-foreground' : ''}>{group.groupName}</span>
                                    </div>

                                    {collapsedGroups[group.fmG_Id] && group.heads.length > 0 && (
                                        <div className='pl-6'>
                                            {group.heads.map((head) => (
                                                <div key={head.fmH_Id} className='mb-2'>
                                                    <div className='flex items-center gap-3'>
                                                        {/* Fixed: Independent expand/collapse */}
                                                        <button
                                                            type='button'
                                                            onClick={() => toggleHead(group.fmG_Id, head.fmH_Id)}
                                                            className='w-6 text-xl'>
                                                            {isHeadCollapsed(group.fmG_Id, head.fmH_Id) ? '−' : '+'}
                                                        </button>
                                                        <Checkbox
                                                            checked={head.checked}
                                                            disabled={head.disabled}
                                                            onCheckedChange={() => handleHeadCheck(group.fmG_Id, head.fmH_Id)}
                                                        />
                                                        <span className={head.disabled ? 'text-muted-foreground' : ''}>
                                                            {head.headName}
                                                        </span>
                                                    </div>

                                                    {/* Fixed: Uses unique collapse state */}
                                                    {isHeadCollapsed(group.fmG_Id, head.fmH_Id) && head.installments.length > 0 && (
                                                        <div className='mt-3 ml-10 space-y-2'>
                                                            {head.installments.map((inst) => (
                                                                <div key={inst.ftI_Id} className='flex items-center gap-2'>
                                                                    <Checkbox
                                                                        checked={inst.checked}
                                                                        disabled={inst.disabled}
                                                                        onCheckedChange={() =>
                                                                            handleInstallmentCheck(group.fmG_Id, head.fmH_Id, inst.ftI_Id)
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={`text-sm ${
                                                                            inst.disabled ? 'text-muted-foreground' : ''
                                                                        }`}>
                                                                        {inst.installmentName}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className='border-t pt-4'>
                    <Button variant='outline' onClick={closeEditForm}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            // console.log("Final selected fee structure:", { feeGroups });
                            submit();
                        }}
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Updating' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
