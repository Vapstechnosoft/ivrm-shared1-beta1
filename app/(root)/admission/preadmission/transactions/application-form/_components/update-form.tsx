'use client';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { MobileNumberInput } from '@/components/ui/extension/input-mobile-number';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import 'react-phone-input-2/lib/style.css';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYearMasterConfiguration } from '@/hooks/admission/preadmission/useConfigurations';
import {
    useActivePreadmissionDetails,
    useCasteDropdown,
    useCountryDropdown,
    useGenderDropdown,
    usePreadmissionClassDropdown,
    usePreadmissionDocumentsDropdown,
    useReferenceDropdown,
    useReligionDropdown,
    useSourceDropdown,
    useStateDropdown
} from '@/hooks/admission/preadmission/useTransactions';
import { getIconByName } from '@/lib/lucide-icon-registry';
import { calculateAge, cn } from '@/lib/utils';
import { studentApplicationFormUpdateSchema } from '@/schemas/admission/preadmission/transactions';
import { addStudentApplicationForm } from '@/server/admission/preadmission/transactions/application_form';
import { deleteDocument, uploadDocument } from '@/server/document_upload';
import type { IPreadmissionClassDropdown } from '@/types/admission/preadmission/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Eye, Save, Trash } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'sonner';
import type { z } from 'zod';
import { IneligibleClassesDialog } from './InEligibleDialog';

type FormFields = z.infer<typeof studentApplicationFormUpdateSchema.update>;

interface UpdateStudentApplicationFormProps {
    id?: number;
    rowData?: any;
    onSuccess?: () => void;
    onClose?: () => void;
    className?: string;
}

const steps = [
    {
        id: 1,
        name: 'Student Information',
        description: 'Basic details',
        icon: 'User'
    },
    {
        id: 2,
        name: 'Address Information',
        description: 'Residential & Permanent',
        icon: 'MapPinHouse'
    },
    {
        id: 3,
        name: 'Parents Information',
        description: 'Father & Mother details',
        icon: 'Users'
    },
    {
        id: 4,
        name: 'Document Upload',
        description: 'Required documents',
        icon: 'FileUp'
    },
    {
        id: 5,
        name: 'Other Information',
        description: 'Final details',
        icon: 'ReceiptText'
    }
];

