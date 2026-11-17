'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useopeningacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { getStudentFeeSummaryById } from '@/server/fees/masters/student_fee_group_mapping';
import type { StudentFeeGroupSummaryById } from '@/types/fees/masters/masters';
import type { Ifeetransaction } from '@/types/fees/transactions/transactions';
import { useEffect, useState } from 'react';

export default function FeeOnlinePaymentPage() {
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const [showChargesPopup, setShowChargesPopup] = useState(false);

    const { data: academicYearData, isLoading: loadingYears } = useopeningacademicyerdropdowndatafee();

    //   const [feedetails, setFeedetails] = useState<any>([]);
    const mockData: any[] = [
        {
            id: 10020,
            headName: 'Tuition Fee',
            installmentName: 'Nov',
            openingBalance: 0,
            receivable: 850,
            charges: 850,
            concession: 0,
            fine: 0,
            payableAmount: 850
        },
        {
            id: 10021,
            headName: 'Tuition Fee',
            installmentName: 'Dec',
            openingBalance: 0,
            receivable: 850,
            charges: 850,
            concession: 50,
            fine: 0,
            payableAmount: 800
        },
        {
            id: 10022,
            headName: 'Lab Fee',
            installmentName: 'Nov',
            openingBalance: 0,
            receivable: 300,
            charges: 300,
            concession: 0,
            fine: 20,
            payableAmount: 320
        },
        {
            id: 10023,
            headName: 'Transport Fee',
            installmentName: 'Nov',
            openingBalance: 100,
            receivable: 600,
            charges: 700,
            concession: 0,
            fine: 0,
            payableAmount: 700
        },
        {
            id: 10024,
            headName: 'Exam Fee',
            installmentName: 'Dec',
            openingBalance: 0,
            receivable: 500,
            charges: 500,
            concession: 100,
            fine: 0,
            payableAmount: 400
        }
    ];
    //   useEffect(() => {
    //     setFeedetails(mockData);
    //   }, []);

    return (
        <FormProvider<Ifeetransaction>>
            <FeeTransactionContent
                selectedAsmayId={selectedAsmayId}
                setSelectedAsmayId={setSelectedAsmayId}
                academicYearData={academicYearData}
                loadingYears={loadingYears}
                showChargesPopup={showChargesPopup}
                setShowChargesPopup={setShowChargesPopup}
                feedetails={mockData}
            />
        </FormProvider>
    );
}

function FeeTransactionContent({
    showChargesPopup,
    setShowChargesPopup,
    feedetails
}: {
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    loadingYears: boolean;
    academicYearData: any;
    showChargesPopup: boolean;
    setShowChargesPopup: (show: boolean) => void;
    feedetails: any[];
}) {
    return (
        <div className='min-h-screen'>
            <div className='container space-y-4 p-3'>
                <CollapsibleSection defaultOpen variant='outline' size='lg' className='shadow-lg'>
                    <FeeOnlinePaymentUI openChargesPopup={() => setShowChargesPopup(true)} feedetails={feedetails} />
                </CollapsibleSection>

                {showChargesPopup && <PaymentChargesPopup onClose={() => setShowChargesPopup(false)} />}
            </div>
        </div>
    );
}

function PaymentChargesPopup({ onClose }: { onClose: () => void }) {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='max-h-[90vh] w-[420px] space-y-4 overflow-y-auto rounded border bg-white p-4 shadow-lg'>
                <div className='flex items-center justify-between border-b pb-2'>
                    <h2 className='font-bold text-primary'>PAYMENT GATE WAY CHARGES</h2>
                    <Button size='lg' variant='outline' className='px-8' onClick={onClose}>
                        Close
                    </Button>
                </div>

                <div className='space-y-4 text-sm'>
                    <div>
                        <h3 className='font-bold text-lg'>1) PAYU</h3>
                        <ul className='mt-2 ml-2 space-y-1'>
                            <li>* Net Banking : ₹ 7.39</li>
                            <li>* Credit Card : 1.4671%</li>
                            <li>* Debit Card : 1.07% &lt; ₹2000 , 1.18421% &gt; ₹2000</li>
                        </ul>
                        <hr className='my-3' />
                    </div>
                    <div>
                        <h3 className='font-bold text-lg'>2) RAZORPAY</h3>
                        <ul className='mt-2 ml-2 space-y-1'>
                            <li>* Credit Card Domestic – 0.90%</li>
                            <li>* Debit Card – 0% &lt; ₹2000, 0.80% &gt; ₹2000</li>
                            <li>* Net Banking – ₹7</li>
                            <li>* Wallets – 1.68%</li>
                            <li>* EMI – 1.1%</li>
                            <li>* UPI – ₹12</li>
                        </ul>
                        <hr className='my-3' />
                    </div>
                    <div>
                        <h3 className='font-bold text-lg'>3) PAYTM CHARGES</h3>
                        <ul className='mt-2 ml-2 space-y-1'>
                            <li>* Credit Card – 1.1%</li>
                            <li>* Debit Card – 0% &lt; ₹2000, 0.80% &gt; ₹2000</li>
                            <li>* Net Banking – ₹10</li>
                            <li>* Wallet – 1.5%</li>
                            <li>* Postpaid – 1.06%</li>
                            <li>* UPI – 0% &lt; ₹2000 , 1.6% &gt; ₹2000</li>
                        </ul>
                    </div>

                    <p className='mt-4 font-semibold text-red-600'>NOTE: GST APPLICABLE AS PER GOVERNMENT OF INDIA GUIDELINES</p>
                </div>
            </div>
        </div>
    );
}

