'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormError, Label } from '@/components/ui/extension/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { FeesCustomMultiSelectBox } from '@/components/ui/feesmultiselect';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { useFeeMasterConfiguration, useFeeTransactionList } from '@/hooks/fees/useTrasactions';
import { feesStaffOtherTransactionSchema } from '@/schemas/fees/trasactions';
import { masterBank } from '@/server/fees/trasactions/fee_student_transaction';
import type {
    IFeeTermDetails,
    IStudentSearchList,
    IStudentTermList,
    MasterModeofPayment,
    MasterNarration,
    masterBankList
} from '@/types/fees/transactions/transactions';
import type { z } from 'zod';

type FormFields = z.infer<typeof feesStaffOtherTransactionSchema.addOrUpdate>;

interface FeestudentTrasactionsFormProps {
    onSuccess?: () => void;
    asmayId?: number;
}

export default function FeeStaffOtherTransaction({ onSuccess, asmayId }: FeestudentTrasactionsFormProps) {
    const { refetchAll } = useFeeTransactionList(Number(asmayId));

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesStaffOtherTransactionSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined
        }
    });

    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const [students, setStudents] = useState<IStudentSearchList[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [staffSearch, setStaffSearch] = useState('');
    const [staff, setStaff] = useState<IStudentSearchList[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<IStudentSearchList | null>(null);
    const [selectedTerm, setselectedTerm] = useState<string[]>([]);
    const [terms, setTerms] = useState<IStudentTermList[]>([]);
    const [loadingTerm, setLoadingTerm] = useState(false);
    const [feeHeads, setFeeHeads] = useState<IFeeTermDetails[]>([]);
    const [masternarration, setMasternarration] = useState<MasterNarration[]>([]);
    const [masterModeofPaymentList, setMasterModeofPaymentList] = useState<MasterModeofPayment[]>([]);
    const [loadingFeeHead, setLoadingFeeHead] = useState(false);
    const [selectedHeads, setSelectedHeads] = useState<Record<number, boolean>>({});
    const [currentCharges, setCurrentCharges] = useState<{
        [key: number]: string;
    }>({});
    const [toatlAdjusted, setToatlAdjusted] = useState<{
        [key: number]: string;
    }>({});
    const [totalCharges, setTotalCharges] = useState<{
        [key: number]: string;
    }>({});
    const [concession, setConcession] = useState<{
        [key: number]: string;
    }>({});
    const [openingBalance, setOpeningBalance] = useState<{
        [key: number]: string;
    }>({});
    const [payableAmount, setPayableAmount] = useState<{
        [key: number]: string;
    }>({});
    const [netAmount, setNetAmount] = useState<{
        [key: number]: string;
    }>({});
    const [rebateAmount, setRebateAmount] = useState<{
        [key: number]: string;
    }>({});
    const [TotalCurrentFee, setTotalCurrentFee] = useState<number>();
    const [ConcessionAmount, setConcessionAmount] = useState<number>();
    const [TotalConcession, setTotalConcession] = useState<number>();
    const [totalPayable, settotalPayable] = useState<number>();
    const [overAllOutStanding, setoverAllOutStanding] = useState<number>();
    const [TotalWaivedOff, setTotalWaivedOff] = useState<number>();
    const [Totalfine, setTotalFine] = useState<number>();
    const [TotalPaying, setTotalPaying] = useState<number>(0);
    const [fineAmount, setFineAmount] = useState<number>();
    // const [totalAmount, settotalAmount] = useState<number>(0);
    const [TotalOutStanding, setTotalOutStanding] = useState<number>();
    const [chequeNo, setChequeNo] = useState<{
        [key: number]: string;
    }>({});
    const [chequedates, setchequeDates] = useState<Record<number, Date | null>>({});
    const [amount, setAmount] = useState<{
        [key: number]: string;
    }>({});
    const [filterType, setFilterType] = useState('Staff');
    const [payType, setPayType] = useState<string>('');
    const [modeType, setModeType] = useState<string>('Single');
    const [checkPayType, setCheckPayType] = useState<string[]>([]);
    const [selectedBanks, setSelectedBanks] = useState<Record<number, string>>({});
    const [left, setLeft] = useState(false);
    const [deactive, setDeative] = useState(false);
    const [classs, setClass] = useState(false);
    const [section, setSection] = useState(false);
    const [amountCheck, setAmountCheck] = useState(false);
    const [amountforTerm, setAmountforTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(false);
    const [todaysDate, setTodaysDate] = useState<Date | undefined>(new Date());
    const [selectedNarration, setSelectedNarration] = useState<number | null>(null);
    const [narrationRemark, setNarrationRemark] = useState('');
    const [masterBanks, setMasterBanks] = useState<masterBankList[]>([]);
    const [isLoadingmasterBanks, setIsLoadingMasterBanks] = useState(false);

    const filterOptions = [
        { value: 'Staff', label: 'Staff' },
        { value: 'Others', label: 'Others' }
    ];

    const staticData: IStudentSearchList[] = [
        {
            amsT_StudentName: 'RENA',
            amst_Id: 1
        },
        {
            amsT_StudentName: 'PRIYA',
            amst_Id: 2
        },
        {
            amsT_StudentName: 'SUGUNA',
            amst_Id: 3
        },
        {
            amsT_StudentName: 'ROHINI',
            amst_Id: 4
        },
        {
            amsT_StudentName: 'RITA',
            amst_Id: 5
        }
    ];

    const staticStudentData: IStudentSearchList[] = [
        {
            amsT_StudentName: 'LAKSHYA',
            amst_Id: 1
        },
        {
            amsT_StudentName: 'LALITH SIDDARTH ',
            amst_Id: 2
        },
        {
            amsT_StudentName: 'KEERTHI BHUSHAN REDDY GS',
            amst_Id: 3
        },
        {
            amsT_StudentName: 'KISHAN K S',
            amst_Id: 4
        },
        {
            amsT_StudentName: 'DIGANTH P',
            amst_Id: 5
        },
        {
            amsT_StudentName: 'KAVERI S',
            amst_Id: 6
        },
        {
            amsT_StudentName: 'KUSHAL S',
            amst_Id: 7
        },
        {
            amsT_StudentName: 'KEERTHI BOMMAJJAL N',
            amst_Id: 8
        }
    ];

    const staticTermData: IStudentTermList[] = [
        {
            fmG_GroupName: 'I Term',
            fmG_Id: 1,
            checked: false,
            disablepaisterms: false,
            fmT_Id: 1
        }
    ];

    const staticHeadData: IFeeTermDetails[] = [
        {
            fmG_GroupName: 'Tution Fee',
            fmG_Id: 1,
            fmT_Id: 1,
            fmA_Id: 101,
            fmH_FeeName: 'Annual Tuition Fee',
            fmH_Flag: 'M',
            ftI_Name: 'Term 1',
            fmH_Id: 1,
            ftI_Id: 1,
            totalamount: 50000,
            fsS_ToBePaid: 45000,
            fsS_ConcessionAmount: 5000,
            fsS_FineAmount: 0,
            fsS_CurrentYrCharges: 50000,
            fsS_TotalToBePaid: 45000,
            fsS_OBArrearAmount: 0,
            fsS_RebateAmount: 0,
            fsS_WaivedAmount: 0,
            fsS_OBAsPerFY: 0,
            fsS_AdjustedAmount: 0
        },
        {
            fmG_GroupName: 'Transport Fee',
            fmG_Id: 2,
            fmT_Id: 2,
            fmA_Id: 102,
            fmH_FeeName: 'Bus Fee - Monthly',
            fmH_Flag: 'M',
            ftI_Name: 'Term 1',
            fmH_Id: 2,
            ftI_Id: 1,
            totalamount: 12000,
            fsS_ToBePaid: 10000,
            fsS_ConcessionAmount: 2000,
            fsS_FineAmount: 0,
            fsS_CurrentYrCharges: 12000,
            fsS_TotalToBePaid: 10000,
            fsS_OBArrearAmount: 0,
            fsS_RebateAmount: 0,
            fsS_WaivedAmount: 0,
            fsS_OBAsPerFY: 0,
            fsS_AdjustedAmount: 0
        },
        {
            fmG_GroupName: 'Examination Fee',
            fmG_Id: 3,
            fmT_Id: 1,
            fmA_Id: 103,
            fmH_FeeName: 'Final Exam Fee',
            fmH_Flag: 'O',
            ftI_Name: 'Term 2',
            fmH_Id: 3,
            ftI_Id: 2,
            totalamount: 5000,
            fsS_ToBePaid: 5000,
            fsS_ConcessionAmount: 0,
            fsS_FineAmount: 200,
            fsS_CurrentYrCharges: 5000,
            fsS_TotalToBePaid: 5200,
            fsS_OBArrearAmount: 1000,
            fsS_RebateAmount: 0,
            fsS_WaivedAmount: 0,
            fsS_OBAsPerFY: 5000,
            fsS_AdjustedAmount: 0
        },
        {
            fmG_GroupName: 'Library Fee',
            fmG_Id: 4,
            fmT_Id: 1,
            fmA_Id: 104,
            fmH_FeeName: 'Annual Library Fee',
            fmH_Flag: 'M',
            ftI_Name: 'Term 1',
            fmH_Id: 4,
            ftI_Id: 1,
            totalamount: 3000,
            fsS_ToBePaid: 2500,
            fsS_ConcessionAmount: 500,
            fsS_FineAmount: 50,
            fsS_CurrentYrCharges: 3000,
            fsS_TotalToBePaid: 2550,
            fsS_OBArrearAmount: 0,
            fsS_RebateAmount: 0,
            fsS_WaivedAmount: 100,
            fsS_OBAsPerFY: 3000,
            fsS_AdjustedAmount: -50
        },
        {
            fmG_GroupName: 'Sports Fee',
            fmG_Id: 5,
            fmT_Id: 3,
            fmA_Id: 105,
            fmH_FeeName: 'Sports Equipment Fee',
            fmH_Flag: 'O',
            ftI_Name: 'Term 3',
            fmH_Id: 5,
            ftI_Id: 3,
            totalamount: 8000,
            fsS_ToBePaid: 7000,
            fsS_ConcessionAmount: 1000,
            fsS_FineAmount: 100,
            fsS_CurrentYrCharges: 8000,
            fsS_TotalToBePaid: 7100,
            fsS_OBArrearAmount: 1500,
            fsS_RebateAmount: 500,
            fsS_WaivedAmount: 200,
            fsS_OBAsPerFY: 8000,
            fsS_AdjustedAmount: 300
        }
    ];
    const paymentDataArray: MasterModeofPayment[] = [
        {
            ivrmmoD_Id: 1,
            ivrmmoD_ModeOfPayment: 'Cash Payment',
            ivrmmoD_Flag: 'A',
            ivrmmoD_ModeOfPayment_Code: 'CASH001',
            bank_Date: '2024-03-15',
            bank_No: 'N/A',
            bank_Amount: '5000.00',
            bank_Name: 'Not Applicable',
            fyppM_Id: 2024
        },
        {
            ivrmmoD_Id: 2,
            ivrmmoD_ModeOfPayment: 'Bank Transfer',
            ivrmmoD_Flag: 'A',
            ivrmmoD_ModeOfPayment_Code: 'BTRN002',
            bank_Date: '2024-03-16',
            bank_No: 'BT202403161245',
            bank_Amount: '25000.00',
            bank_Name: 'State Bank of India',
            fyppM_Id: 2024
        },
        {
            ivrmmoD_Id: 3,
            ivrmmoD_ModeOfPayment: 'Credit Card',
            ivrmmoD_Flag: 'A',
            ivrmmoD_ModeOfPayment_Code: 'CRCD003',
            bank_Date: '2024-03-17',
            bank_No: 'CC-7890XXXXXX1234',
            bank_Amount: '15000.00',
            bank_Name: 'HDFC Bank',
            fyppM_Id: 2024
        },
        {
            ivrmmoD_Id: 4,
            ivrmmoD_ModeOfPayment: 'Cheque Payment',
            ivrmmoD_Flag: 'I', // Inactive
            ivrmmoD_ModeOfPayment_Code: 'CHQ004',
            bank_Date: '2024-03-18',
            bank_No: '87654321',
            bank_Amount: '18000.00',
            bank_Name: 'ICICI Bank',
            fyppM_Id: 2024
        }
    ];

    useEffect(() => {
        setStaff(staticData);
    }, []);

    useEffect(() => {
        setStudents(staticStudentData);
    }, [selectedAsmayId]);

    useEffect(() => {
        setTerms(staticTermData);
    }, [selectedStudent, selectedStaff]);
    useEffect(() => {
        setFeeHeads(staticHeadData);
        setMasterModeofPaymentList(paymentDataArray);
    }, []);

    const selectedLabel = filterOptions.find((opt) => opt.value === filterType)?.label || '';

    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();

    const { data: masterConfiguration } = useFeeMasterConfiguration();

    const config = masterConfiguration?.data?.[0]?.fmC_AutoReceiptFeeGroupFlag ?? 0;

    useEffect(() => {
        setTerms([]);
        setselectedTerm([]);
    }, [selectedAsmayId, filterType]);

    useEffect(() => {
        setFeeHeads([]);
        setSelectedHeads([]);
        setSelectedNarration(null);
        setSelectAll(false);
        setPayableAmount({});
        setToatlAdjusted({});
    }, [selectedTerm]);

    useEffect(() => {
        setchequeDates({});
        setChequeNo({});
        setSelectedBanks({});
        setAmount({});
        const selectedPayment = masterModeofPaymentList.find((f) => f.ivrmmoD_ModeOfPayment === payType);

        if (modeType === 'Single' && selectedPayment) {
            setAmount((prev) => ({
                ...prev,
                [selectedPayment.ivrmmoD_Id]: TotalPaying?.toString() || '0'
            }));
        }
    }, [payType, TotalPaying, modeType]);

    useEffect(() => {
        setIsLoadingMasterBanks(true);
        const fetchMasterBank = async () => {
            try {
                const masterBanks = await masterBank();
                setMasterBanks(masterBanks?.data ?? []);
            } catch (error) {
                setIsLoadingMasterBanks(false);
                console.error('Failed to fetch fee heads:', error);
            }
        };
        setIsLoadingMasterBanks(false);
        fetchMasterBank();
    }, []);

    useEffect(() => {
        const concession = feeHeads.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_ConcessionAmount.toString()) || 0;
            return sum + amount;
        }, 0);
        const fine = feeHeads.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_FineAmount.toString()) || 0;
            return sum + amount;
        }, 0);
        const totalpaying = feeHeads.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_ToBePaid.toString()) || 0;
            return sum + amount;
        }, 0);
        const totalCurrentFee = feeHeads.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_CurrentYrCharges.toString()) || 0;
            return sum + amount;
        }, 0);
        setConcessionAmount(concession);
        settotalPayable(totalPayable);
        setoverAllOutStanding(overAllOutStanding);
        setFineAmount(fine);
        setTotalCurrentFee(totalCurrentFee);
        setTotalOutStanding(totalpaying);
    }, [feeHeads]);

    useEffect(() => {
        const selectedItems = feeHeads.filter((f) => selectedHeads[f.fmA_Id]);
        const totalpaying = selectedItems.reduce((sum, f) => {
            const payableValue = payableAmount[f.fmA_Id];
            const amount = payableValue ? Number.parseFloat(payableValue) || 0 : Number.parseFloat(f.fsS_ToBePaid?.toString() || '0') || 0;
            return sum + amount;
        }, 0);
        setTotalPaying(totalpaying);
    }, [selectedHeads, feeHeads, payableAmount]);

    const toggleRow = (id: number, checked: boolean) => {
        setSelectedHeads((prev) => {
            const updated = { ...prev, [id]: checked };
            if (!checked) {
                setSelectAll(false);
            } else {
                const allChecked = staticHeadData.every((item) => updated[item.fmA_Id]);
                setSelectAll(allChecked);
            }

            return updated;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        const newState: Record<number, boolean> = {};
        staticHeadData.forEach((f) => {
            newState[f.fmA_Id] = checked;
        });

        setSelectedHeads(newState);
    };

    const handleTermChange = (newSelectedValues: string[]) => {
        const isSelectAll = newSelectedValues.length === terms.length || newSelectedValues.length === 0;

        if (isSelectAll) {
            applySelection(newSelectedValues);
            return;
        }
        const newlySelected = newSelectedValues.map(Number);
        const previouslySelected = selectedTerm.map(Number);
        const orderedTerms = terms;
        const clickedId =
            newlySelected.find((id) => !previouslySelected.includes(id)) ?? previouslySelected.find((id) => !newlySelected.includes(id));

        if (clickedId == null) {
            applySelection(newSelectedValues);
            return;
        }

        const clickedIndex = orderedTerms.findIndex((t) => t.fmT_Id === clickedId);
        const isChecking = newlySelected.includes(clickedId);
        const isUnchecking = !isChecking;

        if (isChecking) {
            for (let i = 0; i < clickedIndex; i++) {
                const above = orderedTerms[i];
                const isEnabled = above.disablepaisterms === false || above.disablepaisterms === undefined;
                if (!isEnabled) continue;
                const isAboveSelected = newlySelected.includes(above.fmT_Id);
                if (!isAboveSelected) {
                    toast.warning('You have to select Terms in Order');
                    return;
                }
            }
        }

        if (isUnchecking) {
            for (let i = clickedIndex + 1; i < orderedTerms.length; i++) {
                const below = orderedTerms[i];
                const isBelowSelected = previouslySelected.includes(below.fmT_Id);
                if (isBelowSelected) {
                    toast.warning('You cannot unselect,because you have selected next Term');
                    return;
                }
            }
        }

        applySelection(newSelectedValues);
    };

    const applySelection = (selectedValues: string[]) => {
        setselectedTerm(selectedValues);
        const updated = terms.map((ex) => ({
            ...ex,
            checked: selectedValues.includes(ex.fmT_Id.toString())
        }));
        setTerms(updated);
    };

    const onSubmit = async () => {
        if (staticHeadData.filter((f) => selectedHeads[f.fmA_Id]).length === 0) {
            toast.error('Atleast one head has to be checked to save the Transaction!!!');
            return;
        }
        if (modeType === 'Single') {
            const selectedPayment = masterModeofPaymentList.find((f) => f.ivrmmoD_ModeOfPayment === payType);

            if (!selectedPayment) {
                toast.error('Invalid payment selection');
                return;
            }
            if (selectedPayment.ivrmmoD_Flag.toLowerCase() !== 'c') {
                const paymentId = selectedPayment.ivrmmoD_Id;
                if (!chequeNo[paymentId] || chequeNo[paymentId] === '') {
                    toast.error('Please enter Cheque No. for Selected Payment Mode');
                    return;
                }
                if (!selectedBanks[paymentId] || selectedBanks[paymentId] === '') {
                    toast.error('Please select Bank for Selected Payment Mode');
                    return;
                }

                if (!amount[paymentId] || amount[paymentId] === '') {
                    toast.error('Please enter Amount for Selected Payment Mode');
                    return;
                }
                if (amount[paymentId] === Number(0).toString()) {
                    toast.error('Amount Is Must Be Greater Than Zero');
                    return;
                }
            }
        }

        try {
            const savePaymentModes = [];

            if (modeType === 'Single') {
                const selectedPayment = masterModeofPaymentList.find((f) => f.ivrmmoD_ModeOfPayment === payType);

                if (selectedPayment) {
                    const bankId = selectedBanks?.[selectedPayment?.ivrmmoD_Id];
                    const selectedBankName = bankId ? masterBanks.find((f) => f.fmbanK_Id === Number(bankId))?.fmbanK_BankName : '';
                    // console.log("selectedBankName",selectedBankName)
                    const paymentMode = {
                        fyppM_TotalPaidAmount: amount[selectedPayment.ivrmmoD_Id] || '0',
                        fyppM_TransactionTypeFlag: selectedPayment.ivrmmoD_Flag,
                        fyppM_BankName: selectedBankName,
                        fyppM_DDChequeDate: chequedates[selectedPayment.ivrmmoD_Id] ?? new Date(),
                        fyppM_DDChequeNo: chequeNo[selectedPayment.ivrmmoD_Id],
                        ivrmmoD_ModeOfPayment_Code: selectedPayment.ivrmmoD_ModeOfPayment_Code,
                        fyppM_Id: 0
                    };
                    savePaymentModes.push(paymentMode);
                }
            } else {
                const selectedPayment = masterModeofPaymentList.filter((f) => checkPayType.includes(f.ivrmmoD_ModeOfPayment));
                selectedPayment.forEach((f) => {
                    const bankId = selectedBanks?.[f?.ivrmmoD_Id];
                    const selectedBankName = bankId ? masterBanks.find((f) => f.fmbanK_Id === Number(bankId))?.fmbanK_BankName : '';
                    // console.log("selectedBankName",selectedBankName)
                    const payment = {
                        fyppM_TotalPaidAmount: amount[f.ivrmmoD_Id] || '0',
                        fyppM_TransactionTypeFlag: f.ivrmmoD_Flag,
                        fyppM_BankName: selectedBankName ?? '',
                        fyppM_DDChequeDate: chequedates[f.ivrmmoD_Id] ?? new Date(),
                        fyppM_DDChequeNo: chequeNo[f.ivrmmoD_Id] ?? '',
                        ivrmmoD_ModeOfPayment_Code: f.ivrmmoD_ModeOfPayment_Code,
                        fyppM_Id: 0
                    };
                    savePaymentModes.push(payment);
                });
            }

            const feeStudentTermInfos = feeHeads
                .filter((f) => selectedHeads[f.fmA_Id])
                .map((fee) => ({
                    fmA_Id: fee.fmA_Id,
                    fmH_FeeName: fee.fmH_FeeName,
                    fmH_Flag: fee.fmH_Flag,
                    ftI_Name: fee.ftI_Name,
                    fmH_Id: fee.fmH_Id,
                    ftI_Id: fee.ftI_Id,
                    totalamount: Number(netAmount[fee.fmA_Id] ?? fee.fsS_CurrentYrCharges),
                    fsS_ToBePaid: Number(payableAmount[fee.fmA_Id] ?? fee.fsS_ToBePaid),
                    fsS_ConcessionAmount: Number(concession[fee.fmA_Id] ?? fee.fsS_ConcessionAmount),
                    fsS_FineAmount: fee.fsS_FineAmount,
                    fsS_CurrentYrCharges: Number(currentCharges[fee.fmA_Id] ?? fee.fsS_CurrentYrCharges),
                    fsS_TotalToBePaid: Number(totalCharges[fee.fmA_Id] ?? fee.fsS_TotalToBePaid),
                    fmG_Id: fee.fmG_Id,
                    fmG_GroupName: fee.fmG_GroupName,
                    fsS_OBArrearAmount: fee.fsS_OBArrearAmount,
                    fmT_Id: fee.fmT_Id,
                    fsS_RebateAmount: Number(rebateAmount[fee.fmA_Id] ?? fee.fsS_RebateAmount),
                    fsS_WaivedAmount: fee.fsS_WaivedAmount
                }));

            const payload = {
                fyP_Chq_Bounce: '',
                fyP_Id: 0,
                asmaY_Id: selectedAsmayId?.toString(),
                automanualreceiptno: '',
                auto_receipt_flag: config,
                fyP_Receipt_No: '',
                fyPcurr_Date: todaysDate,
                fyP_Remarks: narrationRemark,
                savePaymentModes: savePaymentModes,
                feeStudentTermInfos: feeStudentTermInfos,
                returnval: '',
                displaymessage: '',
                amst_Id: selectedStudent,
                fyP_Tot_Amount: TotalPaying,
                filterinitialdata: filterType,
                fyP_Tot_Concession_Amt: TotalConcession,
                fyP_Tot_Fine_Amt: Totalfine,
                fyP_Tot_Waived_Amt: TotalWaivedOff,
                fyP_PayModeType: '',
                smsconfig: sms,
                emailconfig: email
            };

            // const response = await saveFeeTransaction(payload);

            // if (response?.displaymessage) {
            //     toast.success(response.message || ' Transaction Saved successfully');
            //     handleReset();
            //     onSuccess?.();
            //     refetchAll();
            // } else {
            //     const errorMessage = response?.returnval;
            //     if (typeof errorMessage === 'string' && errorMessage.trim() !== '') {
            //         toast.error(errorMessage);
            //     } else {
            //         toast.error('Save failed');
            //     }
            // }
            toast.success('Transaction Saved successfully');
            handleReset();
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Something went wrong');
        }
        onSuccess?.();
    };

    const handleReset = () => {
        reset();
        setSelectedAsmayId(0);
        setStudents([]);
        setTerms([]);
        setselectedTerm([]);
        setLeft(false);
        setClass(false);
        setSection(false);
        setDeative(false);
        setFilterType('Staff');
        setTodaysDate(new Date());
        setSms(false);
        setEmail(false);
        setAmountCheck(false);
        setNarrationRemark('');
        setAmountforTerm('');
        setFeeHeads([]);
        setSelectedHeads([]);
        setSelectedNarration(null);
    };

    return (
        <div className='mx-auto max-w-7xl p-2'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex gap-8'>
                    <div className='max-h-[100px] overflow-auto rounded border bg-gray-50 p-3 shadow-inner' style={{ width: '30%' }}>
                        <RadioGroup value={filterType} onValueChange={setFilterType}>
                            <div className='grid grid-cols-2 gap-3'>
                                {filterOptions.map((item) => (
                                    <div key={item.value} className='flex items-center space-x-2'>
                                        <RadioGroupItem value={item.value} id={item.value} />
                                        <Label htmlFor={item.value} className='cursor-pointer text-sm'>
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                        <div className=' flex w-full items-center space-x-4 pt-4 '>
                            <Label className='font-semibold'>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' className='w-full justify-start text-left font-normal'>
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {todaysDate ? format(todaysDate, 'PPP') : 'Select Date'}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar
                                        mode='single'
                                        selected={todaysDate ?? undefined}
                                        onSelect={(date) => {
                                            if (date) setTodaysDate(date);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className='max-h-[300px] w-[40%] overflow-auto rounded border bg-gray-50 p-4 shadow-inner'>
                        <div className='mb-4 space-y-2'>
                            <div className='flex w-full items-center justify-between gap-4'>
                                <Label htmlFor='asmaY_Id' className='whitespace-nowrap font-semibold'>
                                    Academic Year <span className='text-red-500'>*</span>
                                </Label>
                                <Controller
                                    name='asmaY_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value || 'empty'}
                                            onValueChange={(val) => {
                                                const id = Number(val);
                                                field.onChange(id);
                                                setSelectedAsmayId(id);
                                            }}
                                            value={
                                                typeof field.value === 'number' || typeof field.value === 'string'
                                                    ? String(field.value)
                                                    : ''
                                            }>
                                            <SelectTrigger className='w-64'>
                                                <SelectValue placeholder='--Select Academic Year--' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadingYears ? (
                                                    <SelectItem value='loading' disabled>
                                                        Loading...
                                                    </SelectItem>
                                                ) : (
                                                    academicYearData?.data?.map((item: any) => (
                                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            {errors.asmaY_Id && (
                                <div className='flex w-full items-center justify-between gap-4'>
                                    <Label />
                                    <FormError>{errors.asmaY_Id.message}</FormError>
                                </div>
                            )}
                            <div className='flex w-full items-center justify-between gap-4'>
                                <Label className='whitespace-nowrap font-semibold'>
                                    {filterType === 'Staff' ? 'Staff Name' : 'Student Name'}

                                    <span className='ml-1 text-red-500'>*</span>
                                </Label>

                                {filterType === 'Staff' ? (
                                    <div className='relative w-64'>
                                        <InputText
                                            id='staffSearchInput'
                                            type='text'
                                            placeholder='Search Staff...'
                                            disabled={!selectedAsmayId}
                                            value={staffSearch}
                                            onChange={(e) => {
                                                setStaffSearch(e.target.value);
                                                setSelectedStaff(null);
                                            }}
                                            className='flex rounded-md border border-gray-300 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            autoComplete='off'
                                        />

                                        {staffSearch.trim() !== '' && !selectedStaff && (
                                            <ul className='absolute top-full left-0 z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow-md'>
                                                {staff.length === 0 ? (
                                                    <li className='px-3 py-2 text-gray-500'>No Staff found</li>
                                                ) : (
                                                    staff.map((staff) => (
                                                        <li
                                                            key={staff.amst_Id}
                                                            onClick={() => {
                                                                setSelectedStaff(staff);
                                                                setStaffSearch(staff.amsT_StudentName);
                                                            }}
                                                            className='cursor-pointer px-3 py-2 hover:bg-blue-100'>
                                                            {staff.amsT_StudentName}
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Controller
                                        name='amst_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                key={field.value || 'empty'}
                                                onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    setSelectedStudent(id);
                                                }}
                                                value={
                                                    typeof field.value === 'number' || typeof field.value === 'string'
                                                        ? String(field.value)
                                                        : ''
                                                }>
                                                <SelectTrigger className='w-64'>
                                                    <SelectValue placeholder='--Select Student Name--' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {students?.map((item: IStudentSearchList) => (
                                                        <SelectItem key={item.amst_Id} value={item.amst_Id.toString()}>
                                                            {item.amsT_StudentName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Term + Options */}
                        <div className='mt-3 flex gap-6'>
                            <div className='flex w-40 flex-col space-y-6'>
                                <div className='flex items-center space-x-2'>
                                    <Label className='font-semibold'>Term Name :</Label>
                                </div>
                            </div>

                            <div className='w-80'>
                                <FeesCustomMultiSelectBox
                                    options={terms.map((ex) => ({
                                        label: ex.fmG_GroupName,
                                        value: ex.fmT_Id.toString()
                                    }))}
                                    isLoading={loadingTerm}
                                    disabled={amountCheck || filterType === 'Chal_no'}
                                    value={selectedTerm}
                                    onChange={handleTermChange}
                                    height='150px'
                                />
                            </div>
                        </div>
                    </div>
                    {filterType === 'Staff' && selectedStaff != null ? (
                        <div className='max-h-[250px] overflow-auto rounded border bg-gray-50 p-4 shadow-inner' style={{ width: '30%' }}>
                            <h3 className='mb-2 font-bold text-lg'>Staff Information</h3>
                            <div className='flex min-w-[220px] max-w-[300px] flex-[1] flex-col items-center'>
                                <Card className='w-full p-0 shadow'>
                                    <div className='mt-1 px-4 pb-5 font-semibold text-xs'>
                                        <div className='grid grid-cols-2 gap-x-5 gap-y-3 border-gray-300 border-t pt-3 '>
                                            <div>Name</div>
                                            <div className='text-gray-700'>: {'RITA'}</div>

                                            <div>Code</div>
                                            <div className='text-gray-700'>: {'VSS123'}</div>

                                            <div>Department</div>
                                            <div className='text-gray-700'>: {'General'}</div>

                                            <div>Designation</div>
                                            <div className='text-gray-700'>: {'Teacher'}</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        filterType === 'Others' &&
                        selectedStudent != null && (
                            <div
                                className='max-h-[250px] overflow-auto rounded border bg-gray-50 p-4 shadow-inner'
                                style={{ width: '30%' }}>
                                <h3 className='mb-2 font-bold text-lg'>Student Information</h3>
                                <div className='flex min-w-[220px] max-w-[300px] flex-[1] flex-col items-center'>
                                    <Card className='w-full p-0 shadow'>
                                        <div className='mt-1 px-4 pb-5 font-semibold text-xs'>
                                            <div className='grid grid-cols-2 gap-x-5 gap-y-3 border-gray-300 border-t pt-3 '>
                                                <div>Name</div>
                                                <div className='text-gray-700'>: {'KEERTHI BHUSHAN REDDY GS'}</div>

                                                <div>MobileNo</div>
                                                <div className='text-gray-700'>
                                                    : {'VII'} / {'A'}
                                                </div>

                                                <div>Email-Id</div>
                                                <div className='text-gray-700'>: {'test@gmail.com'}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )
                    )}
                </div>
                {selectedTerm.length > 0 ? (
                    <Card className='p-4'>
                        <table className='w-full border text-center text-sm'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className='border p-2'>Sl.No</th>
                                    <th className='border p-2'>
                                        <Checkbox checked={selectAll} onCheckedChange={(val) => handleSelectAll(val === true)} />
                                    </th>
                                    <th className='border p-2'>Fee Head</th>
                                    <th className='border p-2'>Installment</th>
                                    <th className='border p-2'>Current Charges</th>
                                    <th className='border p-2'>Total Adjusted</th>
                                    <th className='border p-2'>Total Charges</th>
                                    <th className='border p-2'>Concession</th>
                                    <th className='border p-2'>Opening Balance</th>
                                    <th className='border p-2'>Payable Amount</th>
                                    <th className='border p-2'>Net Amount</th>
                                    <th className='border p-2'>Rebate Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                {staticHeadData.map((f, index) => (
                                    <tr key={f.fmA_Id}>
                                        <td className='border p-2'>{index + 1}</td>
                                        <td className='border p-2'>
                                            <Checkbox
                                                checked={selectedHeads[f.fmA_Id] || false}
                                                onCheckedChange={(val) => toggleRow(f.fmA_Id, val === true)}
                                            />
                                        </td>

                                        <td className='border p-2'>{f.fmG_GroupName}</td>
                                        <td className='border p-2'>{f.ftI_Name}</td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={currentCharges[f.fmA_Id] ?? f.fsS_CurrentYrCharges ?? ''}
                                                disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setCurrentCharges((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setCurrentCharges((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={toatlAdjusted[f.fmA_Id] ?? f.fsS_AdjustedAmount ?? ''}
                                                // disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setToatlAdjusted((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setToatlAdjusted((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={totalCharges[f.fmA_Id] ?? f.fsS_TotalToBePaid ?? ''}
                                                disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setTotalCharges((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setTotalCharges((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={concession[f.fmA_Id] ?? f.fsS_ConcessionAmount ?? ''}
                                                disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;

                                                    if (v === '') {
                                                        setConcession((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setConcession((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={openingBalance[f.fmA_Id] ?? f.fsS_OBAsPerFY ?? ''}
                                                disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setOpeningBalance((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setOpeningBalance((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={payableAmount[f.fmA_Id] ?? f.fsS_ToBePaid ?? ''}
                                                disabled={!selectedHeads[f.fmA_Id]}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setPayableAmount((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setPayableAmount((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={netAmount[f.fmA_Id] ?? f.fsS_CurrentYrCharges ?? ''}
                                                disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setNetAmount((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setNetAmount((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                        <td className='border p-2'>
                                            <input
                                                type='number'
                                                value={rebateAmount[f.fmA_Id] ?? f.fsS_RebateAmount ?? ''}
                                                disabled
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    if (v === '') {
                                                        setRebateAmount((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: ''
                                                        }));
                                                        return;
                                                    }
                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                        setRebateAmount((prev) => ({
                                                            ...prev,
                                                            [f.fmA_Id]: v
                                                        }));
                                                    }
                                                }}
                                                className='w-full rounded border px-2 py-1 font-semibold text-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 '
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                ) : (
                    <Card className='p-4 text-center text-gray-700'>No Fee Head Details Found</Card>
                )}
                {selectedTerm.length > 0 && (
                    <div className='flex gap-8'>
                        <div className='max-h-[400px] w-[75%] overflow-auto rounded border bg-gray-50 p-3 shadow-inner'>
                            {/* <Card className='mb-5 p-4'>
                                <div className='flex w-full flex-col items-start justify-center gap-4'>
                                    <div className='flex w-full items-center justify-center gap-4'>
                                        <Label htmlFor='narrationId' className='whitespace-nowrap font-semibold'>
                                            Narration
                                        </Label>
                                        <Controller
                                            name='narrationId'
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    key={field.value || 'empty'}
                                                    onValueChange={(val) => {
                                                        const id = Number(val);
                                                        field.onChange(id);
                                                        setSelectedNarration(id);
                                                    }}
                                                    value={selectedNarration?.toString()}
                                                    // disabled={feeSectionDataLoading}
                                                >
                                                    <SelectTrigger className='w-64'>
                                                        <SelectValue placeholder='Select Narration' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {masternarration?.map((item) => (
                                                            <SelectItem key={item.fmnaR_Id} value={String(item.fmnaR_Id)}>
                                                                {item.fmnaR_Narration}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <InputText
                                            id='remark'
                                            value={narrationRemark}
                                            onChange={(e) => setNarrationRemark(e.target.value)}
                                            placeholder='Enter Narration'
                                            className='flex transition-colors focus:ring-2 focus:ring-primary/20'
                                        />
                                    </div>

                                    <div className='flex w-full items-center justify-center gap-4'>
                                        <RadioGroup
                                            value={modeType}
                                            onValueChange={(v) => {
                                                setModeType(v);
                                                setchequeDates({});
                                            }}
                                            className='flex items-center justify-center gap-6'>
                                            <div className='flex cursor-pointer items-center justify-center space-x-2'>
                                                <RadioGroupItem value='Single' id='single' />
                                                <Label htmlFor='single' className='text-sm'>
                                                    Single
                                                </Label>
                                            </div>
                                            <div className='flex cursor-pointer items-center justify-center space-x-2'>
                                                <RadioGroupItem value='Multiple' id='multiple' />
                                                <Label htmlFor='multiple' className='text-sm'>
                                                    Multiple
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </Card> */}

                            {paymentDataArray.length > 0 ? (
                                <Card className='p-4'>
                                    <table className='w-full border text-sm'>
                                        <thead className='bg-gray-100'>
                                            <tr>
                                                <th className='border p-2'> </th>
                                                <th className='border p-2'>Type</th>
                                                <th className='border p-2'>Cheque/DD Date</th>
                                                <th className='border p-2'>Cheque/DD No./Card No</th>
                                                <th className='border p-2'>Bank Name</th>
                                                <th className='border p-2'>Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paymentDataArray?.map((f) => (
                                                <tr key={f.ivrmmoD_Id}>
                                                    <td className='border p-2'>
                                                        {modeType === 'Single' && (
                                                            <RadioGroup
                                                                value={payType}
                                                                onValueChange={(v) => {
                                                                    setPayType(v);
                                                                }}>
                                                                <RadioGroupItem
                                                                    value={f.ivrmmoD_ModeOfPayment}
                                                                    id={f.ivrmmoD_ModeOfPayment}
                                                                />
                                                            </RadioGroup>
                                                        )}
                                                        {modeType === 'Multiple' && (
                                                            <Checkbox
                                                                checked={checkPayType.includes(f.ivrmmoD_ModeOfPayment)}
                                                                onCheckedChange={(value) => {
                                                                    if (value) {
                                                                        setCheckPayType((prev) => [...prev, f.ivrmmoD_ModeOfPayment]);
                                                                    } else {
                                                                        if (
                                                                            checkPayType.length === 1 &&
                                                                            checkPayType.includes(f.ivrmmoD_ModeOfPayment)
                                                                        ) {
                                                                            toast.warning('At least one should be selected');
                                                                            return;
                                                                        }
                                                                        setCheckPayType((prev) =>
                                                                            prev.filter((b) => b !== f.ivrmmoD_ModeOfPayment)
                                                                        );
                                                                    }
                                                                }}
                                                                aria-label='Select row'
                                                            />
                                                        )}
                                                    </td>
                                                    <td className='border p-2 font-semibold'>{f.ivrmmoD_ModeOfPayment}</td>
                                                    <td className='border p-2'>
                                                        {f.ivrmmoD_Flag.toLowerCase() !== 'c' &&
                                                            modeType === 'Single' &&
                                                            payType === f.ivrmmoD_ModeOfPayment && (
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant='outline'
                                                                            className='w-full justify-start text-left font-normal'
                                                                            disabled={
                                                                                payType !== f.ivrmmoD_ModeOfPayment && modeType === 'Single'
                                                                            }>
                                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                                            {payType === f.ivrmmoD_ModeOfPayment &&
                                                                            !chequedates[f.ivrmmoD_Id]
                                                                                ? format(new Date(), 'PPP')
                                                                                : chequedates[f.ivrmmoD_Id]
                                                                                  ? format(chequedates[f.ivrmmoD_Id]!, 'PPP')
                                                                                  : 'Select Date'}
                                                                        </Button>
                                                                    </PopoverTrigger>

                                                                    <PopoverContent className='w-auto p-0' align='start'>
                                                                        <Calendar
                                                                            mode='single'
                                                                            selected={chequedates[f.ivrmmoD_Id] ?? undefined}
                                                                            onSelect={(date) =>
                                                                                setchequeDates((prev) => ({
                                                                                    ...prev,
                                                                                    [f.ivrmmoD_Id]: date ?? null
                                                                                }))
                                                                            }
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        {checkPayType.includes(f.ivrmmoD_ModeOfPayment) &&
                                                            modeType === 'Multiple' &&
                                                            f.ivrmmoD_Flag.toLowerCase() !== 'c' && (
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant='outline'
                                                                            className='w-full justify-start text-left font-normal'>
                                                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                                                            {!chequedates[f.ivrmmoD_Id]
                                                                                ? format(new Date(), 'PPP')
                                                                                : chequedates[f.ivrmmoD_Id]
                                                                                  ? format(chequedates[f.ivrmmoD_Id]!, 'PPP')
                                                                                  : 'Select Date'}
                                                                        </Button>
                                                                    </PopoverTrigger>

                                                                    <PopoverContent className='w-auto p-0' align='start'>
                                                                        <Calendar
                                                                            mode='single'
                                                                            selected={chequedates[f.ivrmmoD_Id] ?? undefined}
                                                                            onSelect={(date) =>
                                                                                setchequeDates((prev) => ({
                                                                                    ...prev,
                                                                                    [f.ivrmmoD_Id]: date ?? null
                                                                                }))
                                                                            }
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                    </td>
                                                    <td className='border p-2'>
                                                        {f.ivrmmoD_Flag.toLowerCase() !== 'c' && modeType === 'Single' && (
                                                            <InputText
                                                                type='number'
                                                                value={chequeNo?.[f.ivrmmoD_Id] ?? ''}
                                                                onChange={(e) => {
                                                                    const v = e.target.value;
                                                                    if (v === '') {
                                                                        setChequeNo((prev) => ({
                                                                            ...prev,
                                                                            [f.ivrmmoD_Id]: ''
                                                                        }));
                                                                        return;
                                                                    }
                                                                    if (/^\d*\.?\d*$/.test(v)) {
                                                                        setChequeNo((prev) => ({
                                                                            ...prev,
                                                                            [f.ivrmmoD_Id]: v
                                                                        }));
                                                                    }
                                                                }}
                                                                className='flex rounded-md border border-gray-300 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                                disabled={payType !== f.ivrmmoD_ModeOfPayment}
                                                            />
                                                        )}
                                                        {checkPayType.includes(f.ivrmmoD_ModeOfPayment) &&
                                                            modeType === 'Multiple' &&
                                                            f.ivrmmoD_Flag.toLowerCase() !== 'c' && (
                                                                <InputText
                                                                    type='number'
                                                                    value={chequeNo?.[f.ivrmmoD_Id] ?? ''}
                                                                    onChange={(e) => {
                                                                        const v = e.target.value;
                                                                        if (v === '') {
                                                                            setChequeNo((prev) => ({
                                                                                ...prev,
                                                                                [f.ivrmmoD_Id]: ''
                                                                            }));
                                                                            return;
                                                                        }
                                                                        if (/^\d*\.?\d*$/.test(v)) {
                                                                            setChequeNo((prev) => ({
                                                                                ...prev,
                                                                                [f.ivrmmoD_Id]: v
                                                                            }));
                                                                        }
                                                                    }}
                                                                    className='flex rounded-md border border-gray-300 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                                />
                                                            )}
                                                    </td>

                                                    <td className='border p-2'>
                                                        {f.ivrmmoD_Flag.toLowerCase() !== 'c' && modeType === 'Single' && (
                                                            <Select
                                                                value={selectedBanks[f.ivrmmoD_Id] || ''}
                                                                onValueChange={(val) =>
                                                                    setSelectedBanks((prev) => ({
                                                                        ...prev,
                                                                        [f.ivrmmoD_Id]: val
                                                                    }))
                                                                }>
                                                                <SelectTrigger className='w-full'>
                                                                    <SelectValue placeholder='Select Bank' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {isLoadingmasterBanks ? (
                                                                        <SelectItem value='loading' disabled>
                                                                            Loading...
                                                                        </SelectItem>
                                                                    ) : (
                                                                        masterBanks.map((item) => (
                                                                            <SelectItem
                                                                                key={item.fmbanK_Id}
                                                                                value={item.fmbanK_Id.toString()}>
                                                                                {item.fmbanK_BankName}
                                                                            </SelectItem>
                                                                        ))
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        {modeType === 'Multiple' && f.ivrmmoD_Flag.toLowerCase() !== 'c' && (
                                                            <Select
                                                                value={selectedBanks[f.ivrmmoD_Id] || ''}
                                                                onValueChange={(val) =>
                                                                    setSelectedBanks((prev) => ({
                                                                        ...prev,
                                                                        [f.ivrmmoD_Id]: val
                                                                    }))
                                                                }>
                                                                <SelectTrigger className='w-full'>
                                                                    <SelectValue placeholder='Select Bank' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {isLoadingmasterBanks ? (
                                                                        <SelectItem value='loading' disabled>
                                                                            Loading...
                                                                        </SelectItem>
                                                                    ) : (
                                                                        masterBanks.map((item) => (
                                                                            <SelectItem
                                                                                key={item.fmbanK_Id}
                                                                                value={item.fmbanK_Id.toString()}>
                                                                                {item.fmbanK_BankName}
                                                                            </SelectItem>
                                                                        ))
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </td>
                                                    <td className='border p-2'>
                                                        <InputText
                                                            type='number'
                                                            value={amount?.[f.ivrmmoD_Id] ?? ''}
                                                            onChange={(e) => {
                                                                const v = e.target.value;
                                                                if (v === '') {
                                                                    setAmount((prev) => ({
                                                                        ...prev,
                                                                        [f.ivrmmoD_Id]: ''
                                                                    }));
                                                                    return;
                                                                }
                                                                if (/^\d*\.?\d*$/.test(v)) {
                                                                    setAmount((prev) => ({
                                                                        ...prev,
                                                                        [f.ivrmmoD_Id]: v
                                                                    }));
                                                                }
                                                            }}
                                                            className='flex rounded-md border border-gray-300 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card>
                            ) : (
                                <Card className='p-4 text-center text-gray-700'>No Mode of Payment is Data Available</Card>
                            )}
                        </div>
                        <div className='max-h-[400px] w-[25%] overflow-auto rounded border bg-gray-50 p-4 shadow-inner'>
                            <Card className='mb-4 grid grid-cols-1 gap-3 p-4 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Current Fee:</span>
                                    <span className='font-semibold text-gray-900'>{1000}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Concession:</span>
                                    <span className='font-semibold text-gray-900'>{40000}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Outstanding:</span>
                                    <span className='font-semibold text-gray-900'>{0}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Fine:</span>
                                    <span className='font-semibold text-gray-900'>{0}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Now Paying:</span>
                                    <span className='font-semibold text-gray-900'>{1000}</span>
                                </div>
                            </Card>

                            <Card className='grid grid-cols-1 gap-3 p-4 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Payable:</span>
                                    <span className='font-semibold text-gray-900'>{120000}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Concession:</span>
                                    <span className='font-semibold text-gray-900'>{5000}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Waived off:</span>
                                    <span className='font-semibold text-gray-900'>{2000}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Overall Outstanding:</span>
                                    <span className='font-semibold text-gray-900'>{3500}</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {selectedTerm.length > 0 && (
                    <div className='flex justify-end gap-3 border-t pt-4'>
                        <Button type='button' variant='outline' className='flex items-center gap-2' onClick={handleReset}>
                            <RotateCcw className='h-4 w-4' /> Reset
                        </Button>

                        <Button type='submit' disabled={isSubmitting}>
                            <Save className='mr-2 h-4 w-4' /> Save
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
