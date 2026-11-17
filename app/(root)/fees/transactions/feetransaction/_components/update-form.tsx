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
import { Input } from '@/components/ui/input';
import { useStudentClassDropDown, useStudentSectionDropDown } from '@/hooks/fees/useMasters';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { useFeeMasterConfiguration, useFeeTransactionList } from '@/hooks/fees/useTrasactions';
import { feesStudentTransactionUpdateSchema } from '@/schemas/fees/trasactions';
import {
    getFeeHead,
    getStudentDetails,
    masterBank,
    saveFeeTransaction,
    searchStudentName,
    updateFeeStudentTransactionDetails
} from '@/server/fees/trasactions/fee_student_transaction';
import type {
    IFeeTDetails,
    IFeeTermDetails,
    IStudentSearchList,
    IStudentTDetails,
    IStudentTermList,
    Ifeetransaction,
    MasterModeofPayment,
    MasterNarration,
    masterBankList
} from '@/types/fees/transactions/transactions';
import type { z } from 'zod';
import FeeDetails from './fee-head-column';
import StudentProfileModal from './student-details';

type FormFields = z.infer<typeof feesStudentTransactionUpdateSchema.addOrUpdate>;

interface updateFeestudentTrasactionsFormProps {
    onSuccess?: () => void;
    asmayId?: number;
    selectedRow: Ifeetransaction;
}

