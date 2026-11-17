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
import { useStudentClassDropDown, useStudentSectionDropDown } from '@/hooks/fees/useMasters';
import { useFeeDefaulterReport } from '@/hooks/fees/useReports';
import { useFeeMasterConfiguration, useFeeTransactionList } from '@/hooks/fees/useTrasactions';
import { feesStudentTransactionSchema } from '@/schemas/fees/trasactions';
import {
    getFeeHead,
    getStudentDetails,
    masterBank,
    saveFeeTransaction,
    searchStudentName
} from '@/server/fees/trasactions/fee_student_transaction';
import type {
    IFeeTDetails,
    IFeeTermDetails,
    IStudentDisableList,
    IStudentSearchList,
    IStudentTDetails,
    IStudentTermList,
    MasterModeofPayment,
    MasterNarration,
    masterBankList
} from '@/types/fees/transactions/transactions';
import type { z } from 'zod';
import FeeDetails from './fee-head-column';
import StudentProfileModal from './student-details';

type FormFields = z.infer<typeof feesStudentTransactionSchema.addOrUpdate>;

interface FeestudentTrasactionsFormProps {
    onSuccess?: () => void;
    asmayId?: number;
}

export default function StudentFeeTransaction({ onSuccess, asmayId }: FeestudentTrasactionsFormProps) {
    const { refetchAll } = useFeeTransactionList(Number(asmayId));

    const {
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(feesStudentTransactionSchema.addOrUpdate),
        mode: 'onChange',
        defaultValues: {
            asmaY_Id: undefined
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
    const [disableTerms, setDisableTerms] = useState<IStudentDisableList[]>([]);
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
    const [searchByLet, setSearchByLetters] = useState('2');
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
    const [openFeeDetails, setOpenFeeDetails] = useState(false);

    const [openStudentDetails, setOpenStudentDetails] = useState(false);
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
        { value: 'AdmNo', label: 'Adm No' },
        { value: 'NameAdmno', label: 'Name:Adm.No.' },
        { value: 'NameRegNo', label: 'Name:Reg.No.' },
        { value: 'Fathername', label: 'Father Name' },
        { value: 'Mothername', label: 'Mother Name' },
        { value: 'MobileNo', label: 'Mobile No' }
    ];
    const searchByLetters = [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' }
    ];

    const selectedLabel = filterOptions.find((opt) => opt.value === filterType)?.label || '';

    const { data: academicYearData, isLoading: loadingYears } = useFeeDefaulterReport();

    const { data: masterConfiguration } = useFeeMasterConfiguration();

    const config = masterConfiguration?.data?.[0]?.fmC_AutoReceiptFeeGroupFlag ?? 0;
    // console.log("masterConfiguration", masterConfiguration);
    // console.log("config", config);

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

    const { data: feeclassData, isLoading: feeclassDataLoading } = useStudentClassDropDown(classs);

    const { data: feeSectionData, isLoading: feeSectionDataLoading } = useStudentSectionDropDown(section);

    const asmcLID = watch('asmcl_Id');
    const asmS_Id = watch('asms_Id');
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
                    filterinitialdata: left === true || deactive === true ? 'NameAdmno' : filterType,
                    searchfilter: studentSearch,
                    asmcL_ID: classs === true || section === true ? asmcLID : 0,
                    asmS_Id: section === true ? asmS_Id : 0,
                    amsT_SOL: left === true ? 'L' : deactive === true ? 'D' : 'S'
                };

                console.log('student details payload', JSON.stringify(payload));
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
        if (!selectedStudent) {
            setTerms([]);
            SetStudentDetails([]);
            SetFeeDetails([]);
            return;
        }
        const fetchStudentsDetails = async () => {
            setLoadingTerm(true);
            try {
                const payload = {
                    amst_Id: selectedStudent.amst_Id,
                    filterinitialdata: filterType,
                    // configset: 'T',
                    autoReceiptFlag: true,
                    asmaY_Id: selectedAsmayId
                };

                console.log('term details payload', JSON.stringify(payload));
                const termArray = await getStudentDetails(payload);
                const termList = JSON.parse(JSON.stringify(termArray.masterGroupDetails || []));
                const disableTerms = JSON.parse(JSON.stringify(termArray.termDetails || []));
                const studentDetails = JSON.parse(JSON.stringify(termArray.fillstudents || []));
                const feeDetails = JSON.parse(JSON.stringify(termArray.showstaticticsdetails || []));
                const studentUserNameArray = JSON.parse(JSON.stringify(termArray.filusernames || []));
                // const studentAmountDetails = JSON.parse(JSON.stringify(termArray.fillstudentviewdetails || []));
                setTerms(termList || []);
                setDisableTerms(disableTerms || []);
                SetStudentDetails(studentDetails || []);
                SetFeeDetails(feeDetails || []);
                SetStudentUserNameDetails(studentUserNameArray || []);
                // SetStudentAmountDetails(studentAmountDetails || []);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                setTerms([]);
            } finally {
                setLoadingTerm(false);
            }
        };
        fetchStudentsDetails();
    }, [selectedStudent]);

    useEffect(() => {
        if (terms.length === disableTerms.length && terms.length > 0) {
            const updatedTerms = [...terms];
            for (let i = 0; i < terms.length; i++) {
                const matchingTerm = disableTerms.find((dt) => dt.fmtId === terms[i].fmT_Id);
                if (matchingTerm && matchingTerm.netAmount <= matchingTerm.paid) {
                    updatedTerms[i].disablepaisterms = true;
                } else {
                    updatedTerms[i].disablepaisterms = false;
                }
            }
            setTerms(updatedTerms);
        }
    }, [disableTerms]);

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
                setFeeHeads(feeDetails || []);
                setMasternarration(narrationDropDown || []);
                setMasterModeofPaymentList(modeofPaymentList || []);

                setPayType(modeofPaymentList[0]?.ivrmmoD_ModeOfPayment ?? '');
                // setCheckPayType(modeofPaymentList[0]?.ivrmmoD_ModeOfPayment ?? '');
            } catch (error) {
                console.error('Failed to fetch fee heads:', error);
                setFeeHeads([]);
            } finally {
                setLoadingFeeHead(false);
            }
        };

        fetchFeeHeadDetails();
    }, [selectedTerm, filterType, selectedStudent, selectedAsmayId]);

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
    }, [selectedHeads, feeHeads, payableAmount]);

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

    const handleCheckboxChange = (checked: boolean, type: 'left' | 'inactive' | 'class' | 'section') => {
        if (type === 'left') {
            setLeft(checked);
            setDeative(false);
            setFilterType('NameAdmno');
        } else if (type === 'inactive') {
            setDeative(checked);
            setLeft(false);
            setFilterType('NameAdmno');
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

        // Clear student search and reset student selection when filters change
        setStudentSearch('');
        setSelectedStudent(null);
        setStudents([]);
        setTerms([]);
        SetStudentDetails([]);
        SetFeeDetails([]);
        setselectedTerm([]);
    };

    // // Find this useEffect (around line 298) and update its dependencies
    // useEffect(() => {
    //     if (!studentSearch.trim()) {
    //         setStudents([]);
    //         return;
    //     }

    //     const fetchStudents = async () => {
    //         setLoadingStudents(true);
    //         try {
    //             const payload = {
    //                 asmaY_Id: selectedAsmayId,
    //                 filterinitialdata: filterType,
    //                 searchfilter: studentSearch,
    //                 asmcL_ID: selectedclassId ?? 0,
    //                 asmS_Id: selectedSectionId ?? 0,
    //                 amsT_SOL: left === false ? 'S' : 'L',
    //                 // Add deactive flag if needed by your API
    //                 amsT_Status: deactive ? 'I' : 'A' // Assuming 'I' for inactive, 'A' for active
    //             };
    //             const studentsArray = await searchStudentName(payload);
    //             const studentsData = JSON.parse(JSON.stringify(studentsArray.feeStudentSearch || []));
    //             setStudents(studentsData || []);
    //         } catch (error) {
    //             console.error('Failed to fetch students:', error);
    //             setStudents([]);
    //         } finally {
    //             setLoadingStudents(false);
    //         }
    //     };

    //     fetchStudents();
    // }, [studentSearch, selectedAsmayId, filterType, selectedclassId, selectedSectionId, left, deactive]); // Add left and deactive to dependencies

    const onSubmit = async () => {
        if (feeHeads.filter((f) => selectedHeads[f.fmA_Id]).length === 0) {
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
                if (amount[paymentId] > Number(TotalPaying).toString() || amount[paymentId] < Number(TotalPaying).toString()) {
                    toast.error('Sum Of Amounts Of By Mode Of Payments Must Match Now Paying Amount');
                    return;
                }
            } else {
                const paymentId = selectedPayment.ivrmmoD_Id;
                if (amount[paymentId] === Number(0).toString()) {
                    toast.error('Amount Is Must Be Greater Than Zero');
                    return;
                }
                if (amount[paymentId] > Number(TotalPaying).toString() || amount[paymentId] < Number(TotalPaying).toString()) {
                    toast.error('Sum Of Amounts Of By Mode Of Payments Must Match Now Paying Amount');
                    return;
                }
            }
        } else {
            const selectedPayments = masterModeofPaymentList.filter((f) => checkPayType.includes(f.ivrmmoD_ModeOfPayment));

            if (selectedPayments.length === 0) {
                toast.error('Invalid payment selection');
                return;
            }

            const total = selectedPayments.reduce((sum, f) => {
                const payableValue = amount[f.ivrmmoD_Id];
                const amountr = payableValue
                    ? Number.parseFloat(payableValue) || 0
                    : Number.parseFloat(amount[f.ivrmmoD_Id]?.toString() || '0') || 0;
                return sum + amountr;
            }, 0);
            // settotalAmount(total);
            // console.log('totalAmountSum', total);

            for (const payment of selectedPayments) {
                const paymentId = payment.ivrmmoD_Id;
                if (payment.ivrmmoD_Flag.toLowerCase() !== 'c') {
                    if (!chequeNo[paymentId] || chequeNo[paymentId] === '') {
                        toast.error(`Please enter Cheque No. for ${payment.ivrmmoD_ModeOfPayment}`);
                        return;
                    }

                    if (!selectedBanks[paymentId] || selectedBanks[paymentId] === '') {
                        toast.error(`Please Select a Bank for ${payment.ivrmmoD_ModeOfPayment}`);
                        return;
                    }

                    if (!amount[paymentId] || amount[paymentId] === '') {
                        toast.error(`Please enter Amount for ${payment.ivrmmoD_ModeOfPayment}`);
                        return;
                    }

                    const paymentAmount = Number.parseFloat(amount[paymentId]);
                    if (Number.isNaN(paymentAmount) || paymentAmount <= 0) {
                        toast.error(`Amount Must Be Greater Than Zero for ${payment.ivrmmoD_ModeOfPayment}`);
                        return;
                    }
                } else {
                    if (!amount[paymentId] || amount[paymentId] === '') {
                        toast.error(`Please enter Amount for ${payment.ivrmmoD_ModeOfPayment}`);
                        return;
                    }

                    const paymentAmount = Number.parseFloat(amount[paymentId]);
                    if (Number.isNaN(paymentAmount) || paymentAmount <= 0) {
                        toast.error(`Amount Must Be Greater Than Zero for ${payment.ivrmmoD_ModeOfPayment}`);
                        return;
                    }
                }
            }
            const tolerance = 0.01;
            if (Math.abs(total - TotalPaying) > tolerance) {
                toast.error(`Sum Of Amounts (${total}) Must Match Now Paying Amount (${TotalPaying})`);
                return;
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
                        fyppM_DDChequeNo: chequeNo[selectedPayment.ivrmmoD_Id] ?? '',
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
                amst_Id: selectedStudent?.amst_Id,
                fyP_Tot_Amount: TotalPaying,
                filterinitialdata: filterType,
                fyP_Tot_Concession_Amt: TotalConcession,
                fyP_Tot_Fine_Amt: Totalfine,
                fyP_Tot_Waived_Amt: TotalWaivedOff,
                fyP_PayModeType: '',
                smsconfig: sms,
                emailconfig: email
            };
            console.log('save fee transaction payload', JSON.stringify(payload));
            const response = await saveFeeTransaction(payload);

            if (response?.displaymessage) {
                toast.success(response.message || ' Transaction Saved successfully');
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
        reset();
        setSelectedAsmayId(0);
        setStudentSearch('');
        setStudents([]);
        setTerms([]);
        setselectedTerm([]);
        setLeft(false);
        setClass(false);
        setSection(false);
        setDeative(false);
        setFilterType('regular');
        setTodaysDate(new Date());
        setSelectedClassId(null);
        setSelectedSectionId(null);
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
                                    id='inactive'
                                    checked={deactive}
                                    onCheckedChange={(c) => handleCheckboxChange(c as boolean, 'inactive')}
                                />
                                <Label htmlFor='inactive' className='cursor-pointer text-sm'>
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

                                <div className='relative w-64'>
                                    <InputText
                                        id='studentSearchInput'
                                        type='text'
                                        placeholder='Search student...'
                                        disabled={!selectedAsmayId || filterType === 'Chal_no'}
                                        value={studentSearch}
                                        onChange={(e) => {
                                            setStudentSearch(e.target.value);
                                            setSelectedStudent(null);
                                        }}
                                        className='flex rounded-md border border-gray-300 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        autoComplete='off'
                                    />

                                    {studentSearch.trim() !== '' && !selectedStudent && (
                                        <>
                                            {/* For regular filter type - check minimum letters */}
                                            {filterType === 'regular' ? (
                                                studentSearch.trim().length >= Number.parseInt(searchByLet) && (
                                                    <ul className='absolute top-full left-0 z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow-md'>
                                                        {loadingStudents ? (
                                                            <li className='px-3 py-2 text-gray-500'>Loading...</li>
                                                        ) : students.length === 0 ? (
                                                            <li className='px-3 py-2 text-gray-500'>No students found</li>
                                                        ) : (
                                                            students.map((student) => (
                                                                <li
                                                                    key={student.amst_Id}
                                                                    onClick={() => {
                                                                        setSelectedStudent(student);
                                                                        setStudentSearch(student.amsT_StudentName);
                                                                    }}
                                                                    className='cursor-pointer px-3 py-2 hover:bg-blue-100'>
                                                                    {student.amsT_StudentName}
                                                                </li>
                                                            ))
                                                        )}
                                                    </ul>
                                                )
                                            ) : (
                                                /* For non-regular filter types - show immediately */
                                                <ul className='absolute top-full left-0 z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow-md'>
                                                    {loadingStudents ? (
                                                        <li className='px-3 py-2 text-gray-500'>Loading...</li>
                                                    ) : students.length === 0 ? (
                                                        <li className='px-3 py-2 text-gray-500'>No students found</li>
                                                    ) : (
                                                        students.map((student) => (
                                                            <li
                                                                key={student.amst_Id}
                                                                onClick={() => {
                                                                    setSelectedStudent(student);
                                                                    setStudentSearch(student.amsT_StudentName);
                                                                }}
                                                                className='cursor-pointer px-3 py-2 hover:bg-blue-100'>
                                                                {student.amsT_StudentName}
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            )}
                                        </>
                                    )}
                                </div>
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
                                        value: ex.fmT_Id.toString(),
                                        disabled: ex.disablepaisterms
                                    }))}
                                    isLoading={loadingTerm}
                                    disabled={amountCheck || filterType === 'Chal_no'}
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

                                    {selectedStudent != null && (
                                        <span
                                            className='flex cursor-pointer items-center gap-1 hover:underline'
                                            onClick={() => setOpenStudentDetails(true)}>
                                            Student Profile <span>➤</span>
                                        </span>
                                    )}
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

                {openStudentDetails && selectedStudent != null && (
                    <StudentProfileModal
                        isOpen={!!openStudentDetails}
                        onClose={() => setOpenStudentDetails(false)}
                        data={openStudentDetails}
                        loading={false}
                        amst_Id={Number(selectedStudent!.amst_Id)}
                        asmay_Id={Number(selectedAsmayId)}
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
                                {feeHeads.map((f, index) => (
                                    <tr key={f.fmA_Id}>
                                        <td className='border p-2'>{index + 1}</td>
                                        <td className='border p-2'>
                                            <Checkbox
                                                checked={selectedHeads[f.fmA_Id] || false}
                                                onCheckedChange={(val) => toggleRow(f.fmA_Id, val === true)}
                                            />
                                        </td>

                                        <td className='border p-2'>{f.fmH_FeeName}</td>
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
                                                value={openingBalance[f.fmA_Id] ?? f.fsS_OBArrearAmount ?? ''}
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
                                    <span className='font-semibold text-gray-900'>{TotalPaying}</span>
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
                            <Save className='mr-2 h-4 w-4' /> Save
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