export default function UpdateStudentApplicationForm({ id, rowData, onSuccess, className = '' }: UpdateStudentApplicationFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [phoneValues, setPhoneValues] = useState<Record<string, string>>({});
    const [phoneExpectedInfo, setPhoneExpectedInfo] = useState<Record<string, { expected?: number; name?: string; dial?: string }>>({});

    const {
        watch,
        control,
        register,
        handleSubmit,
        reset,
        trigger,
        setValue,
        getValues,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(studentApplicationFormUpdateSchema.update),
        mode: 'onChange',
        defaultValues: {
            pasA_WillingToContributeFlg: 0,
            pasR_UndertakingFlag: 0
        }
    });

    // Sibling details controlled by react-hook-form
    const {
        fields: siblingFields,
        append: appendSibling,
        remove,
        replace: replaceSiblings
    } = useFieldArray({
        control,
        name: 'siblingsDetails'
    });

    // Previous School Details controlled by react-hook-form
    const {
        fields: previousSchoolFields,
        append: appendPreviousSchool,
        remove: removePreviousSchool,
        replace: replacePreviousSchools
    } = useFieldArray({
        control,
        name: 'previousSchoolDetails'
    });

    useEffect(() => {
        if (rowData) {
            const existingId = rowData.pasr_id ?? rowData.pasR_Id ?? rowData.pasRId ?? 0;
            setValue('pasR_Id', existingId);

            Object.entries(rowData).forEach(([key, value]) => {
                // Skip siblingsDetails and previousSchoolDetails - handle them separately
                if (key === 'siblingsDetails' || key === 'previousSchoolDetails') {
                    return;
                }

                if (key === 'pasR_DOB' && value) {
                    setValue(key, new Date(value as string));
                    return;
                }

                let normalized: any = value;

                if (
                    normalized === '' ||
                    normalized === null ||
                    (normalized === 0 && !['pasR_TransportReqdFlag'].includes(key)) ||
                    normalized === '0'
                ) {
                    normalized = undefined;
                }

                if (
                    [
                        'pasR_MobileNo',
                        'pasR_FatherMobleNo',
                        'pasR_MotherMobleNo',
                        'pasR_AltContactNo',
                        'pasR_AadharNo',
                        'pasR_FatherPanno',
                        'pasR_MotherPanno'
                    ].includes(key) &&
                    typeof normalized === 'number'
                ) {
                    normalized = String(normalized);
                }

                if (['pasR_Nationality', 'pasR_FatherNationality', 'pasR_MotherNationality'].includes(key) && normalized !== undefined) {
                    normalized = typeof normalized === 'number' ? String(normalized) : normalized;
                }

                if (['pasR_ConState', 'pasR_PerState'].includes(key) && normalized !== undefined) {
                    normalized = typeof normalized === 'string' ? Number(normalized) : normalized;
                }

                setValue(key as any, normalized);
            });

            setValue('pasA_WillingToContributeFlg', rowData.pasA_WillingToContributeFlg ? 1 : 0);
            setValue('pasA_WillingToContributeRemarks', rowData.pasA_WillingToContributeRemarks ?? undefined);
            // if (rowData.hasOwnProperty("pasR_BirthPlace")) {
            //   setValue("pasR_BirthPlace", rowData.pasR_BirthPlace ?? undefined);
            // }

            // Handle siblingsDetails and previousSchoolDetails arrays AFTER all other fields
            if (rowData.siblingsDetails && Array.isArray(rowData.siblingsDetails) && rowData.siblingsDetails.length > 0) {
                replaceSiblings(rowData.siblingsDetails);
            }

            if (rowData.previousSchoolDetails && Array.isArray(rowData.previousSchoolDetails) && rowData.previousSchoolDetails.length > 0) {
                // Keep only the first previous school entry in the form (show single entry only)
                const firstPrev = rowData.previousSchoolDetails[0];
                replacePreviousSchools([firstPrev]);
            }

            if (rowData.selectedSourceDetails) {
                setSelectedSourceItems(rowData.selectedSourceDetails);
            }
            if (rowData.selectedRefrenceDetails) {
                setSelectedReferenceItems(rowData.selectedRefrenceDetails);
            }
            if (rowData.previousSchoolDetails?.[0]) {
                setPreviousSchool(rowData.previousSchoolDetails[0]);
            }
            if (rowData.selectedDocuments) {
                setUploadedDocuments(rowData.selectedDocuments);
            }

            if (rowData.pasR_Student_Pic_Path) {
                setStudentPhoto({
                    pasR_Student_Pic_Path: rowData.pasR_Student_Pic_Path,
                    isUploading: false
                });
            }

            if (rowData.pasR_FatherPhoto) {
                setFatherPhoto({
                    pasR_FatherPhoto: rowData.pasR_FatherPhoto,
                    isUploading: false
                });
            }

            if (rowData.pasR_MotherPhoto) {
                setMotherPhoto({
                    pasR_MotherPhoto: rowData.pasR_MotherPhoto,
                    isUploading: false
                });
            }
        }
    }, [rowData, setValue, replaceSiblings, replacePreviousSchools]);

    const [isDobOpen, setIsDobOpen] = useState(false);
    const [filteredClasses, setFilteredClasses] = useState<IPreadmissionClassDropdown[]>([]);
    const [isClassDisabled, setIsClassDisabled] = useState(true);
    const [showIneligibleDialog, setShowIneligibleDialog] = useState(false);
    const [ineligibleClasses, setIneligibleClasses] = useState<IPreadmissionClassDropdown[]>([]);
    const [selectedSourceItems, setSelectedSourceItems] = useState<{ pamS_Id: string; pamS_SourceName: string }[]>([]);
    const [selectedReferenceItems, setSelectedReferenceItems] = useState<{ pamR_Id: string; pamR_ReferenceName: string }[]>([]);
    const [sameAsResidential, setSameAsResidential] = useState(false);

    const [, setPreviousSchool] = useState({
        pasrpS_Id: 0,
        pasR_Id: 0,
        pasrpS_PrvSchoolName: '',
        pasrpS_PreviousClass: '',
        pasrpS_Board: '',
        pasrpS_LeftYear: '',
        pasrpS_LeftReason: '',
        pasrpS_Address: ''
    });
    const [uploadedDocuments, setUploadedDocuments] = useState<
        Array<{
            pasrD_Id: number;
            pasR_Id: number;
            amsmD_Id: number;
            document_Path: string;
            documentName?: string;
            isUploading?: boolean;
        }>
    >([]);

    const [studentPhoto, setStudentPhoto] = useState<{
        pasR_Student_Pic_Path: string;
        isUploading?: boolean;
    } | null>(null);
    const [studentPhotoError, setStudentPhotoError] = useState<string | null>(null);

    const studentPhotoInputRef = useRef<HTMLInputElement | null>(null);

    const [fatherPhoto, setFatherPhoto] = useState<{
        pasR_FatherPhoto: string;
        isUploading?: boolean;
    } | null>(null);
    const [fatherPhotoError, setFatherPhotoError] = useState<string | null>(null);

    const fatherPhotoInputRef = useRef<HTMLInputElement | null>(null);

    const [motherPhoto, setMotherPhoto] = useState<{
        pasR_MotherPhoto: string;
        isUploading?: boolean;
    } | null>(null);
    const [motherPhotoError, setMotherPhotoError] = useState<string | null>(null);

    const motherPhotoInputRef = useRef<HTMLInputElement | null>(null);

    const [documentErrors, setDocumentErrors] = useState<Record<number, string>>({});

    const { data: activePreadmission } = useActivePreadmissionDetails();

    const { data: masterConfig } = useAcademicYearMasterConfiguration(activePreadmission?.data?.asmaY_Id ?? 0);

    const { data: religion, isLoading: religionLoading, error: religionError, refetchAll: refetchReligion } = useReligionDropdown();

    const conConuntryId = watch('pasR_ConCountry');
    const perConuntryId = watch('pasR_PerCountry');
    const { data: caste, isLoading: casteLoading, error: casteError, refetchAll: refetchCaste } = useCasteDropdown(watch('religion_Id'));
    const { data: gender, isLoading: genderLoading, error: genderError, refetchAll: refetchGender } = useGenderDropdown();
    const { data: preadmissionClass, refetchAll: refetchClass } = usePreadmissionClassDropdown();
    const { data: country, isLoading: countryLoading, error: countryError, refetchAll: refetchCountry } = useCountryDropdown();
    const {
        data: conState,
        isLoading: conStateLoading,
        error: conStateError,
        refetchAll: refetchConState
    } = useStateDropdown(Number(conConuntryId));
    const {
        data: perState,
        isLoading: perStateLoading,
        error: perStateError,
        refetchAll: refetchPerState
    } = useStateDropdown(Number(perConuntryId));
    const { data: source, isLoading: sourceLoading, refetchAll: refetchSource } = useSourceDropdown();
    const { data: reference, isLoading: referenceLoading, refetchAll: refetchReference } = useReferenceDropdown();
    const {
        data: preadmissionDocuments,
        isLoading: preadmissionDocumentsLoading,
        refetchAll: refetchPreadmissionDocuments
    } = usePreadmissionDocumentsDropdown();

    // Add this useEffect after the existing useEffect that sets form values
    useEffect(() => {
        if (rowData && masterConfig?.data && preadmissionClass?.data) {
            const dob = new Date(rowData.pasR_DOB);
            const allClasses = preadmissionClass.data;

            const validClasses: IPreadmissionClassDropdown[] = [];

            allClasses.forEach((classItem: IPreadmissionClassDropdown) => {
                const validation = validateAgeForClass(dob, classItem, masterConfig.data);
                if (validation.isValid) {
                    validClasses.push(classItem);
                }
            });

            setFilteredClasses(validClasses);
            setIsClassDisabled(false);
        }
    }, [rowData, masterConfig?.data, preadmissionClass?.data]);

    const refetchDropdowns = () => {
        refetchReligion();
        refetchCaste();
        refetchGender();
        refetchClass();
        refetchCountry();
        refetchSource();
        refetchReference();
        refetchConState();
        refetchPerState();
        refetchPreadmissionDocuments();
    };

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];

        if (currentStep === 1) {
            fieldsToValidate = [
                'pasR_FirstName',
                'pasR_MiddleName',
                'pasR_LastName',
                'pasR_DOB',
                'pasR_MobileNo',
                'pasR_BirthPlace',
                'religion_Id',
                'caste_Id',
                'pasR_Sex',
                'asmcL_Id',
                'pasR_emailId',
                'pasR_Nationality',
                'pasR_MotherTongue',
                'pasR_TransportReqdFlag'
            ];
            if (!studentPhoto?.pasR_Student_Pic_Path) {
                toast.error('Please upload student photo');
                return;
            }

            if (watch('asmcL_Id') === 0) {
                toast.error('Please select class');
                return;
            }

            // Validate required phone field
            const fieldName = 'pasR_MobileNo';
            const info = phoneExpectedInfo[fieldName];
            const rawVal = String(watch(fieldName) ?? '');

            if (!rawVal || rawVal === '') {
                toast.error('Mobile number is required');
                return;
            }

            if (info?.expected) {
                const digits = rawVal.replace(/\D/g, '');
                if (digits.length !== info.expected) {
                    toast.error(`Mobile number must be exactly ${info.expected} digits`);
                    return;
                }
            }
        } else if (currentStep === 2) {
            fieldsToValidate = [
                'pasR_ConStreet',
                'pasR_ConArea',
                'pasR_ConCountry',
                'pasR_ConState',
                'pasR_ConCity',
                'pasR_ConPincode',
                'pasR_PerStreet',
                'pasR_PerArea',
                'pasR_PerCountry',
                'pasR_PerState',
                'pasR_PerCity'
            ];
            if (!sameAsResidential) {
                fieldsToValidate.push('pasR_PerPincode');
            }
        } else if (currentStep === 3) {
            fieldsToValidate = ['pasR_FatherName', 'pasR_FatherNationality', 'pasR_MotherName', 'pasR_MotherNationality'];

            if (!fatherPhoto?.pasR_FatherPhoto) {
                toast.error('Please upload father photo');
                return;
            }

            if (!motherPhoto?.pasR_MotherPhoto) {
                toast.error('Please upload mother photo');
                return;
            }

            // Validate optional phone fields if they have values
            const phoneFieldsToCheck = [
                { name: 'pasR_FatherMobleNo', label: 'Father mobile number' },
                { name: 'pasR_MotherMobleNo', label: 'Mother mobile number' },
                { name: 'pasR_AltContactNo', label: 'Alternate contact number' }
            ];

            for (const phoneField of phoneFieldsToCheck) {
                const rawVal = String(watch(phoneField.name as any) ?? '');
                const info = phoneExpectedInfo[phoneField.name];

                if (rawVal && rawVal !== '' && info?.expected) {
                    const digits = rawVal.replace(/\D/g, '');

                    if (digits.length !== info.expected) {
                        toast.error(`${phoneField.label} must be ${info.expected} digits`);
                        return;
                    }
                }
            }
        } else if (currentStep === 4) {
            const selectedReligionId = watch('religion_Id');
            const selectedReligion = religion?.data?.find((r) => r.ivrmmR_Id === selectedReligionId);
            const isRomanCatholic = selectedReligion?.ivrmmR_Name === 'Roman Catholic';

            const mandatoryDocs =
                preadmissionDocuments?.data?.filter((doc) => {
                    if (doc.amsmD_FLAG) return true;
                    if (doc.amsmD_DocumentName === 'Baptism Certificate' && isRomanCatholic) {
                        return true;
                    }
                    return false;
                }) || [];

            const missingDocs = mandatoryDocs.filter((doc) => !isDocumentUploaded(doc.amsmD_Id));

            if (missingDocs.length > 0) {
                const docNames = missingDocs.map((doc) => doc.amsmD_DocumentName).join(', ');
                toast.error(`Please upload mandatory documents: ${docNames}`);
                return;
            }
        }

        const isValid = await trigger(fieldsToValidate as any);

        if (isValid) {
            if (currentStep === 2) {
                const conPincodeVal = String(watch('pasR_ConPincode') ?? '');
                if (conZipLength && conPincodeVal !== '' && conPincodeVal.length !== conZipLength) {
                    setError('pasR_ConPincode', {
                        type: 'manual',
                        message: `Pin code must be ${conZipLength} digits`
                    });
                    return;
                }

                if (!sameAsResidential) {
                    const perPincodeVal = String(watch('pasR_PerPincode') ?? '');
                    if (perZipLength && perPincodeVal !== '' && perPincodeVal.length !== perZipLength) {
                        setError('pasR_PerPincode', {
                            type: 'manual',
                            message: `Pin code must be ${perZipLength} digits`
                        });
                        return;
                    }
                }
            }

            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const getExpectedPhoneLength = (countryData: any): number | undefined => {
        if (!countryData) return undefined;

        const format = countryData?.format;
        if (format && typeof format === 'string') {
            const placeholders = (format.match(/[0-9xX\.\#9]/g) || []).length;
            if (placeholders > 0) return placeholders;
        }

        const dial = String(countryData?.dialCode ?? '').replace(/\D/g, '');
        const fallback: Record<string, number> = {
            '91': 10,
            '1': 10,
            '44': 10,
            '61': 9
        };

        return fallback[dial] ?? undefined;
    };

    const handlePhoneChange = (phone: string, countryData: any, fieldName: string) => {
        // If empty or equal to dial code only, clear
        if (!phone || phone === countryData?.dialCode) {
            setPhoneValues((prev) => ({ ...prev, [fieldName]: '' }));
            setValue(fieldName as any, '');
            setPhoneExpectedInfo((prev) => ({ ...prev, [fieldName]: {} }));
            trigger(fieldName as any);
            return;
        }

        const countryCode = countryData?.dialCode || '91';
        let numberPart = phone.replace(/[^\d]/g, '');
        if (numberPart.startsWith(countryCode)) {
            numberPart = numberPart.slice(String(countryCode).length);
        }
        const formattedPhone = `+${countryCode} ${numberPart}`;
        setPhoneValues((prev) => ({ ...prev, [fieldName]: formattedPhone }));
        setValue(fieldName as any, formattedPhone);

        const expected = getExpectedPhoneLength(countryData);
        setPhoneExpectedInfo((prev) => ({
            ...prev,
            [fieldName]: {
                expected,
                name: countryData?.name ?? countryData?.country,
                dial: String(countryData?.dialCode ?? '')
            }
        }));

        if (expected !== undefined && numberPart.length > 0) {
            if (numberPart.length < expected) {
                setError(fieldName as any, {
                    type: 'manual',
                    message: `Mobile number must be at least ${expected} digits for ${countryData?.name ?? countryData?.country ?? 'selected country'}`
                });
            } else if (numberPart.length > expected) {
                setError(fieldName as any, {
                    type: 'manual',
                    message: `Mobile number must be exactly ${expected} digits for ${countryData?.name ?? countryData?.country ?? 'selected country'}`
                });
            } else {
                clearErrors(fieldName as any);
            }
        }

        trigger(fieldName as any);
    };

    const onSubmit: SubmitHandler<FormFields | any> = async (data: FormFields) => {
        if (data.pasR_UndertakingFlag === 0) {
            toast.error('Please accept undertaking');
            return;
        }

        try {
            const existingId = data.pasR_Id ?? rowData?.pasR_Id ?? rowData?.pasr_id ?? rowData?.pasRId ?? id ?? 0;

            const {
                pasR_DOB,
                source_ids,
                reference_ids,
                pasR_ConCountry,
                pasR_PerCountry,
                pasR_ConPincode,
                pasR_PerPincode,
                pasR_ConState,
                pasR_PerState,
                pasA_WillingToContributeFlg,
                ...filteredData
            } = data;

            const toNull = (v: any) => (v === '' || v === undefined || v === '$undefined' ? null : v);
            const toNullOther = (v: any) => (v === '' || v === undefined || v === '$undefined' ? '' : v);
            const toZero = (v: any) => (v === '' || v === undefined || v === '$undefined' || v === null ? 0 : v);
            const nullFields = new Set([
                'pasR_AadharNo',
                'pasR_FatherPanno',
                'pasR_MotherPanno',
                'pasR_MobileNo',
                'pasR_FatherMobleNo',
                'pasR_MotherMobleNo',
                'pasR_AltContactNo',
                'pasR_FatherIncome',
                'pasR_MotherIncome',
                'pasR_ConState'
            ]);

            const payload = {
                pasR_Id: Number(existingId),
                ...Object.fromEntries(
                    Object.entries(filteredData)
                        .filter(([k]) => k !== 'createdDate' && k !== 'updatedDate' && k !== 'createdAt' && k !== 'updatedAt')
                        .map(([k, v]) => [k, nullFields.has(k) ? toNull(v) : toNullOther(v)])
                ),
                pasR_DOB: pasR_DOB ? format(pasR_DOB, 'yyyy-MM-dd') : null,
                pasR_Age: 0,
                pasR_Student_Pic_Path: toNullOther(studentPhoto?.pasR_Student_Pic_Path),
                pasR_FatherPhoto: toNullOther(fatherPhoto?.pasR_FatherPhoto),
                pasR_MotherPhoto: toNullOther(motherPhoto?.pasR_MotherPhoto),
                PASR_ConState:
                    pasR_ConState == null || String(pasR_ConState) === '' || String(pasR_ConState) === '$undefined'
                        ? null
                        : Number(pasR_ConState),
                PASR_PerState: toNullOther(pasR_PerState?.toString()),
                PASR_ConCountry: toNullOther(pasR_ConCountry?.toString()),
                PASR_PerCountry: toNullOther(pasR_PerCountry?.toString()),
                PASR_ConPincode: toZero(pasR_ConPincode),
                PASR_PerPincode: toZero(pasR_PerPincode),
                pasR_MobileNo: toNull(data.pasR_MobileNo),
                pasR_FatherMobleNo: toNull(data.pasR_FatherMobleNo),
                pasR_MotherMobleNo: toNull(data.pasR_MotherMobleNo),
                pasR_AltContactNo: toNull(data.pasR_AltContactNo),
                pasR_AadharNo: toNull(data.pasR_AadharNo),
                pasR_FatherPanno: toNull(data.pasR_FatherPanno),
                pasR_MotherPanno: toNull(data.pasR_MotherPanno),
                selectedSourceDetails: selectedSourceItems.map((item) => ({
                    pamS_Id: item.pamS_Id
                })),
                selectedRefrenceDetails: selectedReferenceItems.map((item) => ({
                    pamR_Id: item.pamR_Id
                })),
                siblingsDetails: (getValues('siblingsDetails') || []).map((sibling: any) => ({
                    ...Object.fromEntries(Object.entries(sibling).filter(([k]) => k !== 'createdDate' && k !== 'updatedDate')),
                    verrejstatus: '',
                    pasrS_SchoolName: '',
                    pasrS_Age: 0,
                    pasrS_Gender: '',
                    pasrS_Institution: '',
                    pasrS_DOB: ''
                })),
                previousSchoolList: (getValues('previousSchoolDetails') || []).map((school: any) => ({
                    ...school,
                    pasrpS_TcNo: '',
                    pasrpS_PreviousPer: '',
                    pasrpS_PreviousGrade: '',
                    pasrpS_PreviousMarks: '',
                    pasrpS_ConcOrScholarshipFlg: ''
                })),
                examSubjectDTO: [],
                elesubsubject: [],
                selectedDocuments: uploadedDocuments.map((doc) => ({
                    pasrD_Id: doc.pasrD_Id,
                    pasR_Id: doc.pasR_Id,
                    amsmD_Id: doc.amsmD_Id,
                    document_Path: toNullOther(doc.document_Path)
                })),
                PASR_RegistrationNo: toNullOther((data as any).pasR_RegistrationNo),
                pasA_WillingToContributeFlg: pasA_WillingToContributeFlg === 1
            };

            const response = await addStudentApplicationForm(payload);

            if (response && (response.success === true || response.status === 200)) {
                toast.success('Successfully Updated Student Application ');
                reset();
                handleReset();
                onSuccess?.();
            } else {
                const msg = response?.message || 'Failed to submit form';
                toast.error(msg);
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            toast.error(error.message || 'Failed to submit form');
        }
        refetchDropdowns();
    };

    const handleReset = () => {
        reset();
        setCurrentStep(1);
        setSelectedSourceItems([]);
        setSelectedReferenceItems([]);
        setSameAsResidential(false);
        setPreviousSchool({
            pasrpS_Id: 0,
            pasR_Id: 0,
            pasrpS_PrvSchoolName: '',
            pasrpS_PreviousClass: '',
            pasrpS_Board: '',
            pasrpS_LeftYear: '',
            pasrpS_LeftReason: '',
            pasrpS_Address: ''
        });
        setUploadedDocuments([]);
        setDocumentErrors({});
    };

    const handleSourceSelection = (selectedValues: string[]) => {
        const selectedSources = selectedValues.map((value) => {
            return { pamS_Id: value.toString(), pamS_SourceName: '' };
        });
        setSelectedSourceItems(selectedSources);
    };

    const handleReferenceSelection = (selectedValues: string[]) => {
        const selectedReferences = selectedValues.map((value) => {
            return { pamR_Id: value.toString(), pamR_ReferenceName: '' };
        });
        setSelectedReferenceItems(selectedReferences);
    };

    const handleSameAsResidential = (checked: boolean) => {
        setSameAsResidential(checked);
        if (checked) {
            const conStreet = watch('pasR_ConStreet');
            const conArea = watch('pasR_ConArea');
            const conCountry = watch('pasR_ConCountry');
            const conState = watch('pasR_ConState');
            const conCity = watch('pasR_ConCity');
            const conPincode = watch('pasR_ConPincode');

            setValue('pasR_PerStreet', conStreet);
            setValue('pasR_PerArea', conArea);
            setValue('pasR_PerCountry', conCountry);
            setValue('pasR_PerState', conState ? Number(conState) : undefined);
            setValue('pasR_PerCity', conCity);
            setValue('pasR_PerPincode', conPincode);

            if (perZipLength && typeof conPincode === 'string') {
                setValue('pasR_PerPincode', conPincode.slice(0, perZipLength));
            } else if (perZipLength && typeof conPincode === 'number') {
                setValue('pasR_PerPincode', String(conPincode).slice(0, perZipLength));
            } else {
                setValue('pasR_PerPincode', conPincode);
            }
        }
    };

    const addSibling = () => {
        appendSibling({
            pasrS_Id: 0,
            pasrS_SiblingsName: '',
            pasrS_SiblingsClass: '',
            pasrS_SiblingsAdmissionNo: '',
            pasrS_SiblingsSection: ''
        });
    };

    const handleDocumentUpload = async (amsmD_Id: number, file: File, documentName: string) => {
        try {
            // Restrict file size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should not exceed 5MB');
                return;
            }

            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

            if (!allowedTypes.includes(file.type)) {
                toast.error(' Only Pdf, PNG, JPG, and JPEG formats are allowed');
                return;
            }
            setUploadedDocuments((prev) => {
                const existingIndex = prev.findIndex((doc) => doc.amsmD_Id === amsmD_Id);

                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        isUploading: true
                    };
                    return updated;
                }
                return [
                    ...prev,
                    {
                        pasrD_Id: 0,
                        pasR_Id: 0,
                        amsmD_Id,
                        document_Path: '',
                        documentName,
                        isUploading: true
                    }
                ];
            });

            setDocumentErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[amsmD_Id];
                return newErrors;
            });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('SubContainerName', 'preadmission_document');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setUploadedDocuments((prev) => {
                    const existingIndex = prev.findIndex((doc) => doc.amsmD_Id === amsmD_Id);
                    const newDoc = {
                        pasrD_Id: 0,
                        pasR_Id: 0,
                        amsmD_Id,
                        document_Path: response.data as string,
                        documentName,
                        isUploading: false
                    };

                    if (existingIndex >= 0) {
                        const updated = [...prev];
                        updated[existingIndex] = newDoc;
                        return updated;
                    }
                    return [...prev, newDoc];
                });

                toast.success(`${documentName} uploaded successfully`);
            } else {
                toast.error(`Failed to upload ${documentName}`);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';

            setDocumentErrors((prev) => ({
                ...prev,
                [amsmD_Id]: errorMessage
            }));

            setUploadedDocuments((prev) => prev.filter((doc) => doc.amsmD_Id !== amsmD_Id));

            toast.error(`Failed to upload ${documentName}: ${errorMessage}`);
        }
    };

    const handleDocumentDelete = async (amsmD_Id: number, blobUrl: string, documentName: string) => {
        try {
            const response = await deleteDocument(blobUrl);

            if (response.success) {
                setUploadedDocuments((prev) => prev.filter((doc) => doc.amsmD_Id !== amsmD_Id));
                toast.success(`${documentName} deleted successfully`);
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error(`Failed to delete ${documentName}`);
        }
    };

    const handleStudentPhotoUpload = async (file: File) => {
        try {
            // Validate file type
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            // Restrict photo size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size should not exceed 5MB');
                return;
            }

            setStudentPhoto({ pasR_Student_Pic_Path: '', isUploading: true });
            setStudentPhotoError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('SubContainerName', 'preadmission_student_photo');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setStudentPhoto({
                    pasR_Student_Pic_Path: response.data as string,
                    isUploading: false
                });
                toast.success('Student photo uploaded successfully');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setStudentPhotoError(errorMessage);
            setStudentPhoto(null);
            toast.error(`Failed to upload photo: ${errorMessage}`);
        }
    };

    const handleStudentPhotoDelete = async () => {
        if (!studentPhoto?.pasR_Student_Pic_Path) return;

        try {
            const response = await deleteDocument(studentPhoto.pasR_Student_Pic_Path);
            if (response.success) {
                setStudentPhoto(null);
                toast.success('Student photo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete photo');
        }
    };

    const handleFatherPhotoUpload = async (file: File) => {
        try {
            // Validate file type
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            // Restrict photo size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size should not exceed 5MB');
                return;
            }

            setFatherPhoto({ pasR_FatherPhoto: '', isUploading: true });
            setFatherPhotoError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('SubContainerName', 'preadmission_student_photo');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setFatherPhoto({
                    pasR_FatherPhoto: response.data as string,
                    isUploading: false
                });
                toast.success('Father photo uploaded successfully');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setFatherPhotoError(errorMessage);
            setFatherPhoto(null);
            toast.error(`Failed to upload photo: ${errorMessage}`);
        }
    };

    const handleFatherPhotoDelete = async () => {
        if (!fatherPhoto?.pasR_FatherPhoto) return;

        try {
            const response = await deleteDocument(fatherPhoto.pasR_FatherPhoto);
            if (response.success) {
                setFatherPhoto(null);
                toast.success('Father photo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete photo');
        }
    };

    const handleMotherPhotoUpload = async (file: File) => {
        try {
            // Validate file type
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            // Restrict photo size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size should not exceed 5MB');
                return;
            }

            setMotherPhoto({ pasR_MotherPhoto: '', isUploading: true });
            setMotherPhotoError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('SubContainerName', 'preadmission_student_photo');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setMotherPhoto({
                    pasR_MotherPhoto: response.data as string,
                    isUploading: false
                });
                toast.success('Mother photo uploaded successfully');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setMotherPhotoError(errorMessage);
            setMotherPhoto(null);
            toast.error(`Failed to upload photo: ${errorMessage}`);
        }
    };

    const handleMotherPhotoDelete = async () => {
        if (!motherPhoto?.pasR_MotherPhoto) return;

        try {
            const response = await deleteDocument(motherPhoto.pasR_MotherPhoto);
            if (response.success) {
                setMotherPhoto(null);
                toast.success('Mother photo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete photo');
        }
    };

    const isDocumentUploaded = (amsmD_Id: number) => {
        return uploadedDocuments.some((doc) => doc.amsmD_Id === amsmD_Id);
    };

    const getUploadedDocument = (amsmD_Id: number) => {
        return uploadedDocuments.find((doc) => doc.amsmD_Id === amsmD_Id);
    };

    const validateAgeForClass = (dob: Date, classData: IPreadmissionClassDropdown, config: any): { isValid: boolean; reason?: string } => {
        const cutOffDate = config.ispaC_ApplCutOffDateFlag === 1 ? new Date(config.asmaY_Cut_Of_Date) : new Date();

        const age = calculateAge(dob, cutOffDate);

        // Check minimum age if flag is enabled
        if (config.ispaC_DOBMinAgeFlag === 1) {
            const minAgeInMonths = classData.asmcL_MinAgeYear * 12 + classData.asmcL_MinAgeMonth;
            const currentAgeInMonths = age.years * 12 + age.months;

            if (currentAgeInMonths < minAgeInMonths) {
                return {
                    isValid: false,
                    reason: `Minimum age required: ${classData.asmcL_MinAgeYear}y ${classData.asmcL_MinAgeMonth}m ${classData.asmcL_MinAgeDays}d`
                };
            }

            if (currentAgeInMonths === minAgeInMonths && age.days < classData.asmcL_MinAgeDays) {
                return {
                    isValid: false,
                    reason: `Minimum age required: ${classData.asmcL_MinAgeYear}y ${classData.asmcL_MinAgeMonth}m ${classData.asmcL_MinAgeDays}d`
                };
            }
        }

        // Check maximum age if flag is enabled
        if (config.ispaC_DOBMaxAgeFlag === 1) {
            const maxAgeInMonths = classData.asmcL_MaxAgeYear * 12 + classData.asmcL_MaxAgeMonth;
            const currentAgeInMonths = age.years * 12 + age.months;

            if (currentAgeInMonths > maxAgeInMonths) {
                return {
                    isValid: false,
                    reason: `Maximum age allowed: ${classData.asmcL_MaxAgeYear}y ${classData.asmcL_MaxAgeMonth}m ${classData.asmcL_MaxAgeDays}d`
                };
            }

            if (currentAgeInMonths === maxAgeInMonths && age.days > classData.asmcL_MaxAgeDays) {
                return {
                    isValid: false,
                    reason: `Maximum age allowed: ${classData.asmcL_MaxAgeYear}y ${classData.asmcL_MaxAgeMonth}m ${classData.asmcL_MaxAgeDays}d`
                };
            }
        }

        return { isValid: true };
    };

    const handleDOBChange = (date: Date | undefined) => {
        if (!date || !masterConfig?.data) {
            setIsClassDisabled(true);
            setFilteredClasses([]);
            setValue('asmcL_Id', 0);
            return;
        }

        const allClasses = preadmissionClass?.data || [];

        const validClasses: IPreadmissionClassDropdown[] = [];
        const invalidClasses: IPreadmissionClassDropdown[] = [];

        allClasses.forEach((classItem: IPreadmissionClassDropdown) => {
            const validation = validateAgeForClass(date, classItem, masterConfig.data);
            if (validation.isValid) {
                validClasses.push(classItem);
            } else {
                invalidClasses.push(classItem);
            }
        });

        setFilteredClasses(validClasses);

        if (validClasses.length === 0) {
            setIneligibleClasses(invalidClasses);
            setShowIneligibleDialog(true);
            setIsClassDisabled(true);
            setValue('asmcL_Id', 0);
        } else {
            setIsClassDisabled(false);
            // Don't reset class selection in update form if current class is still valid
            const currentClassId = getValues('asmcL_Id');
            const isCurrentClassValid = validClasses.some((c) => c.asmcL_Id === currentClassId);
            if (!isCurrentClassValid) {
                setValue('asmcL_Id', 0);
            }
        }
    };
    // derive zip/pincode length allowed from selected country (useMemo to wait for data)

    const conCountryObj = useMemo(() => {
        if (!country?.data || conConuntryId === undefined || conConuntryId === null || conConuntryId === '') return undefined;
        return country.data.find((c: any) => String(c.ivrmmC_Id) === String(conConuntryId));
    }, [country?.data, conConuntryId]);

    const perCountryObj = useMemo(() => {
        if (!country?.data || perConuntryId === undefined || perConuntryId === null || perConuntryId === '') return undefined;
        return country.data.find((c: any) => String(c.ivrmmC_Id) === String(perConuntryId));
    }, [country?.data, perConuntryId]);

    const conZipLength: number | undefined = conCountryObj?.ivrmmC_ZipNoLength ?? undefined;
    const perZipLength: number | undefined = perCountryObj?.ivrmmC_ZipNoLength ?? undefined;

    const prevConCountryRef = useRef<any>(undefined);
    const prevPerCountryRef = useRef<any>(undefined);

    useEffect(() => {
        if (prevConCountryRef.current !== undefined && String(prevConCountryRef.current) !== String(conConuntryId)) {
            setValue('pasR_ConPincode', '');
        }
        prevConCountryRef.current = conConuntryId;
    }, [conConuntryId, setValue]);

    useEffect(() => {
        if (prevPerCountryRef.current !== undefined && String(prevPerCountryRef.current) !== String(perConuntryId)) {
            setValue('pasR_PerPincode', '');
        }
        prevPerCountryRef.current = perConuntryId;
    }, [perConuntryId, setValue]);

    return (
        <>
            <div className={cn('mx-auto w-full max-w-7xl px-4 py-2', className)}>
                {/* Main Layout: Vertical Stepper + Form */}
                <div className='flex flex-col gap-6 lg:flex-row'>
                    {/* Stepper - Vertical on desktop, horizontal on mobile */}
                    <div className='lg:w-50 lg:flex-shrink-0'>
                        {/* Mobile: Horizontal Stepper */}
                        <div className='block overflow-x-auto lg:hidden'>
                            <div className='flex min-w-max items-center justify-between px-4'>
                                {steps.map((step, index) => {
                                    const IconComponent = getIconByName(step.icon);
                                    return (
                                        <div key={step.id} className='flex flex-1 items-center'>
                                            <div className='flex flex-col items-center'>
                                                <Button
                                                    type='button'
                                                    // onClick={() => goToStep(step.id)}
                                                    disabled={isSubmitting}
                                                    className={cn(
                                                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50',
                                                        currentStep === step.id
                                                            ? 'border-blue-600 bg-blue-600 text-white shadow-blue-200 shadow-lg'
                                                            : currentStep > step.id
                                                              ? 'border-green-500 bg-green-500 text-white'
                                                              : 'border-gray-300 bg-white text-gray-400'
                                                    )}>
                                                    {currentStep > step.id ? (
                                                        <Check className='h-5 w-5' />
                                                    ) : (
                                                        <span className='text-lg'>
                                                            {IconComponent && <IconComponent className='h-5 w-5' />}
                                                        </span>
                                                    )}
                                                </Button>
                                                <p
                                                    className={cn(
                                                        'mt-1 text-nowrap text-center font-medium text-xs transition-colors',
                                                        currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
                                                    )}>
                                                    {step.name}
                                                </p>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div
                                                    className={cn(
                                                        'mx-2 h-0.5 flex-1 transition-all duration-300',
                                                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                                                    )}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Desktop: Vertical Stepper */}
                        <div className='hidden lg:block'>
                            <div className='sticky top-4 space-y-2'>
                                {steps.map((step, index) => {
                                    const IconComponent = getIconByName(step.icon);
                                    return (
                                        <div key={step.id} className='flex items-start'>
                                            <div className='flex flex-col items-center'>
                                                <button
                                                    type='button'
                                                    // onClick={() => goToStep(step.id)}
                                                    disabled={isSubmitting}
                                                    className={cn(
                                                        'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50',
                                                        currentStep === step.id
                                                            ? 'border-secondary bg-secondary text-white shadow-blue-200 shadow-lg'
                                                            : currentStep > step.id
                                                              ? 'border-green-500 bg-green-500 text-white'
                                                              : 'border-gray-300 bg-white text-gray-500'
                                                    )}>
                                                    {currentStep > step.id ? (
                                                        <Check className='h-6 w-6' />
                                                    ) : (
                                                        <span className='text-lg'>
                                                            {IconComponent && <IconComponent className='h-5 w-5' />}
                                                        </span>
                                                    )}
                                                </button>
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={cn(
                                                            'my-2 h-16 w-0.5 transition-all duration-300',
                                                            currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                                                        )}
                                                    />
                                                )}
                                            </div>
                                            <div className='ml-4 flex-1'>
                                                <p
                                                    className={cn(
                                                        'font-medium text-sm transition-colors',
                                                        currentStep === step.id ? 'text-primary' : 'text-gray-500'
                                                    )}>
                                                    {step.name}
                                                </p>
                                                <p className='text-gray-400 text-xs'>{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className='min-w-0 flex-1 space-y-6'>
                        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
                            <div className='max-h-[calc(100vh-2rem)] overflow-y-auto p-6 md:p-8'>
                                {/* Step 1: Student Information */}
                                {currentStep === 1 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Student Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please provide the student&apos;s basic information
                                            </p>
                                        </div>

                                        <div className='flex justify-between'>
                                            <InputText
                                                label='Academic Year'
                                                required
                                                id='academic_year'
                                                placeholder='Academic Year'
                                                defaultValue={activePreadmission?.data?.asmaY_Year}
                                                className='w-fit font-semibold'
                                                disabled
                                            />

                                            {/* Student Photo Upload */}
                                            <div className='col-span-full w-fit'>
                                                <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-2'>
                                                    {/* Hidden input used for edit/replace of existing photo */}
                                                    <input
                                                        ref={studentPhotoInputRef}
                                                        id='student_photo_hidden'
                                                        type='file'
                                                        className='hidden'
                                                        accept='image/jpeg,image/jpg,image/png'
                                                        disabled={studentPhoto?.isUploading || isSubmitting}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                if (file.size > 1 * 1024 * 1024) {
                                                                    toast.error('File size must be less than 1MB');
                                                                    e.target.value = '';
                                                                    return;
                                                                }
                                                                handleStudentPhotoUpload(file);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />
                                                    <div className='mb-1'>
                                                        <Label htmlFor='student_photo'>
                                                            Student Photo <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                    </div>

                                                    {!studentPhoto?.pasR_Student_Pic_Path ? (
                                                        <label
                                                            htmlFor='student_photo'
                                                            className={cn(
                                                                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-3 text-center transition-all hover:border-primary hover:bg-white',
                                                                studentPhoto?.isUploading
                                                                    ? 'border-blue-400 bg-blue-100'
                                                                    : 'border-gray-300 bg-white'
                                                            )}>
                                                            {studentPhoto?.isUploading ? (
                                                                <div className='flex flex-col items-center gap-2'>
                                                                    <svg
                                                                        className='h-8 w-8 animate-spin text-primary'
                                                                        fill='none'
                                                                        stroke='currentColor'
                                                                        viewBox='0 0 24 24'>
                                                                        <circle
                                                                            className='opacity-25'
                                                                            cx='12'
                                                                            cy='12'
                                                                            r='10'
                                                                            strokeWidth='4'
                                                                            stroke='currentColor'
                                                                        />
                                                                        <path
                                                                            className='opacity-75'
                                                                            fill='currentColor'
                                                                            d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                                                                        />
                                                                    </svg>
                                                                    <span className='font-medium text-primary text-sm'>
                                                                        Uploading photo...
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <svg
                                                                        className='h-12 w-12 text-primary'
                                                                        fill='none'
                                                                        stroke='currentColor'
                                                                        viewBox='0 0 24 24'>
                                                                        <path
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                            strokeWidth={2}
                                                                            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                                                        />
                                                                    </svg>
                                                                    <span className='font-medium text-gray-700 text-sm'>
                                                                        Click to upload
                                                                    </span>
                                                                    <span className='mt-1 max-w-[250px] text-gray-600 text-sm'>
                                                                        Upload recent passport-size photo (Max size: 5MB, Format: JPG, PNG)
                                                                    </span>
                                                                </>
                                                            )}
                                                            <input
                                                                id='student_photo'
                                                                type='file'
                                                                className='hidden'
                                                                accept='image/jpeg,image/jpg,image/png'
                                                                disabled={studentPhoto?.isUploading || isSubmitting}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        if (file.size > 5 * 1024 * 1024) {
                                                                            toast.error('File size must be less than 5MB');
                                                                            e.target.value = '';
                                                                            return;
                                                                        }
                                                                        handleStudentPhotoUpload(file);
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    ) : (
                                                        <div className='flex w-fit flex-col items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 p-4'>
                                                            <div className='flex items-center gap-4'>
                                                                <img
                                                                    src={studentPhoto.pasR_Student_Pic_Path}
                                                                    alt='Student'
                                                                    className='h-20 w-20 rounded-lg border-2 border-green-300 object-cover'
                                                                />
                                                                <div>
                                                                    <div className='flex items-center gap-2 font-medium text-green-700'>
                                                                        <Check className='h-5 w-5' />
                                                                        Uploaded Successfully
                                                                    </div>
                                                                    <p className='mt-1 text-green-600 text-sm'>Student photo is ready</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex gap-2'>
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        window.open(studentPhoto.pasR_Student_Pic_Path, '_blank')
                                                                    }>
                                                                    <Eye className='h-4 w-4' />
                                                                </Button>
                                                                <Button
                                                                    type='button'
                                                                    variant='destructive'
                                                                    size='sm'
                                                                    disabled={isSubmitting}
                                                                    onClick={handleStudentPhotoDelete}>
                                                                    <Trash className='h-4 w-4' />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {studentPhotoError && (
                                                        <div className='mt-3 rounded-md border border-red-200 bg-red-50 p-3'>
                                                            <p className='flex items-start gap-2 font-medium text-red-700 text-sm'>
                                                                <span className='mt-0.5 text-red-500'>⚠</span>
                                                                <span>{studentPhotoError}</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                            <InputText
                                                label='First Name'
                                                required
                                                id='pasR_FirstName'
                                                placeholder='Enter first name'
                                                {...register('pasR_FirstName')}
                                                error={errors.pasR_FirstName?.message}
                                            />
                                            <InputText
                                                label='Middle Name'
                                                required
                                                id='pasR_MiddleName'
                                                placeholder='Enter middle name'
                                                {...register('pasR_MiddleName')}
                                                error={errors.pasR_MiddleName?.message}
                                            />
                                            <InputText
                                                label='Last Name'
                                                required
                                                id='pasR_LastName'
                                                placeholder='Enter last name'
                                                {...register('pasR_LastName')}
                                                error={errors.pasR_LastName?.message}
                                            />
                                            <div className='flex flex-col gap-1.5'>
                                                <Controller
                                                    name='pasR_DOB'
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label htmlFor='pasR_DOB'>
                                                                Date of Birth <span className='ml-1 text-red-500'>*</span>
                                                            </Label>
                                                            <Popover open={isDobOpen} onOpenChange={(open) => setIsDobOpen(open)}>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant={'outline'}
                                                                        className={cn(
                                                                            'w-full justify-start text-left font-normal',
                                                                            !field.value && 'text-muted-foreground',
                                                                            error && 'border-red-500'
                                                                        )}>
                                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                                        {field.value ? (
                                                                            format(field.value, 'dd/MM/yyyy')
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className='w-auto p-0' align='start'>
                                                                    <CalendarYear
                                                                        mode='single'
                                                                        selected={field.value}
                                                                        onSelect={(date: Date | undefined) => {
                                                                            if (date) {
                                                                                field.onChange(date);
                                                                                handleDOBChange(date);
                                                                                setValue('asmcL_Id', 0);
                                                                            }
                                                                        }}
                                                                        disabled={(date: Date) =>
                                                                            date > new Date() || date < new Date('1900-01-01')
                                                                        }
                                                                        onDayClick={() => setIsDobOpen(false)}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    )}
                                                />
                                                {errors.pasR_DOB && <FormError>{errors.pasR_DOB.message}</FormError>}
                                            </div>
                                            <div className='flex flex-col gap-1.5 '>
                                                <Controller
                                                    name='pasR_MobileNo'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div>
                                                            <Label htmlFor='pasR_MobileNo'>
                                                                Mobile No.
                                                                <span className='ml-1 text-red-500'>*</span>
                                                            </Label>

                                                            <PhoneInput
                                                                country='in'
                                                                value={
                                                                    phoneValues.pasR_MobileNo ??
                                                                    (field.value != null ? String(field.value) : null)
                                                                }
                                                                onChange={(phone: any, countryData: any) =>
                                                                    handlePhoneChange(phone, countryData, 'pasR_MobileNo')
                                                                }
                                                                onBlur={() => trigger('pasR_MobileNo')}
                                                                inputProps={{
                                                                    id: 'pasR_MobileNo',
                                                                    name: 'pasR_MobileNo',
                                                                    maxLength: 25,

                                                                    required: false,
                                                                    style: {
                                                                        width: '87%',
                                                                        height: '36px',
                                                                        marginLeft: '40px',
                                                                        boxSizing: 'border-box',
                                                                        borderRadius: '4px',
                                                                        padding: '16.5px 14px',
                                                                        fontSize: '16px'
                                                                    }
                                                                }}
                                                                containerClass='w-full'
                                                                inputClass='w-full px-4 py-2 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                                enableSearch
                                                                disableCountryCode={false}
                                                                enableLongNumbers={true}
                                                                isValid={true}
                                                                preserveOrder={['country', 'nationalNumber']}
                                                            />
                                                            {phoneExpectedInfo.pasR_MobileNo?.expected && (
                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                    {`Mobile number must be exactly ${phoneExpectedInfo.pasR_MobileNo.expected} digits for ${
                                                                        phoneExpectedInfo.pasR_MobileNo.name ?? 'selected country'
                                                                    }`}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                                {errors.pasR_MobileNo && <FormError>{errors.pasR_MobileNo.message}</FormError>}
                                            </div>
                                            <InputText
                                                label='Birth Place'
                                                id='pasR_BirthPlace'
                                                placeholder='Enter birth place'
                                                {...register('pasR_BirthPlace')}
                                                error={errors.pasR_BirthPlace?.message}
                                            />
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='religion_Id'>
                                                    Religion <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='religion_Id'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || undefined}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select religion' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {religionLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : religionError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    religion?.data?.map((item) => (
                                                                        <SelectItem key={item.ivrmmR_Id} value={item.ivrmmR_Id.toString()}>
                                                                            {item.ivrmmR_Name}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.religion_Id && <FormError>{errors.religion_Id.message}</FormError>}
                                            </div>
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='caste_Id'>
                                                    Caste <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='caste_Id'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || undefined}
                                                            disabled={!watch('religion_Id')}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select caste' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {casteLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : casteError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    caste?.data?.map((item) => (
                                                                        <SelectItem key={item.imC_Id} value={item.imC_Id.toString()}>
                                                                            {item.imC_CasteName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.caste_Id && <FormError>{errors.caste_Id.message}</FormError>}
                                            </div>
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='pasR_Sex'>
                                                    Gender <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='pasR_Sex'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={(value) => field.onChange(value)}
                                                            value={field.value?.toString() || undefined}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select gender' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {genderLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : genderError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    gender?.data?.map((item) => (
                                                                        <SelectItem key={item.ivrmmG_Id} value={item.ivrmmG_GenderName}>
                                                                            {item.ivrmmG_GenderName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.pasR_Sex && <FormError>{errors.pasR_Sex.message}</FormError>}
                                            </div>
                                            <div className='flex flex-col gap-1.5'>
                                                <Controller
                                                    name='asmcL_Id'
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <div className='flex flex-col space-y-2'>
                                                            <Label htmlFor='asmcL_Id'>
                                                                Applying For Class <span className='ml-1 text-red-500'>*</span>
                                                            </Label>
                                                            <Select
                                                                value={
                                                                    field.value === null || field.value === 0
                                                                        ? ''
                                                                        : field.value?.toString() || ''
                                                                }
                                                                onValueChange={(value) => field.onChange(Number(value))}
                                                                disabled={isClassDisabled}
                                                                searchable={false}>
                                                                <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
                                                                    <SelectValue
                                                                        placeholder={
                                                                            isClassDisabled
                                                                                ? 'Please select Date of Birth first'
                                                                                : 'Select a class'
                                                                        }
                                                                    />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {filteredClasses.length > 0 ? (
                                                                        filteredClasses.map((classItem) => (
                                                                            <SelectItem
                                                                                key={classItem.asmcL_Id}
                                                                                value={classItem.asmcL_Id.toString()}>
                                                                                {classItem.asmcL_ClassName}
                                                                            </SelectItem>
                                                                        ))
                                                                    ) : (
                                                                        <SelectItem value='0' disabled>
                                                                            No classes available
                                                                        </SelectItem>
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                                                />
                                                {errors.asmcL_Id && <FormError>{errors.asmcL_Id.message}</FormError>}
                                            </div>
                                            <InputText
                                                label='Email'
                                                required
                                                id='pasR_emailId'
                                                placeholder='Enter email'
                                                {...register('pasR_emailId')}
                                                error={errors.pasR_emailId?.message}
                                            />
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='pasR_Nationality'>
                                                    Nationality <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='pasR_Nationality'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={(value) => field.onChange(value)} value={field.value || ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select nationality' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {countryLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : countryError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    country?.data?.map((item) => (
                                                                        <SelectItem key={item.ivrmmC_Id} value={item.ivrmmC_Id.toString()}>
                                                                            {item.ivrmmC_CountryName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.pasR_Nationality && <FormError>{errors.pasR_Nationality.message}</FormError>}
                                            </div>
                                            <InputText
                                                label='Mother Tongue'
                                                id='pasR_MotherTongue'
                                                placeholder='Enter mother tongue'
                                                {...register('pasR_MotherTongue')}
                                                error={errors.pasR_MotherTongue?.message}
                                            />
                                            <div className='flex flex-col gap-1.5'>
                                                <Controller
                                                    name='pasR_AadharNo'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <MobileNumberInput
                                                            label='Aadhaar No.'
                                                            id='pasR_AadharNo'
                                                            value={field.value === '' || field.value == null ? '' : field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            type='number'
                                                            showSpinner={false}
                                                        />
                                                    )}
                                                />
                                                {errors.pasR_AadharNo && <FormError>{errors.pasR_AadharNo.message}</FormError>}
                                            </div>
                                            <InputText
                                                label='Languages Spoken'
                                                id='pasR_Languagespeaking'
                                                placeholder='Enter languages'
                                                {...register('pasR_Languagespeaking')}
                                                error={errors.pasR_Languagespeaking?.message}
                                            />
                                            <InputText
                                                label='Last Played Ground Attended'
                                                id='pasR_LastPlayGrndAttnd'
                                                placeholder='Enter details'
                                                {...register('pasR_LastPlayGrndAttnd')}
                                                error={errors.pasR_LastPlayGrndAttnd?.message}
                                            />
                                            <InputText
                                                label='Extra Curriculum Activity'
                                                id='pasR_ExtraActivity'
                                                placeholder='Enter activities'
                                                {...register('pasR_ExtraActivity')}
                                                error={errors.pasR_ExtraActivity?.message}
                                            />
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='source_ids'>Source</Label>
                                                <Controller
                                                    name='source_ids'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <MultiSelect
                                                            options={
                                                                source?.data?.map((data) => ({
                                                                    label: data.pamS_SourceName,
                                                                    value: data.pamS_Id.toString()
                                                                })) || []
                                                            }
                                                            onValueChange={(selectedValues) => {
                                                                field.onChange(selectedValues);
                                                                handleSourceSelection(selectedValues);
                                                            }}
                                                            defaultValue={selectedSourceItems.map((data) => data.pamS_Id)}
                                                            value={selectedSourceItems.map((data) => data.pamS_Id)}
                                                            placeholder='Select sources'
                                                            variant='inverted'
                                                            disabled={sourceLoading}
                                                        />
                                                    )}
                                                />
                                                {errors.source_ids && <FormError>{errors.source_ids.message}</FormError>}
                                            </div>
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='reference_ids'>Reference</Label>
                                                <Controller
                                                    name='reference_ids'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <MultiSelect
                                                            options={
                                                                reference?.data?.map((data) => ({
                                                                    label: data.pamR_ReferenceName,
                                                                    value: data.pamR_Id.toString()
                                                                })) || []
                                                            }
                                                            onValueChange={(selectedValues) => {
                                                                field.onChange(selectedValues);
                                                                handleReferenceSelection(selectedValues);
                                                            }}
                                                            defaultValue={selectedReferenceItems.map((data) => data.pamR_Id)}
                                                            value={selectedReferenceItems.map((data) => data.pamR_Id)}
                                                            placeholder='Select references'
                                                            variant='inverted'
                                                            disabled={referenceLoading}
                                                        />
                                                    )}
                                                />
                                                {errors.reference_ids && <FormError>{errors.reference_ids.message}</FormError>}
                                            </div>
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='pasR_TransportReqdFlag'>
                                                    Transport Required <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='pasR_TransportReqdFlag'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || undefined}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select option' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='1'>Yes</SelectItem>
                                                                <SelectItem value='0'>No</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.pasR_TransportReqdFlag && (
                                                    <FormError>{errors.pasR_TransportReqdFlag.message}</FormError>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Address Information */}
                                {currentStep === 2 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Address Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please provide residential and permanent address details
                                            </p>
                                        </div>

                                        <div className='space-y-8'>
                                            <div className='space-y-4'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Residential Address</h3>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    <InputText
                                                        label='Street'
                                                        id='pasR_ConStreet'
                                                        placeholder='Enter street'
                                                        {...register('pasR_ConStreet')}
                                                        error={errors.pasR_ConStreet?.message}
                                                    />
                                                    <InputText
                                                        label='Area'
                                                        id='pasR_ConArea'
                                                        placeholder='Enter area'
                                                        {...register('pasR_ConArea')}
                                                        error={errors.pasR_ConArea?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_ConCountry'>Country</Label>
                                                        <Controller
                                                            name='pasR_ConCountry'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value?.toString() || undefined}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select country' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {countryLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : countryError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            country?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmC_Id}
                                                                                    value={item.ivrmmC_Id.toString()}>
                                                                                    {item.ivrmmC_CountryName}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.pasR_ConCountry && <FormError>{errors.pasR_ConCountry.message}</FormError>}
                                                    </div>
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_ConState'>State</Label>
                                                        <Controller
                                                            name='pasR_ConState'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString() || undefined}
                                                                    disabled={!conConuntryId}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select state' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {conStateLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : conStateError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            conState?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmS_Id}
                                                                                    value={item.ivrmmS_Id.toString()}>
                                                                                    {item.ivrmmS_Name}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.pasR_ConState && <FormError>{errors.pasR_ConState.message}</FormError>}
                                                    </div>
                                                    <InputText
                                                        label='City'
                                                        id='pasR_ConCity'
                                                        placeholder='Enter city'
                                                        {...register('pasR_ConCity')}
                                                        error={errors.pasR_ConCity?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Controller
                                                            name='pasR_ConPincode'
                                                            control={control}
                                                            rules={
                                                                conZipLength
                                                                    ? {
                                                                          minLength: {
                                                                              value: conZipLength,
                                                                              message: `Pin code must be ${conZipLength} digits`
                                                                          },
                                                                          maxLength: {
                                                                              value: conZipLength,
                                                                              message: `Pin code must be ${conZipLength} digits`
                                                                          }
                                                                      }
                                                                    : undefined
                                                            }
                                                            render={({ field }) => (
                                                                <>
                                                                    <MobileNumberInput
                                                                        label='Pin Code/Zip Code'
                                                                        id='pasR_ConPincode'
                                                                        value={field.value}
                                                                        onChange={(valueOrEvent: any) => {
                                                                            // MobileNumberInput forwards the input event; accept either event or string
                                                                            const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                            const str = raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                            const truncated = conZipLength
                                                                                ? str.slice(0, conZipLength)
                                                                                : str;
                                                                            field.onChange(truncated);
                                                                            // Set/clear manual error so message appears immediately
                                                                            if (
                                                                                conZipLength &&
                                                                                truncated !== '' &&
                                                                                String(truncated).length !== conZipLength
                                                                            ) {
                                                                                setError('pasR_ConPincode', {
                                                                                    type: 'manual',
                                                                                    message: `Pin code must be ${conZipLength} digits`
                                                                                });
                                                                            } else {
                                                                                clearErrors('pasR_ConPincode');
                                                                            }
                                                                            // trigger resolver validation as well
                                                                            trigger('pasR_ConPincode');
                                                                        }}
                                                                        minLength={conZipLength}
                                                                        maxLength={conZipLength}
                                                                        type='number'
                                                                        showSpinner={false}
                                                                    />
                                                                    {conCountryObj && conZipLength && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Pin code must be ${conZipLength} digits for ${conCountryObj.ivrmmC_CountryName}`}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                        {errors.pasR_ConPincode && <FormError>{errors.pasR_ConPincode.message}</FormError>}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Same as Residential Address Checkbox */}
                                            <div className='flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                                                <Checkbox
                                                    id='sameAsResidential'
                                                    checked={sameAsResidential}
                                                    onCheckedChange={handleSameAsResidential}
                                                />
                                                <Label
                                                    htmlFor='sameAsResidential'
                                                    className='cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                                    Same as Residential Address
                                                </Label>
                                            </div>
                                            <div className='space-y-4'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Permanent Address</h3>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    <InputText
                                                        label='Street'
                                                        id='pasR_PerStreet'
                                                        placeholder='Enter street'
                                                        {...register('pasR_PerStreet')}
                                                        error={errors.pasR_PerStreet?.message}
                                                        disabled={sameAsResidential}
                                                    />
                                                    <InputText
                                                        label='Area'
                                                        id='pasR_PerArea'
                                                        placeholder='Enter area'
                                                        {...register('pasR_PerArea')}
                                                        error={errors.pasR_PerArea?.message}
                                                        disabled={sameAsResidential}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_PerCountry'>Country</Label>
                                                        <Controller
                                                            name='pasR_PerCountry'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value?.toString() || undefined}
                                                                    disabled={sameAsResidential}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select country' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {countryLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : countryError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            country?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmC_Id}
                                                                                    value={item.ivrmmC_Id.toString()}>
                                                                                    {item.ivrmmC_CountryName}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.pasR_PerCountry && <FormError>{errors.pasR_PerCountry.message}</FormError>}
                                                    </div>
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_PerState'>State</Label>
                                                        <Controller
                                                            name='pasR_PerState'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString() || undefined}
                                                                    disabled={!perConuntryId || sameAsResidential}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select state' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {perStateLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : perStateError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            perState?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmS_Id}
                                                                                    value={item.ivrmmS_Id.toString()}>
                                                                                    {item.ivrmmS_Name}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.pasR_PerState && <FormError>{errors.pasR_PerState.message}</FormError>}
                                                    </div>
                                                    <InputText
                                                        label='City'
                                                        id='pasR_PerCity'
                                                        placeholder='Enter city'
                                                        {...register('pasR_PerCity')}
                                                        error={errors.pasR_PerCity?.message}
                                                        disabled={sameAsResidential}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Controller
                                                            name='pasR_PerPincode'
                                                            control={control}
                                                            rules={
                                                                perZipLength
                                                                    ? {
                                                                          minLength: {
                                                                              value: perZipLength,
                                                                              message: `Pin code must be ${perZipLength} digits`
                                                                          },
                                                                          maxLength: {
                                                                              value: perZipLength,
                                                                              message: `Pin code must be ${perZipLength} digits`
                                                                          }
                                                                      }
                                                                    : undefined
                                                            }
                                                            render={({ field }) => (
                                                                <>
                                                                    <MobileNumberInput
                                                                        label='Pin Code/Zip Code'
                                                                        id='pasR_PerPincode'
                                                                        value={field.value}
                                                                        onChange={(valueOrEvent: any) => {
                                                                            const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                            const str = raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                            const truncated = perZipLength
                                                                                ? str.slice(0, perZipLength)
                                                                                : str;
                                                                            field.onChange(truncated);
                                                                            // Set/clear manual error so message appears immediately
                                                                            if (
                                                                                perZipLength &&
                                                                                truncated !== '' &&
                                                                                String(truncated).length !== perZipLength
                                                                            ) {
                                                                                setError('pasR_PerPincode', {
                                                                                    type: 'manual',
                                                                                    message: `Pin code must be ${perZipLength} digits`
                                                                                });
                                                                            } else {
                                                                                clearErrors('pasR_PerPincode');
                                                                            }
                                                                            // trigger resolver validation as well
                                                                            trigger('pasR_PerPincode');
                                                                        }}
                                                                        minLength={perZipLength}
                                                                        maxLength={perZipLength}
                                                                        type='number'
                                                                        showSpinner={false}
                                                                        disabled={sameAsResidential}
                                                                    />
                                                                    {perCountryObj && perZipLength && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Pin code must be ${perZipLength} digits for ${perCountryObj.ivrmmC_CountryName}`}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                        {errors.pasR_PerPincode && <FormError>{errors.pasR_PerPincode.message}</FormError>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Parents Information */}
                                {currentStep === 3 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Parents Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please provide father and mother details</p>
                                        </div>

                                        <div className='space-y-8'>
                                            <div className='space-y-4'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Father Details</h3>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    {/* Father Photo Upload - Mandatory */}
                                                    <div className='col-span-full w-fit'>
                                                        <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-2'>
                                                            {/* Hidden input used for edit/replace of existing photo */}
                                                            <input
                                                                ref={fatherPhotoInputRef}
                                                                id='father_photo_hidden'
                                                                type='file'
                                                                className='hidden'
                                                                accept='image/jpeg,image/jpg,image/png'
                                                                disabled={fatherPhoto?.isUploading || isSubmitting}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        if (file.size > 1 * 1024 * 1024) {
                                                                            toast.error('File size must be less than 1MB');
                                                                            e.target.value = '';
                                                                            return;
                                                                        }
                                                                        handleFatherPhotoUpload(file);
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                            <div className='mb-1'>
                                                                <Label htmlFor='father_photo'>
                                                                    Father Photo <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                            </div>

                                                            {!fatherPhoto?.pasR_FatherPhoto ? (
                                                                <label
                                                                    htmlFor='father_photo'
                                                                    className={cn(
                                                                        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-3 text-center transition-all hover:border-primary hover:bg-white',
                                                                        fatherPhoto?.isUploading
                                                                            ? 'border-blue-400 bg-blue-100'
                                                                            : 'border-gray-300 bg-white'
                                                                    )}>
                                                                    {fatherPhoto?.isUploading ? (
                                                                        <div className='flex flex-col items-center gap-2'>
                                                                            <svg
                                                                                className='h-8 w-8 animate-spin text-primary'
                                                                                fill='none'
                                                                                stroke='currentColor'
                                                                                viewBox='0 0 24 24'>
                                                                                <circle
                                                                                    className='opacity-25'
                                                                                    cx='12'
                                                                                    cy='12'
                                                                                    r='10'
                                                                                    strokeWidth='4'
                                                                                    stroke='currentColor'
                                                                                />
                                                                                <path
                                                                                    className='opacity-75'
                                                                                    fill='currentColor'
                                                                                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                                                                                />
                                                                            </svg>
                                                                            <span className='font-medium text-primary text-sm'>
                                                                                Uploading photo...
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <svg
                                                                                className='h-12 w-12 text-primary'
                                                                                fill='none'
                                                                                stroke='currentColor'
                                                                                viewBox='0 0 24 24'>
                                                                                <path
                                                                                    strokeLinecap='round'
                                                                                    strokeLinejoin='round'
                                                                                    strokeWidth={2}
                                                                                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                                                                />
                                                                            </svg>
                                                                            <span className='font-medium text-gray-700 text-sm'>
                                                                                Click to upload
                                                                            </span>
                                                                            <span className='mt-1 max-w-[250px] text-gray-600 text-sm'>
                                                                                Upload recent passport-size photo (Max size: 5MB, Format:
                                                                                JPG, PNG)
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                    <input
                                                                        id='father_photo'
                                                                        type='file'
                                                                        className='hidden'
                                                                        accept='image/jpeg,image/jpg,image/png'
                                                                        disabled={fatherPhoto?.isUploading || isSubmitting}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                if (file.size > 5 * 1024 * 1024) {
                                                                                    toast.error('File size must be less than 5MB');
                                                                                    e.target.value = '';
                                                                                    return;
                                                                                }
                                                                                handleFatherPhotoUpload(file);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            ) : (
                                                                <div className='flex w-fit flex-col items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 p-4'>
                                                                    <div className='flex items-center gap-4'>
                                                                        <img
                                                                            src={fatherPhoto.pasR_FatherPhoto}
                                                                            alt='Father'
                                                                            className='h-20 w-20 rounded-lg border-2 border-green-300 object-cover'
                                                                        />
                                                                        <div>
                                                                            <div className='flex items-center gap-2 font-medium text-green-700'>
                                                                                <Check className='h-5 w-5' />
                                                                                Uploaded Successfully
                                                                            </div>
                                                                            <p className='mt-1 text-green-600 text-sm'>
                                                                                Father photo is ready
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='flex gap-2'>
                                                                        <Button
                                                                            type='button'
                                                                            variant='outline'
                                                                            size='sm'
                                                                            onClick={() =>
                                                                                window.open(fatherPhoto.pasR_FatherPhoto, '_blank')
                                                                            }>
                                                                            <Eye className='h-4 w-4' />
                                                                        </Button>
                                                                        <Button
                                                                            type='button'
                                                                            variant='destructive'
                                                                            size='sm'
                                                                            disabled={isSubmitting}
                                                                            onClick={handleFatherPhotoDelete}>
                                                                            <Trash className='h-4 w-4' />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {fatherPhotoError && (
                                                                <div className='mt-3 rounded-md border border-red-200 bg-red-50 p-3'>
                                                                    <p className='flex items-start gap-2 font-medium text-red-700 text-sm'>
                                                                        <span className='mt-0.5 text-red-500'>⚠</span>
                                                                        <span>{fatherPhotoError}</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <InputText
                                                        label='Father Name'
                                                        required
                                                        id='pasR_FatherName'
                                                        placeholder='Enter father name'
                                                        {...register('pasR_FatherName')}
                                                        error={errors.pasR_FatherName?.message}
                                                    />
                                                    <InputText
                                                        label='Surname'
                                                        id='pasR_FatherSurname'
                                                        placeholder='Enter surname'
                                                        {...register('pasR_FatherSurname')}
                                                        error={errors.pasR_FatherSurname?.message}
                                                    />
                                                    <InputText
                                                        label='Qualification'
                                                        id='pasR_FatherEducation'
                                                        placeholder='Enter qualification'
                                                        {...register('pasR_FatherEducation')}
                                                        error={errors.pasR_FatherEducation?.message}
                                                    />
                                                    <InputText
                                                        label='Pan No'
                                                        id='pasR_FatherPanno'
                                                        placeholder='Enter PAN'
                                                        {...register('pasR_FatherPanno')}
                                                        error={errors.pasR_FatherPanno?.message}
                                                    />
                                                    <InputText
                                                        label='Designation'
                                                        id='pasR_FatherDesignation'
                                                        placeholder='Enter designation'
                                                        {...register('pasR_FatherDesignation')}
                                                        error={errors.pasR_FatherDesignation?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_FatherNationality'>
                                                            Nationality <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                        <Controller
                                                            name='pasR_FatherNationality'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value || ''}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select nationality' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {countryLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : countryError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            country?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmC_Id}
                                                                                    value={item.ivrmmC_Id.toString()}>
                                                                                    {item.ivrmmC_CountryName}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.pasR_FatherNationality && (
                                                            <FormError>{errors.pasR_FatherNationality.message}</FormError>
                                                        )}
                                                    </div>
                                                    <InputText
                                                        label='Office Address'
                                                        id='pasR_FatherOfficeAddr'
                                                        placeholder='Enter office address'
                                                        {...register('pasR_FatherOfficeAddr')}
                                                        error={errors.pasR_FatherOfficeAddr?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5 '>
                                                        <Controller
                                                            name='pasR_FatherMobleNo'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div>
                                                                    <Label htmlFor='pasR_FatherMobleNo'>Mobile No.</Label>
                                                                    <PhoneInput
                                                                        country='in'
                                                                        value={
                                                                            phoneValues.pasR_FatherMobleNo ??
                                                                            (field.value != null ? String(field.value) : null)
                                                                        }
                                                                        onChange={(phone: any, countryData: any) =>
                                                                            handlePhoneChange(phone, countryData, 'pasR_FatherMobleNo')
                                                                        }
                                                                        onBlur={() => trigger('pasR_FatherMobleNo')}
                                                                        inputProps={{
                                                                            id: 'pasR_FatherMobleNo',
                                                                            name: 'pasR_FatherMobleNo',
                                                                            maxLength: 25,
                                                                            required: false,
                                                                            style: {
                                                                                width: '87%',
                                                                                height: '36px',
                                                                                marginLeft: '40px',
                                                                                boxSizing: 'border-box',
                                                                                borderRadius: '4px',
                                                                                padding: '16.5px 14px',
                                                                                fontSize: '16px'
                                                                            }
                                                                        }}
                                                                        containerClass='w-full'
                                                                        inputClass='w-full px-4 py-2 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                                        enableSearch
                                                                        disableCountryCode={false}
                                                                        enableLongNumbers={true}
                                                                        isValid={true}
                                                                        preserveOrder={['country', 'nationalNumber']}
                                                                    />
                                                                    {phoneExpectedInfo.pasR_FatherMobleNo?.expected && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Mobile number must be exactly ${phoneExpectedInfo.pasR_FatherMobleNo.expected} digits for ${
                                                                                phoneExpectedInfo.pasR_FatherMobleNo.name ??
                                                                                'selected country'
                                                                            }`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        />
                                                        {errors.pasR_FatherMobleNo && (
                                                            <FormError>{errors.pasR_FatherMobleNo.message}</FormError>
                                                        )}
                                                    </div>
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Controller
                                                            name='pasR_FatherIncome'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <InputNumber
                                                                    label='Father Income'
                                                                    id='pasR_FatherIncome'
                                                                    value={field.value || 0}
                                                                    onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                                                    minValue={0}
                                                                    maxDigits={15}
                                                                />
                                                            )}
                                                        />
                                                        {errors.pasR_FatherIncome && (
                                                            <FormError>{errors.pasR_FatherIncome.message}</FormError>
                                                        )}
                                                    </div>
                                                    <InputText
                                                        label={`Father's Institution Attended`}
                                                        id='pasA_FatherInstitution'
                                                        placeholder={`Enter Father's Institution Attended`}
                                                        {...register('pasA_FatherInstitution')}
                                                        error={errors.pasA_FatherInstitution?.message}
                                                    />
                                                    <InputText
                                                        label={`Father's Mother Tongue`}
                                                        id='pasA_FatherMotherTongue'
                                                        placeholder={`Enter Father's Mother Tongue`}
                                                        {...register('pasA_FatherMotherTongue')}
                                                        error={errors.pasA_FatherMotherTongue?.message}
                                                    />
                                                    <InputText
                                                        label={`Father's Business`}
                                                        id='pasA_FatherBusiness'
                                                        placeholder={`Enter Father's Business`}
                                                        {...register('pasA_FatherBusiness')}
                                                        error={errors.pasA_FatherBusiness?.message}
                                                    />
                                                    <InputText
                                                        label={`Father's Company/Office`}
                                                        id='pasA_FatherCompany'
                                                        placeholder={`Enter Father's Company/Office`}
                                                        {...register('pasA_FatherCompany')}
                                                        error={errors.pasA_FatherCompany?.message}
                                                    />
                                                </div>
                                            </div>

                                            <div className='space-y-4'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Mother Details</h3>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    {/* Mother Photo Upload - Mandatory */}
                                                    <div className='col-span-full w-fit'>
                                                        <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-2'>
                                                            {/* Hidden input used for edit/replace of existing photo */}
                                                            <input
                                                                ref={motherPhotoInputRef}
                                                                id='mother_photo_hidden'
                                                                type='file'
                                                                className='hidden'
                                                                accept='image/jpeg,image/jpg,image/png'
                                                                disabled={motherPhoto?.isUploading || isSubmitting}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        if (file.size > 1 * 1024 * 1024) {
                                                                            toast.error('File size must be less than 1MB');
                                                                            e.target.value = '';
                                                                            return;
                                                                        }
                                                                        handleMotherPhotoUpload(file);
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                            <div className='mb-1'>
                                                                <Label htmlFor='mother_photo'>
                                                                    Mother Photo <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                            </div>

                                                            {!motherPhoto?.pasR_MotherPhoto ? (
                                                                <label
                                                                    htmlFor='mother_photo'
                                                                    className={cn(
                                                                        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-3 text-center transition-all hover:border-primary hover:bg-white',
                                                                        motherPhoto?.isUploading
                                                                            ? 'border-blue-400 bg-blue-100'
                                                                            : 'border-gray-300 bg-white'
                                                                    )}>
                                                                    {motherPhoto?.isUploading ? (
                                                                        <div className='flex flex-col items-center gap-2'>
                                                                            <svg
                                                                                className='h-8 w-8 animate-spin text-primary'
                                                                                fill='none'
                                                                                stroke='currentColor'
                                                                                viewBox='0 0 24 24'>
                                                                                <circle
                                                                                    className='opacity-25'
                                                                                    cx='12'
                                                                                    cy='12'
                                                                                    r='10'
                                                                                    strokeWidth='4'
                                                                                    stroke='currentColor'
                                                                                />
                                                                                <path
                                                                                    className='opacity-75'
                                                                                    fill='currentColor'
                                                                                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                                                                                />
                                                                            </svg>
                                                                            <span className='font-medium text-primary text-sm'>
                                                                                Uploading photo...
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <svg
                                                                                className='h-12 w-12 text-primary'
                                                                                fill='none'
                                                                                stroke='currentColor'
                                                                                viewBox='0 0 24 24'>
                                                                                <path
                                                                                    strokeLinecap='round'
                                                                                    strokeLinejoin='round'
                                                                                    strokeWidth={2}
                                                                                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                                                                />
                                                                            </svg>
                                                                            <span className='font-medium text-gray-700 text-sm'>
                                                                                Click to upload
                                                                            </span>
                                                                            <span className='mt-1 max-w-[250px] text-gray-600 text-sm'>
                                                                                Upload recent passport-size photo (Max size: 5MB, Format:
                                                                                JPG, PNG)
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                    <input
                                                                        id='mother_photo'
                                                                        type='file'
                                                                        className='hidden'
                                                                        accept='image/jpeg,image/jpg,image/png'
                                                                        disabled={motherPhoto?.isUploading || isSubmitting}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                if (file.size > 5 * 1024 * 1024) {
                                                                                    toast.error('File size must be less than 5MB');
                                                                                    e.target.value = '';
                                                                                    return;
                                                                                }
                                                                                handleMotherPhotoUpload(file);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            ) : (
                                                                <div className='flex w-fit flex-col items-start justify-between gap-2 rounded-lg border border-green-200 bg-green-50 p-4'>
                                                                    <div className='flex items-center gap-4'>
                                                                        <img
                                                                            src={motherPhoto.pasR_MotherPhoto}
                                                                            alt='Mother'
                                                                            className='h-20 w-20 rounded-lg border-2 border-green-300 object-cover'
                                                                        />
                                                                        <div>
                                                                            <div className='flex items-center gap-2 font-medium text-green-700'>
                                                                                <Check className='h-5 w-5' />
                                                                                Uploaded Successfully
                                                                            </div>
                                                                            <p className='mt-1 text-green-600 text-sm'>
                                                                                Mother photo is ready
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='flex gap-2'>
                                                                        <Button
                                                                            type='button'
                                                                            variant='outline'
                                                                            size='sm'
                                                                            onClick={() =>
                                                                                window.open(motherPhoto.pasR_MotherPhoto, '_blank')
                                                                            }>
                                                                            <Eye className='h-4 w-4' />
                                                                        </Button>
                                                                        <Button
                                                                            type='button'
                                                                            variant='destructive'
                                                                            size='sm'
                                                                            disabled={isSubmitting}
                                                                            onClick={handleMotherPhotoDelete}>
                                                                            <Trash className='h-4 w-4' />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {motherPhotoError && (
                                                                <div className='mt-3 rounded-md border border-red-200 bg-red-50 p-3'>
                                                                    <p className='flex items-start gap-2 font-medium text-red-700 text-sm'>
                                                                        <span className='mt-0.5 text-red-500'>⚠</span>
                                                                        <span>{motherPhotoError}</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <InputText
                                                        label='Mother Name'
                                                        required
                                                        id='pasR_MotherName'
                                                        placeholder='Enter mother name'
                                                        {...register('pasR_MotherName')}
                                                        error={errors.pasR_MotherName?.message}
                                                    />
                                                    <InputText
                                                        label='Surname'
                                                        id='pasR_MotherSurname'
                                                        placeholder='Enter surname'
                                                        {...register('pasR_MotherSurname')}
                                                        error={errors.pasR_MotherSurname?.message}
                                                    />
                                                    <InputText
                                                        label='Qualification'
                                                        id='pasR_MotherEducation'
                                                        placeholder='Enter qualification'
                                                        {...register('pasR_MotherEducation')}
                                                        error={errors.pasR_MotherEducation?.message}
                                                    />
                                                    <InputText
                                                        label='Pan No'
                                                        id='pasR_MotherPanno'
                                                        placeholder='Enter PAN'
                                                        {...register('pasR_MotherPanno')}
                                                        error={errors.pasR_MotherPanno?.message}
                                                    />
                                                    <InputText
                                                        label='Designation'
                                                        id='pasR_MotherDesignation'
                                                        placeholder='Enter designation'
                                                        {...register('pasR_MotherDesignation')}
                                                        error={errors.pasR_MotherDesignation?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_MotherNationality'>
                                                            Nationality <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                        <Controller
                                                            name='pasR_MotherNationality'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value || ''}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select nationality' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {countryLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : countryError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            country?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmC_Id}
                                                                                    value={item.ivrmmC_Id.toString()}>
                                                                                    {item.ivrmmC_CountryName}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.pasR_MotherNationality && (
                                                            <FormError>{errors.pasR_MotherNationality.message}</FormError>
                                                        )}
                                                    </div>
                                                    <InputText
                                                        label='Office Address'
                                                        id='pasR_MotherOfficeAddr'
                                                        placeholder='Enter office address'
                                                        {...register('pasR_MotherOfficeAddr')}
                                                        error={errors.pasR_MotherOfficeAddr?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5 '>
                                                        <Controller
                                                            name='pasR_MotherMobleNo'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div>
                                                                    <Label htmlFor='pasR_MotherMobleNo'>Mobile No.</Label>
                                                                    <PhoneInput
                                                                        country='in'
                                                                        value={
                                                                            phoneValues.pasR_MotherMobleNo ??
                                                                            (field.value != null ? String(field.value) : null)
                                                                        }
                                                                        onChange={(phone: any, countryData: any) =>
                                                                            handlePhoneChange(phone, countryData, 'pasR_MotherMobleNo')
                                                                        }
                                                                        onBlur={() => trigger('pasR_MotherMobleNo')}
                                                                        inputProps={{
                                                                            id: 'pasR_MotherMobleNo',
                                                                            name: 'pasR_MotherMobleNo',
                                                                            maxLength: 25,
                                                                            required: false,
                                                                            style: {
                                                                                width: '87%',
                                                                                height: '36px',
                                                                                marginLeft: '40px',
                                                                                boxSizing: 'border-box',
                                                                                borderRadius: '4px',
                                                                                padding: '16.5px 14px',
                                                                                fontSize: '16px'
                                                                            }
                                                                        }}
                                                                        containerClass='w-full'
                                                                        inputClass='w-full px-4 py-2 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                                        enableSearch
                                                                        disableCountryCode={false}
                                                                        enableLongNumbers={true}
                                                                        isValid={true}
                                                                        preserveOrder={['country', 'nationalNumber']}
                                                                    />
                                                                    {phoneExpectedInfo.pasR_MotherMobleNo?.expected && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Mobile number must be exactly ${phoneExpectedInfo.pasR_MotherMobleNo.expected} digits for ${
                                                                                phoneExpectedInfo.pasR_MotherMobleNo.name ??
                                                                                'selected country'
                                                                            }`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        />
                                                        {errors.pasR_MotherMobleNo && (
                                                            <FormError>{errors.pasR_MotherMobleNo.message}</FormError>
                                                        )}
                                                    </div>
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Controller
                                                            name='pasR_MotherIncome'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <InputNumber
                                                                    label='Mother Income'
                                                                    id='pasR_MotherIncome'
                                                                    value={field.value || 0}
                                                                    onChange={(value) => field.onChange(Number.isNaN(value) ? 0 : value)}
                                                                    minValue={0}
                                                                    maxDigits={15}
                                                                />
                                                            )}
                                                        />
                                                        {errors.pasR_MotherIncome && (
                                                            <FormError>{errors.pasR_MotherIncome.message}</FormError>
                                                        )}
                                                    </div>
                                                    <InputText
                                                        label={`Mother's Institution Attended`}
                                                        id='pasA_MotherInstitution'
                                                        placeholder={`Enter Mother's Institution Attended`}
                                                        {...register('pasA_MotherInstitution')}
                                                        error={errors.pasA_MotherInstitution?.message}
                                                    />
                                                    <InputText
                                                        label={`Mother's Mother Tongue`}
                                                        id='pasA_MotherMotherTongue'
                                                        placeholder={`Enter Mother's Mother Tongue`}
                                                        {...register('pasA_MotherMotherTongue')}
                                                        error={errors.pasA_MotherMotherTongue?.message}
                                                    />
                                                    <InputText
                                                        label={`Mother's Business`}
                                                        id='pasA_MotherBusiness'
                                                        placeholder={`Enter Mother's Business`}
                                                        {...register('pasA_MotherBusiness')}
                                                        error={errors.pasA_MotherBusiness?.message}
                                                    />
                                                    <InputText
                                                        label={`Mother's Company/Office`}
                                                        id='pasA_MotherCompany'
                                                        placeholder={`Enter Mother's Company/Office`}
                                                        {...register('pasA_MotherCompany')}
                                                        error={errors.pasA_MotherCompany?.message}
                                                    />
                                                </div>
                                            </div>

                                            <div className='space-y-4'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Additional Contact</h3>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                                    <div className='flex flex-col gap-1.5 '>
                                                        <Controller
                                                            name='pasR_AltContactNo'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div>
                                                                    <Label htmlFor='pasR_AltContactNo'>Mobile No.</Label>
                                                                    <PhoneInput
                                                                        country='in'
                                                                        value={
                                                                            phoneValues.pasR_AltContactNo ??
                                                                            (field.value != null ? String(field.value) : null)
                                                                        }
                                                                        onChange={(phone: any, countryData: any) =>
                                                                            handlePhoneChange(phone, countryData, 'pasR_AltContactNo')
                                                                        }
                                                                        onBlur={() => trigger('pasR_AltContactNo')}
                                                                        inputProps={{
                                                                            id: 'pasR_AltContactNo',
                                                                            name: 'pasR_AltContactNo',
                                                                            maxLength: 25,
                                                                            required: false,
                                                                            style: {
                                                                                width: '87%',
                                                                                height: '36px',
                                                                                marginLeft: '40px',
                                                                                boxSizing: 'border-box',
                                                                                borderRadius: '4px',
                                                                                padding: '16.5px 14px',
                                                                                fontSize: '16px'
                                                                            }
                                                                        }}
                                                                        containerClass='w-full'
                                                                        inputClass='w-full px-4 py-2 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                                        enableSearch
                                                                        disableCountryCode={false}
                                                                        enableLongNumbers={true}
                                                                        isValid={true}
                                                                        preserveOrder={['country', 'nationalNumber']}
                                                                    />
                                                                    {phoneExpectedInfo.pasR_AltContactNo?.expected && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Mobile number must be exactly ${phoneExpectedInfo.pasR_AltContactNo.expected} digits for ${
                                                                                phoneExpectedInfo.pasR_AltContactNo.name ??
                                                                                'selected country'
                                                                            }`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        />
                                                        {errors.pasR_AltContactNo && (
                                                            <FormError>{errors.pasR_AltContactNo.message}</FormError>
                                                        )}
                                                    </div>
                                                    <InputText
                                                        label='Alternate Contact Email'
                                                        id='pasR_AltContactEmail'
                                                        placeholder='Enter alternate email'
                                                        {...register('pasR_AltContactEmail')}
                                                        error={errors.pasR_AltContactEmail?.message}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Document Upload */}
                                {currentStep === 4 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Document Upload</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please upload the required documents. Documents marked with{' '}
                                                <span className='text-red-500'>*</span> are mandatory.
                                            </p>
                                        </div>

                                        {preadmissionDocumentsLoading ? (
                                            <div className='flex items-center justify-center py-12'>
                                                <div className='text-center'>
                                                    <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                                                    <p className='mt-4 text-gray-600 text-sm'>Loading documents...</p>
                                                </div>
                                            </div>
                                        ) : preadmissionDocuments?.data && preadmissionDocuments.data.length > 0 ? (
                                            <div className='overflow-x-auto rounded-lg border border-gray-200'>
                                                <table className='min-w-full divide-y divide-gray-200'>
                                                    <thead className='bg-gray-50'>
                                                        <tr>
                                                            <th
                                                                scope='col'
                                                                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                                Document Name
                                                            </th>
                                                            <th
                                                                scope='col'
                                                                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                                Status
                                                            </th>
                                                            <th
                                                                scope='col'
                                                                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                                Upload
                                                            </th>
                                                            <th
                                                                scope='col'
                                                                className='px-6 py-3 text-center font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='divide-y divide-gray-200 bg-white'>
                                                        {preadmissionDocuments.data.map((document) => {
                                                            const uploadedDoc = getUploadedDocument(document.amsmD_Id);
                                                            const isUploading = uploadedDoc?.isUploading;
                                                            const error = documentErrors[document.amsmD_Id];

                                                            return (
                                                                <tr
                                                                    key={document.amsmD_Id}
                                                                    className={(() => {
                                                                        // Get selected religion details
                                                                        const selectedReligionId = watch('religion_Id');
                                                                        const selectedReligion = religion?.data?.find(
                                                                            (r) => r.ivrmmR_Id === selectedReligionId
                                                                        );
                                                                        const isRomanCatholic =
                                                                            selectedReligion?.ivrmmR_Name === 'Roman Catholic';

                                                                        // Check if this document is conditionally mandatory
                                                                        const isConditionallyMandatory =
                                                                            document.amsmD_DocumentName === 'Baptism Certificate' &&
                                                                            isRomanCatholic;

                                                                        const isMandatory = document.amsmD_FLAG || isConditionallyMandatory;

                                                                        if (uploadedDoc && !isUploading) return 'bg-green-50';
                                                                        if (isMandatory) return 'bg-orange-50';
                                                                        return '';
                                                                    })()}>
                                                                    <td className='whitespace-nowrap px-6 py-4'>
                                                                        {(() => {
                                                                            // Get selected religion details
                                                                            const selectedReligionId = watch('religion_Id');
                                                                            const selectedReligion = religion?.data?.find(
                                                                                (r) => r.ivrmmR_Id === selectedReligionId
                                                                            );
                                                                            const isRomanCatholic =
                                                                                selectedReligion?.ivrmmR_Name === 'Roman Catholic';

                                                                            // Check if this document is conditionally mandatory
                                                                            const isConditionallyMandatory =
                                                                                document.amsmD_DocumentName === 'Baptism Certificate' &&
                                                                                isRomanCatholic;

                                                                            const isMandatory =
                                                                                document.amsmD_FLAG || isConditionallyMandatory;

                                                                            return (
                                                                                <>
                                                                                    <div className='flex items-center gap-2'>
                                                                                        <span className='font-semibold text-gray-900 text-sm'>
                                                                                            {document.amsmD_DocumentName}
                                                                                        </span>
                                                                                        {isMandatory && (
                                                                                            <span className='text-red-500'>*</span>
                                                                                        )}
                                                                                    </div>
                                                                                    <p className='mt-0.5 text-gray-500 text-xs'>
                                                                                        {isMandatory ? 'Required' : 'Optional'}
                                                                                        {isConditionallyMandatory && (
                                                                                            <span className='ml-1 text-orange-600'>
                                                                                                (for Roman Catholic)
                                                                                            </span>
                                                                                        )}
                                                                                    </p>
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </td>

                                                                    <td className='whitespace-nowrap px-6 py-4'>
                                                                        {uploadedDoc && !isUploading ? (
                                                                            <div className='flex items-center gap-2 font-medium text-green-600 text-sm'>
                                                                                <Check className='h-5 w-5' />
                                                                                Uploaded
                                                                            </div>
                                                                        ) : isUploading ? (
                                                                            <div className='flex animate-pulse items-center gap-2 font-medium text-blue-600 text-sm'>
                                                                                <svg
                                                                                    className='h-5 w-5 animate-spin'
                                                                                    fill='none'
                                                                                    stroke='currentColor'
                                                                                    viewBox='0 0 24 24'>
                                                                                    <circle
                                                                                        className='opacity-25'
                                                                                        cx='12'
                                                                                        cy='12'
                                                                                        r='10'
                                                                                        strokeWidth='4'
                                                                                        stroke='currentColor'
                                                                                    />
                                                                                    <path
                                                                                        className='opacity-75'
                                                                                        fill='currentColor'
                                                                                        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                                                                                    />
                                                                                </svg>
                                                                                Uploading...
                                                                            </div>
                                                                        ) : (
                                                                            <span className='text-gray-500 text-sm'>Not Uploaded</span>
                                                                        )}
                                                                        {error && (
                                                                            <p className='mt-1 flex items-center gap-1 font-medium text-red-600 text-xs'>
                                                                                <span>⚠</span> {error}
                                                                            </p>
                                                                        )}
                                                                    </td>

                                                                    <td className='whitespace-nowrap px-6 py-4'>
                                                                        {(!uploadedDoc || isUploading) && (
                                                                            <label
                                                                                htmlFor={`document-${document.amsmD_Id}`}
                                                                                className={cn(
                                                                                    'flex w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 text-center transition-all hover:border-primary hover:bg-gray-50',
                                                                                    isUploading
                                                                                        ? 'border-blue-300 bg-blue-50'
                                                                                        : 'border-gray-300 bg-white'
                                                                                )}>
                                                                                <svg
                                                                                    className='mb-1 h-6 w-6 text-primary'
                                                                                    fill='none'
                                                                                    stroke='currentColor'
                                                                                    viewBox='0 0 24 24'>
                                                                                    <path
                                                                                        strokeLinecap='round'
                                                                                        strokeLinejoin='round'
                                                                                        strokeWidth={2}
                                                                                        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                                                                    />
                                                                                </svg>
                                                                                <span className='text-gray-600 text-xs'>
                                                                                    Click to upload
                                                                                </span>
                                                                                <input
                                                                                    id={`document-${document.amsmD_Id}`}
                                                                                    type='file'
                                                                                    className='hidden'
                                                                                    accept='.pdf,.jpg,.jpeg,.png'
                                                                                    disabled={isUploading || isSubmitting}
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files?.[0];
                                                                                        if (file) {
                                                                                            if (file.size > 5 * 1024 * 1024) {
                                                                                                toast.error(
                                                                                                    'File size must be less than 5MB'
                                                                                                );
                                                                                                e.target.value = ''; // Reset input
                                                                                                return;
                                                                                            }
                                                                                            handleDocumentUpload(
                                                                                                document.amsmD_Id,
                                                                                                file,
                                                                                                document.amsmD_DocumentName
                                                                                            );
                                                                                            e.target.value = ''; // Reset input after starting upload
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </label>
                                                                        )}
                                                                    </td>

                                                                    <td className='space-x-2 whitespace-nowrap px-6 py-4 text-center'>
                                                                        {uploadedDoc && !isUploading && (
                                                                            <>
                                                                                <Button
                                                                                    type='button'
                                                                                    className='w-fit'
                                                                                    onClick={() =>
                                                                                        window.open(uploadedDoc.document_Path, '_blank')
                                                                                    }>
                                                                                    <Eye className='h-4 w-4' />
                                                                                </Button>
                                                                                <Button
                                                                                    type='button'
                                                                                    className='w-fit'
                                                                                    variant='destructive'
                                                                                    disabled={isSubmitting}
                                                                                    onClick={() =>
                                                                                        handleDocumentDelete(
                                                                                            document.amsmD_Id,
                                                                                            uploadedDoc.document_Path,
                                                                                            document.amsmD_DocumentName
                                                                                        )
                                                                                    }>
                                                                                    <Trash className='h-4 w-4' />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className='rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-12 text-center'>
                                                <svg
                                                    className='mx-auto h-12 w-12 text-gray-400'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                                    />
                                                </svg>
                                                <p className='mt-4 text-gray-600 text-sm'>No documents required at this time</p>
                                            </div>
                                        )}

                                        {/* Upload Summary */}
                                        {preadmissionDocuments?.data && preadmissionDocuments.data.length > 0 && (
                                            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                                                <div className='flex items-start gap-3'>
                                                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100'>
                                                        <svg
                                                            className='h-5 w-5 text-blue-600'
                                                            fill='none'
                                                            stroke='currentColor'
                                                            viewBox='0 0 24 24'>
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                strokeWidth={2}
                                                                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className='flex-1'>
                                                        <p className='font-medium text-blue-900 text-sm'>Upload Progress</p>
                                                        <p className='mt-1 text-blue-700 text-sm'>
                                                            {uploadedDocuments.length} of {preadmissionDocuments.data.length} documents
                                                            uploaded
                                                            {preadmissionDocuments.data.filter((d) => d.amsmD_FLAG).length > 0 && (
                                                                <>
                                                                    {' '}
                                                                    (
                                                                    {
                                                                        preadmissionDocuments.data.filter(
                                                                            (d) => d.amsmD_FLAG && isDocumentUploaded(d.amsmD_Id)
                                                                        ).length
                                                                    }{' '}
                                                                    of {preadmissionDocuments.data.filter((d) => d.amsmD_FLAG).length}{' '}
                                                                    mandatory)
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 4: Other Information */}
                                {currentStep === 5 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Other Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Sibling details, previous school information, and undertaking
                                            </p>
                                        </div>

                                        {/* Sibling Details Section (controlled) */}
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Sibling Details</h3>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    onClick={addSibling}
                                                    disabled={isSubmitting}
                                                    className='w-fit'>
                                                    <span className='mr-2'>+</span>
                                                    Add Sibling
                                                </Button>
                                            </div>

                                            {siblingFields.length === 0 ? (
                                                <p className='text-gray-500 text-sm'>
                                                    No siblings added yet. Click "Add Sibling" to add details.
                                                </p>
                                            ) : (
                                                <div className='space-y-4'>
                                                    {siblingFields.map((field, index) => (
                                                        <div key={field.id} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                                                            <div className='mb-3 flex items-center justify-between'>
                                                                <h4 className='font-medium text-gray-700 text-sm'>Sibling {index + 1}</h4>
                                                                <Button
                                                                    type='button'
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() => remove(index)}
                                                                    disabled={isSubmitting}
                                                                    className='h-8 w-fit bg-error text-white'>
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                <Controller
                                                                    name={`siblingsDetails.${index}.pasrS_SiblingsName`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Sibling Name'
                                                                            id={`sibling_name_${index}`}
                                                                            placeholder='Enter sibling name'
                                                                            {...field}
                                                                            error={
                                                                                errors.siblingsDetails?.[index]?.pasrS_SiblingsName?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`siblingsDetails.${index}.pasrS_SiblingsClass`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Class'
                                                                            id={`sibling_class_${index}`}
                                                                            placeholder='Enter class'
                                                                            {...field}
                                                                            error={
                                                                                errors.siblingsDetails?.[index]?.pasrS_SiblingsClass
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`siblingsDetails.${index}.pasrS_SiblingsAdmissionNo`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Admission No'
                                                                            id={`sibling_admission_${index}`}
                                                                            placeholder='Enter admission number'
                                                                            {...field}
                                                                            error={
                                                                                errors.siblingsDetails?.[index]?.pasrS_SiblingsAdmissionNo
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`siblingsDetails.${index}.pasrS_SiblingsSection`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Section'
                                                                            id={`sibling_section_${index}`}
                                                                            placeholder='Enter section'
                                                                            {...field}
                                                                            error={
                                                                                errors.siblingsDetails?.[index]?.pasrS_SiblingsSection
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Previous School Details Section */}
                                        <div className='space-y-4'>
                                            <h3 className='font-semibold text-gray-800 text-lg'>Previous School Details</h3>
                                            <div className='mb-2'>
                                                {/* <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={() =>
                                                        appendPreviousSchool({
                                                            pasrpS_PrvSchoolName: '',
                                                            pasrpS_PreviousClass: '',
                                                            pasrpS_Board: '',
                                                            pasrpS_LeftYear: '',
                                                            pasrpS_LeftReason: '',
                                                            pasrpS_Address: ''
                                                        })
                                                    }
                                                    disabled={isSubmitting}
                                                    className='w-fit'>
                                                    <span className='mr-2'>+</span>
                                                    Add Previous School
                                                </Button> */}
                                            </div>
                                            {previousSchoolFields.length === 0 ? (
                                                <p className='text-gray-500 text-sm'>
                                                    No previous school details added yet. Click "Add Previous School" to add details.
                                                </p>
                                            ) : (
                                                <div className='space-y-4'>
                                                    {previousSchoolFields.map((field, index) => (
                                                        <div key={field.id} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                                                            <div className='mb-3 flex items-center justify-between'>
                                                                <h4 className='font-medium text-gray-700 text-sm'>Previous School</h4>
                                                                {/* <Button
                                                                    type='button'
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() => removePreviousSchool(index)}
                                                                    disabled={isSubmitting}
                                                                    className='h-8 w-fit bg-error text-white'>
                                                                    Remove
                                                                </Button> */}
                                                            </div>
                                                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                <Controller
                                                                    name={`previousSchoolDetails.${index}.pasrpS_PrvSchoolName`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Previous School Name'
                                                                            id={`prev_school_name_${index}`}
                                                                            placeholder='Enter school name'
                                                                            {...field}
                                                                            error={
                                                                                errors.previousSchoolDetails?.[index]?.pasrpS_PrvSchoolName
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`previousSchoolDetails.${index}.pasrpS_PreviousClass`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Previous Class'
                                                                            id={`prev_class_${index}`}
                                                                            placeholder='Enter class'
                                                                            {...field}
                                                                            error={
                                                                                errors.previousSchoolDetails?.[index]?.pasrpS_PreviousClass
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`previousSchoolDetails.${index}.pasrpS_Board`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Board'
                                                                            id={`prev_board_${index}`}
                                                                            placeholder='Enter board'
                                                                            {...field}
                                                                            error={
                                                                                errors.previousSchoolDetails?.[index]?.pasrpS_Board?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`previousSchoolDetails.${index}.pasrpS_LeftYear`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Left Year'
                                                                            id={`prev_left_year_${index}`}
                                                                            placeholder='Enter year'
                                                                            {...field}
                                                                            error={
                                                                                errors.previousSchoolDetails?.[index]?.pasrpS_LeftYear
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`previousSchoolDetails.${index}.pasrpS_LeftReason`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Reason for Leaving'
                                                                            id={`prev_left_reason_${index}`}
                                                                            placeholder='Enter reason'
                                                                            {...field}
                                                                            error={
                                                                                errors.previousSchoolDetails?.[index]?.pasrpS_LeftReason
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name={`previousSchoolDetails.${index}.pasrpS_Address`}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='School Address'
                                                                            id={`prev_address_${index}`}
                                                                            placeholder='Enter address'
                                                                            {...field}
                                                                            error={
                                                                                errors.previousSchoolDetails?.[index]?.pasrpS_Address
                                                                                    ?.message
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <InputTextarea
                                            label={'Reason for Admitting Child'}
                                            id='pasA_AdmittingReason'
                                            placeholder={'Enter reason for admitting child'}
                                            {...register('pasA_AdmittingReason')}
                                            error={errors.pasA_AdmittingReason?.message}
                                            rows={2}
                                        />

                                        <div className='group flex flex-col gap-1.5'>
                                            <Label htmlFor='pasA_WillingToContributeFlg'>Willing to Contribute</Label>
                                            <Controller
                                                name='pasA_WillingToContributeFlg'
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup
                                                        id='pasA_WillingToContributeFlg'
                                                        value={field.value !== undefined ? String(field.value) : '0'}
                                                        onValueChange={(value) => {
                                                            field.onChange(Number(value.toString()));
                                                            if (Number(value) === 0) {
                                                                setValue('pasA_WillingToContributeRemarks', undefined);
                                                            } else {
                                                                setValue('pasA_WillingToContributeRemarks', undefined);
                                                            }
                                                        }}
                                                        required
                                                        className='flex gap-6 pt-2'>
                                                        <div className='flex items-center gap-2'>
                                                            <RadioGroupItem
                                                                value='1'
                                                                id='pasA_WillingToContributeFlg_yes'
                                                                className='h-5 w-5'
                                                            />
                                                            <Label
                                                                htmlFor='pasA_WillingToContributeFlg_yes'
                                                                className='cursor-pointer font-medium'>
                                                                Yes
                                                            </Label>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <RadioGroupItem
                                                                value='0'
                                                                id='pasA_WillingToContributeFlg_no'
                                                                className='h-5 w-5'
                                                            />
                                                            <Label
                                                                htmlFor='pasA_WillingToContributeFlg_no'
                                                                className='cursor-pointer font-medium'>
                                                                No
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>

                                        {watch('pasA_WillingToContributeFlg') === 1 && (
                                            <InputTextarea
                                                label={'Willing to Contribute Remarks'}
                                                id='pasA_WillingToContributeRemarks'
                                                placeholder={'Enter willing to Contribute Remarks'}
                                                {...register('pasA_WillingToContributeRemarks')}
                                                defaultValue={rowData.pasA_WillingToContributeRemarks}
                                                error={errors.pasA_WillingToContributeRemarks?.message}
                                                rows={2}
                                            />
                                        )}

                                        {/* Undertaking Section */}
                                        <div className='rounded-lg border border-gray-200 bg-gray-200 p-6'>
                                            <Controller
                                                name='pasR_UndertakingFlag'
                                                control={control}
                                                render={({ field }) => (
                                                    <div className='space-y-4'>
                                                        <Label className='text-base'>
                                                            <span className='font-bold text-gray-900'>
                                                                Undertaking by the Parents/Guardian:
                                                            </span>
                                                            <p className='mt-3 text-gray-700 text-sm leading-relaxed'>
                                                                I have read all the rules of the School and declare that they are acceptable
                                                                to me and my ward. I shall pay all the School fees quarterly or annually. I
                                                                am willing to pay all other dues as necessary. I have no objection to my
                                                                child participating in any extra curricular activities run by the school.
                                                            </p>
                                                        </Label>
                                                        <RadioGroup
                                                            id='pasR_UndertakingFlag'
                                                            value={field.value !== undefined ? String(field.value) : '0'}
                                                            onValueChange={(value) => field.onChange(Number(value.toString()))}
                                                            required
                                                            className='flex gap-6 pt-2'>
                                                            <div className='flex items-center gap-2'>
                                                                <RadioGroupItem
                                                                    value='1'
                                                                    id='pasR_UndertakingFlag_yes'
                                                                    className='h-5 w-5'
                                                                />
                                                                <Label
                                                                    htmlFor='pasR_UndertakingFlag_yes'
                                                                    className='cursor-pointer font-medium'>
                                                                    I Accept
                                                                </Label>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <RadioGroupItem
                                                                    value='0'
                                                                    id='pasR_UndertakingFlag_no'
                                                                    className='h-5 w-5'
                                                                />
                                                                <Label
                                                                    htmlFor='pasR_UndertakingFlag_no'
                                                                    className='cursor-pointer font-medium'>
                                                                    I Decline
                                                                </Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Footer */}
                            <div className='flex items-center justify-end border-t bg-gray-50 px-6 py-4 md:px-8'>
                                {/* <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    disabled={isSubmitting}
                                    className='w-fit transition-all duration-200 hover:scale-105'>
                                    Reset Form
                                </Button> */}

                                <div className='flex gap-3'>
                                    {currentStep > 1 && (
                                        <Button type='button' variant='outline' onClick={prevStep} disabled={isSubmitting}>
                                            <ChevronLeft className='mr-2 h-4 w-4' />
                                            Previous
                                        </Button>
                                    )}

                                    {currentStep < steps.length ? (
                                        <Button type='button' onClick={nextStep} disabled={isSubmitting}>
                                            Next
                                            <ChevronRight className='ml-2 h-4 w-4' />
                                        </Button>
                                    ) : (
                                        <Button
                                            type='button'
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={isSubmitting}
                                            className='min-w-[160px] transition-all duration-200 hover:scale-105'>
                                            {isSubmitting ? (
                                                <span>Saving...</span>
                                            ) : (
                                                <>
                                                    <Save className='mr-2 h-4 w-4' />
                                                    Update Application
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <IneligibleClassesDialog
                            open={showIneligibleDialog}
                            onOpenChange={setShowIneligibleDialog}
                            classes={ineligibleClasses}
                            cutOffDate={
                                masterConfig?.data &&
                                masterConfig.data.ispaC_ApplCutOffDateFlag === 1 &&
                                masterConfig.data.asmaY_Cut_Of_Date
                                    ? new Date(masterConfig.data.asmaY_Cut_Of_Date)
                                    : new Date()
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