export default function UpdateStudentFeeTransaction({ onSuccess, asmayId, selectedRow }: updateFeestudentTrasactionsFormProps) {
    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();
    const { refetchAll } = useFeeTransactionList(Number(asmayId));
    if (loadingYears) {
        return <div className='flex items-center justify-center p-8'>Loading academic year data...</div>;
    }

    const [preSelectedTerm, setPreSelectedTerm] = useState<any[]>([]);
    const [HeadofUpdate, setHeadofUpdate] = useState<any[]>([]);
    const {
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesStudentTransactionUpdateSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: 0
        }
    });

    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const [selectedclassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [students, setStudents] = useState<IStudentSearchList[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<IStudentSearchList | null>(null);
    const [selectedTerm, setselectedTerm] = useState<string[]>([]);
    const [terms, setTerms] = useState<IStudentTermList[]>([]);
    const [loadingTerm, setLoadingTerm] = useState(false);
    const [studentDetails, SetStudentDetails] = useState<IStudentTDetails[]>([]);
    const [feeDetails, SetFeeDetails] = useState<IFeeTDetails[]>([]);
    const [studentUserNameDetails, SetStudentUserNameDetails] = useState<IFeeTDetails[]>([]);
    // const [studentAmountDetails, SetStudentAmountDetails] = useState<IFeeTDetails[]>([]);
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
    const [openStudentDetails, setOpenStudentDetails] = useState(false);
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
    const [filterType, setFilterType] = useState('regular');
    const [payType, setPayType] = useState<string>('');

    const [checkPayType, setCheckPayType] = useState<string[]>(['']);
    const [searchByLet, setSearchByLetters] = useState('2');
    const [selectedBanks, setSelectedBanks] = useState<Record<number, string>>({});
    const [left, setLeft] = useState(false);
    const [deactive, setDeative] = useState(false);
    const [classs, setClass] = useState(false);
    const [section, setSection] = useState(false);
    const [amountCheck, setAmountCheck] = useState(false);
    const [amountforTerm, setAmountforTerm] = useState('');
    const [selectAll, setSelectAll] = useState(true);
    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(false);
    const [openFeeDetails, setOpenFeeDetails] = useState(false);
    const [challenSearch, setChallenSearch] = useState('');
    const [todaysDate, setTodaysDate] = useState<Date | undefined>(new Date());
    const [selectedNarration, setSelectedNarration] = useState<number | null>(null);
    const [narrationRemark, setNarrationRemark] = useState('');
    const [masterBanks, setMasterBanks] = useState<masterBankList[]>([]);
    const [isLoadingmasterBanks, setIsLoadingMasterBanks] = useState(false);

    const filterOptions = [
        { value: 'regular', label: 'Regular' },
        { value: 'Chal_no', label: 'Challan No.' },
        { value: 'regno', label: 'Reg No' },
        { value: 'admno', label: 'Adm No' },
        { value: 'nameadmno', label: 'Name:Adm.No.' },
        { value: 'nameregno', label: 'Name:Reg.No.' },
        { value: 'father', label: 'Father Name' },
        { value: 'mother', label: 'Mother Name' },
        { value: 'mobile', label: 'Mobile No' }
    ];

    const searchByLetters = [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' }
    ];

    const selectedLabel = filterOptions.find((opt) => opt.value === filterType)?.label || '';

    const { data: masterConfiguration } = useFeeMasterConfiguration();

    const config = masterConfiguration?.data?.[0]?.fmC_AutoReceiptFeeGroupFlag ?? 0;
    // console.log("masterConfiguration", masterConfiguration);
    // console.log("config", config);

    useEffect(() => {
        if (!selectedRow || !academicYearData) return;

        const fullName = `${selectedRow.amsT_FirstName} ${selectedRow.amsT_MiddleName} ${selectedRow.amsT_LastName}`.trim();

        setSelectedAsmayId(selectedRow.asmaY_ID);
        setStudentSearch(fullName);

        // Use setValue instead of reset
        setValue('asmaY_Id', selectedRow.asmaY_ID);
        setValue('studentSearchName', fullName);
    }, [selectedRow, setValue, academicYearData]);

    useEffect(() => {
        setStudentSearch('');
        setChallenSearch('');
        setTerms([]);
        SetStudentDetails([]);
        SetFeeDetails([]);
        setselectedTerm([]);
    }, [selectedAsmayId, selectedclassId, selectedSectionId, filterType]);

    useEffect(() => {
        setSelectedClassId(0);
        setSelectedSectionId(0);
    }, [classs, section]);

    useEffect(() => {
        setselectedTerm([]);
        setTerms([]);
    }, [studentSearch]);

    useEffect(() => {
        setFeeHeads([]);
        setSelectedHeads([]);
        setSelectedNarration(null);
        setSelectAll(false);
        setPayableAmount({});
        setToatlAdjusted({});
    }, [selectedTerm]);

    useEffect(() => {
        if (!amountCheck) setselectedTerm([]);
        if (!amountCheck) setAmountforTerm('');
    }, [amountCheck]);

    const { data: feeclassData, isLoading: feeclassDataLoading } = useStudentClassDropDown(classs);

    const { data: feeSectionData, isLoading: feeSectionDataLoading } = useStudentSectionDropDown(section);

    useEffect(() => {
        if (!studentSearch.trim()) {
            setStudents([]);
            return;
        }

        const fetchStudents = async () => {
            setLoadingStudents(true);
            try {
                const payload = {
                    asmaY_Id: selectedAsmayId,
                    filterinitialdata: filterType,
                    searchfilter: studentSearch,
                    asmcL_ID: selectedclassId ?? 0,
                    asmS_Id: selectedSectionId ?? 0,
                    amsT_SOL: 'string'
                };
                const studentsArray = await searchStudentName(payload);
                const studentsData = JSON.parse(JSON.stringify(studentsArray.feeStudentSearch || []));
                setStudents(studentsData || []);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudents();
    }, [studentSearch]);

    useEffect(() => {
        // if (!selectedStudent) {
        //     setTerms([]);
        //     SetStudentDetails([]);
        //     SetFeeDetails([]);
        //     return;
        // }
        const fetchStudentsDetails = async () => {
            setLoadingTerm(true);
            try {
                const payload = {
                    amst_Id: selectedRow.amst_Id,
                    filterinitialdata: filterType,
                    // configset: 'T',
                    autoReceiptFlag: true,
                    asmaY_Id: selectedRow.asmaY_ID
                };
                const termArray = await getStudentDetails(payload);
                const termList = JSON.parse(JSON.stringify(termArray.masterGroupDetails || []));
                setTerms(termList || []);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                setTerms([]);
            } finally {
                setLoadingTerm(false);
            }
        };
        fetchStudentsDetails();
    }, [selectedRow]);

    useEffect(() => {
        if (!selectedTerm || selectedTerm.length === 0) {
            setFeeHeads([]);
            return;
        }

        const fetchFeeHeadDetails = async () => {
            setLoadingFeeHead(true);

            try {
                const payload = {
                    filterinitialdata: filterType,
                    amst_Id: selectedStudent?.amst_Id,
                    asmaY_Id: selectedAsmayId,
                    configset: '',
                    multiplegroups: selectedTerm.toString(),
                    fyP_Date: todaysDate
                };
                const termListArray = await getFeeHead(payload);
                const feeDetails = JSON.parse(JSON.stringify(termListArray.feeStudentTermInfo || []));
                const narrationDropDown = JSON.parse(JSON.stringify(termListArray.masterNarrations || []));
                const modeofPaymentList = JSON.parse(JSON.stringify(termListArray.modeOfPaymentDTOs || []));
                // setFeeHeads(feeDetails || []);
                setMasternarration(narrationDropDown || []);
                setMasterModeofPaymentList(modeofPaymentList || []);

                setPayType(modeofPaymentList[0]?.ivrmmoD_ModeOfPayment ?? '');
                setCheckPayType(modeofPaymentList[0]?.ivrmmoD_ModeOfPayment ?? '');
            } catch (error) {
                console.error('Failed to fetch fee heads:', error);
                setFeeHeads([]);
            } finally {
                setLoadingFeeHead(false);
            }
        };

        fetchFeeHeadDetails();
    }, []);

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
    const [Total, setTotal] = useState<number>(0);
    useEffect(() => {
        const UpdateStudentsDetails = async () => {
            try {
                const payload = {
                    asmaY_Id: selectedRow.asmaY_ID,
                    amst_Id: selectedRow.amst_Id,
                    fyP_Id: selectedRow.fyP_Id
                };
                const array = await updateFeeStudentTransactionDetails(payload);
                const student = JSON.parse(JSON.stringify(array.filusernames || []));
                const feeDetails = JSON.parse(JSON.stringify(array.showstaticticsdetails || []));
                const PreSelectedtermList = JSON.parse(JSON.stringify(array.fillmastergroup || []));
                const feeHeads = JSON.parse(JSON.stringify(array.receiparraydeleteall || []));
                const bank = JSON.parse(JSON.stringify(array.editBankDetails || []));
                const narration = JSON.parse(JSON.stringify(array.narrationlists || []));
                const modeofPayment = JSON.parse(JSON.stringify(array.fetchmodeofpayments || []));
                setPreSelectedTerm(PreSelectedtermList || []);
                setMasterModeofPaymentList(modeofPayment || []);
                SetStudentDetails(student || []);
                SetFeeDetails(feeDetails || []);
                SetStudentUserNameDetails(student || []);
                setHeadofUpdate(feeHeads || []);
                setMasterBanks(bank || []);
                setMasternarration(narration || []);
                // console.log("feeHeads", feeHeads);
                // console.log("HeadofUpdate", HeadofUpdate);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                setPreSelectedTerm([]);
            } finally {
                // setLoadingTerm(false);
            }
        };
        UpdateStudentsDetails();
    }, [selectedRow, HeadofUpdate, feeDetails, studentDetails, masterBanks, masternarration, preSelectedTerm, Total]);

    useEffect(() => {
        if (terms.length === 0) return;
        const preSelectedIds = preSelectedTerm.map((item) => String(item.fmG_Id));
        const matchedTerms = terms.filter((term) => preSelectedIds.includes(String(term.fmG_Id))).map((term) => String(term.fmG_Id));
        // console.log("matchedTerms", matchedTerms);
        setselectedTerm(matchedTerms);
    }, [terms, preSelectedTerm]);

    useEffect(() => {
        if (masterBanks.length === 0) return;

        const initialSelectedBanks: Record<number, string> = {};
        masterModeofPaymentList.forEach((paymentMethod) => {
            const matchingBank = masterBanks.find((masterBank) => masterBank.fmbanK_BankName === paymentMethod.bank_Name);
            if (matchingBank && paymentMethod.ivrmmoD_Id) {
                initialSelectedBanks[paymentMethod.ivrmmoD_Id] = matchingBank.fmbanK_Id.toString();
            }
        });
        setSelectedBanks((prev) => ({
            ...prev,
            ...initialSelectedBanks
        }));
    }, [masterBanks, masterModeofPaymentList]);
    console.log('selectedBank', selectedBanks);

    const totalpaying = feeHeads.reduce((sum: number, f: any) => {
        const amount = Number.parseFloat(f.fsS_ToBePaid?.toString() || '0') || 0;
        return sum + amount;
    }, 0);

    console.log('totalpaying', totalpaying);

    // To see the updated value, use useEffect
    useEffect(() => {
        setTotal(totalpaying);
        console.log('Total updated:', Total);
    }, [Total, feeHeads]);
    const [modeType, setModeType] = useState<string>(masterModeofPaymentList.length === 1 ? 'Single' : 'Multiple');

    useEffect(() => {
        setModeType(masterModeofPaymentList.length === 1 ? 'Single' : 'Multiple');
    }, [masterModeofPaymentList]);

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
        if (selectedTerm.length === 0) return;
        setLoadingFeeHead(true);
        setFeeHeads(HeadofUpdate);
        setLoadingFeeHead(false);
    }, [HeadofUpdate, feeHeads]);

    useEffect(() => {
        const concession = feeHeads.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_ConcessionAmount.toString()) || 0;
            return sum + amount;
        }, 0);
        const totalconcession = feeDetails.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_ConcessionAmount.toString()) || 0;
            return sum + amount;
        }, 0);
        const totalWaivedOff = feeDetails.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_WaivedAmount.toString()) || 0;
            return sum + amount;
        }, 0);
        const totalPayable = feeDetails.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_TotalToBePaid.toString()) || 0;
            return sum + amount;
        }, 0);
        const overAllOutStanding = feeDetails.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_ToBePaid.toString()) || 0;
            return sum + amount;
        }, 0);
        const totalfine = feeDetails.reduce((sum, f) => {
            const amount = Number.parseFloat(f.fsS_FineAmount.toString()) || 0;
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
        setTotalConcession(totalconcession);
        settotalPayable(totalPayable);
        setTotalFine(totalfine);
        setoverAllOutStanding(overAllOutStanding);
        setTotalWaivedOff(totalWaivedOff);
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
    }, [selectedHeads, feeHeads, payableAmount, selectedRow]);

    const toggleRow = (id: number, checked: boolean) => {
        setSelectedHeads((prev) => {
            const updated = { ...prev, [id]: checked };
            if (!checked) {
                setSelectAll(false);
            } else {
                const allChecked = feeHeads.every((item) => updated[item.fmA_Id]);
                setSelectAll(allChecked);
            }

            return updated;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        const newState: Record<number, boolean> = {};
        feeHeads.forEach((f) => {
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

        const clickedIndex = orderedTerms.findIndex((t) => t.fmG_Id === clickedId);
        const isChecking = newlySelected.includes(clickedId);
        const isUnchecking = !isChecking;

        if (isChecking) {
            for (let i = 0; i < clickedIndex; i++) {
                const above = orderedTerms[i];
                const isEnabled = above.disablepaisterms === false || above.disablepaisterms === undefined;
                if (!isEnabled) continue;
                const isAboveSelected = newlySelected.includes(above.fmG_Id);
                if (!isAboveSelected) {
                    toast.warning('You have to select Terms in Order');
                    return;
                }
            }
        }

        if (isUnchecking) {
            for (let i = clickedIndex + 1; i < orderedTerms.length; i++) {
                const below = orderedTerms[i];
                const isBelowSelected = previouslySelected.includes(below.fmG_Id);
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
            checked: selectedValues.includes(ex.fmG_Id.toString())
        }));
        setTerms(updated);
    };

    const handleCheckboxChange = (checked: boolean, type: 'left' | 'deactive' | 'class' | 'section') => {
        if (type === 'left') {
            setLeft(checked);
        } else if (type === 'deactive') {
            setDeative(checked);
        } else if (type === 'class') {
            setClass(checked);
            if (!checked) {
                setSection(false);
            }
        } else if (type === 'section') {
            setSection(checked);
            if (checked) {
                setClass(true);
            } else {
                setClass(false);
            }
        }
    };

    const onSubmit = async () => {
        try {
            const savePaymentModes: any = [];
            masterModeofPaymentList.forEach((f) => {
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
                    fyppM_Id: f.fyppM_Id
                };
                savePaymentModes.push(payment);
            });

            const feeStudentTermInfos = feeHeads.map((fee) => ({
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
                fyP_Chq_Bounce: selectedRow.fyP_Chq_Bounce,
                fyP_Id: selectedRow.fyP_Id,
                asmaY_Id: selectedRow.asmaY_ID?.toString(),
                automanualreceiptno: '',
                auto_receipt_flag: config,
                fyP_Receipt_No: selectedRow.fyP_Receipt_No,
                fyPcurr_Date: todaysDate,
                fyP_Remarks: narrationRemark,
                savePaymentModes: savePaymentModes,
                feeStudentTermInfos: feeStudentTermInfos,
                returnval: '',
                displaymessage: '',
                amst_Id: selectedRow.amst_Id,
                fyP_Tot_Amount: Total,
                filterinitialdata: filterType,
                fyP_Tot_Concession_Amt: TotalConcession,
                fyP_Tot_Fine_Amt: Totalfine,
                fyP_Tot_Waived_Amt: TotalWaivedOff,
                fyP_PayModeType: '',
                smsconfig: sms,
                emailconfig: email
            };

            const response = await saveFeeTransaction(payload);

            if (response?.displaymessage) {
                toast.success(response.message || ' Transaction Updated successfully');
                handleReset();
                onSuccess?.();
                refetchAll();
            } else {
                const errorMessage = response?.returnval;
                if (typeof errorMessage === 'string' && errorMessage.trim() !== '') {
                    toast.error(errorMessage);
                } else {
                    toast.error('Save failed');
                }
            }
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error(err?.message || 'Something went wrong');
        }
        // toast.success("Fee Transaction Saved Successfully!");
        onSuccess?.();
    };

    const handleReset = () => {
        if (selectedRow) {
            reset({
                asmaY_Id: selectedRow.asmaY_ID,
                studentSearchName: `${selectedRow.amsT_FirstName} ${selectedRow.amsT_MiddleName} ${selectedRow.amsT_LastName}`
            });
        }
    };

    return (
        <div className='mx-auto max-w-7xl p-2'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='flex gap-8'>
                    <div className='max-h-[400px] overflow-auto rounded border bg-gray-50 p-3 shadow-inner' style={{ width: '30%' }}>
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
                        {filterType === 'regular' && (
                            <Card className='mt-5 w-full p-3 shadow'>
                                Search by (No. of letters) :
                                <RadioGroup value={searchByLet} onValueChange={setSearchByLetters}>
                                    <div className='grid grid-cols-5 gap-3'>
                                        {searchByLetters.map((item) => (
                                            <div key={item.value} className='flex items-center space-x-2'>
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className='cursor-pointer text-sm'>
                                                    {item.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </Card>
                        )}
                        <div className='grid grid-cols-2 gap-3 pt-4 '>
                            <div className='flex items-center space-x-2'>
                                <Checkbox id='left' checked={left} onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'left')} />
                                <Label htmlFor='left' className='cursor-pointer text-sm'>
                                    Left
                                </Label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id='deactive'
                                    checked={deactive}
                                    onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'deactive')}
                                />
                                <Label htmlFor='deactive' className='cursor-pointer text-sm'>
                                    Deactive
                                </Label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id='class'
                                    checked={classs}
                                    onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'class')}
                                />
                                <Label htmlFor='class' className='cursor-pointer text-sm'>
                                    Class Wise
                                </Label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id='section'
                                    checked={section}
                                    onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'section')}
                                />
                                <Label htmlFor='section' className='cursor-pointer text-sm'>
                                    Section Wise
                                </Label>
                            </div>
                        </div>
                        <div className=' flex w-full items-center space-x-4 pt-4 '>
                            <Label className='font-semibold'>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' className='w-full justify-start text-left font-normal' disabled>
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
                        {filterType === 'Chal_no' && (
                            <div className='flex w-full items-center space-x-4 pt-4'>
                                <Label className='font-semibold'>
                                    Challan No. :<span className='ml-1 text-red-500'>*</span>
                                </Label>

                                <InputText
                                    id='Chal_no'
                                    value={challenSearch}
                                    onChange={(e) => setChallenSearch(e.target.value)}
                                    placeholder='Enter Challan No'
                                    className='flex transition-colors focus:ring-2 focus:ring-primary/20'
                                />
                            </div>
                        )}
                        {challenSearch !== '' && (
                            <div className='flex justify-end gap-3 pt-4'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    className='flex items-center gap-2'
                                    onClick={() => setChallenSearch('')}>
                                    <RotateCcw className='h-4 w-4' /> Clear
                                </Button>

                                <Button
                                    onClick={() => {
                                        toast.warning('Challan No Not Found');
                                    }}>
                                    <Save className='mr-2 h-4 w-4' /> Search
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className='max-h-[600px] w-[40%] overflow-auto rounded border bg-gray-50 p-4 shadow-inner'>
                        {/* Academic Year */}
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
                                            disabled
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
                            {/* Class */}
                            {classs && (
                                <div className='flex w-full items-center justify-between gap-4'>
                                    <Label htmlFor='asmcl_Id' className='whitespace-nowrap font-semibold'>
                                        Class <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='asmcl_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                key={field.value || 'empty'}
                                                onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    setSelectedClassId(id);
                                                }}
                                                value={
                                                    typeof field.value === 'number' || typeof field.value === 'string'
                                                        ? String(field.value)
                                                        : ''
                                                }
                                                disabled={feeclassDataLoading}>
                                                <SelectTrigger className='w-64'>
                                                    <SelectValue placeholder='Select Class' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {feeclassData?.data?.map((item) => (
                                                        <SelectItem key={item.asmcL_Id} value={String(item.asmcL_Id)}>
                                                            {item.asmcL_ClassName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            )}
                            {errors.asmcl_Id && classs && (
                                <div className='flex w-full items-center justify-between gap-4'>
                                    <Label />
                                    <FormError>{errors.asmcl_Id.message}</FormError>
                                </div>
                            )}

                            {/* Section */}
                            {section && (
                                <div className='flex w-full items-center justify-between gap-4'>
                                    <Label htmlFor='asms_Id' className='whitespace-nowrap font-semibold'>
                                        Section <span className='text-red-500'>*</span>
                                    </Label>
                                    <Controller
                                        name='asms_Id'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                key={field.value || 'empty'}
                                                onValueChange={(val) => {
                                                    const id = Number(val);
                                                    field.onChange(id);
                                                    setSelectedSectionId(id);
                                                }}
                                                value={
                                                    typeof field.value === 'number' || typeof field.value === 'string'
                                                        ? String(field.value)
                                                        : ''
                                                }
                                                disabled={feeSectionDataLoading}>
                                                <SelectTrigger className='w-64'>
                                                    <SelectValue placeholder='Select Section' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {feeSectionData?.data?.map((item) => (
                                                        <SelectItem key={item.asmS_Id} value={String(item.asmS_Id)}>
                                                            {item.asmC_SectionName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            )}

                            {errors.asms_Id && section && (
                                <div className='flex w-full items-center justify-between gap-4'>
                                    <Label />
                                    <FormError>{errors.asms_Id.message}</FormError>
                                </div>
                            )}

                            {/* Student Name */}
                            <div className='flex w-full items-center justify-between gap-4'>
                                <Label className='whitespace-nowrap font-semibold'>
                                    {filterType === 'regular' || filterType === 'Chal_no' ? 'Student Name' : selectedLabel}

                                    <span className='ml-1 text-red-500'>*</span>
                                </Label>

                                <Controller
                                    name='studentSearchName'
                                    control={control}
                                    render={({ field }) => (
                                        <div className='relative w-64'>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                disabled
                                                className='flex rounded-md border border-gray-300 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                autoComplete='off'
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Term + Options */}
                        <div className='mt-3 flex gap-6'>
                            <div className='flex w-40 flex-col space-y-6'>
                                <div className='flex items-center space-x-2'>
                                    <Label className='font-semibold'>Term Name :</Label>
                                </div>

                                <div className='flex items-center space-x-6'>
                                    <Label>SMS</Label>
                                    <Checkbox checked={sms} onCheckedChange={(v) => setSms(v === true)} />
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <Label>EMAIL</Label>
                                    <Checkbox checked={email} onCheckedChange={(v) => setEmail(v === true)} />
                                </div>
                            </div>

                            <div className='w-80'>
                                <FeesCustomMultiSelectBox
                                    options={terms.map((ex) => ({
                                        label: ex.fmG_GroupName,
                                        value: ex.fmG_Id.toString()
                                    }))}
                                    isLoading={loadingTerm}
                                    disabled
                                    value={selectedTerm}
                                    onChange={handleTermChange}
                                    height='150px'
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className='mt-3'>
                            <div className='flex items-center gap-3'>
                                <Checkbox
                                    id='amount'
                                    checked={amountCheck}
                                    disabled
                                    onCheckedChange={(v) => {
                                        if (v === true && selectedTerm.length === 0) {
                                            toast.error('Kindly select atleast any one term');
                                            return;
                                        }
                                        setAmountCheck(v === true);
                                    }}
                                />

                                <Label>Amount {amountCheck && <span className='text-red-500'>*</span>}</Label>

                                <InputText
                                    id='amount'
                                    value={amountforTerm}
                                    onChange={(e) => setAmountforTerm(e.target.value)}
                                    placeholder='Enter Amount'
                                    className='flex transition-colors focus:ring-2 focus:ring-primary/20'
                                    disabled={!amountCheck}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='max-h-[400px] overflow-auto rounded border bg-gray-50 p-4 shadow-inner' style={{ width: '30%' }}>
                        <h3 className='mb-2 font-bold text-lg'>Student Information</h3>
                        <div className='flex min-w-[220px] max-w-[300px] flex-[1] flex-col items-center'>
                            <Card className='w-full p-0 shadow'>
                                <div className='flex justify-center p-4'>
                                    <div className='rounded-full border border-blue-300 p-1'>
                                        <img
                                            src={
                                                studentDetails?.[0]?.amsT_Photoname ??
                                                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                            }
                                            alt='Student'
                                            className='h-40 w-40 rounded-full object-cover'
                                        />
                                    </div>
                                </div>
                                <div className='flex items-center justify-between border-t px-3 py-2 font-semibold text-blue-700 text-sm'>
                                    <span
                                        className='flex cursor-pointer items-center gap-1 hover:underline'
                                        onClick={() => setOpenFeeDetails(true)}>
                                        Fee Details <span>➤</span>
                                    </span>

                                    <span
                                        className='flex cursor-pointer items-center gap-1 hover:underline'
                                        onClick={() => setOpenStudentDetails(true)}>
                                        Student Profile <span>➤</span>
                                    </span>
                                </div>

                                {studentDetails.length > 0 && (
                                    <div className='mt-1 px-4 pb-5 font-semibold text-xs'>
                                        <div className='grid grid-cols-2 gap-x-5 gap-y-3 border-gray-300 border-t pt-3 '>
                                            <div>STUDENT NAME</div>
                                            <div className='text-gray-700'>
                                                {studentDetails?.[0]?.amsT_FirstName || 'N/A'}
                                                {studentDetails?.[0]?.amsT_MiddleName && ` ${studentDetails[0].amsT_MiddleName}`}
                                                {studentDetails?.[0]?.amsT_LastName && ` ${studentDetails[0].amsT_LastName}`}
                                            </div>

                                            <div>CLASS / SECTION</div>
                                            <div className='text-gray-700'>
                                                {studentDetails?.[0]?.classname} / {studentDetails?.[0]?.sectionname}
                                            </div>

                                            <div>ADMISSION NUMBER</div>
                                            <div className='text-gray-700'>{studentDetails?.[0]?.amsT_AdmNo}</div>

                                            <div>MOBILE NUMBER</div>
                                            <div className='text-gray-700'>{studentDetails?.[0]?.amst_mobile}</div>

                                            <div>FATHER NAME</div>
                                            <div className='text-gray-700'>{studentDetails?.[0]?.fathername}</div>

                                            <div>USERNAME</div>
                                            <div className='text-gray-700'>{studentUserNameDetails?.[0]?.portalusername || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>

                {openFeeDetails && <FeeDetails onClose={() => setOpenFeeDetails(false)} data={feeDetails} loading={false} />}
                {openStudentDetails && (
                    <StudentProfileModal
                        isOpen={!!openStudentDetails}
                        onClose={() => setOpenStudentDetails(false)}
                        data={openStudentDetails}
                        loading={false}
                        amst_Id={selectedRow.amst_Id}
                        asmay_Id={selectedRow.asmaY_ID}
                    />
                )}

                {/* -------- FEE GRID -------- */}
                {loadingFeeHead ? (
                    <Card className='p-4 text-center text-gray-700'>Loading Fee Head Details...</Card>
                ) : selectedTerm.length > 0 && feeHeads.length > 0 ? (
                    <Card className='p-4'>
                        <table className='w-full border text-center text-sm'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className='border p-2'>Sl.No</th>
                                    <th className='border p-2'>
                                        <Checkbox checked={true} disabled onCheckedChange={(val) => handleSelectAll(val === true)} />
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
                                {feeHeads.map((f, index) => (
                                    <tr key={f.fmA_Id}>
                                        <td className='border p-2'>{index + 1}</td>
                                        <td className='border p-2'>
                                            <Checkbox
                                                checked={true}
                                                disabled
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
                {selectedTerm.length > 0 && !loadingFeeHead && feeHeads.length > 0 && (
                    <div className='flex gap-8'>
                        <div className='max-h-[400px] w-[75%] overflow-auto rounded border bg-gray-50 p-3 shadow-inner'>
                            <Card className='mb-5 p-4'>
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
                                                <RadioGroupItem value='Single' id='single' disabled />
                                                <Label htmlFor='single' className='text-sm'>
                                                    Single
                                                </Label>
                                            </div>
                                            <div className='flex cursor-pointer items-center justify-center space-x-2'>
                                                <RadioGroupItem value='Multiple' id='multiple' disabled />
                                                <Label htmlFor='multiple' className='text-sm'>
                                                    Multiple
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </Card>

                            {masterModeofPaymentList.length > 0 ? (
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
                                            {masterModeofPaymentList?.map((f) => (
                                                <tr key={f.ivrmmoD_Id}>
                                                    <td className='border p-2'>
                                                        {modeType === 'Single' && (
                                                            <RadioGroup
                                                                value={payType}
                                                                disabled
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
                                                                disabled
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
                                                        {f.ivrmmoD_Flag.toLowerCase() !== 'c' && modeType === 'Single' && (
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant='outline'
                                                                        className='w-full justify-start text-left font-normal'
                                                                        disabled>
                                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                                        {!chequedates[f.ivrmmoD_Id]
                                                                            ? format(f.bank_Date ?? new Date(), 'PPP')
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

                                                        {modeType === 'Multiple' && f.ivrmmoD_Flag.toLowerCase() !== 'c' && (
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant='outline'
                                                                        className='w-full justify-start text-left font-normal'>
                                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                                        {!chequedates[f.ivrmmoD_Id]
                                                                            ? format(f.bank_Date ?? new Date(), 'PPP')
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
                                                        {f.ivrmmoD_Flag.toLowerCase() !== 'c' && (
                                                            <InputText
                                                                type='number'
                                                                value={chequeNo?.[f.ivrmmoD_Id] ?? f.bank_No ?? ''}
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
                                                                                {item.fmbanK_BankName ?? f.bank_Name}
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
                                                            value={amount?.[f.ivrmmoD_Id] ?? f.bank_Amount ?? ''}
                                                            disabled
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
                                    <span className='font-semibold text-gray-900'>{TotalCurrentFee}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Concession:</span>
                                    <span className='font-semibold text-gray-900'>{ConcessionAmount}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Outstanding:</span>
                                    <span className='font-semibold text-gray-900'>{TotalOutStanding ?? 0}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Fine:</span>
                                    <span className='font-semibold text-gray-900'>{fineAmount}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Now Paying:</span>
                                    <span className='font-semibold text-gray-900'>{Total}</span>
                                </div>
                            </Card>

                            <Card className='grid grid-cols-1 gap-3 p-4 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Payable:</span>
                                    <span className='font-semibold text-gray-900'>{totalPayable}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Concession:</span>
                                    <span className='font-semibold text-gray-900'>{TotalConcession}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Total Waived off:</span>
                                    <span className='font-semibold text-gray-900'>{TotalWaivedOff}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-700'>Overall Outstanding:</span>
                                    <span className='font-semibold text-gray-900'>{overAllOutStanding}</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {selectedTerm.length > 0 && !loadingFeeHead && feeHeads.length > 0 && (
                    <div className='flex justify-end gap-3 border-t pt-4'>
                        <Button type='button' variant='outline' className='flex items-center gap-2' onClick={handleReset}>
                            <RotateCcw className='h-4 w-4' /> Reset
                        </Button>

                        <Button type='submit' disabled={isSubmitting}>
                            <Save className='mr-2 h-4 w-4' /> Update
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