function FeeOnlinePaymentUI({
    openChargesPopup,
    feedetails
}: {
    openChargesPopup: () => void;
    feedetails: any[];
}) {
    const [totalRebateAmount, setTotalRebateAmount] = useState('0');
    const [totalPayableAmount, setTotalPayableAmount] = useState('0');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(feedetails.map((row) => row.id)));
    const isAllSelected = feedetails.length > 0 && selectedIds.size === feedetails.length;

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(feedetails.map((row: any) => row.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const toggleRow = (id: number, checked: boolean) => {
        setSelectedIds((prev) => {
            const updated = new Set(prev);
            checked ? updated.add(id) : updated.delete(id);
            return updated;
        });
    };
    const paymentOptions = [
        { value: 'easebuzz', label: 'EaseBuzz' },
        { value: 'edviron', label: 'Edviron' }
    ];
    const [paymentType, setPaymentType] = useState('');
    const [feeGroups, setFeeGroups] = useState<StudentFeeGroupSummaryById[]>([]);
    const [loading, setLoading] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});
    const [collapsedHeads, setCollapsedHeads] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const groups = await getStudentFeeSummaryById(231, 16035);
                setFeeGroups(groups);
            } catch (err) {
                console.error(err);
                setFeeGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
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
    const [mappings, setMappings] = useState<any[]>([]);

    // Function to build mappings
    const buildMappings = () => {
        const newMappings: any[] = [];

        feeGroups.forEach((group) => {
            group.heads.forEach((head) => {
                head.installments.forEach((inst) => {
                    newMappings.push({
                        fmG_Id: group.fmG_Id,
                        fmH_Id: head.fmH_Id,
                        ftI_Id: inst.ftI_Id,
                        isSelected: inst.checked === true
                    });
                });
            });
        });

        setMappings(newMappings);
    };

    // Call this function when needed
    useEffect(() => {
        buildMappings();
    }, [feeGroups]); // Add dependencies as needed

    return (
        <div className='space-y-4 rounded-md border bg-white p-4 shadow-md'>
            <div className='rounded border border-green-300 bg-green-100 p-2 text-center text-green-700 text-sm'>
                If Amount is deducted from actual account and receipt is not generated Kindly wait for 12 hours.
            </div>
            <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Button size='lg' variant='outline' className='px-8'>
                    View Fee Structure
                </Button>

                <Button size='lg' variant='outline' className='px-8' onClick={openChargesPopup}>
                    View Payment Gateway Charges
                </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                {/* Student Info */}
                <div className='rounded-md border shadow-sm'>
                    <div className='border-spacing-y-px rounded-md bg-primary px-3 py-2 font-semibold text-sm text-white'>
                        Student Information
                    </div>

                    <div className='space-y-2 p-4 text-sm'>
                        <InfoRow label='Name' value='PARINITH ARYA N' />
                        <InfoRow label='Class/Section/Roll No' value='Nursery / A / 15' />
                        <InfoRow label='Adm No' value='108/2025-26' />
                        <InfoRow label='Reg No' value='108/2025-26' />
                        <InfoRow label='Mobile No' value='0' />
                        <InfoRow label='Email-Id' value='' />
                    </div>
                </div>
                <div className='rounded-md border'>
                    <div className='border-spacing-y-px rounded-md bg-primary px-3 py-2 font-semibold text-sm text-white'>Group List</div>
                    <div className='max-h-[300px] flex-1 overflow-y-auto p-4 shadow-sm'>
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
                                                        {isHeadCollapsed(group.fmG_Id, head.fmH_Id) && head.installments.length > 0 && (
                                                            <div className='mt-3 ml-10 space-y-2'>
                                                                {head.installments.map((inst) => (
                                                                    <div key={inst.ftI_Id} className='flex items-center gap-2'>
                                                                        <Checkbox
                                                                            checked={inst.checked}
                                                                            disabled={inst.disabled}
                                                                            onCheckedChange={() =>
                                                                                handleInstallmentCheck(
                                                                                    group.fmG_Id,
                                                                                    head.fmH_Id,
                                                                                    inst.ftI_Id
                                                                                )
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
                </div>
            </div>

            <div className='mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <InputField label='Current Year Charges' value='42900' />
                <InputField label='Current Year Paid' value='20000' />
                <InputField label='Current Year Outstanding' value='22900' />
                <InputField label='Current Year Concession' value='0' />
            </div>

            <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Button>SHOW</Button>
                <Button size='lg' variant='outline' className='px-8'>
                    CANCEL
                </Button>
            </div>
            {feedetails.length > 0 && mappings.length > 0 && (
                <div className='container space-y-4 p-3'>
                    <CollapsibleSection
                        defaultOpen={true}
                        variant='default'
                        size='lg'
                        className='shadow-lg transition-shadow duration-300 hover:shadow-xl'>
                        <div className='flex items-center justify-between border-b bg-primary/5 px-8 py-6'>
                            <div className='mb-1 text-center'>
                                <h2 className='font-bold text-2xl text-primary'>Fee Details</h2>
                            </div>
                        </div>
                        <div>
                            <div className='overflow-x-auto border'>
                                <table className='w-full table-auto border-collapse'>
                                    <thead className='bg-primary text-white'>
                                        <tr>
                                            <th className='border px-2 py-2 text-center'>
                                                <Checkbox
                                                    id='selectAll'
                                                    className='scale-75 outline'
                                                    disabled
                                                    checked={isAllSelected === true}
                                                    onCheckedChange={(checked: boolean) => toggleSelectAll(checked)}
                                                />
                                            </th>
                                            <th className='border px-2 py-2'>Sl No</th>
                                            <th className='border px-2 py-2'>Head Name</th>
                                            <th className='border px-2 py-2'>Installment Name</th>
                                            <th className='border px-2 py-2'>Opening Balance</th>
                                            <th className='border px-2 py-2'>Receivable</th>

                                            <th className='border px-2 py-2'>Charges</th>
                                            <th className='border px-2 py-2'>Concession</th>
                                            <th className='border px-2 py-2'>Fine</th>

                                            <th className='border px-2 py-2'>Payable Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {feedetails.map((row: any, index: number) => (
                                            <tr key={row.id}>
                                                <td className='border px-2 py-2 text-center'>
                                                    <Checkbox
                                                        checked={selectedIds.has(row.id)}
                                                        disabled
                                                        onCheckedChange={(checked: boolean) => toggleRow(row.id, checked)}
                                                    />
                                                </td>
                                                <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                <td className='border px-2 py-2 text-center'>{row.headName}</td>
                                                <td className='border px-2 py-2 text-center'>{row.installmentName}</td>
                                                <td className='border px-2 py-2 text-center'>{row.openingBalance}</td>
                                                <td className='border px-2 py-2 text-center'>{row.receivable}</td>
                                                <td className='border px-2 py-2 text-center'>{row.charges}</td>
                                                <td className='border px-2 py-2 text-center'>{row.concession}</td>
                                                <td className='border px-2 py-2 text-center'>{row.fine}</td>
                                                <td className='border px-2 py-2 text-center'>{row.payableAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='mt-6 flex w-full flex-col items-center'>
                            <div className='mb-3 flex items-center gap-4'>
                                <Label className='min-w-[140px] text-right'>
                                    Total Rebate: <span className='text-red-500'>*</span>
                                </Label>
                                <InputText
                                    id='torebate'
                                    value={totalRebateAmount}
                                    disabled
                                    onChange={(e) => setTotalRebateAmount(e.target.value)}
                                    placeholder='Enter Total Rebate'
                                    className='w-64'
                                />
                            </div>

                            <div className='mb-6 flex items-center gap-4'>
                                <Label className='min-w-[140px] text-right'>
                                    Total Payable: <span className='text-red-500'>*</span>
                                </Label>
                                <InputText
                                    id='topayable'
                                    disabled
                                    value={totalPayableAmount}
                                    onChange={(e) => setTotalPayableAmount(e.target.value)}
                                    placeholder='Enter Total Payable'
                                    className='w-64'
                                />
                            </div>

                            <h2 className='mb-4 text-center font-bold text-primary text-xl'>
                                Select Any One Payment Gateway Below To Proceed To Payment
                            </h2>

                            <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                                <div className='flex justify-center gap-6'>
                                    {paymentOptions.map((p) => (
                                        <div key={p.value} className='flex items-center gap-2'>
                                            <RadioGroupItem value={p.value} id={p.value} />
                                            <Label htmlFor={p.value} className='cursor-pointer text-sm'>
                                                {p.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                            <Button type='submit' disabled={!paymentType} className='mt-10 w-64'>
                                {'CLICK HERE TO PAY NOW'}
                            </Button>
                        </div>
                    </CollapsibleSection>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className='flex text-sm'>
            <span className='w-44 font-semibold'>{label}</span>
            <span>: {value}</span>
        </div>
    );
}

function InputField({ label, value }: { label: string; value: string }) {
    return (
        <div className='space-y-1'>
            <Label className='text-sm'>{label}</Label>
            <Input defaultValue={value} className='h-9 text-sm' />
        </div>
    );
}
