'use client';

import { Button } from '@/components/ui/button';
import { CalendarYear } from '@/components/ui/calendar_year';
import { Checkbox } from '@/components/ui/checkbox';
import { FormError, Label } from '@/components/ui/extension/field';
import { MobileNumberInput } from '@/components/ui/extension/input-mobile-number';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { InputNumber } from '@/components/ui/extension/input-number';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useAcademicYearDropdown, useConcessionDropdown, useMasterCategoryDropdown, useMasterSectionHeld } from '@/hooks/admission/preadmission/useMasters';
import {
    useActivePreadmissionDetails,
    useAdmissionClassDropdown,
    useCasteDropdown,
    useCountryDropdown,
    useReferenceDropdown,
    useReligionDropdown,
    useSourceDropdown,
    useStateDropdown,
    useDistrictDropdown
} from '@/hooks/admission/preadmission/useTransactions';
import { getIconByName } from '@/lib/lucide-icon-registry';
import { calculateAge, dateToWords } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { studentAdmissionFormSchema } from '@/schemas/admission/admission-form';
import {
    saveFifthTabApi,
    saveFinalTabApi,
    saveFirstTabApi,
    saveFourthTabApi,
    saveGaurdianApi,
    saveSecondTabApi,
    saveStudentPhotoApi,
    saveThirdTabApi
} from '@/server/admission/admission-form/admission';
import { deleteDocument, uploadDocument } from '@/server/document_upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Eye, Save, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FormFields = z.infer<typeof studentAdmissionFormSchema.add>;

interface AddStudentApplicationFormProps {
    onSuccess?: () => void;
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
        name: 'Other Information',
        description: 'Additional details',
        icon: 'ReceiptText'
    },
    {
        id: 5,
        name: 'Health and Medical Details',
        description: 'Health & medical info',
        icon: 'Hospital'
    },
    {
        id: 6,
        name: 'Document Upload',
        description: 'Required documents',
        icon: 'FileUp'
    }
];

export default function AddStudentAdmissionForm({ onSuccess, className = '' }: AddStudentApplicationFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const [showStep3Errors, setShowStep3Errors] = useState(false);
    const {
        watch,
        control,
        register,
        reset,
        trigger,
        setValue,
        getValues,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(studentAdmissionFormSchema.add),
        mode: 'onChange',
        defaultValues: {
            previousSchools: [],
            siblings: [],
            guardian: [],
            amsT_ECSFlag: 0,
            isEmisBpl: 0,
            feeConcessionType: 0,
            hostelRequired: false,
            transportRequired: false
        } as any
    });

    // previous school entries (allow multiple)
    const {
        fields: previousSchoolFields,
        append: appendPreviousSchool,
        remove: removePreviousSchool
    } = useFieldArray({
        control,
        name: 'previousSchools'
    });

    // student mobile numbers (allow multiple up to 5)
    const { fields: mobileFields, append: appendMobile } = useFieldArray({
        control,
        name: 'mobileNos'
    });

    // student email addresses (allow multiple up to 5)
    const { fields: emailFields, append: appendEmail } = useFieldArray({
        control,
        name: 'adm_M_Student_EmailIdDTO'
    });

    useEffect(() => {
        if (emailFields.length === 0) {
            const initial = (getValues('adm_M_Student_EmailIdDTO') || [])[0]?.amsT_emailId ?? getValues('amsT_emailId') ?? '';
            appendEmail({ amsT_emailId: initial });
        }
    }, []);
    const watchedEmails = watch('adm_M_Student_EmailIdDTO');
    useEffect(() => {
        const first = Array.isArray(watchedEmails) && watchedEmails.length > 0 ? (watchedEmails[0]?.amsT_emailId ?? '') : '';
        setValue('amsT_emailId' as any, first);
    }, [watchedEmails, setValue]);

    const [selectedSourceItems, setSelectedSourceItems] = useState<{ pamS_Id: string; pamS_SourceName: string }[]>([]);
    const [_selectedReferenceItems, setSelectedReferenceItems] = useState<{ pamR_Id: string; pamR_ReferenceName: string }[]>([]);

    // overwrite each other when both controls are used on the same tab.
    const [selectedActivityItems, setSelectedActivityItems] = useState<string[]>([]);

    const [sameAsResidential, setSameAsResidential] = useState(false);
    const [phoneExpectedInfo, setPhoneExpectedInfo] = useState<Record<string, { expected?: number; name?: string; dial?: string }>>({});
    const [phoneValues, setPhoneValues] = useState<Record<string, string>>({});

    const [uploadedDocuments, setUploadedDocuments] = useState<
        Array<{
            pasrD_Id: number;
            pasR_Id: number;
            amsmD_Id: number;
            document_Path: string;
            documentName?: string;
            isUploading?: boolean;
            file?: File;
        }>
    >([]);

    // Persisted amsT_Id returned from server after saving Step 1
    const [savedAmsTId, setSavedAmsTId] = useState<number | null>(null);

    const [studentPhoto, setStudentPhoto] = useState<{
        amsT_Photoname: string;
        isUploading?: boolean;
    } | null>(null);
    const [studentPhotoFile, setStudentPhotoFile] = useState<File | null>(null);
    const [studentPhotoError, setStudentPhotoError] = useState<string | null>(null);

    // Prevent multiple final submissions by showing submitting state
    const [submittingFinal, setSubmittingFinal] = useState(false);

    // Track when currently saving step data to prevent multiple submissions
    const [isSavingStep, setIsSavingStep] = useState(false);

    // Parent photos & signatures for Step 6 (similar to student photo)
    const [fatherPhoto, setFatherPhoto] = useState<{ path?: string; isUploading?: boolean } | null>(null);
    const [_fatherPhotoFile, setFatherPhotoFile] = useState<File | null>(null);
    const [_fatherPhotoError, setFatherPhotoError] = useState<string | null>(null);

    const [motherPhoto, setMotherPhoto] = useState<{ path?: string; isUploading?: boolean } | null>(null);
    const [_motherPhotoFile, setMotherPhotoFile] = useState<File | null>(null);
    const [_motherPhotoError, setMotherPhotoError] = useState<string | null>(null);

    const [fatherSignature, setFatherSignature] = useState<{ path?: string; isUploading?: boolean } | null>(null);
    const [_fatherSignatureFile, setFatherSignatureFile] = useState<File | null>(null);
    const [_fatherSignatureError, setFatherSignatureError] = useState<string | null>(null);

    const [motherSignature, setMotherSignature] = useState<{ path?: string; isUploading?: boolean } | null>(null);
    const [_motherSignatureFile, setMotherSignatureFile] = useState<File | null>(null);
    const [_motherSignatureError, setMotherSignatureError] = useState<string | null>(null);

    // Guardian photo & signature per guardian index (supports multiple guardians)
    // Keep optional `file` so we can send binary `File` objects to backend
    const [guardianPhotos, setGuardianPhotos] = useState<Record<number, { path?: string; isUploading?: boolean; file?: File }>>({});
    const [guardianSignatures, setGuardianSignatures] = useState<Record<number, { path?: string; isUploading?: boolean; file?: File }>>({});

    // Keep a snapshot of saved guardian values so we can detect unsaved edits
    const [savedGuardianSnapshot, setSavedGuardianSnapshot] = useState<Record<number, any>>({});
    // Explicit saved-flag per guardian index (true after successful Save)
    const [savedGuardianSaved, setSavedGuardianSaved] = useState<Record<number, boolean>>({});

    const [_documentErrors, setDocumentErrors] = useState<Record<number, string>>({});
    const [_handledStep3, setHandledStep3] = useState(false);

    const { data: activePreadmission } = useActivePreadmissionDetails();

    // Ensure the academic year from active preadmission is present in react-hook-form state
    useEffect(() => {
        const year = activePreadmission?.data?.asmaY_Year ?? '';
        const id = Number(activePreadmission?.data?.asmaY_Id ?? 0) || 0;
        setValue('asmaY_Year' as any, year);
        setValue('asmaY_Id' as any, id);
    }, [activePreadmission, setValue]);

    const { data: religion, isLoading: religionLoading, error: religionError, refetchAll: refetchReligion } = useReligionDropdown();
    const { data: studentCategory, isLoading: studentCategoryLoading, isError: studentCategoryError } = useMasterCategoryDropdown();

    // Watch all country fields
    const conConuntryId = watch('amsT_ConCountry');
    const perConuntryId = watch('amsT_PerCountry');

    const conStateId = watch('amsT_ConState');
    const {
        data: conDistrict,
        isLoading: conDistrictLoading,
        error: conDistrictError
    } = useDistrictDropdown(Number(conStateId));

    const perStateId = watch('amsT_PerState');
    const {
        data: perDistrict,
        isLoading: perDistrictLoading,
        error: perDistrictError
    } = useDistrictDropdown(Number(perStateId));

    // Watch guardian fields to conditionally show uploads when guardian name is present
    const watchedGuardians = watch('guardian');

    // helper: check if any of the common guardian fields has content
    const guardianHasContent = (g: any) => {
        if (!g) return false;
        const keys = ['guardianName', 'guardianPhone', 'guardianEmail', 'guardianAddress'];
        return keys.some((k) => !!String(g[k] ?? '').trim());
    };

    // helper: shallow compare saved snapshot to current guardian values
    const shallowEqualGuardians = (a: any, b: any) => {
        if (!a || !b) return false;
        return (
            String(a.guardianName ?? '') === String(b.guardianName ?? '') &&
            String(a.guardianPhone ?? '') === String(b.guardianPhone ?? '') &&
            String(a.guardianEmail ?? '') === String(b.guardianEmail ?? '') &&
            String(a.guardianAddress ?? '') === String(b.guardianAddress ?? '')
        );
    };

    // Invalidate saved snapshots if user edits guardian fields after save
    useEffect(() => {
        if (!watchedGuardians) return;
        const nextSnapshot: Record<number, any> = { ...savedGuardianSnapshot };
        const nextSavedFlags: Record<number, boolean> = { ...savedGuardianSaved };
        (watchedGuardians || []).forEach((g: any, idx: number) => {
            if (nextSnapshot[idx] && !shallowEqualGuardians(nextSnapshot[idx], g)) {
                // User edited a previously-saved guardian -> mark as unsaved
                delete nextSnapshot[idx];
                nextSavedFlags[idx] = false;
            }
            // if there's content and no snapshot, ensure saved flag is false
            if (guardianHasContent(g) && !nextSnapshot[idx]) {
                nextSavedFlags[idx] = false;
            }
        });
        // remove snapshots and flags for indices that no longer exist
        Object.keys(nextSnapshot).forEach((k) => {
            const i = Number(k);
            if (!watchedGuardians[i]) delete nextSnapshot[i];
        });
        Object.keys(nextSavedFlags).forEach((k) => {
            const i = Number(k);
            if (!watchedGuardians[i]) delete nextSavedFlags[i];
        });
        setSavedGuardianSnapshot(nextSnapshot);
        setSavedGuardianSaved(nextSavedFlags);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedGuardians]);

    // Whether there is any guardian with content that is not saved yet (only on Step 4)
    const hasUnsavedGuardian = useMemo(() => {
        if (currentStep !== 4) return false;
        const arr = Array.isArray(watchedGuardians) ? watchedGuardians : [];
        for (let i = 0; i < arr.length; i++) {
            const g = arr[i];
            if (guardianHasContent(g) && !savedGuardianSaved[i]) {
                return true;
            }
        }
        return false;
    }, [watchedGuardians, savedGuardianSaved, currentStep]);

    // Use the nationality fields used in the Step 3 UI so state dropdowns refetch correctly
    const fatherPresentCountryId = watch('fatherNationality');
    const _fatherPermanentCountryId = watch('fatherNationality');
    const motherPresentCountryId = watch('motherNationality');
    const _motherPermanentCountryId = watch('motherNationality');
    const birthCountryId = watch('amsT_PlaceOfBirthCountry');

    const fatherAlive = watch('fatherAliveFlag');
    // Support multiple possible keys for mother-alive checkbox coming from different places
    const motherAlive = watch('motherAliveFlag') || watch('MotherAliveFlag') || false;
    const {
        data: caste,
        isLoading: casteLoading,
        error: casteError,
        refetchAll: refetchCaste
    } = useCasteDropdown(watch('amsT_ReligionId'));

    // Caste dropdowns for father and mother should depend on their selected religion
    const {
        data: fatherCaste,
        isLoading: fatherCasteLoading,
        error: fatherCasteError,
        refetchAll: refetchFatherCaste
    } = useCasteDropdown(watch('fatherReligionId') ?? 0);

    const {
        data: motherCaste,
        isLoading: motherCasteLoading,
        error: motherCasteError,
        refetchAll: refetchMotherCaste
    } = useCasteDropdown(watch('motherReligionId') ?? 0);
    const genderOptions = [
        { id: 'Male', name: 'Male' },
        { id: 'Female', name: 'Female' },
        { id: 'Other', name: 'Other' }
    ];
    const { data: admissionClass, isLoading: admissionClassLoading, isError: admissionClassError } = useAdmissionClassDropdown();
    const classId = watch('asmcL_Id');
    const { data: sectionData, isLoading: sectionLoading, isError: sectionError } = useMasterSectionHeld(Number(classId));
    const { data: country, isLoading: countryLoading, error: countryError, refetchAll: refetchCountry } = useCountryDropdown();

    // Student address states
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

    // Student country -> states (Step 1 student country/state)
    const studentCountryId = watch('amsT_StudentCountry');
    const { data: studentState, isLoading: studentStateLoading, error: studentStateError } = useStateDropdown(Number(studentCountryId));

    // Father address states
    const {
        data: fatherPresentState,
        isLoading: fatherPresentStateLoading,
        error: fatherPresentStateError,
        refetchAll: refetchFatherPresentState
    } = useStateDropdown(Number(fatherPresentCountryId));

    // Mother address states
    const {
        data: motherPresentState,
        isLoading: motherPresentStateLoading,
        error: motherPresentStateError,
        refetchAll: refetchMotherPresentState
    } = useStateDropdown(Number(motherPresentCountryId));

    // Birth place state
    const {
        data: birthState,
        isLoading: birthStateLoading,
        error: birthStateError,
        refetchAll: refetchBirthState
    } = useStateDropdown(Number(birthCountryId));

    const { data: source, isLoading: sourceLoading, refetchAll: refetchSource } = useSourceDropdown();
    const { data: reference, isLoading: referenceLoading, refetchAll: refetchReference } = useReferenceDropdown();
    // Preadmission documents API removed - using local uploads instead
    const { data: concession, isLoading: concessionLoading, refetchAll: refetchConcession } = useConcessionDropdown();
    const { data: academicYears, isLoading: academicLoading, refetchAll: refetchAcademic } = useAcademicYearDropdown();

    const _refetchDropdowns = () => {
        refetchReligion();
        refetchCaste();
        refetchFatherCaste();
        refetchMotherCaste();
        refetchCountry();
        refetchSource();
        refetchReference();
        refetchConcession();
        refetchAcademic();
        refetchConState();
        refetchPerState();
        refetchFatherPresentState();
        refetchMotherPresentState();
        refetchBirthState();
    };

    // Component for a single previous-school row's country/state selects.
    const PreviousSchoolRow = ({ idx }: { idx: number }) => {
        const countryId = watch(`previousSchools.${idx}.countryId` as const) as any;
        const { data: prevStates, isLoading: prevStatesLoading } = useStateDropdown(Number(countryId));

        return (
            <>
                <div className='flex flex-col gap-1.5'>
                    <Label>Country</Label>

                    <Controller
                        name={`previousSchools.${idx}.countryId` as const}
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value?.toString() || ''}
                                onValueChange={(val) => {
                                    const num = Number(val);
                                    field.onChange(num);
                                    const sel = country?.data?.find((c: any) => Number(c.ivrmmC_Id) === num);
                                    (setValue as any)(`previousSchools.${idx}.country`, sel?.ivrmmC_CountryName ?? '');
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Country' />
                                </SelectTrigger>
                                <SelectContent>
                                    {countryLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
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

                    {errors.previousSchools?.[idx]?.countryId && <FormError>{errors.previousSchools[idx].countryId.message}</FormError>}
                </div>

                <div className='flex flex-col gap-1.5'>
                    <Label>State</Label>
                    <Controller
                        name={`previousSchools.${idx}.stateId` as const}
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value?.toString() || ''}
                                onValueChange={(val) => {
                                    const num = Number(val);
                                    field.onChange(num);
                                    const sel = prevStates?.data?.find((s: any) => Number(s.ivrmmS_Id) === num);
                                    (setValue as any)(`previousSchools.${idx}.state`, sel?.ivrmmS_Name ?? '');
                                }}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select State' />
                                </SelectTrigger>
                                <SelectContent>
                                    {prevStatesLoading ? (
                                        <SelectItem value='loading' disabled>
                                            Loading...
                                        </SelectItem>
                                    ) : (
                                        prevStates?.data?.map((item) => (
                                            <SelectItem key={item.ivrmmS_Id} value={item.ivrmmS_Id.toString()}>
                                                {item.ivrmmS_Name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.previousSchools?.[idx]?.stateId && <FormError>{errors.previousSchools[idx].stateId.message}</FormError>}
                </div>
            </>
        );
    };

    const saveFirstTab = async (formData: any) => {
        try {
            // Guard: ensure minimal required fields are present before calling API
            // This prevents any code path (including forced/auto-save) from calling server with incomplete data.
            const requiredFields = ['amsT_FirstName', 'amsT_LastName', 'asmcL_Id', 'amsT_Date', 'amsT_DOB'];

            // If any required field is missing in formData, abort
            const missingRequired = requiredFields.filter((k) => {
                const v = formData?.[k];
                return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
            });
            if (missingRequired.length > 0) {
                console.warn('[Admission] saveFirstTab aborted - missing required fields:', missingRequired);
                toast.error('Please complete required fields before saving Step 1');
                throw new Error(`Validation failed: missing required fields: ${missingRequired.join(', ')}`);
            }

            // Student photo required
            if (!formData.amsT_Photoname && !formData.amsT_Photoname) {
                console.warn('[Admission] saveFirstTab aborted - missing student photo');
                toast.error('Please upload student photo');
                throw new Error('Validation failed: missing student photo');
            }

            // EMIS conditional
            if (Number(formData.isEmisBpl ?? formData.isEmisBpl) === 1) {
                const emis = String(formData.amsT_BPLCardNo ?? getValues('amsT_BPLCardNo') ?? '').trim();
                if (!emis) {
                    toast.error('EMIS / BPL / STS No. is required');
                    throw new Error('Validation failed: missing EMIS');
                }
            }

            // ECS conditional: check nested or flat fields
            if (Number(formData.amsT_ECSFlag ?? getValues('amsT_ECSFlag') ?? 0) === 1) {
                const ecs = formData.adm_M_Student_ECS ?? {};
                const flat = formData;
                const acctNo = String(ecs.asecS_AccountNo ?? flat.asecS_AccountNo ?? getValues('asecS_AccountNo') ?? '').trim();
                const holder = String(
                    ecs.asecS_AccountHolderName ?? flat.asecS_AccountHolderName ?? getValues('asecS_AccountHolderName') ?? ''
                ).trim();
                const bank = String(ecs.asecS_BankName ?? flat.asecS_BankName ?? getValues('asecS_BankName') ?? '').trim();
                const type = String(ecs.asecS_AccountType ?? flat.asecS_AccountType ?? getValues('asecS_AccountType') ?? '').trim();
                const micr = String(ecs.asecS_MICRNo ?? flat.asecS_MICRNo ?? getValues('asecS_MICRNo') ?? '').trim();
                const branch = String(ecs.asecS_Branch ?? flat.asecS_Branch ?? getValues('asecS_Branch') ?? '').trim();
                if (!acctNo || !holder || !bank || !type || !micr || !branch) {
                    toast.error('Please fill all ECS account details');
                    console.warn('[Admission] saveFirstTab aborted - missing ECS details');
                    throw new Error('Validation failed: missing ECS details');
                }
            }
            // Build payload expected by server for first tab
            const payload = {
                amsT_Id: 0,
                mI_Id: Number(formData.mI_Id ?? 30),
                asmaY_Id: Number(formData.asmaY_Id ?? formData.asmaY_Year ?? 0),
                asmcL_Id: Number(formData.asmcL_Id ?? 0),
                asmS_Id: Number(formData.asmS_Id ?? 0),
                amsT_Date: formData.amsT_Date ? new Date(formData.amsT_Date).toISOString() : new Date().toISOString(),
                amsT_RegistrationNo: String(formData.amsT_RegistrationNo ?? ''),
                amsT_AdmissionNo: String(formData.amsT_AdmissionNo ?? ''),
                amsT_DateOfAdmission: formData.amsT_Date ? new Date(formData.amsT_Date).toISOString() : new Date().toISOString(),
                amsT_FirstName: formData.amsT_FirstName ?? '',
                amsT_MiddleName: formData.amsT_MiddleName ?? '',
                amsT_LastName: formData.amsT_LastName ?? '',
                amsT_Sex: String(formData.amsT_Sex ?? ''),
                amsT_DOB: formData.amsT_DOB ? new Date(formData.amsT_DOB).toISOString() : undefined,
                amsT_DOB_Words: formData.amsT_DOB_Words ?? dateToWords(formData.amsT_DOB) ?? '',
                pasR_Age: Number(formData.pasR_Age ?? 0),
                amsT_MotherTongue: formData.amsT_MotherTongue ?? '',
                amsT_LanguageSpoken: formData.amsT_LanguageSpoken ?? '',
                amsT_StudentCategory_Id: Number(formData.amsT_StudentCategory_Id ?? 0),
                amsT_BloodGroup: formData.amsT_BloodGroup ?? '',
                ivrmmR_Id: Number(formData.ivrmmR_Id ?? formData.amsT_ReligionId ?? 0),
                imcC_Id: Number(formData.studentCategoryId ?? 0),
                amsT_SubCasteIMC_Id: (formData.amsT_SubCasteIMC_Id ?? '')?.toString() ?? '',
                amsT_CasteCertiNo: formData.amsT_CasteCertiNo ?? '',
                studentPhotoUrl: '',
                amsT_BirthPlace: formData.amsT_BirthPlace ?? '',
                amsT_BirthCertNO: formData.amsT_BirthCertNO ?? '',
                amsT_AadharNo: Number(formData.amsT_AadharNo) || 0,
                amsT_BiometricId: formData.amsT_BiometricId ?? '',
                amsT_RFCardNo: formData.amsT_RFCardNo ?? '',
                isEmisBpl: !!formData.isEmisBpl,
                amsT_BPLCardNo: formData.amsT_BPLCardNo ?? '',
                mobileCountryCode: (() => {
                    const mobileNos = getValues('mobileNos') as any[];
                    return Array.isArray(mobileNos) && mobileNos.length > 0
                        ? String(mobileNos[0]?.amstsmS_CountryCode ?? '')
                        : '';
                })(),
                mobileNumber: (() => {
                    const mobileNos = getValues('mobileNos') as any[];
                    return Array.isArray(mobileNos) && mobileNos.length > 0
                        ? String(mobileNos[0]?.amsT_MobileNo ?? '')
                        : String(formData.amsT_MobileNo ?? '');
                })(),
                emailId: (() => {
                    const emails = formData.adm_M_Student_EmailIdDTO;
                    return Array.isArray(emails) && emails.length > 0
                        ? String(emails[0]?.amsT_emailId ?? '')
                        : String(formData.amsT_emailId ?? '');
                })(),
                amsT_PerState: Number(formData.amsT_PerState ?? 0),
                amsT_PerDistrict: Number(formData.amsT_PerDistrict ?? 0),
                amsT_PerCountry: Number(formData.amsT_PerCountry ?? 0),
                amsT_PerPincode: Number(formData.amsT_PerPincode) || 0,
                amsT_BankName: formData.amsT_BankName ?? '',
                amsT_BankBranch: formData.amsT_BankBranch ?? '',
                amsT_BankAccountNo: formData.amsT_BankAccountNo ?? '',
                amsT_BankIFSCCode: formData.amsT_BankIFSCCode ?? '',
                amsT_ECSFlag: !!(formData.amsT_ECSFlag ?? false),
                adm_M_Student_ECS: {
                    asecS_AccountNo: formData.amsT_ECSFlag
                        ? (formData.adm_M_Student_ECS?.asecS_AccountNo ?? formData.asecS_AccountNo ?? '')
                        : '',
                    asecS_AccountHolderName: formData.amsT_ECSFlag
                        ? (formData.adm_M_Student_ECS?.asecS_AccountHolderName ?? formData.asecS_AccountHolderName ?? '')
                        : '',
                    asecS_BankName: formData.amsT_ECSFlag
                        ? (formData.adm_M_Student_ECS?.asecS_BankName ?? formData.asecS_BankName ?? '')
                        : '',
                    asecS_AccountType: formData.amsT_ECSFlag
                        ? (formData.adm_M_Student_ECS?.asecS_AccountType ?? formData.asecS_AccountType ?? '')
                        : '',
                    asecS_MICRNo: formData.amsT_ECSFlag ? (formData.adm_M_Student_ECS?.asecS_MICRNo ?? formData.asecS_MICRNo ?? '') : '',
                    asecS_BranchName: formData.amsT_ECSFlag ? (formData.adm_M_Student_ECS?.asecS_Branch ?? formData.asecS_Branch ?? '') : ''
                },
                feeConcessionType: Number(formData.feeConcessionType ?? 0),
                amsT_Tpin: formData.amsT_Tpin ?? '',
                amsT_GPSTrackingId: formData.amsT_GPSTrackingId ?? '',
                amsT_MediumOfInstruction: formData.amsT_MediumOfInstruction ?? '',
                userId: Number(formData.userId ?? 0) || 21602,
                editFlag: !!formData.editFlag,
                returnVal: true
            };

            console.debug('[Admission] saveFirstTab payload:', payload);
            console.info(payload)
            console.log(payload)

            // Send JSON payload directly
            const res = await saveFirstTabApi(payload);
            console.debug('[Admission] saveFirstTab response:', res);
            if (res?.success && res?.data !== undefined && res?.data !== null) {
                try {
                    const returnedId = Number(res.data) || 0;
                    if (returnedId) {
                        setValue('amsT_Id' as any, returnedId);
                        setSavedAmsTId(returnedId);
                    }
                } catch (e) {
                    console.warn('Failed to set amsT_Id from response', e);
                }
            }
            if (!res?.success) {
                throw new Error(res?.message || 'Failed to save step 1');
            }
            toast.success('Step 1 saved');
            return res;
        } catch (error) {
            console.error('Error saving first tab:', error);
            throw error;
        }
    };

    const __markUsed = (..._args: any[]) => {
        /* intentionally empty */
    };

    __markUsed(reference, referenceLoading, refetchReference);

    const saveThirdTab = async () => {
        console.debug('[Admission] enter saveThirdTab');
        try {
            const formData = getValues();

            const payload = {
                amsT_Id: Number(getValues('amsT_Id' as any) ?? 0) || 15353,
                userId: 21602,
                miId: 30,
                amsT_FatherPassingYear: Number(formData.amsT_FatherPassingYear ?? 0) || 0,

                // Father
                fatherAliveFlag: !!(formData.fatherAliveFlag ?? false),
                fatherName: formData.fatherName || '',
                fatherSurname: formData.fatherSurname || '',
                fatherAadharNo: formData.fatherAadharNo || '',
                fatherMaritalStatus: formData.fatherMaritalStatus ?? '',
                fatherMonthlyIncome: 0,
                fatherMobileNumbers: Array.isArray(formData.fatherMobileNumbers)
                    ? formData.fatherMobileNumbers.map((m: any) => ({
                        mobileNo: String(m.mobileNo ?? m.amsT_MobileNo ?? m)
                    }))
                    : formData.fatherMobileNumbers
                        ? [{ mobileNo: String(formData.fatherMobileNumbers) }]
                        : [],
                fatherEmailIds: Array.isArray(formData.fatherEmailIds)
                    ? formData.fatherEmailIds.map((e: any) => ({
                        emailId: String(e.emailId ?? e.amsT_emailId ?? e)
                    }))
                    : formData.fatherEmailIds
                        ? [{ emailId: String(formData.fatherEmailIds) }]
                        : [],
                fatherHomePhone: formData.fatherHomePhone || formData.fatherHomePhone || '',
                fatherNationality: Number(formData.fatherNationality ?? 0) || 0,
                fatherEducation: formData.FatherEducation || '',
                fatherPresentAddress: {
                    address: formData.fatherPresentAddress?.address || '',
                    //   country: "India",
                    country: formData.fatherPresentAddress?.country || '',
                    city: formData.fatherPresentAddress?.city || '',
                    state: Number(formData.fatherPresentAddress?.state ?? 0) || 0,
                    po: formData.fatherPresentAddress?.po || '',
                    pincode: formData.fatherPresentAddress?.pincode || '',
                    ps: formData.fatherPresentAddress?.ps || ''
                },
                fatherPermanentAddress: {
                    address: formData.fatherPermanentAddress?.address || '',
                    //   country: "India",
                    country: formData.fatherPermanentAddress?.country || '',
                    city: formData.fatherPermanentAddress?.city || '',
                    state: Number(formData.fatherPermanentAddress?.state ?? 0) || 0,
                    po: formData.fatherPermanentAddress?.po || '',
                    pincode: formData.fatherPermanentAddress?.pincode || '',
                    ps: formData.fatherPermanentAddress?.ps || ''
                },
                fatherOfficeAddress: formData.fatherOfficeAddress || '',
                fatherOfficePhone: formData.fatherOfficePhone || '',
                fatherOccupation: formData.fatherOccupation || '',
                fatherDesignation: formData.fatherDesignation || '',
                fatherReligionId: Number(formData.fatherReligionId ?? 0) || 0,
                fatherCasteId: Number(formData.fatherCasteId ?? 0) || 0,
                fatherSubCaste: formData.fatherSubCaste || '',

                fatherAnnualIncome: Number(formData.fatherAnnualIncome ?? 0) || 0,
                fatherCasteCertificateNo: formData.fatherCasteCertificateNo || '',
                fatherPAN: formData.fatherPAN || '',
                fatherSelfEmployedFlg: !!formData.fatherSelfEmployedFlg,

                // Mother
                motherAliveFlag: !!(formData.motherAliveFlag ?? false),
                motherName: formData.motherName || '',
                motherSurname: formData.motherSurname || '',
                motherAadharNo: formData.motherAadharNo || '',
                motherMaritalStatus: formData.motherMaritalStatus ?? '',
                motherMobileNumbers: Array.isArray(formData.motherMobileNumbers)
                    ? formData.motherMobileNumbers.map((m: any) => ({
                        mobileNo: String(m.mobileNo ?? m.amsT_MobileNo ?? m)
                    }))
                    : formData.motherMobileNumbers
                        ? [{ mobileNo: String(formData.motherMobileNumbers) }]
                        : [],
                motherEmailIds: Array.isArray(formData.motherEmailIds)
                    ? formData.motherEmailIds.map((e: any) => ({
                        emailId: String(e.emailId ?? e.amsT_emailId ?? e)
                    }))
                    : formData.motherEmailIds
                        ? [{ emailId: String(formData.motherEmailIds) }]
                        : [],
                motherHomePhone: formData.motherHomePhone || '',
                motherNationality: Number(formData.motherNationality ?? 0) || 0,
                motherQualification: formData.motherQualification || '',
                motherPassingYear: Number(formData.motherPassingYear ?? 0) || 0,
                motherPresentAddress: {
                    address: formData.motherPresentAddress?.address || '',
                    //   country: "India",
                    country: formData.motherPresentAddress?.country || '',
                    city: formData.motherPresentAddress?.city || '',
                    state: Number(formData.motherPresentAddress?.state ?? 0) || 0,
                    po: formData.motherPresentAddress?.po || '',
                    pincode: formData.motherPresentAddress?.pincode || '',
                    ps: formData.motherPresentAddress?.ps || ''
                },
                motherPermanentAddress: {
                    address: formData.motherPermanentAddress?.address || '',
                    //   country: "India",
                    country: formData.motherPermanentAddress?.country || '',
                    city: formData.motherPermanentAddress?.city || '',
                    state: Number(formData.motherPermanentAddress?.state ?? 0) || 0,
                    po: formData.motherPermanentAddress?.po || '',
                    pincode: formData.motherPermanentAddress?.pincode || '',
                    ps: formData.motherPermanentAddress?.ps || ''
                },
                motherOfficeAddress: formData.motherOfficeAddress || '',
                motherOfficePhone: formData.motherOfficePhone || '',
                motherOccupation: formData.motherOccupation || '',
                motherDesignation: formData.motherDesignation || '',
                motherReligionId: Number(formData.motherReligionId ?? 0) || 0,
                motherCasteId: Number(formData.motherCasteId ?? 0) || 0,
                motherSubCaste: formData.motherSubCaste || '',
                motherMonthlyIncome: 0,
                motherAnnualIncome: Number(formData.motherAnnualIncome ?? 0) || 0,
                motherCasteCertificateNo: formData.motherCasteCertificateNo || '',
                motherPAN: formData.motherPAN || '',
                motherEducation: '',
                motherSelfEmployedFlg: !!formData.motherSelfEmployedFlg
            };

            // Call server API to save third tab
            console.debug('[Admission] saveThirdTab payload:', payload);
            const response = await saveThirdTabApi(payload);
            console.debug('[Admission] saveThirdTab response:', response);
            if (response?.success) {
                return response;
            }
            throw new Error(response?.message || 'Failed to save parents data');
        } catch (error) {
            console.error('Error saving parents data:', error);
            throw error;
        }
    };

    const nextStep = async () => {
        // Prevent multiple simultaneous calls
        if (isSavingStep) return;

        // Block progression if there are unsaved guardian edits on Step 4
        try {
            // Immediate check using current form values to avoid stale memo
            if (currentStep === 4) {
                const currentGuardians = (getValues('guardian') || []) as any[];
                for (let i = 0; i < currentGuardians.length; i++) {
                    const g = currentGuardians[i] || {};
                    const hasContent = Boolean(
                        String(g.guardianName || '').trim() ||
                        String(g.guardianPhone || '').trim() ||
                        String(g.guardianEmail || '').trim() ||
                        String(g.guardianAddress || '').trim()
                    );
                    if (hasContent && !savedGuardianSaved[i]) {
                        toast.error('Please save guardian details before proceeding.');
                        return;
                    }
                }
            }
            console.debug('[Admission] nextStep invoked, currentStep=', currentStep);
        } catch (e) {
            console.error('nextStep logging failed', e);
        }
        // Pre-validate student photo for Step 1 so user sees immediate warning
        if (currentStep === 1) {
            if (!studentPhoto?.amsT_Photoname) {
                toast.error('Please upload student photo');
                return;
            }
        }
        try {
            let fieldsToValidate: any[] = [];

            if (currentStep === 1) {
                fieldsToValidate = [
                    'amsT_FirstName',
                    'amsT_MiddleName',
                    'amsT_LastName',
                    'amsT_RegistrationNo',
                    'amsT_AdmissionNo',
                    'asmcL_Id',
                    'asmS_Id',
                    'amsT_StudentCountry',
                    'amsT_Date',
                    'amsT_DOB',
                    'amsT_ReligionId',
                    'amsT_Sex',
                    'amsT_MobileNo',
                    'studentCategoryId',
                    'feeConcessionType'
                ];
                // If EMIS checkbox is set, ensure the EMIS field is validated
                if (Number(getValues('isEmisBpl') ?? 0) === 1) {
                    fieldsToValidate.push('amsT_BPLCardNo');
                }

                // If ECS flag is set, ensure ECS bank detail fields are validated
                if (Number(getValues('amsT_ECSFlag') ?? 0) === 1) {
                    fieldsToValidate.push(
                        'asecS_AccountNo',
                        'asecS_AccountHolderName',
                        'asecS_BankName',
                        'asecS_AccountType',
                        'asecS_MICRNo',
                        'asecS_Branch'
                    );
                }

                const candidateFields = ['amsT_MobileNo', 'amsT_MobileNo'];
                let rawVal = '';
                for (const f of candidateFields) {
                    const v = watch(f as any);
                    if (v !== undefined && v !== null && String(v).trim() !== '') {
                        rawVal = String(v);
                        break;
                    }
                }
                // Fallback to phoneValues if the form field is empty (PhoneInput may store value there)
                if (!rawVal || rawVal === '') {
                    for (const f of candidateFields) {
                        if (phoneValues[f]) {
                            rawVal = String(phoneValues[f]);
                            break;
                        }
                    }
                }
            } else if (currentStep === 2) {
                fieldsToValidate = [
                    'amsT_ConStreet',
                    'amsT_ConArea',
                    'amsT_ConCountry',
                    'amsT_ConState',
                    'amsT_ConCity',
                    // include pincode fields so their validation runs when moving to next step
                    'amsT_ConPincode',
                    'amsT_PerStreet',
                    'amsT_PerArea',
                    'amsT_PerCountry',
                    'amsT_PerState',
                    'amsT_PerCity'
                ];
                // Only validate Permanent pincode when it's not marked same as residential
                if (!sameAsResidential) {
                    fieldsToValidate.push('amsT_PerPincode');
                }
            } else if (currentStep === 3) {
                fieldsToValidate = [];

                if (fatherAlive) {
                    fieldsToValidate.push('fatherName', 'fatherNationality');
                }

                if (motherAlive) {
                    fieldsToValidate.push('motherName', 'motherNationality');
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
                fieldsToValidate = [
                    'amsT_PlaceOfBirthCountry',
                    'amsT_PlaceOfBirthState',
                    'amsT_Distirct',
                    'amsT_Taluk',
                    'amsT_Town',
                    'amsT_Village',
                    'achievements',
                    'amsT_OtherInformations'
                ];
            }

            const isValid = await trigger(fieldsToValidate.length > 0 ? fieldsToValidate : []);
            console.info('Validation Result:', isValid);
            console.info('Fields Validated:', fieldsToValidate);
            console.info('Validation Errors:', errors);

            // Log specific field errors for debugging
            if (!isValid) {
                console.error('=== VALIDATION FAILED ===');
                Object.keys(errors).forEach((fieldName) => {
                    const error = (errors as any)[fieldName];
                    console.error(`Field: ${fieldName}`, {
                        message: error?.message,
                        type: error?.type,
                        value: getValues(fieldName as any)
                    });
                });
                console.error('========================');
            }

            // Check if there are any validation errors on the current form state
            if (!isValid) {
                console.debug('[Admission] Validation errors detected, aborting API call', { isValid, errors: Object.keys(errors) });
                toast.error('Please fix all errors before proceeding');
                return;
            }

            // Set saving state to prevent multiple submissions
            setIsSavingStep(true);

            if (currentStep === 3) {
                if (!isValid) {
                    setShowStep3Errors(true);
                    setIsSavingStep(false);
                    return;
                }
                setShowStep3Errors(false);
                // Get selected religion details
                const selectedReligionId = watch('motherReligionId');
                const selectedReligion = religion?.data?.find((r) => r.ivrmmR_Id === selectedReligionId);
                const _isRomanCatholic = selectedReligion?.ivrmmR_Name === 'Roman Catholic';
            }

            if (isValid && Number(currentStep) === 3) {
                try {
                    const res = await saveThirdTab();
                    if (!res?.success) {
                        toast.error(res?.message || 'Failed to save step 3 (immediate)');
                        setIsSavingStep(false);
                        return;
                    }
                } catch (err) {
                    console.error('[Admission] immediate saveThirdTab threw error:', err);
                    toast.error('Failed to save step 3');
                    setIsSavingStep(false);
                    return;
                }

                setHandledStep3(true);
                setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                setIsSavingStep(false);
                return;
            }

            if (isValid && Number(currentStep) === 5) {
                try {
                    const formData = getValues();

                    const payload = {
                        amsT_Id: Number(getValues('amsT_Id' as any) ?? 0) || 15353,
                        mI_Id: 30,
                        userId: 1,
                        amsT_Studentillness: formData.amsT_Studentillness || '',
                        amsT_MedicalComplaints: formData.amsT_MedicalComplaints || '',
                        amsT_AdmissionReason: formData.amsT_AdmissionReason || '',
                        amsT_OtherResidential_Addr: formData.amsT_OtherResidential_Addr || '',
                        amsT_SchoolDISECode: formData.amsT_SchoolDISECode || '',
                        amsT_FirstLanguage: formData.amsT_FirstLanguage || '',
                        amsT_Thirdlanguage: formData.amsT_Thirdlanguage || '',
                        amsT_Illnessdetails: formData.amsT_Illnessdetails || '',
                        amsT_OtherInformations: formData.amsT_OtherInformations || '',
                        amsT_ExtraActivity: formData.amsT_ExtraActivity || '',
                        amsT_Stayingwith: formData.amsT_Stayingwith || '',
                        amsT_OtherPermanentAddr: formData.amsT_OtherPermanentAddr || '',
                        amsT_Domicile: formData.amsT_Domicile || '',
                        amsT_SecondLanguage: formData.amsT_SecondLanguage || '',
                        amsT_TransferrableJobFlg: !!formData.amsT_TransferrableJobFlg,
                        amsT_VaccinatedFlg: !!formData.amsT_VaccinatedFlg,
                        amsT_Tcflag: !!formData.amsT_Tcflag
                    };

                    const res = await saveFifthTabApi(payload);
                    if (!res?.success) {
                        console.error('Failed saving step 5 response (auto):', res);
                        toast.error(res?.message || 'Failed to save step 5');
                        setIsSavingStep(false);
                        return;
                    }
                    toast.success('Step 5 saved');
                    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                    setIsSavingStep(false);
                    return;
                } catch (error) {
                    console.error('Failed saving step 5 (auto)', error);
                    toast.error('Failed to save step 5');
                    setIsSavingStep(false);
                    return;
                }
            }
            if (isValid && Number(currentStep) === 4) {
                try {
                    const formData = getValues();

                    const activities =
                        selectedActivityItems && selectedActivityItems.length > 0
                            ? selectedActivityItems.map((id) => ({ activityId: Number(id) || 0, isSelected: true }))
                            : Array.isArray(formData.activities)
                                ? formData.activities.map((a: any) => ({ activityId: Number(a) || 0, isSelected: true }))
                                : [];

                    const sourceDetails =
                        selectedSourceItems && selectedSourceItems.length > 0
                            ? selectedSourceItems.map((s) => ({
                                sourceId: Number(s.pamS_Id) || 0,
                                isSelected: true
                            }))
                            : Array.isArray(formData.sourceDetails)
                                ? formData.sourceDetails.map((s: any) => ({
                                    sourceId: Number(s) || 0,
                                    isSelected: true
                                }))
                                : [];

                    const guardiansSource = formData.guardian || [];
                    const _guardians = (Array.isArray(guardiansSource) ? guardiansSource : []).map((g: any) => ({
                        guardianName: g.guardianName || g.name || '',
                        guardianAddress: g.guardianAddress || g.address || '',
                        guardianEmail: g.guardianEmail || g.email || '',
                        guardianPhone: g.guardianPhone || g.phone || '',
                        guardianPhotoUrl: '',
                        guardianSignUrl: ''
                    }));

                    const siblingsSource = formData.siblings || [];
                    const siblingsList = (Array.isArray(siblingsSource) ? siblingsSource : []).map((s: any) => ({
                        name: s.pasrS_SiblingsName || s.name || s.siblingName || '',
                        classId: Number(s.pasrS_SiblingsClass || s.classId || s.pasrS_SiblingsClassId) || 0,
                        relation: s.relation || s.relationShip || ''
                    }));

                    const previousSchoolSource = formData.previousSchools || [];
                    const previousSchools = (Array.isArray(previousSchoolSource) ? previousSchoolSource : []).map((school: any) => ({
                        schoolName: school.pasrpS_PrvSchoolName || school.schoolName || school.pasrS_SchoolName || '',
                        schoolType:
                            school.schoolType ||
                            (school.schoolTypeId !== undefined && school.schoolTypeId !== null
                                ? school.schoolTypeId === 1
                                    ? 'Pre-Primary School'
                                    : school.schoolTypeId === 2
                                        ? 'Primary School'
                                        : school.schoolTypeId === 3
                                            ? 'High School'
                                            : String(school.schoolTypeId)
                                : ''),
                        class: String(school.pasrpS_PreviousClass || school.classId || ''),
                        percentage: school.pasrpS_PreviousPer || school.percentage || '',
                        grade: school.pasrpS_PreviousGrade || school.grade || '',
                        passedYear: (school.pasrpS_LeftYear ?? school.passedYear) ? Number(school.pasrpS_LeftYear ?? school.passedYear) : 0,
                        country:
                            school.country ||
                            (school.countryId
                                ? country?.data?.find((c: any) => Number(c.ivrmmC_Id) === Number(school.countryId))?.ivrmmC_CountryName ||
                                ''
                                : ''),
                        state: school.state || '',
                        address: school.pasrpS_Address || school.address || '',
                        leftReason: school.pasrpS_LeftReason || school.leftReason || '',
                        medium: school.medium || '',
                        tcNumber: school.pasrpS_TcNo || school.tcNumber || '',
                        tcDate: (() => {
                            const d = school.pasrpS_TcDate ?? school.tcDate;
                            if (!d) return null;
                            const parsed = d instanceof Date ? d : new Date(d);
                            return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
                        })()
                    }));

                    const amsTIdToUse = Number(getValues('amsT_Id' as any) ?? 0) || Number(savedAmsTId ?? 0) || 0;
                    const payload: any = {
                        amsT_Id: amsTIdToUse,
                        mI_Id: 30,
                        userId: 21602,
                        activities: activities,
                        achievements: formData.achievements || '',
                        sourceDetails: sourceDetails,
                        siblings: siblingsList,
                        previousSchools: previousSchools,
                        amsT_PlaceOfBirthCountry: Number(formData.amsT_PlaceOfBirthCountry ?? 0) || 0,
                        amsT_PlaceOfBirthState: Number(formData.amsT_PlaceOfBirthState ?? 0) || 0,
                        amsT_Distirct: formData.amsT_Distirct || '',
                        amsT_Taluk: formData.amsT_Taluk || '',
                        amsT_Town: formData.amsT_Town || '',
                        amsT_Village: formData.amsT_Village || '',
                        amsT_NoOfSiblings: Number(formData.amsT_NoOfSiblings ?? 0) || 0,
                        amsT_NoOfSiblingsSchool: Number(formData.amsT_NoOfSiblingsSchool ?? 0) || 0,
                        amsT_Noofbrothers: Number(formData.amsT_Noofbrothers ?? 0) || 0,
                        amsT_NoOfElderBrothers: Number(formData.amsT_NoOfElderBrothers ?? 0) || 0,
                        amsT_NoOfYoungerBrothers: Number(formData.amsT_NoOfYoungerBrothers ?? 0) || 0,
                        amsT_Noofsisters: Number(formData.amsT_Noofsisters ?? 0) || 0,
                        amsT_NoOfElderSisters: Number(formData.amsT_NoOfElderSisters ?? 0) || 0,
                        amsT_NoOfYoungerSisters: Number(formData.amsT_NoOfYoungerSisters ?? 0) || 0,

                        message: '',
                        returnVal: true
                    };
                    const res = await saveFourthTabApi(payload);
                    if (!res?.success) {
                        toast.error(res?.message || 'Failed to save step 4 ');
                        setIsSavingStep(false);
                        return;
                    }
                    toast.success('Step 4 saved ');
                    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                    setIsSavingStep(false);
                    return;
                } catch (err) {
                    console.error('[Admission] Step4 handler error:', err);
                    toast.error('Failed to save step 4');
                    setIsSavingStep(false);
                    return;
                }
            }
            // If validation passed for Step 1, run additional conditional checks then persist
            if (isValid && Number(currentStep) === 1) {
                // Ensure student photo exists
                if (!studentPhoto?.amsT_Photoname) {
                    toast.error('Please upload student photo');
                    setCurrentStep(1);
                    setIsSavingStep(false);
                    return;
                }

                // If EMIS/BPL checkbox is checked, require the EMIS/BPL/STS number
                if (Number(getValues('isEmisBpl') ?? 0) === 1) {
                    const emis = String(getValues('amsT_BPLCardNo') ?? '').trim();
                    if (!emis) {
                        toast.error('EMIS / BPL / STS No. is required');
                        setIsSavingStep(false);
                        return;
                    }
                }

                // If ECS flag checked, require ECS bank details
                if (Number(getValues('amsT_ECSFlag') ?? 0) === 1) {
                    const requiredEcsFields = [
                        'asecS_AccountNo',
                        'asecS_AccountHolderName',
                        'asecS_BankName',
                        'asecS_AccountType',
                        'asecS_MICRNo',
                        'asecS_Branch'
                    ] as const;
                    const missing = requiredEcsFields.filter((f) => !String(getValues(f as any) ?? '').trim());
                    if (missing.length > 0) {
                        toast.error('Please fill all ECS account details');
                        setIsSavingStep(false);
                        return;
                    }
                }

                try {
                    const formData = getValues();
                    const res = await saveFirstTab({
                        ...formData,
                        amsT_Photoname: studentPhoto?.amsT_Photoname
                    });
                    console.debug('[Admission] saveFirstTab response (auto):', res);
                    if (!res?.success) {
                        toast.error(res?.message || 'Failed to save step 1');
                        setIsSavingStep(false);
                        return;
                    }

                    // Extract returned student id from response and persist into form state
                    const returnedId =
                        Number(
                            res?.data?.amsT_Id ??
                            res?.data?.AMST_Id ??
                            res?.data?.amst_Id ??
                            res?.data?.amstId ??
                            getValues('amsT_Id' as any) ??
                            0
                        ) || 0;
                    if (returnedId > 0) {
                        setValue('amsT_Id' as any, returnedId);
                        setSavedAmsTId(returnedId);
                    }

                    // After successful first-tab save, ensure student photo is persisted server-side
                    try {
                        const amsIdToUse = returnedId || Number(getValues('amsT_Id' as any) ?? 0);
                        if (!amsIdToUse) {
                            throw new Error('Missing student id for photo upload');
                        }

                        const photoPayload = new FormData();
                        photoPayload.append('AmstId', String(amsIdToUse));
                        if (studentPhotoFile) {
                            photoPayload.append('StudentPhoto', studentPhotoFile);
                        } else {
                            photoPayload.append('StudentPhoto', String(studentPhoto?.amsT_Photoname ?? ''));
                        }

                        const photoRes = await saveStudentPhotoApi(photoPayload);
                        console.debug('[Admission] saveStudentPhotoApi response:', photoRes);
                        if (!photoRes?.success) {
                            toast.error(photoRes?.message || 'Failed to save student photo');
                            setIsSavingStep(false);
                            return;
                        }
                        toast.success('Step 1 saved');
                        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                        setIsSavingStep(false);
                        return;
                    } catch (photoErr) {
                        console.error('Failed uploading student photo after save:', photoErr);
                        toast.error('Failed to upload student photo');
                        setIsSavingStep(false);
                        return;
                    }
                } catch (err) {
                    console.error('[Admission] saveFirstTab error:', err);
                    toast.error('Failed to save step 1');
                    setIsSavingStep(false);
                    return;
                }
            }

            // If validation passed for Step 2, persist Step 2 to server (ensure schema validated)
            if (isValid && Number(currentStep) === 2) {
                // Additional client-side pincode checks before save
                const conPincodeVal = String(watch('amsT_ConPincode') ?? '');
                if (conZipLength && conPincodeVal !== '' && conPincodeVal.length !== conZipLength) {
                    setError('amsT_ConPincode', {
                        type: 'manual',
                        message: `Pin code must be ${conZipLength} digits`
                    });
                    setIsSavingStep(false);
                    return;
                }

                if (!sameAsResidential) {
                    const perPincodeVal = String(watch('amsT_PerPincode') ?? '');
                    if (perZipLength && perPincodeVal !== '' && perPincodeVal.length !== perZipLength) {
                        setError('amsT_PerPincode', {
                            type: 'manual',
                            message: `Pin code must be ${perZipLength} digits`
                        });
                        setIsSavingStep(false);
                        return;
                    }
                }

                try {
                    const values = getValues();

                    const pick = (candidates: string[]) => {
                        for (const k of candidates) {
                            const v = values[k as keyof typeof values];
                            if (v !== undefined && v !== null && v !== '') return v;
                        }
                        return '';
                    };

                    const payload: any = {
                        userid: 21602,
                        amsT_Id: Number(getValues('amsT_Id' as any) ?? 0) || 15353,
                        mI_Id: 30,

                        // Permanent address
                        amsT_PerStreet: pick(['amsT_PerStreet']) || '',
                        amsT_PerArea: pick(['amsT_PerArea']) || '',
                        amsT_PerCity: pick(['amsT_PerCity']) || '',
                        amsT_PerState: Number(pick(['amsT_PerState']) ?? 0) || 0,
                        amsT_PerDistrict: Number(pick(['amsT_PerDistrict']) ?? 0) || 0,
                        amsT_PerCountry: Number(pick(['amsT_PerCountry']) ?? 0) || 0,
                        amsT_PerPincode: Number(pick(['amsT_PerPincode']) ?? 0) || 0,

                        // Residential address
                        amsT_ConStreet: pick(['amsT_ConStreet']) || '',
                        amsT_ConArea: pick(['amsT_ConArea']) || '',
                        amsT_ConCity: pick(['amsT_ConCity']) || '',
                        amsT_ConState: Number(pick(['amsT_ConState']) ?? 0) || 0,
                        amsT_ConDistrict: Number(pick(['amsT_ConDistrict']) ?? 0) || 0,
                        amsT_ConCountry: Number(pick(['amsT_ConCountry']) ?? 0) || 0,
                        amsT_ConPincode: Number(pick(['amsT_ConPincode']) ?? 0) || 0,
                        message: '',
                        returnval: true
                    };

                    console.debug('[Admission] saveSecondTab payload:', payload);
                    const res = await saveSecondTabApi(payload);
                    console.debug('[Admission] saveSecondTab response:', res);
                    if (!res?.success) {
                        toast.error(res?.message || 'Failed to save step 2');
                        setIsSavingStep(false);
                        return;
                    }
                    toast.success('Step 2 saved');
                    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                    setIsSavingStep(false);
                } catch (error) {
                    console.error('Failed saving step 2', error);
                    toast.error('Failed to save step 2');
                    setIsSavingStep(false);
                    return;
                }
            }
            if (!isValid && Number(currentStep) !== 4) {
                console.debug('[Admission] Validation failed. errors:', errors);
                try {
                    console.debug('Validation errors', errors);
                    const firstKey = Object.keys(errors)[0];
                    const firstMsg = firstKey
                        ? ((errors as any)[firstKey]?.message ?? 'Please fill required fields')
                        : 'Please fill required fields';
                    toast.error(firstMsg);
                } catch (e) {
                    console.debug('Error showing validation toast', e);
                    toast.error('Please fill required fields');
                }

                // Additional client-side checks for pincode length because schema is static
                if (isValid) {
                    if (currentStep === 1) {
                        console.debug('[Admission] Step1 values:', {
                            amsT_FirstName: watch('amsT_FirstName'),
                            amsT_LastName: watch('amsT_LastName'),
                            amsT_MobileNo: watch('amsT_MobileNo'),
                            amsT_emailId: watch('amsT_emailId'),
                            studentPhoto: studentPhoto?.amsT_Photoname
                        });

                        // If minimal info present, still attempt to save to server and advance
                        const first = String(watch('amsT_FirstName') ?? '').trim();
                        const last = String(watch('amsT_LastName') ?? '').trim();
                        const mobile = String(watch('amsT_MobileNo') ?? phoneValues.amsT_MobileNo ?? watch('amsT_MobileNo') ?? '').trim();
                        const email = String(watch('amsT_emailId') ?? '').trim();
                        const photo = studentPhoto?.amsT_Photoname;

                        if (first && last && (mobile || email) && photo) {
                            toast('Saving minimal Step 1 data despite validation warnings');
                            try {
                                const formData = getValues();
                                console.debug('[Admission] Attempting saveFirstTab despite validation', {
                                    first,
                                    last,
                                    mobile,
                                    email,
                                    photo
                                });
                                const saveRes = await saveFirstTab({
                                    ...formData,
                                    amsT_Photoname: photo
                                });
                                console.debug('[Admission] saveFirstTab result (forced):', saveRes);
                                if (saveRes?.success) {
                                    const returnedId =
                                        Number(
                                            saveRes?.data?.amsT_Id ??
                                            saveRes?.data?.AMST_Id ??
                                            saveRes?.data?.amst_Id ??
                                            saveRes?.data?.amstId ??
                                            0
                                        ) || 0;
                                    if (returnedId > 0) {
                                        setValue('amsT_Id' as any, returnedId);
                                        setSavedAmsTId(returnedId);
                                    }
                                    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                                    return;
                                }
                                toast.error(saveRes?.message || 'Failed to save step 1');
                                return;
                            } catch (err) {
                                console.error('[Admission] saveFirstTab error (forced):', err);
                                toast.error('Failed to save step 1');
                                return;
                            }
                        }
                    }

                    return;
                }
                if (Number(currentStep) === 2) {
                    const conPincodeVal = String(watch('amsT_ConPincode') ?? '');
                    // if conZipLength is defined and user has entered a value, enforce exact length
                    if (conZipLength && conPincodeVal !== '' && conPincodeVal.length !== conZipLength) {
                        setError('amsT_ConPincode', {
                            type: 'manual',
                            message: `Pin code must be ${conZipLength} digits`
                        });
                        return;
                    }

                    if (!sameAsResidential) {
                        const perPincodeVal = String(watch('amsT_PerPincode') ?? '');
                        if (perZipLength && perPincodeVal !== '' && perPincodeVal.length !== perZipLength) {
                            setError('amsT_PerPincode', {
                                type: 'manual',
                                message: `Pin code must be ${perZipLength} digits`
                            });
                            return;
                        }
                    }
                    // After client-side pincode checks, call server API for Step 2
                    try {
                        const values = getValues();

                        const pick = (candidates: string[]) => {
                            for (const k of candidates) {
                                const v = values[k as keyof typeof values];
                                if (v !== undefined && v !== null && v !== '') return v;
                            }
                            return '';
                        };

                        const payload: any = {
                            userid: 21602,
                            amsT_Id: Number(getValues('amsT_Id' as any) ?? 0) || 15353,
                            mI_Id: 30,

                            // Permanent address
                            amsT_PerStreet: pick(['amsT_PerStreet']) || '',
                            amsT_PerArea: pick(['amsT_PerArea']) || '',
                            amsT_PerCity: pick(['amsT_PerCity']) || '',
                            amsT_PerState: Number(pick(['amsT_PerState']) ?? 0) || 0,
                            amsT_PerDistrict: Number(pick(['amsT_PerDistrict']) ?? 0) || 0,
                            amsT_PerCountry: Number(pick(['amsT_PerCountry']) ?? 0) || 0,
                            amsT_PerPincode: Number(pick(['amsT_PerPincode']) ?? 0) || 0,

                            // Residential address
                            amsT_ConStreet: pick(['amsT_ConStreet']) || '',
                            amsT_ConArea: pick(['amsT_ConArea']) || '',
                            amsT_ConCity: pick(['amsT_ConCity']) || '',
                            amsT_ConState: Number(pick(['amsT_ConState']) ?? 0) || 0,
                            amsT_ConDistrict: Number(pick(['amsT_ConDistrict']) ?? 0) || 0,
                            amsT_ConCountry: Number(pick(['amsT_ConCountry']) ?? 0) || 0,
                            amsT_ConPincode: Number(pick(['amsT_ConPincode']) ?? 0) || 0,

                            message: '',
                            returnval: true
                        };

                        console.debug('[Admission] saveSecondTab payload:', payload);
                        const res = await saveSecondTabApi(payload);
                        console.debug('[Admission] saveSecondTab response:', res);
                        if (!res?.success) {
                            toast.error(res?.message || 'Failed to save step 2');
                            return;
                        }
                        toast.success('Step 2 saved');
                        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
                    } catch (error) {
                        console.error('Failed saving step 2', error);
                        toast.error('Failed to save step 2');
                        return;
                    }
                }
                if (Number(currentStep) === 3) {
                    // console.log('[Admission] about to call saveThirdTab, currentStep:', currentStep, 'isValid:', isValid);
                    try {
                        await saveThirdTab();
                        // console.log('[Admission] saveThirdTab result:', res);
                    } catch (error) {
                        console.error('[Admission] saveThirdTab threw error:', error);
                        toast.error('Failed to save step 3');
                        return;
                    }

                    // Also initiate/save fourth tab when moving into Step 4
                    try {
                        const minimalPayloadForFourth: any = {
                            amsT_Id: Number(getValues('amsT_Id' as any) ?? 0) || 0,
                            mI_Id: 0,
                            userId: 0,
                            message: '',
                            returnVal: true
                        };
                        console.debug('[Admission] auto saveFourthTab (entering Step 4) payload:', minimalPayloadForFourth);
                        const autoRes = await saveFourthTabApi(minimalPayloadForFourth);
                        console.debug('[Admission] auto saveFourthTab response:', autoRes);
                        if (!autoRes?.success) {
                            toast.error(autoRes?.message || 'Failed to save step 4');
                            return;
                        }
                    } catch (err) {
                        console.error('Failed auto-saving step 4 when entering it:', err);
                        toast.error('Failed to save step 4');
                        return;
                    }
                }

                if (Number(currentStep) === 4) {
                    try {
                        const formData = getValues();

                        const activities =
                            selectedActivityItems && selectedActivityItems.length > 0
                                ? selectedActivityItems.map((id) => ({ activityId: Number(id) || 0, isSelected: true }))
                                : Array.isArray(formData.activities)
                                    ? formData.activities.map((a: any) => ({ activityId: Number(a) || 0, isSelected: true }))
                                    : [];

                        const sourceDetails =
                            selectedSourceItems && selectedSourceItems.length > 0
                                ? selectedSourceItems.map((s) => ({
                                    sourceId: Number(s.pamS_Id) || 0,
                                    isSelected: true
                                }))
                                : Array.isArray(formData.sourceDetails)
                                    ? formData.sourceDetails.map((s: any) => ({
                                        sourceId: Number(s) || 0,
                                        isSelected: true
                                    }))
                                    : [];

                        const guardiansSource = formData.guardian || [];
                        const guardians = (Array.isArray(guardiansSource) ? guardiansSource : []).map((g: any) => ({
                            guardianName: g.guardianName || g.name || '',
                            guardianAddress: g.guardianAddress || g.address || '',
                            guardianEmail: g.guardianEmail || g.email || '',
                            guardianPhone: g.guardianPhone || g.phone || '',
                            guardianPhotoUrl: '',
                            guardianSignUrl: ''
                        }));

                        const siblingsSource = formData.siblings || [];
                        const siblingsList = (Array.isArray(siblingsSource) ? siblingsSource : []).map((s: any) => ({
                            name: s.pasrS_SiblingsName || s.name || s.siblingName || '',
                            classId: Number(s.pasrS_SiblingsClass || s.classId || s.pasrS_SiblingsClassId) || 0,
                            relation: s.relation || s.relationShip || ''
                        }));

                        const previousSchoolSource = formData.previousSchools || [];
                        const previousSchools = (Array.isArray(previousSchoolSource) ? previousSchoolSource : []).map((school: any) => ({
                            schoolName: String(school.pasrpS_PrvSchoolName || school.schoolName || school.pasrS_SchoolName || ''),
                            schoolType: String(school.schoolTypeId || school.pasrpS_SchoolTypeId || ''),
                            class: String(school.pasrpS_PreviousClass || school.classId || ''),
                            percentage: String(school.pasrpS_PreviousPer || school.percentage || ''),
                            grade: String(school.pasrpS_PreviousGrade || school.grade || ''),
                            passedYear:
                                (school.pasrpS_LeftYear ?? school.passedYear) ? Number(school.pasrpS_LeftYear ?? school.passedYear) : 0,
                            country: String(school.countryId || ''),
                            state: String(school.stateId || ''),
                            address: String(school.pasrpS_Address || school.address || ''),
                            leftReason: String(school.pasrpS_LeftReason || school.leftReason || ''),
                            medium: String(school.medium || ''),
                            tcNumber: String(school.pasrpS_TcNo || school.tcNumber || ''),
                            tcDate: (() => {
                                const d = school.pasrpS_TcDate ?? school.tcDate;
                                if (!d) return null;
                                const parsed = d instanceof Date ? d : new Date(d);
                                return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
                            })()
                        }));

                        const payload: any = {
                            amsT_Id: Number(getValues('amsT_Id' as any) ?? 0) || 0,
                            mI_Id: 0,
                            userId: 0,
                            activities: activities,
                            achievements: formData.achievements || '',
                            amsT_OtherInformations: formData.amsT_OtherInformations || '',
                            sourceDetails: sourceDetails,
                            guardian: guardians,
                            siblings: siblingsList,
                            previousSchools: previousSchools,
                            amsT_PlaceOfBirthCountry: Number(formData.amsT_PlaceOfBirthCountry ?? 0) || 0,
                            amsT_PlaceOfBirthState: Number(formData.amsT_PlaceOfBirthState ?? 0) || 0,
                            amsT_Distirct: formData.amsT_Distirct || '',
                            amsT_Taluk: formData.amsT_Taluk || '',
                            amsT_Town: formData.amsT_Town || '',
                            amsT_Village: formData.amsT_Village || '',
                            amsT_NoOfSiblings: Number(formData.amsT_NoOfSiblings ?? 0) || 0,
                            amsT_NoOfSiblingsSchool: Number(formData.amsT_NoOfSiblingsSchool ?? 0) || 0,
                            amsT_NoOfDependencies: Number(formData.amsT_NoOfDependencies ?? 0) || 0,
                            amsT_Noofbrothers: Number(formData.amsT_Noofbrothers ?? 0) || 0,
                            amsT_NoOfElderBrothers: Number(formData.amsT_NoOfElderBrothers ?? 0) || 0,
                            amsT_NoOfYoungerBrothers: Number(formData.amsT_NoOfYoungerBrothers ?? 0) || 0,
                            amsT_Noofsisters: Number(formData.amsT_Noofsisters ?? 0) || 0,
                            amsT_NoOfElderSisters: Number(formData.amsT_NoOfElderSisters ?? 0) || 0,
                            amsT_NoOfYoungerSisters: Number(formData.amsT_NoOfYoungerSisters ?? 0) || 0,
                            message: '',
                            returnVal: true
                        };

                        const res = await saveFourthTabApi(payload);
                        if (!res?.success) {
                            toast.error(res?.message || 'Failed to save step 4');
                            return;
                        }
                        toast.success('Step 4 saved');
                    } catch (error) {
                        console.error('Failed saving step 4', error);
                        toast.error('Failed to save step 4');
                        return;
                    }
                }
                setCurrentStep((prev) => Math.min(prev + 1, steps.length));
            }
        } catch (err) {
            console.error('[Admission] nextStep top-level error:', err);
            throw err;
        }
    };

    const handleDOBChange = (date: Date | undefined) => {
        if (date) {
            const dobInWords = dateToWords(date);
            setValue('amsT_DOB_Words', dobInWords);

            const age = calculateAge(date);

            setValue('pasR_Age', age.ageInYears);

            trigger(['amsT_DOB_Words', 'pasR_Age']);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = async (targetStep: number) => {
        if (targetStep < 1 || targetStep > steps.length) return;

        // Only allow going to steps that have been completed or the current step
        // Users can go backward or stay on current step, but not skip forward
        if (targetStep > currentStep) {
            // Can't click directly on uncompleted steps, must use Next button
            return;
        }

        setCurrentStep(targetStep);
        return;
    };

    const handleReset = () => {
        // Preserve academic year values
        const currentAsmaYId = getValues('asmaY_Id' as any) ?? getValues('asmaY_Year' as any) ?? undefined;
        const currentAsmaYYear = getValues('asmaY_Year' as any) ?? '';

        // Build a reset object that clears all known form keys except academic year
        const currentValues = getValues();
        const resetObj: Record<string, any> = {};
        const cv: any = currentValues as any;
        Object.keys(currentValues).forEach((k) => {
            if (k === 'asmaY_Id' || k === 'asmaY_Year') {
                // preserve
                return;
            }
            const val = cv[k];
            if (val instanceof Date) {
                resetObj[k] = undefined;
            } else if (Array.isArray(val)) {
                resetObj[k] = [];
            } else if (val === null || val === undefined) {
                resetObj[k] = val;
            } else if (typeof val === 'boolean') {
                resetObj[k] = false;
            } else if (typeof val === 'number') {
                resetObj[k] = 0;
            } else if (typeof val === 'object') {
                resetObj[k] = {};
            } else {
                resetObj[k] = '';
            }
        });

        // Ensure specific list/object fields are set to sensible empty values
        resetObj.asmaY_Id = currentAsmaYId;
        resetObj.asmaY_Year = currentAsmaYYear;
        resetObj.previousSchools = [];
        resetObj.siblings = [];
        resetObj.guardian = [];
        resetObj.amsT_ECSFlag = 0;
        resetObj.isEmisBpl = 0;
        resetObj.feeConcessionType = 0;
        resetObj.hostelRequired = false;
        resetObj.transportRequired = false;
        resetObj.amsT_MobileNo = '';
        resetObj.mobileNos = [];
        resetObj.adm_M_Student_EmailIdDTO = [{ amsT_emailId: '' }];
        resetObj.amsT_ConDistrict = 0;
        resetObj.amsT_PerDistrict = 0;

        // Apply reset to react-hook-form
        reset(resetObj as any);

        // Reset UI step and popovers
        setCurrentStep(1);
        setOpenPopover(null);

        // Clear selection state
        setSelectedSourceItems([]);
        setSelectedReferenceItems([]);
        setSelectedActivityItems([]);
        setSameAsResidential(false);

        // Clear phone helper state
        setPhoneExpectedInfo({});
        setPhoneValues({});

        // Clear uploaded files / documents / photos / signatures
        setUploadedDocuments([]);
        setStudentPhoto(null);
        setStudentPhotoFile(null);
        setStudentPhotoError(null);

        setFatherPhoto(null);
        setFatherPhotoFile(null);
        setFatherPhotoError(null);

        setMotherPhoto(null);
        setMotherPhotoFile(null);
        setMotherPhotoError(null);

        setFatherSignature(null);
        setFatherSignatureFile(null);
        setFatherSignatureError(null);

        setMotherSignature(null);
        setMotherSignatureFile(null);
        setMotherSignatureError(null);

        setGuardianPhotos({});
        setGuardianSignatures({});

        // Reset guardian saved-state tracking
        setSavedGuardianSnapshot({});
        setSavedGuardianSaved({});

        // Misc UI flags/errors
        setDocumentErrors({});
        setShowStep3Errors(false);
        setHandledStep3(false);
        setSubmittingFinal(false);
    };

    const handleSourceSelection = (selectedValues: string[]) => {
        const selectedSources = selectedValues.map((value) => {
            return { pamS_Id: value.toString(), pamS_SourceName: '' };
        });
        setSelectedSourceItems(selectedSources);
    };

    const handleActivitySelection = (selectedValues: string[]) => {
        setSelectedActivityItems(selectedValues.map((v) => v.toString()));
    };

    const handleReferenceSelection = (selectedValues: string[]) => {
        const selectedReferences = selectedValues.map((value) => {
            return { pamR_Id: value.toString(), pamR_ReferenceName: '' };
        });
        setSelectedReferenceItems(selectedReferences);
    };

    __markUsed(handleReferenceSelection);

    const handleSameAsResidential = (checked: boolean) => {
        setSameAsResidential(!!checked);
        if (checked) {
            const street = getValues('amsT_ConStreet') ?? '';
            const area = getValues('amsT_ConArea') ?? '';
            const country = getValues('amsT_ConCountry') ?? '';
            const state = getValues('amsT_ConState');
            const district = getValues('amsT_ConDistrict');
            const city = getValues('amsT_ConCity') ?? '';
            const pincode = getValues('amsT_ConPincode') ?? '';

            setValue('amsT_PerStreet', street, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerArea', area, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerCountry', country, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerState', state ?? undefined, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerDistrict', district ?? undefined, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerCity', city, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerPincode', pincode, { shouldValidate: true, shouldDirty: true });

            trigger(['amsT_PerStreet', 'amsT_PerArea', 'amsT_PerCountry', 'amsT_PerState', 'amsT_PerDistrict', 'amsT_PerCity', 'amsT_PerPincode']);
        } else {
            setValue('amsT_PerStreet', '', { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerArea', '', { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerCountry', '', { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerState', 0, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerDistrict', 0, { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerCity', '', { shouldValidate: true, shouldDirty: true });
            setValue('amsT_PerPincode', '', { shouldValidate: true, shouldDirty: true });

            clearErrors(['amsT_PerStreet', 'amsT_PerArea', 'amsT_PerCountry', 'amsT_PerState', 'amsT_PerDistrict', 'amsT_PerCity', 'amsT_PerPincode']);
        }
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
        if (!phone || phone === countryData?.dialCode) {
            setPhoneValues((prev) => ({ ...prev, [fieldName]: '' }));
            setValue(fieldName as any, '');
            // trigger validation for this field
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
        if (fieldName === 'amsT_MobileNo') {
            try {
                const mobileArray = getValues('mobileNos') || [];
                if (Array.isArray(mobileArray) && mobileArray.length > 0) {
                    setValue('mobileNos.0.amsT_MobileNo' as any, formattedPhone);
                    setValue('mobileNos.0.amstsmS_CountryCode' as any, String(countryCode));
                } else {
                    setValue('mobileNos' as any, [{ amsT_MobileNo: formattedPhone, amstsmS_CountryCode: String(countryCode) }]);
                }
            } catch (e) {
                console.warn('Failed to sync primary mobile into mobileNos array', e);
            }
        }
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

    // initialize at least one mobile entry so UI remains the same
    useEffect(() => {
        if (mobileFields.length === 0) {
            const initial = String(watch('amsT_MobileNo') ?? '') || '';
            appendMobile({ amsT_MobileNo: initial, amstsmS_CountryCode: '' });
            if (initial) setValue('amsT_MobileNo', initial);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addPreviousSchool = () => {
        appendPreviousSchool({
            schoolName: '',
            classId: 0,
            schoolTypeId: 0,
            schoolType: '',
            percentage: '',
            grade: '',
            passedYear: 0,
            countryId: 0,
            country: '',
            stateId: 0,
            state: '',
            address: '',
            leftReason: '',
            medium: '',
            tcNumber: '',
            tcDate: new Date()
        } as any);
    };
    // Guardian FieldArray
    const {
        fields: guardianFields,
        append: appendGuardian,
        remove: removeGuardianField
    } = useFieldArray({
        control,
        name: 'guardian'
    });

    // Sibling FieldArray
    const {
        fields: siblingFields,
        append: appendSibling,
        remove: removeSiblingField
    } = useFieldArray({
        control,
        name: 'siblings'
    });

    // Add Sibling
    const addSibling = () => {
        appendSibling({
            name: '',
            classId: 0,
            relation: ''
        });
    };

    // Add Guardian
    const addGuardian = () => {
        appendGuardian({
            guardianName: '',
            guardianPhone: '',
            guardianAddress: ''
        });
    };

    // Prevent deleting first sibling
    const removeSibling = (index: number) => {
        if (index === 0) return;
        removeSiblingField(index);
    };

    // Prevent deleting first guardian
    const removeGuardian = (index: number) => {
        if (index === 0) return;
        removeGuardianField(index);
    };

    // Save single guardian using saveGaurdianApi
    const handleSaveGuardian = async (index: number) => {
        try {
            const guardianValues = getValues(`guardian.${index}` as any) as any;

            const formData = new FormData();

            const resolvedAmsId = Number(getValues('amsT_Id' as any) || savedAmsTId || guardianValues?.AMST_Id || 0) || 0;
            formData.append('AMST_Id', String(resolvedAmsId || '25611'));
            formData.append('MI_Id', String(guardianValues?.MI_Id ?? '30'));
            formData.append('GuardianName', guardianValues?.guardianName || '');
            formData.append('GuardianPhone', (guardianValues?.guardianPhone || '').replace(/\D/g, ''));

            formData.append('GuardianEmail', guardianValues?.guardianEmail || '');
            formData.append('GuardianAddress', guardianValues?.guardianAddress || '');
            // Guardian Photo (binary)
            if (guardianPhotos?.[index]?.file instanceof File) {
                formData.append('GuardianPhoto', guardianPhotos[index].file);
            }

            // Guardian Signature (binary)
            if (guardianSignatures?.[index]?.file instanceof File) {
                formData.append('GuardianSign', guardianSignatures[index].file);
            }

            // URL fields (optional) - backend may expect these keys even if empty
            formData.append('GuardianPhotoUrl', '');
            formData.append('GuardianSignUrl', '');

            await saveGaurdianApi(formData);
            toast.success('Guardian saved successfully');
            // store snapshot to mark this guardian as saved and unchanged
            setSavedGuardianSnapshot((prev) => ({ ...prev, [index]: guardianValues }));
            // mark this index as saved
            setSavedGuardianSaved((prev) => ({ ...prev, [index]: true }));
        } catch (error) {
            console.error('save guardian error', error);
            toast.error('Failed to save guardian');
        }
    };

    useEffect(() => {
        if (guardianFields.length === 0) addGuardian();
        if (siblingFields.length === 0) addSibling();
    }, []);

    useEffect(() => {
        if (previousSchoolFields.length === 0) {
            appendPreviousSchool({
                schoolName: '',
                classId: 0,
                schoolTypeId: 0,
                percentage: '',
                grade: '',
                passedYear: 0,
                countryId: 0,
                stateId: 0,
                address: '',
                leftReason: '',
                medium: '',
                tcNumber: '',
                tcDate: null
            });
        }
    }, [previousSchoolFields.length, appendPreviousSchool]);

    // Store selected document files locally until final submit (no immediate API calls)
    const _handleDocumentUpload = async (amsmD_Id: number, file: File, documentName: string) => {
        // Restrict file size and types
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should not exceed 5MB');
            return;
        }
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PDF, PNG, JPG, and JPEG formats are allowed');
            return;
        }

        // Create a local preview URL for the file
        const localUrl = URL.createObjectURL(file);

        setUploadedDocuments((prev) => {
            const existingIndex = prev.findIndex((doc) => doc.amsmD_Id === amsmD_Id);
            const newDoc = {
                pasrD_Id: 0,
                pasR_Id: 0,
                amsmD_Id,
                document_Path: localUrl,
                documentName,
                isUploading: false,
                file
            } as any;

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = newDoc;
                return updated;
            }
            return [...prev, newDoc];
        });

        setDocumentErrors((prev) => {
            const copy = { ...prev };
            delete copy[amsmD_Id];
            return copy;
        });

        toast.success(`${documentName} added (will be submitted with final form)`);
    };

    const handleDocumentDelete = (amsmD_Id: number, _blobUrl: string, documentName: string) => {
        // Remove local document entry (no server call)
        setUploadedDocuments((prev) => {
            const target = prev.find((d) => d.amsmD_Id === amsmD_Id);
            if (target?.file && target.document_Path) {
                try {
                    URL.revokeObjectURL(target.document_Path);
                } catch (_) {
                    //ignore
                }
            }
            return prev.filter((doc) => doc.amsmD_Id !== amsmD_Id);
        });
        // Clear any errors
        setDocumentErrors((prev) => {
            const copy = { ...prev };
            delete copy[amsmD_Id];
            return copy;
        });
        toast.success(`${documentName} removed`);
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

            // Keep original File so we can send binary to backend later
            setStudentPhotoFile(file);
            setStudentPhoto({ amsT_Photoname: '', isUploading: true });
            setStudentPhotoError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('SubContainerName', 'preadmission_student_photo');

            const response = await uploadDocument(formData);

            if (response.success && response.data) {
                setStudentPhoto({
                    amsT_Photoname: response.data as string,
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
        if (!studentPhoto?.amsT_Photoname) return;

        try {
            const response = await deleteDocument(studentPhoto.amsT_Photoname);
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

    // Guardian photo selection (per guardian index) — store File object and local preview, do not upload immediately
    const handleGuardianPhotoUpload = async (idx: number, file: File) => {
        try {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size should not exceed 5MB');
                return;
            }

            const localUrl = URL.createObjectURL(file);

            setGuardianPhotos((prev) => ({
                ...(prev || {}),
                [idx]: { path: localUrl, isUploading: false, file }
            }));

            toast.success('Guardian photo Uploaded');
        } catch (error: any) {
            console.error('Guardian photo selection error:', error);
            setGuardianPhotos((prev) => ({
                ...(prev || {}),
                [idx]: { path: '', isUploading: false }
            }));
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to process file';
            toast.error(`Failed to select guardian photo: ${errorMessage}`);
        }
    };

    const handleGuardianPhotoDelete = async (idx: number) => {
        const target = guardianPhotos?.[idx];
        if (!target) return;

        // If a local File was selected but not uploaded, just clear local preview
        if (target.file) {
            try {
                if (target.path) URL.revokeObjectURL(target.path);
            } catch (_) {
                //ignore
            }
            setGuardianPhotos((prev) => {
                const copy = { ...(prev || {}) };
                delete copy[idx];
                return copy;
            });
            toast.success('Guardian photo removed');
            return;
        }

        // Otherwise treat path as remote and attempt deletion
        const path = target.path;
        if (!path) return;

        try {
            const response = await deleteDocument(path);
            if (response.success) {
                setGuardianPhotos((prev) => {
                    const copy = { ...(prev || {}) };
                    delete copy[idx];
                    return copy;
                });
                toast.success('Guardian photo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete guardian photo');
        }
    };

    // Guardian signature upload (per guardian index)
    const handleGuardianSignatureUpload = async (idx: number, file: File) => {
        try {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Signature size should not exceed 5MB');
                return;
            }

            const localUrl = URL.createObjectURL(file);

            setGuardianSignatures((prev) => ({
                ...(prev || {}),
                [idx]: { path: localUrl, isUploading: false, file }
            }));

            toast.success('Guardian signature Uploaded');
        } catch (error: any) {
            console.error('Guardian signature selection error:', error);
            setGuardianSignatures((prev) => ({
                ...(prev || {}),
                [idx]: { path: '', isUploading: false }
            }));
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to process file';
            toast.error(`Failed to select guardian signature: ${errorMessage}`);
        }
    };

    const handleGuardianSignatureDelete = async (idx: number) => {
        const target = guardianSignatures?.[idx];
        if (!target) return;

        // If a local File was selected but not uploaded, just clear local preview
        if (target.file) {
            try {
                if (target.path) URL.revokeObjectURL(target.path);
            } catch (_) {
                //ignore
            }
            setGuardianSignatures((prev) => {
                const copy = { ...(prev || {}) };
                delete copy[idx];
                return copy;
            });
            toast.success('Guardian signature removed');
            return;
        }

        // Otherwise treat path as remote and attempt deletion
        const path = target.path;
        if (!path) return;

        try {
            const response = await deleteDocument(path);
            if (response.success) {
                setGuardianSignatures((prev) => {
                    const copy = { ...(prev || {}) };
                    delete copy[idx];
                    return copy;
                });
                toast.success('Guardian signature deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete guardian signature');
        }
    };

    // Father photo upload (Step 6)
    const handleFatherPhotoUpload = async (file: File) => {
        try {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size should not exceed 5MB');
                return;
            }
            // Keep the selected File locally and show a preview URL.
            setFatherPhotoFile(file);
            const localUrl = URL.createObjectURL(file);
            setFatherPhoto({ path: localUrl, isUploading: false });
            setFatherPhotoError(null);
            toast.success('Father photo uploaded');
        } catch (error: any) {
            console.error('Father photo upload error:', error);
            setFatherPhoto({ path: '', isUploading: false });
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setFatherPhotoError(errorMessage);
            toast.error(`Failed to upload father photo: ${errorMessage}`);
        }
    };

    const handleFatherPhotoDelete = async () => {
        // If a local File was selected (not yet uploaded), just clear local state
        if (_fatherPhotoFile) {
            try {
                if (fatherPhoto?.path) URL.revokeObjectURL(fatherPhoto.path);
            } catch (_) {
                //ignore
            }
            setFatherPhotoFile(null);
            setFatherPhoto(null);
            setFatherPhotoError(null);
            toast.success('Father photo removed');
            return;
        }

        const path = fatherPhoto?.path;
        if (!path) return;
        try {
            const response = await deleteDocument(path);
            if (response.success) {
                setFatherPhoto(null);
                toast.success('Father photo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete father photo');
        }
    };

    // Mother photo upload (Step 6)
    const handleMotherPhotoUpload = async (file: File) => {
        try {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size should not exceed 5MB');
                return;
            }
            setMotherPhotoFile(file);
            const localUrl = URL.createObjectURL(file);
            setMotherPhoto({ path: localUrl, isUploading: false });
            setMotherPhotoError(null);
            toast.success('Mother photo uploaded');
        } catch (error: any) {
            console.error('Mother photo upload error:', error);
            setMotherPhoto({ path: '', isUploading: false });
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setMotherPhotoError(errorMessage);
            toast.error(`Failed to upload mother photo: ${errorMessage}`);
        }
    };

    const handleMotherPhotoDelete = async () => {
        if (_motherPhotoFile) {
            try {
                if (motherPhoto?.path) URL.revokeObjectURL(motherPhoto.path);
            } catch (_) {
                //ignore
            }
            setMotherPhotoFile(null);
            setMotherPhoto(null);
            setMotherPhotoError(null);
            toast.success('Mother photo removed');
            return;
        }

        const path = motherPhoto?.path;
        if (!path) return;
        try {
            const response = await deleteDocument(path);
            if (response.success) {
                setMotherPhoto(null);
                toast.success('Mother photo deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete mother photo');
        }
    };

    // Father signature upload (Step 6)
    const handleFatherSignatureUpload = async (file: File) => {
        try {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Signature size should not exceed 5MB');
                return;
            }
            setFatherSignatureFile(file);
            const localUrl = URL.createObjectURL(file);
            setFatherSignature({ path: localUrl, isUploading: false });
            setFatherSignatureError(null);
            toast.success('Father signature Uploaded');
        } catch (error: any) {
            console.error('Father signature upload error:', error);
            setFatherSignature({ path: '', isUploading: false });
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setFatherSignatureError(errorMessage);
            toast.error(`Failed to upload father signature: ${errorMessage}`);
        }
    };

    const handleFatherSignatureDelete = async () => {
        if (_fatherSignatureFile) {
            try {
                if (fatherSignature?.path) URL.revokeObjectURL(fatherSignature.path);
            } catch (_) {
                //ignore
            }
            setFatherSignatureFile(null);
            setFatherSignature(null);
            setFatherSignatureError(null);
            toast.success('Father signature removed');
            return;
        }

        const path = fatherSignature?.path;
        if (!path) return;
        try {
            const response = await deleteDocument(path);
            if (response.success) {
                setFatherSignature(null);
                toast.success('Father signature deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete father signature');
        }
    };

    // Mother signature upload (Step 6)
    const handleMotherSignatureUpload = async (file: File) => {
        try {
            const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                toast.error('Only PNG, JPG, and JPEG formats are allowed');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Signature size should not exceed 5MB');
                return;
            }
            setMotherSignatureFile(file);
            const localUrl = URL.createObjectURL(file);
            setMotherSignature({ path: localUrl, isUploading: false });
            setMotherSignatureError(null);
            toast.success('Mother signature uploaded');
        } catch (error: any) {
            console.error('Mother signature upload error:', error);
            setMotherSignature({ path: '', isUploading: false });
            const errorMessage = error?.response?.data?.message || error?.message || 'Upload failed';
            setMotherSignatureError(errorMessage);
            toast.error(`Failed to upload mother signature: ${errorMessage}`);
        }
    };

    const handleMotherSignatureDelete = async () => {
        if (_motherSignatureFile) {
            try {
                if (motherSignature?.path) URL.revokeObjectURL(motherSignature.path);
            } catch (_) {
                //ignore
            }
            setMotherSignatureFile(null);
            setMotherSignature(null);
            setMotherSignatureError(null);
            toast.success('Mother signature removed');
            return;
        }

        const path = motherSignature?.path;
        if (!path) return;
        try {
            const response = await deleteDocument(path);
            if (response.success) {
                setMotherSignature(null);
                toast.success('Mother signature deleted successfully');
            } else {
                throw new Error(response.message || 'Delete failed');
            }
        } catch (_error: any) {
            toast.error('Failed to delete mother signature');
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

    // derive father/mother country objects & zip lengths from their nationality selects
    const fatherCountryObj = useMemo(() => {
        if (!country?.data || !fatherPresentCountryId) return undefined;
        return country.data.find((c: any) => String(c.ivrmmC_Id) === String(fatherPresentCountryId));
    }, [country?.data, fatherPresentCountryId]);

    const fatherZipLength: number | undefined = fatherCountryObj?.ivrmmC_ZipNoLength ?? undefined;

    const motherCountryObj = useMemo(() => {
        if (!country?.data || !motherPresentCountryId) return undefined;
        return country.data.find((c: any) => String(c.ivrmmC_Id) === String(motherPresentCountryId));
    }, [country?.data, motherPresentCountryId]);

    const motherZipLength: number | undefined = motherCountryObj?.ivrmmC_ZipNoLength ?? undefined;

    useEffect(() => {
        setValue('amsT_ConPincode', '');
    }, [conConuntryId, setValue]);

    useEffect(() => {
        if (!sameAsResidential) {
            setValue('amsT_PerPincode', '');
        }
    }, [perConuntryId, setValue, sameAsResidential]);

    useEffect(() => {
        setValue('asmS_Id', 0);
    }, [classId, setValue]);

    const onSubmit = async (_formData: FormFields) => {
        try {
            // Ensure mandatory documents are uploaded
            // Document checklist removed; user-uploaded documents are submitted with final form

            const values = getValues();

            // Build FormData payload (server expects multipart/form-data)
            const fd = new FormData();
            const amsTIdToUse = savedAmsTId ?? (Number(getValues('amsT_Id' as any) ?? 0) || 25608);
            fd.append('amsT_Id', String(amsTIdToUse));
            fd.append('mI_Id', String(30));
            fd.append('userId', String(21602));
            fd.append('hostelRequired', String(Boolean(values.hostelRequired)));
            fd.append('transportRequired', String(Boolean(values.transportRequired)));

            // Attach parent photos/signatures as binary files (if selected)
            if (_fatherPhotoFile) {
                fd.append('FatherPhoto', _fatherPhotoFile, _fatherPhotoFile.name);
            }
            if (_fatherSignatureFile) {
                fd.append('FatherSignature', _fatherSignatureFile, _fatherSignatureFile.name);
            }
            if (_motherPhotoFile) {
                fd.append('MotherPhoto', _motherPhotoFile, _motherPhotoFile.name);
            }
            if (_motherSignatureFile) {
                fd.append('MotherSignature', _motherSignatureFile, _motherSignatureFile.name);
            }

            // Send empty URL placeholders only if backend expects them (optional)
            fd.append('FatherPhotoUrl', '');
            fd.append('MotherPhotoUrl', '');
            fd.append('FatherSignatureUrl', '');
            fd.append('MotherSignatureUrl', '');

            const response = await saveFinalTabApi(fd as any);
            if (response?.success) {
                toast.success('Application submitted successfully');
                reset();
                setCurrentStep(1);
                setUploadedDocuments([]);
                onSuccess?.();
            } else {
                toast.error(response?.message || 'Failed to submit application');
            }
        } catch (error: any) {
            console.error('Final submit error:', error);
            toast.error(error?.message || 'Failed to submit application');
        }
    };

    // Submit final step without running react-hook-form validation
    const submitWithoutValidation = async () => {
        if (submittingFinal) return;
        setSubmittingFinal(true);
        try {
            await onSubmit(getValues() as FormFields);
        } catch (err) {
            console.error('Submit without validation error:', err);
        } finally {
            setSubmittingFinal(false);
        }
    };

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
                                                    onClick={() => goToStep(step.id)}
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
                                                    onClick={() => goToStep(step.id)}
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
                            {/* biome-ignore lint: template literal needed for bracket syntax in Tailwind */}
                            <div className={`max-h-[calc(100vh-2rem)] overflow-y-auto p-6 md:p-8`}>
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
                                            {/* Student Photo Upload - Mandatory */}
                                            <div className='col-span-full w-fit'>
                                                <div className='rounded-lg border-2 border-blue-200 bg-blue-50 p-2'>
                                                    <div className='mb-1'>
                                                        <Label htmlFor='student_photo'>
                                                            Student Photo <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                    </div>

                                                    {!studentPhoto?.amsT_Photoname ? (
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
                                                                    src={studentPhoto.amsT_Photoname}
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
                                                                    onClick={() => window.open(studentPhoto.amsT_Photoname, '_blank')}>
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
                                                id='amsT_FirstName'
                                                placeholder='Enter first name'
                                                {...register('amsT_FirstName')}
                                                error={errors.amsT_FirstName?.message}
                                            />
                                            <InputText
                                                label='Middle Name'
                                                required
                                                id='amsT_MiddleName'
                                                placeholder='Enter middle name'
                                                {...register('amsT_MiddleName')}
                                                error={errors.amsT_MiddleName?.message}
                                            />
                                            <InputText
                                                label='Last Name'
                                                required
                                                id='amsT_LastName'
                                                placeholder='Enter last name'
                                                {...register('amsT_LastName')}
                                                error={errors.amsT_LastName?.message}
                                            />
                                            <InputText
                                                label='Registration No'
                                                required
                                                id='amsT_RegistrationNo'
                                                placeholder='Enter registration number'
                                                {...register('amsT_RegistrationNo')}
                                                error={errors.amsT_RegistrationNo?.message}
                                            />
                                            <InputText
                                                label='Admission No'
                                                required
                                                id='amsT_AdmissionNo'
                                                placeholder='Enter admission number'
                                                {...register('amsT_AdmissionNo')}
                                                error={errors.amsT_AdmissionNo?.message}
                                            />
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='asmcL_Id'>
                                                    Class <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='asmcL_Id'
                                                    control={control}
                                                    render={({ field, fieldState: { error } }) => (
                                                        <div className='flex flex-col space-y-2'>
                                                            <Select
                                                                value={field.value?.toString() || ''}
                                                                onValueChange={(value) => field.onChange(Number(value))}>
                                                                <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
                                                                    <SelectValue
                                                                        placeholder={
                                                                            admissionClassLoading ? 'Loading classes...' : 'Select a class'
                                                                        }
                                                                    />
                                                                </SelectTrigger>

                                                                <SelectContent>
                                                                    {admissionClassLoading ? (
                                                                        <SelectItem value='loading' disabled>
                                                                            Loading...
                                                                        </SelectItem>
                                                                    ) : admissionClassError ? (
                                                                        <SelectItem value='error' disabled>
                                                                            Error loading classes
                                                                        </SelectItem>
                                                                    ) : admissionClass?.data && admissionClass.data.length > 0 ? (
                                                                        admissionClass.data.map((classItem: any) => (
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

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='asmS_Id'>
                                                    Section <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='asmS_Id'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            value={field.value?.toString() || ''}
                                                            onValueChange={(value) => field.onChange(Number(value))} // <-- SEND NUMBER
                                                            disabled={!classId || classId === 0 || sectionLoading}>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={sectionLoading ? 'Loading sections...' : 'Select section'}
                                                                />
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                {sectionLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : sectionError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading sections
                                                                    </SelectItem>
                                                                ) : sectionData?.data && sectionData.data.length > 0 ? (
                                                                    sectionData.data.map((section: any) => (
                                                                        <SelectItem
                                                                            key={section.asmS_Id}
                                                                            value={section.asmS_Id.toString()}>
                                                                            {section.asmC_SectionName}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem value='0' disabled>
                                                                        No sections available
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />

                                                {errors.asmS_Id && <FormError>{errors.asmS_Id.message}</FormError>}
                                            </div>

                                            <Controller
                                                name='amsT_Date'
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <div className='flex flex-col space-y-2'>
                                                        <Label htmlFor='amsT_Date'>
                                                            Date of Admission <span className='ml-1 text-red-500'>*</span>
                                                        </Label>

                                                        <Popover
                                                            open={openPopover === 'amsT_Date'}
                                                            onOpenChange={(open) => setOpenPopover(open ? 'amsT_Date' : null)}>
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
                                                                            setOpenPopover(null);
                                                                        }
                                                                    }}
                                                                    disabled={(date: Date) =>
                                                                        date > new Date() || date < new Date('1900-01-01')
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        {error && <span className='text-red-500 text-sm'>{error.message}</span>}
                                                    </div>
                                                )}
                                            />

                                            <Controller
                                                name='amsT_DOB'
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <div className='flex flex-col space-y-2'>
                                                        <Label htmlFor='amsT_DOB'>
                                                            Date of Birth <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                        <Popover
                                                            open={openPopover === 'amsT_DOB'}
                                                            onOpenChange={(open) => setOpenPopover(open ? 'amsT_DOB' : null)}>
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
                                                                            setOpenPopover(null);
                                                                        }
                                                                    }}
                                                                    disabled={(date: Date) =>
                                                                        date > new Date() || date < new Date('1900-01-01')
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        {error && <span className='text-red-500 text-sm'>{error.message}</span>}
                                                    </div>
                                                )}
                                            />

                                            {/* Date of Birth in Words - Auto-filled */}
                                            <InputText
                                                label='Date of Birth in Words'
                                                id='amsT_DOB_Words'
                                                placeholder='Date of birth in words'
                                                {...register('amsT_DOB_Words')}
                                                error={errors.amsT_DOB_Words?.message}
                                                disabled
                                            />

                                            {/* Age - Auto-calculated */}
                                            <InputText
                                                label='Age'
                                                id='pasR_Age'
                                                placeholder='Age'
                                                type='number'
                                                {...register('pasR_Age', { valueAsNumber: true })}
                                                error={errors.pasR_Age?.message}
                                                disabled
                                            />

                                            <InputText
                                                label='Birth Place'
                                                id='amsT_BirthPlace'
                                                placeholder='Enter birth place'
                                                {...register('amsT_BirthPlace')}
                                                error={errors.amsT_BirthPlace?.message}
                                            />

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='amsT_ReligionId'>
                                                    Religion <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='amsT_ReligionId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || ''}>
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
                                                {errors.amsT_ReligionId && <FormError>{errors.amsT_ReligionId.message}</FormError>}
                                            </div>

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='amsT_StudentCategory_Id'>
                                                    Caste <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='amsT_StudentCategory_Id'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || ''}>
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
                                                {errors.amsT_StudentCategory_Id && (
                                                    <FormError>{errors.amsT_StudentCategory_Id.message}</FormError>
                                                )}
                                            </div>
                                            {/* <InputText
                                                label='Caste '
                                                required
                                                id='imC_Id'
                                                placeholder='Enter caste category'
                                                {...register('imC_Id')}
                                                error={errors.imC_Id?.message}
                                            /> */}
                                            <InputText
                                                label='Sub Caste'
                                                id='amsT_SubCasteIMC_Id'
                                                placeholder='Enter sub caste'
                                                {...register('amsT_SubCasteIMC_Id')}
                                                error={errors.amsT_SubCasteIMC_Id?.message}
                                            />

                                            <InputText
                                                label='Birth Certificate No'
                                                id='amsT_BirthCertNO'
                                                placeholder='Enter Birth Certificate number'
                                                {...register('amsT_BirthCertNO')}
                                                error={errors.amsT_BirthCertNO?.message}
                                            />
                                            <InputText
                                                label='Caste Certificate No'
                                                id='amsT_CasteCertiNo'
                                                placeholder='Enter caste certificate number'
                                                {...register('amsT_CasteCertiNo')}
                                                error={errors.amsT_CasteCertiNo?.message}
                                            />
                                            <InputText
                                                label='Biometric Id'
                                                id='amsT_BiometricId'
                                                placeholder='Enter biometric ID'
                                                {...register('amsT_BiometricId')}
                                                error={errors.amsT_BiometricId?.message}
                                            />
                                            <InputText
                                                label='RF Card No'
                                                id='amsT_RFCardNo'
                                                placeholder='Enter RF card number'
                                                {...register('amsT_RFCardNo')}
                                                error={errors.amsT_RFCardNo?.message}
                                            />

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='amsT_Sex'>
                                                    Gender <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='amsT_Sex'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(value)}
                                                            value={field.value?.toString() || ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select gender' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {genderOptions.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.amsT_Sex && <FormError>{errors.amsT_Sex.message}</FormError>}
                                            </div>

                                            <InputText
                                                label='Mother Tongue'
                                                id='amsT_MotherTongue'
                                                placeholder='Enter mother tongue'
                                                {...register('amsT_MotherTongue')}
                                                error={errors.amsT_MotherTongue?.message}
                                            />
                                            <InputText
                                                label='Languages Spoken'
                                                id='amsT_LanguageSpoken'
                                                placeholder='Enter languages'
                                                {...register('amsT_LanguageSpoken')}
                                                error={errors.amsT_LanguageSpoken?.message}
                                            />

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='amsT_StudentCountry'>
                                                    Country <span className='ml-1 text-red-500'>*</span>
                                                </Label>

                                                <Controller
                                                    name='amsT_StudentCountry'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(value)}
                                                            value={field.value?.toString() || ''}>
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
                                                                        <SelectItem key={item.ivrmmC_Id} value={item.ivrmmC_Id.toString()}>
                                                                            {item.ivrmmC_CountryName}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.amsT_StudentCountry && <FormError>{errors.amsT_StudentCountry.message}</FormError>}
                                            </div>

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='amsT_StudentState'>State</Label>
                                                <Controller
                                                    name='amsT_StudentState'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select state' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {studentStateLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : studentStateError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    studentState?.data?.map((item) => (
                                                                        <SelectItem key={item.ivrmmS_Id} value={item.ivrmmS_Id.toString()}>
                                                                            {item.ivrmmS_Name}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.amsT_StudentState && <FormError>{errors.amsT_StudentState.message}</FormError>}
                                            </div>

                                            <div className='flex flex-col gap-1.5 '>
                                                <Controller
                                                    name='amsT_MobileNo'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div>
                                                            <Label htmlFor='amsT_MobileNo'>
                                                                Mobile No. <span className='text-red-500'>*</span>
                                                            </Label>
                                                            <PhoneInput
                                                                country='in'
                                                                value={
                                                                    phoneValues.amsT_MobileNo ??
                                                                    (field.value != null ? String(field.value) : null)
                                                                }
                                                                onChange={(phone: any, countryData: any) =>
                                                                    handlePhoneChange(phone, countryData, 'amsT_MobileNo')
                                                                }
                                                                onBlur={() => trigger('amsT_MobileNo')}
                                                                inputProps={{
                                                                    id: 'amsT_MobileNo',
                                                                    name: 'amsT_MobileNo',
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
                                                            {phoneExpectedInfo.amsT_MobileNo?.expected && (
                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                    {`Mobile number must be exactly ${phoneExpectedInfo.amsT_MobileNo.expected} digits for ${phoneExpectedInfo.amsT_MobileNo.name ?? 'selected country'
                                                                        }`}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                                {errors.amsT_MobileNo && <FormError>{errors.amsT_MobileNo.message}</FormError>}
                                            </div>

                                            {/* Hidden legacy primary email (kept in sync with first email field) */}
                                            <input type='hidden' {...register('amsT_emailId')} />

                                            <div className='flex flex-col gap-1.5'>
                                                {emailFields.map((field, idx) => {
                                                    const itemError = (errors as any)?.adm_M_Student_EmailIdDTO?.[idx]?.amsT_emailId
                                                        ?.message;
                                                    const fieldName = `adm_M_Student_EmailIdDTO.${idx}.amsT_emailId` as const;
                                                    return (
                                                        <div key={field.id} className='flex w-full flex-col gap-1'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='flex-1'>
                                                                    {idx === 0 && <Label htmlFor={String(field.id)}>Email</Label>}
                                                                    <InputText
                                                                        {...register(fieldName)}
                                                                        id={String(field.id)}
                                                                        placeholder='Enter email'
                                                                        error={itemError}
                                                                        required
                                                                    />
                                                                </div>

                                                                {/* <div className='mt-1 flex items-center gap-1'>
                                                                    {emailFields.length < 5 && (
                                                                        <Button
                                                                            variant='ghost'
                                                                            size='sm'
                                                                            onClick={() => appendEmail({ amsT_emailId: '' })}>
                                                                            +
                                                                        </Button>
                                                                    )}

                                                                    {emailFields.length > 1 && (
                                                                        <Button
                                                                            variant='ghost'
                                                                            size='sm'
                                                                            onClick={() => {
                                                                                removeEmail(idx);
                                                                                if (idx === 0) {
                                                                                    setTimeout(() => {
                                                                                        const newFirst =
                                                                                            (getValues('adm_M_Student_EmailIdDTO') || [])[0]
                                                                                                ?.amsT_emailId ?? '';
                                                                                        setValue('amsT_emailId' as any, newFirst);
                                                                                    }, 0);
                                                                                }
                                                                            }}>
                                                                            -
                                                                        </Button>
                                                                    )}
                                                                </div> */}
                                                            </div>

                                                            {/* InputText already renders the error; avoid duplicate FormError here */}
                                                        </div>
                                                    );
                                                })}

                                                {/* show legacy primary email error only when no email array items are present */}
                                                {(!Array.isArray(watchedEmails) || watchedEmails.length === 0) && errors.amsT_emailId && (
                                                    <FormError>{errors.amsT_emailId.message}</FormError>
                                                )}
                                            </div>

                                            <div className='flex flex-col gap-1.5'>
                                                <Controller
                                                    name='amsT_AadharNo'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <MobileNumberInput
                                                            label='Aadhaar No.'
                                                            placeholder='Enter Aadhaar No'
                                                            id='amsT_AadharNo'
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value)}
                                                            type='number'
                                                            showSpinner={false}
                                                        />
                                                    )}
                                                />
                                                {errors.amsT_AadharNo && <FormError>{errors.amsT_AadharNo.message}</FormError>}
                                            </div>

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='amsT_BloodGroup'>Blood Group</Label>

                                                <Controller
                                                    name='amsT_BloodGroup'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(value)}
                                                            value={field.value || ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select Blood Group' />
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                <SelectItem value='A+'>A+</SelectItem>
                                                                <SelectItem value='A-'>A-</SelectItem>
                                                                <SelectItem value='B+'>B+</SelectItem>
                                                                <SelectItem value='B-'>B-</SelectItem>
                                                                <SelectItem value='AB+'>AB+</SelectItem>
                                                                <SelectItem value='AB-'>AB-</SelectItem>
                                                                <SelectItem value='O+'>O+</SelectItem>
                                                                <SelectItem value='O-'>O-</SelectItem>
                                                                <SelectItem value='A1+ve'>A1+ve</SelectItem>
                                                                <SelectItem value='A1-ve'>A1-ve</SelectItem>
                                                                <SelectItem value='B1+ve'>B1+ve</SelectItem>
                                                                <SelectItem value='B1-ve'>B1-ve</SelectItem>
                                                                <SelectItem value='A2+ve'>A2+ve</SelectItem>
                                                                <SelectItem value='A2-ve'>A2-ve</SelectItem>
                                                                <SelectItem value='A1B+ve'>A1B+ve</SelectItem>
                                                                <SelectItem value='A2B+ve'>A2B+ve</SelectItem>
                                                                <SelectItem value='A1B2'>A1B2</SelectItem>
                                                                <SelectItem value='A1B-ve'>A1B-ve</SelectItem>
                                                                <SelectItem value='A2B-ve'>A2B-ve</SelectItem>
                                                                <SelectItem value='Not Available'>Not Available</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />

                                                {errors.amsT_BloodGroup && <FormError>{errors.amsT_BloodGroup.message}</FormError>}
                                            </div>

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='studentCategoryId'>
                                                    Student Category <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='studentCategoryId'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                            value={field.value?.toString() || ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select option' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {studentCategoryLoading ? (
                                                                    <SelectItem value='loading' disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : studentCategoryError ? (
                                                                    <SelectItem value='error' disabled>
                                                                        Error loading
                                                                    </SelectItem>
                                                                ) : (
                                                                    studentCategory?.data?.map((item) => (
                                                                        <SelectItem key={item.amC_Id} value={item.amC_Id.toString()}>
                                                                            {item.amC_Name}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.studentCategoryId && <FormError>{errors.studentCategoryId.message}</FormError>}
                                            </div>

                                            <div className='col-span-full'>
                                                <div className='flex items-center gap-6'>
                                                    <div className='flex items-center space-x-2'>
                                                        <Checkbox
                                                            id='amsT_ECSFlag'
                                                            checked={Number(watch('amsT_ECSFlag')) === 1}
                                                            onCheckedChange={(checked) => {
                                                                const val = checked ? 1 : 0;
                                                                setValue('amsT_ECSFlag', val);
                                                            }}
                                                        />
                                                        <Label htmlFor='amsT_ECSFlag' className='cursor-pointer'>
                                                            ECS
                                                        </Label>
                                                    </div>

                                                    <div className='flex items-center space-x-2'>
                                                        <Checkbox
                                                            id='isEmisBpl'
                                                            checked={Number(watch('isEmisBpl')) === 1}
                                                            onCheckedChange={(checked) => {
                                                                const val = checked ? 1 : 0;
                                                                setValue('isEmisBpl', val);
                                                            }}
                                                        />
                                                        <Label htmlFor='isEmisBpl' className='cursor-pointer'>
                                                            EMIS/BPL Card/STS No.
                                                        </Label>
                                                    </div>
                                                </div>

                                                {/* EMIS input when checked */}
                                                {Number(watch('isEmisBpl')) === 1 && (
                                                    <div className='mt-3 w-1/2'>
                                                        <InputText
                                                            label='EMIS / BPL / STS No.'
                                                            required
                                                            id='amsT_BPLCardNo'
                                                            placeholder='Enter card or STS no.'
                                                            {...register('amsT_BPLCardNo')}
                                                            error={errors.amsT_BPLCardNo?.message}
                                                        />
                                                    </div>
                                                )}

                                                {/* ECS details panel */}
                                                {Number(watch('amsT_ECSFlag')) === 1 && (
                                                    <div className='mt-4 rounded border border-gray-200 bg-white p-4 shadow-sm'>
                                                        <div className='flex items-center justify-between'>
                                                            <h4 className='font-semibold'>ECS STUDENT DETAILS</h4>
                                                            <Button
                                                                size='sm'
                                                                className='w-fit'
                                                                variant='ghost'
                                                                onClick={() => setValue('amsT_ECSFlag', 0)}>
                                                                Close
                                                            </Button>
                                                        </div>

                                                        <div className='mt-3 grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                            <InputText
                                                                label='Account No.'
                                                                required
                                                                id='asecS_AccountNo'
                                                                placeholder='Account number'
                                                                {...register('asecS_AccountNo')}
                                                                error={errors.asecS_AccountNo?.message}
                                                            />

                                                            <InputText
                                                                label='Account Holder Name'
                                                                required
                                                                id='asecS_AccountHolderName'
                                                                placeholder='Account holder name'
                                                                {...register('asecS_AccountHolderName')}
                                                                error={errors.asecS_AccountHolderName?.message}
                                                            />

                                                            <InputText
                                                                label='Bank Name'
                                                                required
                                                                id='asecS_BankName'
                                                                placeholder='Bank name'
                                                                {...register('asecS_BankName')}
                                                                error={errors.asecS_BankName?.message}
                                                            />

                                                            <InputText
                                                                label='Account Type'
                                                                required
                                                                id='asecS_AccountType'
                                                                placeholder='Savings / Current'
                                                                {...register('asecS_AccountType')}
                                                                error={errors.asecS_AccountType?.message}
                                                            />

                                                            <InputText
                                                                label='MICR Code'
                                                                required
                                                                id='asecS_MICRNo'
                                                                placeholder='MICR'
                                                                {...register('asecS_MICRNo')}
                                                                error={errors.asecS_MICRNo?.message}
                                                            />

                                                            <InputText
                                                                label='Branch Name'
                                                                required
                                                                id='asecS_Branch'
                                                                placeholder='Branch name'
                                                                {...register('asecS_Branch')}
                                                                error={errors.asecS_Branch?.message}
                                                            />
                                                        </div>

                                                        <div className='mt-4 flex justify-end'>
                                                            <Button
                                                                onClick={() => setValue('amsT_ECSFlag', 0)}
                                                                size='sm'
                                                                className='ml-2 w-fit'>
                                                                ADD & CLOSE
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <InputText
                                                label='Bank Name'
                                                id='amsT_BankName'
                                                placeholder='Bank name'
                                                {...register('amsT_BankName')}
                                                error={errors.amsT_BankName?.message}
                                            />
                                            <InputText
                                                label='Branch Name'
                                                id='amsT_BankBranch'
                                                placeholder='Branch name'
                                                {...register('amsT_BankBranch')}
                                                error={errors.amsT_BankBranch?.message}
                                            />
                                            <InputText
                                                label='Bank Account No.'
                                                id='amsT_BankAccountNo'
                                                placeholder='Bank Account Number'
                                                {...register('amsT_BankAccountNo')}
                                                error={errors.amsT_BankAccountNo?.message}
                                            />
                                            <InputText
                                                label='Bank IFSC Code.'
                                                id='amsT_BankIFSCCode'
                                                placeholder='Bank IFSC Code'
                                                {...register('amsT_BankIFSCCode')}
                                                error={errors.amsT_BankIFSCCode?.message}
                                            />

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='feeConcessionType'>
                                                    Fee Concession Type <span className='ml-1 text-red-500'>*</span>
                                                </Label>
                                                <Controller
                                                    name='feeConcessionType'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            key={field.value || 'empty'}
                                                            onValueChange={(value) => field.onChange(value)}
                                                            required
                                                            value={field.value?.toString() || ''}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select fee concession type' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {concessionLoading ? (
                                                                    <SelectItem value={'loading'} disabled>
                                                                        Loading...
                                                                    </SelectItem>
                                                                ) : concession?.data && concession.data.length > 0 ? (
                                                                    concession.data.map((item: any) => (
                                                                        <SelectItem key={String(item.fmcC_Id)} value={String(item.fmcC_Id)}>
                                                                            {item.fmcC_ConcessionName}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem value={'none'} disabled>
                                                                        No concession types
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                {errors.feeConcessionType && <FormError>{errors.feeConcessionType.message}</FormError>}
                                            </div>

                                            {/* Student TPIN */}
                                            <InputText
                                                label='Student TPIN'
                                                id='amsT_Tpin'
                                                placeholder='Enter student TPIN'
                                                {...register('amsT_Tpin')}
                                                error={errors.amsT_Tpin?.message}
                                            />

                                            {/* GPS Tracing Id */}
                                            <InputText
                                                label='GPS Tracing Id'
                                                id='amsT_GPSTrackingId'
                                                placeholder='Enter GPS tracing ID'
                                                {...register('amsT_GPSTrackingId')}
                                                error={errors.amsT_GPSTrackingId?.message}
                                            />

                                            {/* Medium Of Instruction */}
                                            <InputText
                                                label='Medium Of Instruction'
                                                id='amsT_MediumOfInstruction'
                                                placeholder='Enter medium of instruction'
                                                {...register('amsT_MediumOfInstruction')}
                                                error={errors.amsT_MediumOfInstruction?.message}
                                            />
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
                                                        id='amsT_ConStreet'
                                                        placeholder='Enter street'
                                                        {...register('amsT_ConStreet')}
                                                        error={errors.amsT_ConStreet?.message}
                                                    />
                                                    <InputText
                                                        label='Area'
                                                        id='amsT_ConArea'
                                                        placeholder='Enter area'
                                                        {...register('amsT_ConArea')}
                                                        error={errors.amsT_ConArea?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='amsT_ConCountry'>Country</Label>
                                                        <Controller
                                                            name='amsT_ConCountry'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value?.toString() || ''}>
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
                                                        {errors.amsT_ConCountry && <FormError>{errors.amsT_ConCountry.message}</FormError>}
                                                    </div>
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='pasR_ConState'>State</Label>
                                                        <Controller
                                                            name='amsT_ConState'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString() || ''}>
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
                                                        {errors.amsT_ConState && <FormError>{errors.amsT_ConState.message}</FormError>}
                                                    </div>
                                                    {/* <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='amsT_ConDistrict'>District</Label>
                                                        <Controller
                                                            name='amsT_ConDistrict'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString() || ''}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select District' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {conDistrictLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : conDistrictError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            conDistrict?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmD_Id}
                                                                                    value={item.ivrmmD_Id.toString()}>
                                                                                    {item.ivrmmD_Name}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.amsT_ConDistrict && <FormError>{errors.amsT_ConDistrict.message}</FormError>}
                                                    </div> */}
                                                    <InputText
                                                        label='City'
                                                        id='amsT_ConCity'
                                                        placeholder='Enter city'
                                                        {...register('amsT_ConCity')}
                                                        error={errors.amsT_ConCity?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Controller
                                                            name='amsT_ConPincode'
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
                                                                        id='amsT_ConPincode'
                                                                        value={field.value}
                                                                        onChange={(valueOrEvent: any) => {
                                                                            // MobileNumberInput forwards the input event; accept either event or string
                                                                            const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                            const str = raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                            const truncated = conZipLength
                                                                                ? str.slice(0, conZipLength)
                                                                                : str;
                                                                            field.onChange(truncated);
                                                                            // Set/clear a manual validation error so message appears immediately
                                                                            if (
                                                                                conZipLength &&
                                                                                truncated !== '' &&
                                                                                String(truncated).length !== conZipLength
                                                                            ) {
                                                                                setError('amsT_ConPincode', {
                                                                                    type: 'manual',
                                                                                    message: `Pin code must be ${conZipLength} digits`
                                                                                });
                                                                            } else {
                                                                                clearErrors('amsT_ConPincode');
                                                                            }
                                                                            // Also trigger the resolver-based validation
                                                                            trigger('amsT_ConPincode');
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
                                                        {errors.amsT_ConPincode && <FormError>{errors.amsT_ConPincode.message}</FormError>}
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
                                                        id='amsT_PerStreet'
                                                        placeholder='Enter street'
                                                        {...register('amsT_PerStreet')}
                                                        error={errors.amsT_PerStreet?.message}
                                                        disabled={sameAsResidential}
                                                    />
                                                    <InputText
                                                        label='Area'
                                                        id='amsT_PerArea'
                                                        placeholder='Enter area'
                                                        {...register('amsT_PerArea')}
                                                        error={errors.amsT_PerArea?.message}
                                                        disabled={sameAsResidential}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='amsT_PerCountry'>Country</Label>
                                                        <Controller
                                                            name='amsT_PerCountry'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value?.toString() || ''}
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
                                                        {errors.amsT_PerCountry && <FormError>{errors.amsT_PerCountry.message}</FormError>}
                                                    </div>
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='amsT_PerState'>State</Label>
                                                        <Controller
                                                            name='amsT_PerState'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString() || ''}
                                                                    disabled={sameAsResidential}>
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
                                                        {errors.amsT_PerState && <FormError>{errors.amsT_PerState.message}</FormError>}
                                                    </div>
                                                    {/* <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='amsT_PerDistrict'>District</Label>
                                                        <Controller
                                                            name='amsT_PerDistrict'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString() || ''}
                                                                    disabled={sameAsResidential}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder='Select District' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {perDistrictLoading ? (
                                                                            <SelectItem value='loading' disabled>
                                                                                Loading...
                                                                            </SelectItem>
                                                                        ) : perDistrictError ? (
                                                                            <SelectItem value='error' disabled>
                                                                                Error loading
                                                                            </SelectItem>
                                                                        ) : (
                                                                            perDistrict?.data?.map((item) => (
                                                                                <SelectItem
                                                                                    key={item.ivrmmD_Id}
                                                                                    value={item.ivrmmD_Id.toString()}>
                                                                                    {item.ivrmmD_Name}
                                                                                </SelectItem>
                                                                            ))
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.amsT_PerDistrict && <FormError>{errors.amsT_PerDistrict.message}</FormError>}
                                                    </div> */}
                                                    <InputText
                                                        label='City'
                                                        id='amsT_PerCity'
                                                        placeholder='Enter city'
                                                        {...register('amsT_PerCity')}
                                                        error={errors.amsT_PerCity?.message}
                                                        disabled={sameAsResidential}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Controller
                                                            name='amsT_PerPincode'
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
                                                                        id='amsT_PerPincode'
                                                                        value={field.value}
                                                                        onChange={(valueOrEvent: any) => {
                                                                            const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                            const str = raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                            const truncated = perZipLength
                                                                                ? str.slice(0, perZipLength)
                                                                                : str;
                                                                            field.onChange(truncated);
                                                                            // Set/clear a manual validation error so message appears immediately
                                                                            if (
                                                                                perZipLength &&
                                                                                truncated !== '' &&
                                                                                String(truncated).length !== perZipLength
                                                                            ) {
                                                                                setError('amsT_PerPincode', {
                                                                                    type: 'manual',
                                                                                    message: `Pin code must be ${perZipLength} digits`
                                                                                });
                                                                            } else {
                                                                                clearErrors('amsT_PerPincode');
                                                                            }
                                                                            // Also trigger the resolver-based validation
                                                                            trigger('amsT_PerPincode');
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
                                                        {errors.amsT_PerPincode && <FormError>{errors.amsT_PerPincode.message}</FormError>}
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
                                                    <div className='col-span-full flex items-center gap-3'>
                                                        <Controller
                                                            name='fatherAliveFlag'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div className='flex items-center gap-2'>
                                                                    <Checkbox
                                                                        id='fatherAliveFlag'
                                                                        checked={field.value || false}
                                                                        onCheckedChange={(checked) => {
                                                                            field.onChange(checked);
                                                                            if (!checked) {
                                                                                setValue('fatherName', undefined as any);
                                                                                clearErrors('fatherName');
                                                                                setValue('fatherNationality', undefined);
                                                                                setValue('motherNationality', undefined);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Label htmlFor='fatherAliveFlag' className='font-medium text-gray-700'>
                                                                        Father is Alive
                                                                    </Label>
                                                                </div>
                                                            )}
                                                        />
                                                    </div>

                                                    {fatherAlive && (
                                                        <div>
                                                            <InputText
                                                                label='Father Name'
                                                                required
                                                                id='fatherName'
                                                                placeholder='Enter father name'
                                                                {...register('fatherName', {
                                                                    required: fatherAlive ? 'Father Name is required' : false
                                                                })}
                                                                error={errors.fatherName?.message}
                                                            />
                                                        </div>
                                                    )}

                                                    {!fatherAlive && (
                                                        <InputText
                                                            label='Father Name'
                                                            id='fatherName'
                                                            placeholder='Enter father name'
                                                            {...register('fatherName', {
                                                                required: fatherAlive ? 'Father Name is required' : false
                                                            })}
                                                            error={errors.fatherName?.message}
                                                            disabled
                                                        />
                                                    )}
                                                    <InputText
                                                        label='Surname'
                                                        id='fatherSurname'
                                                        placeholder='Enter surname'
                                                        {...register('fatherSurname')}
                                                        error={errors.fatherSurname?.message}
                                                    />

                                                    <InputText
                                                        label='Aadhaar No.'
                                                        id='fatherAadharNo'
                                                        placeholder='Enter Aadhaar No.'
                                                        {...register('fatherAadharNo')}
                                                        error={errors.fatherAadharNo?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='asmcL_Id'>Marital Status</Label>

                                                        <Controller
                                                            name='fatherMaritalStatus'
                                                            control={control}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <div className='flex flex-col space-y-2'>
                                                                    <Select
                                                                        value={field.value?.toString() || ''}
                                                                        onValueChange={(value) => field.onChange(value)}>
                                                                        <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
                                                                            <SelectValue placeholder='Select' />
                                                                        </SelectTrigger>

                                                                        <SelectContent>
                                                                            <SelectItem value='Married'>Married</SelectItem>
                                                                            <SelectItem value='Single father'>Single father</SelectItem>
                                                                            <SelectItem value='Single mother'>Single mother</SelectItem>
                                                                            <SelectItem value='Divorced father'>Divorced father</SelectItem>
                                                                            <SelectItem value='Divorced mother'>Divorced mother</SelectItem>
                                                                            <SelectItem value='Widow'>Widow</SelectItem>
                                                                            <SelectItem value='Widower'>Widower</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            )}
                                                        />

                                                        {errors.fatherMaritalStatus && (
                                                            <FormError>{errors.fatherMaritalStatus.message}</FormError>
                                                        )}
                                                    </div>

                                                    <div className='flex flex-col gap-1.5 '>
                                                        <Controller
                                                            name='fatherMobileNumbers'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div>
                                                                    <Label htmlFor='fatherMobileNumbers'>Mobile No.</Label>
                                                                    <PhoneInput
                                                                        country='in'
                                                                        value={
                                                                            phoneValues.fatherMobileNumbers ??
                                                                            (field.value != null ? String(field.value) : null)
                                                                        }
                                                                        onChange={(phone: any, countryData: any) =>
                                                                            handlePhoneChange(phone, countryData, 'fatherMobileNumbers')
                                                                        }
                                                                        onBlur={() => trigger('fatherMobileNumbers')}
                                                                        inputProps={{
                                                                            id: 'fatherMobileNumbers',
                                                                            name: 'fatherMobileNumbers',
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
                                                                    {phoneExpectedInfo.fatherMobileNumbers?.expected && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Mobile number must be exactly ${phoneExpectedInfo.fatherMobileNumbers.expected} digits for ${phoneExpectedInfo.fatherMobileNumbers.name ??
                                                                                'selected country'
                                                                                }`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        />
                                                        {errors.fatherMobileNumbers && (
                                                            <FormError>{errors.fatherMobileNumbers.message}</FormError>
                                                        )}
                                                    </div>

                                                    <InputText
                                                        label='Email-ID'
                                                        id='fatherEmailIds'
                                                        placeholder='Enter Email-ID'
                                                        {...register('fatherEmailIds')}
                                                        error={errors.fatherEmailIds?.message}
                                                    />

                                                    <InputText
                                                        label='Home Phone No'
                                                        id='fatherHomePhone'
                                                        placeholder='Enter Home Phone No'
                                                        {...register('fatherHomePhone')}
                                                        error={errors.fatherHomePhone?.message}
                                                    />
                                                    <InputText
                                                        label='Passing Year'
                                                        id='amsT_FatherPassingYear'
                                                        placeholder='Enter Passing Year'
                                                        {...register('amsT_FatherPassingYear')}
                                                        error={errors.amsT_FatherPassingYear?.message}
                                                    />

                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='fatherNationality'>
                                                            Country {fatherAlive && <span className='ml-1 text-red-500'>*</span>}
                                                        </Label>
                                                        <Controller
                                                            name='fatherNationality'
                                                            control={control}
                                                            rules={{
                                                                required: fatherAlive ? 'Country is required' : false
                                                            }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value?.toString() || ''}
                                                                    disabled={!fatherAlive}>
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
                                                        {(errors.fatherNationality ||
                                                            (fatherAlive && showStep3Errors && !watch('fatherNationality'))) && (
                                                                <FormError>
                                                                    {errors.fatherNationality?.message ?? 'Country is required'}
                                                                </FormError>
                                                            )}
                                                    </div>
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>Education Details</h3>
                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            <InputText
                                                                label=' '
                                                                id='FatherEducation'
                                                                placeholder='Enter qualification'
                                                                {...register('FatherEducation')}
                                                                error={errors.FatherEducation?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Present Address Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>
                                                            Father Present Address Details
                                                        </h3>

                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            {/* Address */}
                                                            <InputText
                                                                label='Address'
                                                                id='fatherPresentAddress.address'
                                                                placeholder='Enter Address'
                                                                {...register('fatherPresentAddress.address')}
                                                                error={errors.fatherPresentAddress?.address?.message}
                                                            />
                                                            {/* <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='fatherPresentAddress.country'>
                                                                    Country <span className='ml-1 text-red-500'>*</span>
                                                                </Label>

                                                                <Controller
                                                                    name='fatherPresentAddress.country'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(value)}
                                                                            value={field.value?.toString() || ''}>
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
                                                                                            key={item.ivrmmC_CountryName}
                                                                                            value={item.ivrmmC_CountryName.toString()}>
                                                                                            {item.ivrmmC_CountryName}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />

                                                                {errors.fatherPresentAddress?.country && (
                                                                    <FormError>{errors.fatherPresentAddress.country.message}</FormError>
                                                                )}
                                                            </div> */}

                                                            {/* State */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='fatherPresentAddress.state'>State</Label>
                                                                <Controller
                                                                    name='fatherPresentAddress.state'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder='Select state' />
                                                                            </SelectTrigger>

                                                                            <SelectContent>
                                                                                {fatherPresentStateLoading ? (
                                                                                    <SelectItem value='loading' disabled>
                                                                                        Loading...
                                                                                    </SelectItem>
                                                                                ) : fatherPresentStateError ? (
                                                                                    <SelectItem value='error' disabled>
                                                                                        Error loading
                                                                                    </SelectItem>
                                                                                ) : (
                                                                                    fatherPresentState?.data?.map((item) => (
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
                                                                {errors.fatherPresentAddress?.state && (
                                                                    <FormError>{errors.fatherPresentAddress.state.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* City */}
                                                            <InputText
                                                                label='City'
                                                                id='fatherPresentAddress.city'
                                                                placeholder='Enter city'
                                                                {...register('fatherPresentAddress.city')}
                                                                error={errors.fatherPresentAddress?.city?.message}
                                                            />

                                                            {/* Pincode */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                    name='fatherPresentAddress.pincode'
                                                                    control={control}
                                                                    rules={
                                                                        fatherZipLength
                                                                            ? {
                                                                                minLength: {
                                                                                    value: fatherZipLength,
                                                                                    message: `Pin code must be ${fatherZipLength} digits`
                                                                                },
                                                                                maxLength: {
                                                                                    value: fatherZipLength,
                                                                                    message: `Pin code must be ${fatherZipLength} digits`
                                                                                }
                                                                            }
                                                                            : undefined
                                                                    }
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <MobileNumberInput
                                                                                label='Pin Code'
                                                                                id='fatherPresentAddress.pincode'
                                                                                value={field.value}
                                                                                onChange={(valueOrEvent) => {
                                                                                    const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                                    const str =
                                                                                        raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                                    const truncated = fatherZipLength
                                                                                        ? str.slice(0, fatherZipLength)
                                                                                        : str;
                                                                                    field.onChange(truncated);

                                                                                    if (
                                                                                        fatherZipLength &&
                                                                                        truncated !== '' &&
                                                                                        truncated.length !== fatherZipLength
                                                                                    ) {
                                                                                        setError('fatherPresentAddress.pincode', {
                                                                                            type: 'manual',
                                                                                            message: `Pin code must be ${fatherZipLength} digits`
                                                                                        });
                                                                                    } else {
                                                                                        clearErrors('fatherPresentAddress.pincode');
                                                                                    }

                                                                                    trigger('fatherPresentAddress.pincode');
                                                                                }}
                                                                                minLength={fatherZipLength}
                                                                                maxLength={fatherZipLength}
                                                                                type='number'
                                                                                showSpinner={false}
                                                                            />

                                                                            {fatherCountryObj && fatherZipLength && (
                                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                                    {`Pin code must be ${fatherZipLength} digits for ${fatherCountryObj.ivrmmC_CountryName}`}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />
                                                                {errors.fatherPresentAddress?.pincode && (
                                                                    <FormError>{errors.fatherPresentAddress.pincode.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* PO */}
                                                            <InputText
                                                                label='PO'
                                                                id='fatherPresentAddress.po'
                                                                placeholder='Enter PO'
                                                                {...register('fatherPresentAddress.po')}
                                                                error={errors.fatherPresentAddress?.po?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Permanent Address Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>
                                                            Father Permanent Address Details
                                                        </h3>

                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            {/* Permanent Address */}
                                                            <InputText
                                                                label='Permanent Address'
                                                                id='fatherPermanentAddress.address'
                                                                placeholder='Enter Permanent Address'
                                                                {...register('fatherPermanentAddress.address')}
                                                                error={errors.fatherPermanentAddress?.address?.message}
                                                            />
                                                            {/* <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='fatherPermanentAddress.country'>
                                                                    Country <span className='ml-1 text-red-500'>*</span>
                                                                </Label>

                                                                <Controller
                                                                    name='fatherPermanentAddress.country'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(value)}
                                                                            value={field.value?.toString() || ''}>
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
                                                                                            key={item.ivrmmC_CountryName}
                                                                                            value={item.ivrmmC_CountryName.toString()}>
                                                                                            {item.ivrmmC_CountryName}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />

                                                                {errors.fatherPermanentAddress?.country && (
                                                                    <FormError>{errors.fatherPermanentAddress.country.message}</FormError>
                                                                )}
                                                            </div> */}

                                                            {/* Permanent State */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='fatherPermanentAddress.state'>Permanent State</Label>

                                                                <Controller
                                                                    name='fatherPermanentAddress.state'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder='Select state' />
                                                                            </SelectTrigger>

                                                                            <SelectContent>
                                                                                {fatherPresentStateLoading ? (
                                                                                    <SelectItem value='loading' disabled>
                                                                                        Loading...
                                                                                    </SelectItem>
                                                                                ) : fatherPresentStateError ? (
                                                                                    <SelectItem value='error' disabled>
                                                                                        Error loading
                                                                                    </SelectItem>
                                                                                ) : (
                                                                                    fatherPresentState?.data?.map((item) => (
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

                                                                {errors.fatherPermanentAddress?.state && (
                                                                    <FormError>{errors.fatherPermanentAddress.state.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* Permanent City */}
                                                            <InputText
                                                                label='Permanent City'
                                                                id='fatherPermanentAddress.city'
                                                                placeholder='Enter city'
                                                                {...register('fatherPermanentAddress.city')}
                                                                error={errors.fatherPermanentAddress?.city?.message}
                                                            />

                                                            {/* Permanent Pin Code */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                    name='fatherPermanentAddress.pincode'
                                                                    control={control}
                                                                    rules={
                                                                        fatherZipLength
                                                                            ? {
                                                                                minLength: {
                                                                                    value: fatherZipLength,
                                                                                    message: `Pin code must be ${fatherZipLength} digits`
                                                                                },
                                                                                maxLength: {
                                                                                    value: fatherZipLength,
                                                                                    message: `Pin code must be ${fatherZipLength} digits`
                                                                                }
                                                                            }
                                                                            : undefined
                                                                    }
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <MobileNumberInput
                                                                                label='Permanent Pin Code'
                                                                                id='fatherPermanentAddress.pincode'
                                                                                value={field.value}
                                                                                onChange={(valOrEvent: any) => {
                                                                                    const raw = valOrEvent?.target?.value ?? valOrEvent;
                                                                                    const str =
                                                                                        raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                                    const truncated = fatherZipLength
                                                                                        ? str.slice(0, fatherZipLength)
                                                                                        : str;

                                                                                    field.onChange(truncated);

                                                                                    if (
                                                                                        fatherZipLength &&
                                                                                        truncated !== '' &&
                                                                                        truncated.length !== fatherZipLength
                                                                                    ) {
                                                                                        setError('fatherPermanentAddress.pincode', {
                                                                                            type: 'manual',
                                                                                            message: `Pin code must be ${fatherZipLength} digits`
                                                                                        });
                                                                                    } else {
                                                                                        clearErrors('fatherPermanentAddress.pincode');
                                                                                    }

                                                                                    trigger('fatherPermanentAddress.pincode');
                                                                                }}
                                                                                minLength={fatherZipLength}
                                                                                maxLength={fatherZipLength}
                                                                                type='number'
                                                                                showSpinner={false}
                                                                            />

                                                                            {fatherCountryObj && fatherZipLength && (
                                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                                    {`Pin code must be ${fatherZipLength} digits for ${fatherCountryObj.ivrmmC_CountryName}`}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />

                                                                {errors.fatherPermanentAddress?.pincode && (
                                                                    <FormError>{errors.fatherPermanentAddress.pincode.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* Permanent PS */}
                                                            <InputText
                                                                label='Permanent PS'
                                                                id='fatherPermanentAddress.ps'
                                                                placeholder='Enter Permanent PS'
                                                                {...register('fatherPermanentAddress.ps')}
                                                                error={errors.fatherPermanentAddress?.ps?.message}
                                                            />

                                                            {/* Permanent PO */}
                                                            <InputText
                                                                label='Permanent PO'
                                                                id='fatherPermanentAddress.po'
                                                                placeholder='Enter Permanent PO'
                                                                {...register('fatherPermanentAddress.po')}
                                                                error={errors.fatherPermanentAddress?.po?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Office Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>Office Details</h3>
                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            <InputText
                                                                label='Office Address'
                                                                id='fatherOfficeAddress'
                                                                placeholder='Enter office address'
                                                                {...register('fatherOfficeAddress')}
                                                                error={errors.fatherOfficeAddress?.message}
                                                            />

                                                            <div className='flex flex-col gap-1.5 '>
                                                                <Controller
                                                                    name='fatherOfficePhone'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <div>
                                                                            <Label htmlFor='fatherOfficePhone'>
                                                                                Father Office Phone No.
                                                                            </Label>
                                                                            <PhoneInput
                                                                                country='in'
                                                                                value={
                                                                                    phoneValues.fatherOfficePhone ??
                                                                                    (field.value != null ? String(field.value) : null)
                                                                                }
                                                                                onChange={(phone: any, countryData: any) =>
                                                                                    handlePhoneChange(
                                                                                        phone,
                                                                                        countryData,
                                                                                        'fatherOfficePhone'
                                                                                    )
                                                                                }
                                                                                onBlur={() => trigger('fatherOfficePhone')}
                                                                                inputProps={{
                                                                                    id: 'fatherOfficePhone',
                                                                                    name: 'fatherOfficePhone',
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
                                                                            {phoneExpectedInfo.fatherOfficePhone?.expected && (
                                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                                    {`Mobile number must be exactly ${phoneExpectedInfo.fatherOfficePhone.expected} digits for ${phoneExpectedInfo.fatherOfficePhone.name ??
                                                                                        'selected country'
                                                                                        }`}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                                {errors.fatherOfficePhone && (
                                                                    <FormError>{errors.fatherOfficePhone.message}</FormError>
                                                                )}
                                                            </div>

                                                            <InputText
                                                                label='Occupation'
                                                                id='fatherOccupation'
                                                                placeholder='Enter Occupation'
                                                                {...register('fatherOccupation')}
                                                                error={errors.fatherOccupation?.message}
                                                            />

                                                            <InputText
                                                                label='Designation'
                                                                id='fatherDesignation'
                                                                placeholder='Enter designation'
                                                                {...register('fatherDesignation')}
                                                                error={errors.fatherDesignation?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Other's Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>Other's Details</h3>
                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='fatherReligionId'>Religion</Label>
                                                                <Controller
                                                                    name='fatherReligionId'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
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
                                                                                        <SelectItem
                                                                                            key={item.ivrmmR_Id}
                                                                                            value={item.ivrmmR_Id.toString()}>
                                                                                            {item.ivrmmR_Name}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                                {errors.fatherReligionId && (
                                                                    <FormError>{errors.fatherReligionId.message}</FormError>
                                                                )}
                                                            </div>

                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='fatherCasteId'>Caste Category</Label>
                                                                <Controller
                                                                    name='fatherCasteId'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder='Select caste Category' />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {fatherCasteLoading ? (
                                                                                    <SelectItem value='loading' disabled>
                                                                                        Loading...
                                                                                    </SelectItem>
                                                                                ) : fatherCasteError ? (
                                                                                    <SelectItem value='error' disabled>
                                                                                        Error loading
                                                                                    </SelectItem>
                                                                                ) : (
                                                                                    fatherCaste?.data?.map((item) => (
                                                                                        <SelectItem
                                                                                            key={item.imC_Id}
                                                                                            value={item.imC_Id.toString()}>
                                                                                            {item.imC_CasteName}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                                {errors.fatherCasteId && (
                                                                    <FormError>{errors.fatherCasteId.message}</FormError>
                                                                )}
                                                            </div>
                                                            <InputText
                                                                label='Sub Caste '
                                                                id='fatherSubCaste'
                                                                placeholder='Enter caste'
                                                                {...register('fatherSubCaste')}
                                                                error={errors.fatherSubCaste?.message}
                                                            />

                                                            <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                    name='fatherAnnualIncome'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputNumber
                                                                            label='Father Annual Income'
                                                                            id='fatherAnnualIncome'
                                                                            value={field.value || 0}
                                                                            onChange={(value) =>
                                                                                field.onChange(Number.isNaN(value) ? 0 : value)
                                                                            }
                                                                            minValue={0}
                                                                            maxDigits={15}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.fatherAnnualIncome && (
                                                                    <FormError>{errors.fatherAnnualIncome.message}</FormError>
                                                                )}
                                                            </div>

                                                            <InputText
                                                                label='Caste Certificate No'
                                                                id='fatherCasteCertificateNo'
                                                                placeholder='Enter Caste Certificate No '
                                                                {...register('fatherCasteCertificateNo')}
                                                                error={errors.fatherCasteCertificateNo?.message}
                                                            />

                                                            <InputText
                                                                label='Pan No'
                                                                id='fatherPAN'
                                                                placeholder='Enter PAN'
                                                                {...register('fatherPAN')}
                                                                error={errors.fatherPAN?.message}
                                                            />
                                                            <div className='flex items-center space-x-2'>
                                                                <Checkbox
                                                                    id='fatherSelfEmployedFlg'
                                                                    checked={Boolean(watch('fatherSelfEmployedFlg'))}
                                                                    onCheckedChange={(checked) => {
                                                                        setValue('fatherSelfEmployedFlg', checked === true);
                                                                    }}
                                                                />
                                                                <Label htmlFor='fatherSelfEmployedFlg' className='cursor-pointer'>
                                                                    Self Employed Flg
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mother Details           */}
                                            <div className='space-y-4'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Mother Details</h3>
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    <div className='col-span-full flex items-center gap-3'>
                                                        <Controller
                                                            name='motherAliveFlag'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div className='flex items-center gap-2'>
                                                                    <Checkbox
                                                                        id='motherAliveFlag'
                                                                        checked={field.value || false}
                                                                        onCheckedChange={(checked) => {
                                                                            field.onChange(checked);
                                                                            if (!checked) {
                                                                                setValue('motherName', undefined as any);
                                                                                clearErrors('motherName');
                                                                                setValue('motherNationality', undefined);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Label htmlFor='motherAliveFlag' className='font-medium text-gray-700'>
                                                                        Mother is Alive
                                                                    </Label>
                                                                </div>
                                                            )}
                                                        />
                                                    </div>

                                                    {motherAlive && (
                                                        <div>
                                                            <InputText
                                                                label='Mother Name'
                                                                required
                                                                id='motherName'
                                                                placeholder='Enter mother name'
                                                                {...register('motherName', {
                                                                    required: motherAlive ? 'Mother Name is required' : false
                                                                })}
                                                                error={errors.motherName?.message}
                                                            />
                                                        </div>
                                                    )}

                                                    {!motherAlive && (
                                                        <InputText
                                                            label='Mother Name'
                                                            id='motherName'
                                                            placeholder='Enter mother name'
                                                            {...register('motherName', {
                                                                required: motherAlive ? 'Mother Name is required' : false
                                                            })}
                                                            error={errors.motherName?.message}
                                                            disabled
                                                        />
                                                    )}
                                                    <InputText
                                                        label='Surname'
                                                        id='motherSurname'
                                                        placeholder='Enter surname'
                                                        {...register('motherSurname')}
                                                        error={errors.motherSurname?.message}
                                                    />

                                                    <InputText
                                                        label='Aadhaar No.'
                                                        id='motherAadharNo'
                                                        placeholder='Enter Aadhaar No'
                                                        {...register('motherAadharNo')}
                                                        error={errors.motherAadharNo?.message}
                                                    />

                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='motherMaritalStatus'>Marital Status</Label>
                                                        <Controller
                                                            name='motherMaritalStatus'
                                                            control={control}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <div className='flex flex-col space-y-2'>
                                                                    <Select
                                                                        value={field.value?.toString() || ''}
                                                                        onValueChange={(value) => field.onChange(value)}>
                                                                        <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
                                                                            <SelectValue placeholder='Select' />
                                                                        </SelectTrigger>

                                                                        <SelectContent>
                                                                            <SelectItem value='Married'>Married</SelectItem>
                                                                            <SelectItem value='Single father'>Single father</SelectItem>
                                                                            <SelectItem value='Single mother'>Single mother</SelectItem>
                                                                            <SelectItem value='Divorced father'>Divorced father</SelectItem>
                                                                            <SelectItem value='Divorced mother'>Divorced mother</SelectItem>
                                                                            <SelectItem value='Widow'>Widow</SelectItem>
                                                                            <SelectItem value='Widower'>Widower</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            )}
                                                        />

                                                        {errors.motherMaritalStatus && (
                                                            <FormError>{errors.motherMaritalStatus.message}</FormError>
                                                        )}
                                                    </div>

                                                    <div className='flex flex-col gap-1.5 '>
                                                        <Controller
                                                            name='motherMobileNumbers'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div>
                                                                    <Label htmlFor='motherMobileNumbers'>Mobile No.</Label>
                                                                    <PhoneInput
                                                                        country='in'
                                                                        value={
                                                                            phoneValues.motherMobileNumbers ??
                                                                            (field.value != null ? String(field.value) : null)
                                                                        }
                                                                        onChange={(phone: any, countryData: any) =>
                                                                            handlePhoneChange(phone, countryData, 'motherMobileNumbers')
                                                                        }
                                                                        onBlur={() => trigger('motherMobileNumbers')}
                                                                        inputProps={{
                                                                            id: 'motherMobileNumbers',
                                                                            name: 'motherMobileNumbers',
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
                                                                    {phoneExpectedInfo.motherMobileNumbers?.expected && (
                                                                        <span className='mt-1 text-muted-foreground text-xs'>
                                                                            {`Mobile number must be exactly ${phoneExpectedInfo.motherMobileNumbers.expected} digits for ${phoneExpectedInfo.motherMobileNumbers.name ??
                                                                                'selected country'
                                                                                }`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        />
                                                        {errors.motherMobileNumbers && (
                                                            <FormError>{errors.motherMobileNumbers.message}</FormError>
                                                        )}
                                                    </div>

                                                    <InputText
                                                        label='Email-ID'
                                                        id='motherEmailIds'
                                                        placeholder='Enter Email-ID'
                                                        {...register('motherEmailIds')}
                                                        error={errors.motherEmailIds?.message}
                                                    />

                                                    <InputText
                                                        label='Home Phone No'
                                                        id='motherHomePhone'
                                                        placeholder='Enter Home Phone No'
                                                        {...register('motherHomePhone')}
                                                        error={errors.motherHomePhone?.message}
                                                    />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label htmlFor='motherNationality'>
                                                            Country {motherAlive && <span className='ml-1 text-red-500'>*</span>}
                                                        </Label>
                                                        <Controller
                                                            name='motherNationality'
                                                            control={control}
                                                            rules={{
                                                                required: motherAlive ? 'Country is required' : false
                                                            }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    key={field.value || 'empty'}
                                                                    onValueChange={(value) => field.onChange(value)}
                                                                    value={field.value?.toString() || ''}
                                                                    disabled={!motherAlive}>
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
                                                        {(errors.motherNationality ||
                                                            (motherAlive && showStep3Errors && !watch('motherNationality'))) && (
                                                                <FormError>
                                                                    {errors.motherNationality?.message ?? 'Country is required'}
                                                                </FormError>
                                                            )}
                                                    </div>

                                                    {/* Education Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>Education Details</h3>
                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            <InputText
                                                                label='Qualification'
                                                                id='motherQualification'
                                                                placeholder='Enter qualification'
                                                                {...register('motherQualification')}
                                                                error={errors.motherQualification?.message}
                                                            />

                                                            <InputText
                                                                label='Passing Year'
                                                                id='motherPassingYear'
                                                                placeholder='Enter Passing Year'
                                                                {...register('motherPassingYear')}
                                                                error={errors.motherPassingYear?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Mother Present Address Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>
                                                            Mother Present Address Details
                                                        </h3>

                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            {/* Address */}
                                                            <InputText
                                                                label='Address'
                                                                id='motherPresentAddress.address'
                                                                placeholder='Enter Address'
                                                                {...register('motherPresentAddress.address')}
                                                                error={errors.motherPresentAddress?.address?.message}
                                                            />
                                                            {/* <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='motherPresentAddress.country'>
                                                                    Country <span className='ml-1 text-red-500'>*</span>
                                                                </Label>

                                                                <Controller
                                                                    name='motherPresentAddress.country'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(value)}
                                                                            value={field.value?.toString() || ''}>
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
                                                                                            key={item.ivrmmC_CountryName}
                                                                                            value={item.ivrmmC_CountryName.toString()}>
                                                                                            {item.ivrmmC_CountryName}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />

                                                                {errors.motherPresentAddress?.country && (
                                                                    <FormError>{errors.motherPresentAddress.country.message}</FormError>
                                                                )}
                                                            </div> */}

                                                            {/* State */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='motherPresentAddress.state'>State</Label>

                                                                <Controller
                                                                    name='motherPresentAddress.state'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder='Select state' />
                                                                            </SelectTrigger>

                                                                            <SelectContent>
                                                                                {motherPresentStateLoading ? (
                                                                                    <SelectItem value='loading'>Loading...</SelectItem>
                                                                                ) : motherPresentStateError ? (
                                                                                    <SelectItem value='error'>Error loading</SelectItem>
                                                                                ) : (
                                                                                    motherPresentState?.data?.map((item) => (
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

                                                                {errors.motherPresentAddress?.state && (
                                                                    <FormError>{errors.motherPresentAddress.state.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* City */}
                                                            <InputText
                                                                label='City'
                                                                id='motherPresentAddress.city'
                                                                placeholder='Enter city'
                                                                {...register('motherPresentAddress.city')}
                                                                error={errors.motherPresentAddress?.city?.message}
                                                            />

                                                            {/* Pincode */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                    name='motherPresentAddress.pincode'
                                                                    control={control}
                                                                    rules={
                                                                        motherZipLength
                                                                            ? {
                                                                                minLength: {
                                                                                    value: motherZipLength,
                                                                                    message: `Pin code must be ${motherZipLength} digits`
                                                                                },
                                                                                maxLength: {
                                                                                    value: motherZipLength,
                                                                                    message: `Pin code must be ${motherZipLength} digits`
                                                                                }
                                                                            }
                                                                            : undefined
                                                                    }
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <MobileNumberInput
                                                                                label='Pin Code'
                                                                                id='motherPresentAddress.pincode'
                                                                                value={field.value}
                                                                                onChange={(valueOrEvent: any) => {
                                                                                    const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                                    const str =
                                                                                        raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                                    const truncated = motherZipLength
                                                                                        ? str.slice(0, motherZipLength)
                                                                                        : str;
                                                                                    field.onChange(truncated);

                                                                                    if (
                                                                                        motherZipLength &&
                                                                                        truncated !== '' &&
                                                                                        truncated.length !== motherZipLength
                                                                                    ) {
                                                                                        setError('motherPresentAddress.pincode', {
                                                                                            type: 'manual',
                                                                                            message: `Pin code must be ${motherZipLength} digits`
                                                                                        });
                                                                                    } else {
                                                                                        clearErrors('motherPresentAddress.pincode');
                                                                                    }

                                                                                    trigger('motherPresentAddress.pincode');
                                                                                }}
                                                                                minLength={motherZipLength}
                                                                                maxLength={motherZipLength}
                                                                                type='number'
                                                                                showSpinner={false}
                                                                            />

                                                                            {motherCountryObj && motherZipLength && (
                                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                                    {`Pin code must be ${motherZipLength} digits for ${motherCountryObj.ivrmmC_CountryName}`}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />

                                                                {errors.motherPresentAddress?.pincode && (
                                                                    <FormError>{errors.motherPresentAddress.pincode.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* PO */}
                                                            <InputText
                                                                label='PO'
                                                                id='motherPresentAddress.po'
                                                                placeholder='Enter PO'
                                                                {...register('motherPresentAddress.po')}
                                                                error={errors.motherPresentAddress?.po?.message}
                                                            />

                                                            {/* PS */}
                                                            <InputText
                                                                label='PS'
                                                                id='motherPresentAddress.ps'
                                                                placeholder='Enter PS'
                                                                {...register('motherPresentAddress.ps')}
                                                                error={errors.motherPresentAddress?.ps?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Mother Permanent Address Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>
                                                            Mother Permanent Address Details
                                                        </h3>

                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            {/* Permanent Address */}
                                                            <InputText
                                                                label='Permanent Address'
                                                                id='motherPermanentAddress.address'
                                                                placeholder='Enter Permanent Address'
                                                                {...register('motherPermanentAddress.address')}
                                                                error={errors.motherPermanentAddress?.address?.message}
                                                            />
                                                            {/* <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='motherPermanentAddress.country'>
                                                                    Country <span className='ml-1 text-red-500'>*</span>
                                                                </Label>

                                                                <Controller
                                                                    name='motherPermanentAddress.country'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(value)}
                                                                            value={field.value?.toString() || ''}>
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
                                                                                            key={item.ivrmmC_CountryName}
                                                                                            value={item.ivrmmC_CountryName.toString()}>
                                                                                            {item.ivrmmC_CountryName}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />

                                                                {errors.motherPermanentAddress?.country && (
                                                                    <FormError>{errors.motherPermanentAddress.country.message}</FormError>
                                                                )}
                                                            </div> */}

                                                            {/* Permanent State */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='motherPermanentAddress.state'>Permanent State</Label>

                                                                <Controller
                                                                    name='motherPermanentAddress.state'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder='Select state' />
                                                                            </SelectTrigger>

                                                                            <SelectContent>
                                                                                {motherPresentStateLoading ? (
                                                                                    <SelectItem value='loading' disabled>
                                                                                        Loading...
                                                                                    </SelectItem>
                                                                                ) : motherPresentStateError ? (
                                                                                    <SelectItem value='error' disabled>
                                                                                        Error loading
                                                                                    </SelectItem>
                                                                                ) : (
                                                                                    motherPresentState?.data?.map((item) => (
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

                                                                {errors.motherPermanentAddress?.state && (
                                                                    <FormError>{errors.motherPermanentAddress.state.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* Permanent City */}
                                                            <InputText
                                                                label='Permanent City'
                                                                id='motherPermanentAddress.city'
                                                                placeholder='Enter city'
                                                                {...register('motherPermanentAddress.city')}
                                                                error={errors.motherPermanentAddress?.city?.message}
                                                            />

                                                            {/* Permanent Pincode */}
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                    name='motherPermanentAddress.pincode'
                                                                    control={control}
                                                                    rules={
                                                                        motherZipLength
                                                                            ? {
                                                                                minLength: {
                                                                                    value: motherZipLength,
                                                                                    message: `Pin code must be ${motherZipLength} digits`
                                                                                },
                                                                                maxLength: {
                                                                                    value: motherZipLength,
                                                                                    message: `Pin code must be ${motherZipLength} digits`
                                                                                }
                                                                            }
                                                                            : undefined
                                                                    }
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <MobileNumberInput
                                                                                label='Permanent Pin Code'
                                                                                id='motherPermanentAddress.pincode'
                                                                                placeholder='Enter Pincode'
                                                                                value={field.value}
                                                                                onChange={(valueOrEvent: any) => {
                                                                                    const raw = valueOrEvent?.target?.value ?? valueOrEvent;
                                                                                    const str =
                                                                                        raw == null ? '' : String(raw).replace(/\D/g, '');
                                                                                    const truncated = motherZipLength
                                                                                        ? str.slice(0, motherZipLength)
                                                                                        : str;

                                                                                    field.onChange(truncated);

                                                                                    if (
                                                                                        motherZipLength &&
                                                                                        truncated !== '' &&
                                                                                        truncated.length !== motherZipLength
                                                                                    ) {
                                                                                        setError('motherPermanentAddress.pincode', {
                                                                                            type: 'manual',
                                                                                            message: `Pin code must be ${motherZipLength} digits`
                                                                                        });
                                                                                    } else {
                                                                                        clearErrors('motherPermanentAddress.pincode');
                                                                                    }

                                                                                    trigger('motherPermanentAddress.pincode');
                                                                                }}
                                                                                minLength={motherZipLength}
                                                                                maxLength={motherZipLength}
                                                                                type='number'
                                                                                showSpinner={false}
                                                                            />

                                                                            {motherCountryObj && motherZipLength && (
                                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                                    {`Pin code must be ${motherZipLength} digits for ${motherCountryObj.ivrmmC_CountryName}`}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />

                                                                {errors.motherPermanentAddress?.pincode && (
                                                                    <FormError>{errors.motherPermanentAddress.pincode.message}</FormError>
                                                                )}
                                                            </div>

                                                            {/* Permanent PO */}
                                                            <InputText
                                                                label='Permanent PO'
                                                                id='motherPermanentAddress.po'
                                                                placeholder='Enter Permanent PO'
                                                                {...register('motherPermanentAddress.po')}
                                                                error={errors.motherPermanentAddress?.po?.message}
                                                            />

                                                            {/* Permanent PS */}
                                                            <InputText
                                                                label='Permanent PS'
                                                                id='motherPermanentAddress.ps'
                                                                placeholder='Enter Permanent PS'
                                                                {...register('motherPermanentAddress.ps')}
                                                                error={errors.motherPermanentAddress?.ps?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Office Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>Office Details</h3>
                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            <InputText
                                                                label='Office Address'
                                                                id='motherOfficeAddress'
                                                                placeholder='Enter office address'
                                                                {...register('motherOfficeAddress')}
                                                                error={errors.motherOfficeAddress?.message}
                                                            />

                                                            <div className='flex flex-col gap-1.5 '>
                                                                <Controller
                                                                    name='motherOfficePhone'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <div>
                                                                            <Label htmlFor='motherOfficePhone'>Mother Office PhNo.</Label>
                                                                            <PhoneInput
                                                                                country='in'
                                                                                value={
                                                                                    phoneValues.motherOfficePhone ??
                                                                                    (field.value != null ? String(field.value) : null)
                                                                                }
                                                                                onChange={(phone: any, countryData: any) =>
                                                                                    handlePhoneChange(
                                                                                        phone,
                                                                                        countryData,
                                                                                        'motherOfficePhone'
                                                                                    )
                                                                                }
                                                                                onBlur={() => trigger('motherOfficePhone')}
                                                                                inputProps={{
                                                                                    id: 'motherOfficePhone',
                                                                                    name: 'motherOfficePhone',
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
                                                                            {phoneExpectedInfo.motherOfficePhone?.expected && (
                                                                                <span className='mt-1 text-muted-foreground text-xs'>
                                                                                    {`Mobile number must be exactly ${phoneExpectedInfo.motherOfficePhone.expected} digits for ${phoneExpectedInfo.motherOfficePhone.name ??
                                                                                        'selected country'
                                                                                        }`}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                                {errors.motherOfficePhone && (
                                                                    <FormError>{errors.motherOfficePhone.message}</FormError>
                                                                )}
                                                            </div>

                                                            <InputText
                                                                label='Occupation'
                                                                id='motherOccupation'
                                                                placeholder='Enter Occupation'
                                                                {...register('motherOccupation')}
                                                                error={errors.motherOccupation?.message}
                                                            />

                                                            <InputText
                                                                label='Designation'
                                                                id='motherDesignation'
                                                                placeholder='Enter designation'
                                                                {...register('motherDesignation')}
                                                                error={errors.motherDesignation?.message}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Other's Details */}
                                                    <div className='col-span-full space-y-4 md:col-span-2 lg:col-span-3'>
                                                        <h3 className='font-semibold text-gray-800 text-lg'>Other's Details</h3>
                                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='motherReligionId'>Religion</Label>
                                                                <Controller
                                                                    name='motherReligionId'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
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
                                                                                        <SelectItem
                                                                                            key={item.ivrmmR_Id}
                                                                                            value={item.ivrmmR_Id.toString()}>
                                                                                            {item.ivrmmR_Name}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                                {errors.motherReligionId && (
                                                                    <FormError>{errors.motherReligionId.message}</FormError>
                                                                )}
                                                            </div>

                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label htmlFor='motherCasteId'>Caste Category</Label>
                                                                <Controller
                                                                    name='motherCasteId'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            key={field.value || 'empty'}
                                                                            onValueChange={(value) => field.onChange(Number(value))}
                                                                            value={field.value?.toString() || ''}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder='Select caste Category' />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {motherCasteLoading ? (
                                                                                    <SelectItem value='loading' disabled>
                                                                                        Loading...
                                                                                    </SelectItem>
                                                                                ) : motherCasteError ? (
                                                                                    <SelectItem value='error' disabled>
                                                                                        Error loading
                                                                                    </SelectItem>
                                                                                ) : (
                                                                                    motherCaste?.data?.map((item) => (
                                                                                        <SelectItem
                                                                                            key={item.imC_Id}
                                                                                            value={item.imC_Id.toString()}>
                                                                                            {item.imC_CasteName}
                                                                                        </SelectItem>
                                                                                    ))
                                                                                )}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                                {errors.motherCasteId && (
                                                                    <FormError>{errors.motherCasteId.message}</FormError>
                                                                )}
                                                            </div>

                                                            <InputText
                                                                label='Sub Caste'
                                                                id='motherSubCaste'
                                                                placeholder='Enter sub caste'
                                                                {...register('motherSubCaste')}
                                                                error={errors.motherSubCaste?.message}
                                                            />

                                                            <div className='flex flex-col gap-1.5'>
                                                                <Controller
                                                                    name='motherAnnualIncome'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <InputNumber
                                                                            label='Mother Anuual Income'
                                                                            id='motherAnnualIncome'
                                                                            value={field.value || 0}
                                                                            onChange={(value) =>
                                                                                field.onChange(Number.isNaN(value) ? 0 : value)
                                                                            }
                                                                            minValue={0}
                                                                            maxDigits={15}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.motherAnnualIncome && (
                                                                    <FormError>{errors.motherAnnualIncome.message}</FormError>
                                                                )}
                                                            </div>

                                                            <InputText
                                                                label='Caste Certificate No'
                                                                id='motherCasteCertificateNo'
                                                                placeholder='Enter Caste Certificate No'
                                                                {...register('motherCasteCertificateNo')}
                                                                error={errors.motherCasteCertificateNo?.message}
                                                            />

                                                            <InputText
                                                                label='Pan No'
                                                                id='motherPAN'
                                                                placeholder='Enter PAN'
                                                                {...register('motherPAN')}
                                                                error={errors.motherPAN?.message}
                                                            />
                                                            <div className='flex items-center space-x-2'>
                                                                <Checkbox
                                                                    id='motherSelfEmployedFlg'
                                                                    checked={Boolean(watch('motherSelfEmployedFlg'))}
                                                                    onCheckedChange={(checked) => {
                                                                        setValue('motherSelfEmployedFlg', checked === true);
                                                                    }}
                                                                />
                                                                <Label htmlFor='motherSelfEmployedFlg' className='cursor-pointer'>
                                                                    Self Employed Flg
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Other Information */}
                                {currentStep === 4 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Other Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Sibling details, previous school information, and undertaking
                                            </p>
                                        </div>
                                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='source_ids'>Activities</Label>
                                                <Controller
                                                    name='activities'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <MultiSelect
                                                            options={[{ label: 'Sports', value: '2' }]}
                                                            onValueChange={(selectedValues) => {
                                                                field.onChange(selectedValues);
                                                                handleActivitySelection(selectedValues);
                                                            }}
                                                            defaultValue={selectedActivityItems}
                                                            value={selectedActivityItems}
                                                            placeholder='Select Activities'
                                                            variant='inverted'
                                                            disabled={sourceLoading}
                                                        />
                                                    )}
                                                />
                                                {errors.activities && <FormError>{errors.activities.message}</FormError>}
                                            </div>

                                            <div className='flex flex-col gap-1.5'>
                                                <Label htmlFor='source_ids'>Source Details</Label>
                                                <Controller
                                                    name='sourceDetails'
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
                                                {errors.sourceDetails && <FormError>{errors.sourceDetails.message}</FormError>}
                                            </div>

                                            <InputTextarea
                                                label='Achievements'
                                                id='achievements'
                                                // placeholder={`Enter Mother's Business`}
                                                {...register('achievements')}
                                                error={errors.achievements?.message}
                                            />
                                        </div>

                                        {/* Previous School Details Section */}
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>Previous School Details</h3>

                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    className='w-fit'
                                                    onClick={addPreviousSchool}
                                                    disabled={isSubmitting}>
                                                    <span className='mr-2'>+</span>
                                                    Add Previous School Details
                                                </Button>
                                            </div>

                                            {previousSchoolFields.length === 0 ? (
                                                <p className='text-gray-500 text-sm'>No previous school details added.</p>
                                            ) : (
                                                <div className='space-y-4'>
                                                    {previousSchoolFields.map((ps, idx) => (
                                                        <div key={ps.id} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                                                            {/* Header */}
                                                            <div className='flex items-center justify-between'>
                                                                <h4 className='font-medium text-gray-700 text-sm'>
                                                                    Previous School {idx + 1}
                                                                </h4>

                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    size='sm'
                                                                    className='w-fit'
                                                                    onClick={() => removePreviousSchool(idx)}
                                                                    disabled={isSubmitting}>
                                                                    Remove
                                                                </Button>
                                                            </div>

                                                            {/* Fields */}
                                                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                                                {/* School Name */}
                                                                <InputText
                                                                    label='Previous School Name'
                                                                    placeholder='Enter previous school name'
                                                                    {...register(`previousSchools.${idx}.schoolName`)}
                                                                    error={errors.previousSchools?.[idx]?.schoolName?.message}
                                                                />

                                                                {/* School Type */}
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>School Type</Label>

                                                                    <Controller
                                                                        name={`previousSchools.${idx}.schoolTypeId`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Select
                                                                                value={field.value?.toString() || ''}
                                                                                onValueChange={(val) => {
                                                                                    const num = Number(val);
                                                                                    field.onChange(num);
                                                                                }}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder='Select school type' />
                                                                                </SelectTrigger>

                                                                                <SelectContent>
                                                                                    <SelectItem value='1'>Pre-Primary School</SelectItem>
                                                                                    <SelectItem value='2'>Primary School</SelectItem>
                                                                                    <SelectItem value='3'>High School</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                </div>

                                                                {/* Class */}
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>Class</Label>
                                                                    <Controller
                                                                        name={`previousSchools.${idx}.classId`}
                                                                        control={control}
                                                                        render={({ field, fieldState: { error } }) => (
                                                                            <Select
                                                                                value={
                                                                                    field.value !== undefined ? field.value.toString() : ''
                                                                                }
                                                                                onValueChange={(val) => field.onChange(Number(val))}>
                                                                                <SelectTrigger className={error && 'border-red-500'}>
                                                                                    <SelectValue placeholder='Select class' />
                                                                                </SelectTrigger>

                                                                                <SelectContent>
                                                                                    {admissionClassLoading ? (
                                                                                        <SelectItem value='loading' disabled>
                                                                                            Loading...
                                                                                        </SelectItem>
                                                                                    ) : admissionClassError ? (
                                                                                        <SelectItem value='error' disabled>
                                                                                            Error loading classes
                                                                                        </SelectItem>
                                                                                    ) : (
                                                                                        admissionClass?.data?.map((item) => (
                                                                                            <SelectItem
                                                                                                key={item.asmcL_Id}
                                                                                                value={item.asmcL_Id.toString()}>
                                                                                                {item.asmcL_ClassName}
                                                                                            </SelectItem>
                                                                                        ))
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                </div>

                                                                {/* Percentage */}
                                                                <InputText
                                                                    label='Percentage'
                                                                    placeholder='Enter percentage'
                                                                    {...register(`previousSchools.${idx}.percentage`)}
                                                                    error={errors.previousSchools?.[idx]?.percentage?.message}
                                                                />

                                                                {/* Grade */}
                                                                <InputText
                                                                    label='Grade'
                                                                    placeholder='Enter grade'
                                                                    {...register(`previousSchools.${idx}.grade`)}
                                                                    error={errors.previousSchools?.[idx]?.grade?.message}
                                                                />

                                                                {/* Passed Year */}
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>Passed Year</Label>
                                                                    <Controller
                                                                        name={`previousSchools.${idx}.passedYear`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Select
                                                                                value={field.value ? String(field.value) : ''}
                                                                                onValueChange={(val) => field.onChange(val)}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder='Select passed year' />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {academicLoading ? (
                                                                                        <SelectItem value={'loading'} disabled>
                                                                                            Loading...
                                                                                        </SelectItem>
                                                                                    ) : academicYears?.data &&
                                                                                        academicYears.data.length > 0 ? (
                                                                                        academicYears.data.map((y: any) => (
                                                                                            <SelectItem
                                                                                                key={String(y.asmaY_Id)}
                                                                                                value={String(y.asmaY_Id)}>
                                                                                                {y.asmaY_Year}
                                                                                            </SelectItem>
                                                                                        ))
                                                                                    ) : (
                                                                                        <SelectItem value={'none'} disabled>
                                                                                            No years
                                                                                        </SelectItem>
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                </div>

                                                                <PreviousSchoolRow idx={idx} />

                                                                {/* Address */}
                                                                <InputText
                                                                    label='Address'
                                                                    placeholder='Enter school address'
                                                                    {...register(`previousSchools.${idx}.address`)}
                                                                    error={errors.previousSchools?.[idx]?.address?.message}
                                                                />

                                                                {/* Left Reason */}
                                                                <InputText
                                                                    label='Left Reason'
                                                                    placeholder='Enter reason for leaving'
                                                                    {...register(`previousSchools.${idx}.leftReason`)}
                                                                    error={errors.previousSchools?.[idx]?.leftReason?.message}
                                                                />

                                                                {/* Medium */}
                                                                <InputText
                                                                    label='Medium'
                                                                    placeholder='Enter medium of instruction'
                                                                    {...register(`previousSchools.${idx}.medium`)}
                                                                    error={errors.previousSchools?.[idx]?.medium?.message}
                                                                />

                                                                {/* TC Number */}
                                                                <InputText
                                                                    label='TC No'
                                                                    placeholder='Enter TC number'
                                                                    {...register(`previousSchools.${idx}.tcNumber`)}
                                                                    error={errors.previousSchools?.[idx]?.tcNumber?.message}
                                                                />

                                                                {/* TC Date */}
                                                                <Controller
                                                                    name={`previousSchools.${idx}.tcDate`}
                                                                    control={control}
                                                                    render={({ field, fieldState: { error } }) => (
                                                                        <div className='flex flex-col space-y-2'>
                                                                            <Label>TC Date</Label>

                                                                            <Popover>
                                                                                <PopoverTrigger asChild>
                                                                                    <Button
                                                                                        variant='outline'
                                                                                        className={cn(
                                                                                            'w-full justify-start text-left',
                                                                                            !field.value && 'text-muted-foreground',
                                                                                            error && 'border-red-500'
                                                                                        )}>
                                                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                                                        {field.value &&
                                                                                            Object.prototype.toString.call(field.value) ===
                                                                                            '[object Date]' &&
                                                                                            field.value.getTime()
                                                                                            ? format(field.value, 'dd/MM/yyyy')
                                                                                            : 'Select TC date'}
                                                                                    </Button>
                                                                                </PopoverTrigger>

                                                                                <PopoverContent>
                                                                                    <CalendarYear
                                                                                        mode='single'
                                                                                        selected={field.value || undefined}
                                                                                        onSelect={(date) => date && field.onChange(date)}
                                                                                        disabled={(d) =>
                                                                                            d > new Date() || d < new Date('1900-01-01')
                                                                                        }
                                                                                    />
                                                                                </PopoverContent>
                                                                            </Popover>

                                                                            {error && (
                                                                                <span className='text-red-500 text-sm'>
                                                                                    {error.message}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* GUARDIAN DETAILS Section */}
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <h3 className='font-semibold text-gray-800 text-lg'>GUARDIAN DETAILS</h3>

                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='sm'
                                                    className='w-fit'
                                                    onClick={addGuardian}
                                                    disabled={isSubmitting}>
                                                    <span className='mr-2'>+</span>
                                                    Add Guardian
                                                </Button>
                                            </div>

                                            {guardianFields.length === 0 ? (
                                                <p className='text-gray-500 text-sm'>No guardians added yet.</p>
                                            ) : (
                                                <div className='space-y-4'>
                                                    {guardianFields.map((g, idx) => (
                                                        <div key={g.id} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                                                            <div className='flex items-center justify-between'>
                                                                <h4 className='font-medium text-gray-700 text-sm'>Guardian {idx + 1}</h4>
                                                                <div className='flex items-center gap-2'>
                                                                    <Button
                                                                        type='button'
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        onClick={() => removeGuardian(idx)}
                                                                        disabled={isSubmitting || idx === 0}
                                                                        className={`h-8 w-fit ${idx === 0 ? 'cursor-not-allowed opacity-50' : ''}`}>
                                                                        Remove
                                                                    </Button>
                                                                    <Button
                                                                        type='button'
                                                                        variant='outline'
                                                                        size='sm'
                                                                        onClick={() => handleSaveGuardian(idx)}
                                                                        disabled={
                                                                            isSubmitting ||
                                                                            guardianPhotos?.[idx]?.isUploading ||
                                                                            guardianSignatures?.[idx]?.isUploading
                                                                        }
                                                                        className='h-8 w-fit'>
                                                                        <Save className='mr-2 h-4 w-4' />
                                                                        Save
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                                                {/* Guardian Name */}
                                                                <InputText
                                                                    label='Guardian Name'
                                                                    placeholder='Enter Guardian Name'
                                                                    {...register(`guardian.${idx}.guardianName`)}
                                                                    error={errors.guardian?.[idx]?.guardianName?.message}
                                                                />

                                                                {/* Guardian Phone (PhoneInput) */}
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Controller
                                                                        name={`guardian.${idx}.guardianPhone`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <div>
                                                                                <Label htmlFor={`guardianPhone_${idx}`}>
                                                                                    Guardian Phone
                                                                                </Label>

                                                                                <PhoneInput
                                                                                    country='in'
                                                                                    value={
                                                                                        phoneValues[`guardian_${idx}_phone`] ??
                                                                                        (field.value != null ? String(field.value) : null)
                                                                                    }
                                                                                    onChange={(phone, countryData) =>
                                                                                        handlePhoneChange(
                                                                                            phone,
                                                                                            countryData,
                                                                                            `guardian.${idx}.guardianPhone`
                                                                                        )
                                                                                    }
                                                                                    onBlur={() => trigger(`guardian.${idx}.guardianPhone`)}
                                                                                    inputProps={{
                                                                                        id: `guardianPhone_${idx}`,
                                                                                        name: `guardian.${idx}.guardianPhone`,
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

                                                                                {phoneExpectedInfo?.[`guardian_${idx}_phone`]?.expected && (
                                                                                    <span className='mt-1 text-muted-foreground text-xs'>
                                                                                        {`Mobile number must be exactly ${phoneExpectedInfo[`guardian_${idx}_phone`]
                                                                                            .expected
                                                                                            } digits for ${phoneExpectedInfo[`guardian_${idx}_phone`]
                                                                                                .name ?? 'selected country'
                                                                                            }`}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    />

                                                                    {errors.guardian?.[idx]?.guardianPhone && (
                                                                        <FormError>{errors.guardian[idx].guardianPhone?.message}</FormError>
                                                                    )}
                                                                </div>

                                                                {/* Guardian Email */}
                                                                <InputText
                                                                    label='Guardian Email'
                                                                    placeholder='Enter Guardian Email'
                                                                    {...register(`guardian.${idx}.guardianEmail`)}
                                                                    error={errors.guardian?.[idx]?.guardianEmail?.message}
                                                                />

                                                                {/* Guardian Address */}
                                                                <InputText
                                                                    label='Guardian Address'
                                                                    placeholder='Enter Guardian Address'
                                                                    {...register(`guardian.${idx}.guardianAddress`)}
                                                                    error={errors.guardian?.[idx]?.guardianAddress?.message}
                                                                />

                                                                {watchedGuardians?.[idx]?.guardianName ? (
                                                                    <>
                                                                        <div className='col-span-full flex w-full items-stretch gap-4'>
                                                                            {/* Photo column */}
                                                                            <div className='min-w-0 flex-1'>
                                                                                <div className='flex h-full flex-col justify-between overflow-hidden rounded-lg border-2 border-blue-200 bg-blue-50 p-2'>
                                                                                    <div>
                                                                                        <div className='mb-1'>
                                                                                            <Label>Guardian Photo</Label>
                                                                                        </div>

                                                                                        {!guardianPhotos?.[idx]?.path ? (
                                                                                            <label
                                                                                                className={cn(
                                                                                                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-3 text-center transition-all hover:border-primary hover:bg-white',
                                                                                                    guardianPhotos?.[idx]?.isUploading
                                                                                                        ? 'border-blue-400 bg-blue-100'
                                                                                                        : 'border-gray-300 bg-white'
                                                                                                )}>
                                                                                                {guardianPhotos?.[idx]?.isUploading ? (
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
                                                                                                            Upload guardian photo (Max size:
                                                                                                            5MB, JPG/PNG)
                                                                                                        </span>
                                                                                                    </>
                                                                                                )}

                                                                                                <input
                                                                                                    type='file'
                                                                                                    className='hidden'
                                                                                                    accept='image/jpeg,image/jpg,image/png'
                                                                                                    disabled={
                                                                                                        guardianPhotos?.[idx]
                                                                                                            ?.isUploading || isSubmitting
                                                                                                    }
                                                                                                    onChange={(e) => {
                                                                                                        const file = e.target.files?.[0];
                                                                                                        if (file) {
                                                                                                            if (
                                                                                                                file.size >
                                                                                                                5 * 1024 * 1024
                                                                                                            ) {
                                                                                                                toast.error(
                                                                                                                    'File size must be less than 5MB'
                                                                                                                );
                                                                                                                e.target.value = '';
                                                                                                                return;
                                                                                                            }
                                                                                                            handleGuardianPhotoUpload(
                                                                                                                idx,
                                                                                                                file
                                                                                                            );
                                                                                                            e.target.value = '';
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                            </label>
                                                                                        ) : (
                                                                                            <div className='flex h-full w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-lg border border-green-200 bg-green-50 p-4'>
                                                                                                <div className='flex items-center gap-4'>
                                                                                                    <img
                                                                                                        src={guardianPhotos[idx].path}
                                                                                                        alt={`Guardian ${idx + 1}`}
                                                                                                        className='h-24 w-24 rounded-lg border-2 border-green-300 object-cover'
                                                                                                    />
                                                                                                    <div>
                                                                                                        <div className='flex items-center gap-2 font-medium text-green-700'>
                                                                                                            <Check className='h-5 w-5' />
                                                                                                            Uploaded Successfully
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='flex items-center gap-2'>
                                                                                                    <Button
                                                                                                        type='button'
                                                                                                        variant='outline'
                                                                                                        size='sm'
                                                                                                        className='flex h-9 w-9 items-center justify-center p-0'
                                                                                                        onClick={() =>
                                                                                                            window.open(
                                                                                                                guardianPhotos[idx].path,
                                                                                                                '_blank'
                                                                                                            )
                                                                                                        }>
                                                                                                        <Eye className='h-4 w-4' />
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        type='button'
                                                                                                        variant='destructive'
                                                                                                        size='sm'
                                                                                                        className='flex h-9 w-9 items-center justify-center p-0'
                                                                                                        disabled={isSubmitting}
                                                                                                        onClick={() =>
                                                                                                            handleGuardianPhotoDelete(idx)
                                                                                                        }>
                                                                                                        <Trash className='h-4 w-4' />
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Signature column */}
                                                                            <div className='min-w-0 flex-1'>
                                                                                <div className='flex h-full flex-col justify-between overflow-hidden rounded-lg border-2 border-blue-200 bg-blue-50 p-2'>
                                                                                    <div>
                                                                                        <div className='mb-1'>
                                                                                            <Label>Guardian Signature</Label>
                                                                                        </div>

                                                                                        {!guardianSignatures?.[idx]?.path ? (
                                                                                            <label
                                                                                                className={cn(
                                                                                                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-3 text-center transition-all hover:border-primary hover:bg-white',
                                                                                                    guardianSignatures?.[idx]?.isUploading
                                                                                                        ? 'border-blue-400 bg-blue-100'
                                                                                                        : 'border-gray-300 bg-white'
                                                                                                )}>
                                                                                                {guardianSignatures?.[idx]?.isUploading ? (
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
                                                                                                            Uploading signature...
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
                                                                                                            Upload guardian signature (Max
                                                                                                            size: 5MB, JPG/PNG)
                                                                                                        </span>
                                                                                                    </>
                                                                                                )}

                                                                                                <input
                                                                                                    type='file'
                                                                                                    className='hidden'
                                                                                                    accept='image/jpeg,image/jpg,image/png'
                                                                                                    disabled={
                                                                                                        guardianSignatures?.[idx]
                                                                                                            ?.isUploading || isSubmitting
                                                                                                    }
                                                                                                    onChange={(e) => {
                                                                                                        const file = e.target.files?.[0];
                                                                                                        if (file) {
                                                                                                            if (
                                                                                                                file.size >
                                                                                                                5 * 1024 * 1024
                                                                                                            ) {
                                                                                                                toast.error(
                                                                                                                    'File size must be less than 5MB'
                                                                                                                );
                                                                                                                e.target.value = '';
                                                                                                                return;
                                                                                                            }
                                                                                                            handleGuardianSignatureUpload(
                                                                                                                idx,
                                                                                                                file
                                                                                                            );
                                                                                                            e.target.value = '';
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                            </label>
                                                                                        ) : (
                                                                                            <div className='flex h-full w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-lg border border-green-200 bg-green-50 p-4'>
                                                                                                <div className='flex items-center gap-4'>
                                                                                                    <img
                                                                                                        src={guardianSignatures[idx].path}
                                                                                                        alt={`Guardian signature ${idx + 1}`}
                                                                                                        className='h-24 w-40 rounded-lg border-2 border-green-300 object-contain'
                                                                                                    />
                                                                                                    <div>
                                                                                                        <div className='flex items-center gap-2 font-medium text-green-700'>
                                                                                                            <Check className='h-5 w-5' />
                                                                                                            Uploaded Successfully
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='flex items-center gap-2'>
                                                                                                    <Button
                                                                                                        type='button'
                                                                                                        variant='outline'
                                                                                                        size='sm'
                                                                                                        className='flex h-9 w-9 items-center justify-center p-0'
                                                                                                        onClick={() =>
                                                                                                            window.open(
                                                                                                                guardianSignatures[idx]
                                                                                                                    .path,
                                                                                                                '_blank'
                                                                                                            )
                                                                                                        }>
                                                                                                        <Eye className='h-4 w-4' />
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        type='button'
                                                                                                        variant='destructive'
                                                                                                        size='sm'
                                                                                                        className='flex h-9 w-9 items-center justify-center p-0'
                                                                                                        disabled={isSubmitting}
                                                                                                        onClick={() =>
                                                                                                            handleGuardianSignatureDelete(
                                                                                                                idx
                                                                                                            )
                                                                                                        }>
                                                                                                        <Trash className='h-4 w-4' />
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* SIBLING DETAILS Section */}
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
                                                    {siblingFields.map((sibling, index) => (
                                                        <div key={sibling.id} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                                                            <div className='mb-3 flex items-center justify-between'>
                                                                <h4 className='font-medium text-gray-700 text-sm'>Sibling {index + 1}</h4>
                                                                <Button
                                                                    type='button'
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() => removeSibling(index)}
                                                                    disabled={isSubmitting || index === 0}
                                                                    className={`h-8 w-fit ${index === 0 ? 'cursor-not-allowed opacity-50' : 'bg-error text-white'}`}>
                                                                    Remove
                                                                </Button>
                                                            </div>

                                                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                {/* Sibling Name */}
                                                                <Controller
                                                                    control={control}
                                                                    name={`siblings.${index}.name`}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Sibling Name'
                                                                            id={`sibling_name_${index}`}
                                                                            placeholder='Enter sibling name'
                                                                            {...field}
                                                                            error={errors.siblings?.[index]?.name?.message}
                                                                        />
                                                                    )}
                                                                />

                                                                {/* Class Select */}
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label htmlFor={`classId_${index}`}>Class</Label>
                                                                    <Controller
                                                                        name={`siblings.${index}.classId`}
                                                                        control={control}
                                                                        render={({ field, fieldState: { error } }) => (
                                                                            <Select
                                                                                value={field.value?.toString() || ''}
                                                                                onValueChange={(value) => field.onChange(Number(value))}>
                                                                                <SelectTrigger
                                                                                    className={cn('w-full', error && 'border-red-500')}>
                                                                                    <SelectValue
                                                                                        placeholder={
                                                                                            admissionClassLoading
                                                                                                ? 'Loading classes...'
                                                                                                : 'Select a class'
                                                                                        }
                                                                                    />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {admissionClassLoading ? (
                                                                                        <SelectItem value='loading' disabled>
                                                                                            Loading...
                                                                                        </SelectItem>
                                                                                    ) : admissionClassError ? (
                                                                                        <SelectItem value='error' disabled>
                                                                                            Error loading classes
                                                                                        </SelectItem>
                                                                                    ) : Array.isArray(admissionClass?.data) &&
                                                                                        admissionClass.data.length > 0 ? (
                                                                                        admissionClass.data.map((classItem: any) => (
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
                                                                        )}
                                                                    />
                                                                    {errors.siblings?.[index]?.classId && (
                                                                        <FormError>{errors.siblings[index].classId.message}</FormError>
                                                                    )}
                                                                </div>

                                                                {/* Relation */}
                                                                <Controller
                                                                    control={control}
                                                                    name={`siblings.${index}.relation`}
                                                                    render={({ field }) => (
                                                                        <InputText
                                                                            label='Relation'
                                                                            id={`sibling_relation_${index}`}
                                                                            placeholder='Enter Relation'
                                                                            {...field}
                                                                            error={errors.siblings?.[index]?.relation?.message}
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Place of Birth Details */}
                                        <div className='space-y-4'>
                                            <h3 className='font-semibold text-gray-800 text-lg'>Place of Birth Details</h3>
                                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                {/* Country */}
                                                <div className='flex flex-col gap-1.5'>
                                                    <Label htmlFor='amsT_PlaceOfBirthCountry'>Country</Label>
                                                    <Controller
                                                        name='amsT_PlaceOfBirthCountry'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                key={field.value || 'empty'}
                                                                value={field.value?.toString() || ''}
                                                                onValueChange={(value) => field.onChange(Number(value))}>
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
                                                    {errors.amsT_PlaceOfBirthCountry && (
                                                        <FormError>{errors.amsT_PlaceOfBirthCountry.message}</FormError>
                                                    )}
                                                </div>

                                                {/* State */}
                                                <div className='flex flex-col gap-1.5'>
                                                    <Label htmlFor='amsT_PlaceOfBirthState'>State</Label>
                                                    <Controller
                                                        name='amsT_PlaceOfBirthState'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                key={field.value || 'empty'}
                                                                value={field.value?.toString() || ''}
                                                                onValueChange={(value) => field.onChange(Number(value))}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder='Select state' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {birthStateLoading ? (
                                                                        <SelectItem value='loading' disabled>
                                                                            Loading...
                                                                        </SelectItem>
                                                                    ) : birthStateError ? (
                                                                        <SelectItem value='error' disabled>
                                                                            Error loading
                                                                        </SelectItem>
                                                                    ) : (
                                                                        birthState?.data?.map((item) => (
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
                                                    {errors.amsT_PlaceOfBirthState && (
                                                        <FormError>{errors.amsT_PlaceOfBirthState.message}</FormError>
                                                    )}
                                                </div>

                                                {/* District */}
                                                <InputText
                                                    label='District'
                                                    id='amsT_Distirct'
                                                    placeholder='Enter District'
                                                    {...register('amsT_Distirct')}
                                                    error={errors.amsT_Distirct?.message}
                                                />

                                                {/* Taluk */}
                                                <InputText
                                                    label='Taluk'
                                                    id='amsT_Taluk'
                                                    placeholder='Enter Taluk'
                                                    {...register('amsT_Taluk')}
                                                    error={errors.amsT_Taluk?.message}
                                                />

                                                {/* Town */}
                                                <InputText
                                                    label='Town'
                                                    id='amsT_Town'
                                                    placeholder='Enter Town'
                                                    {...register('amsT_Town')}
                                                    error={errors.amsT_Town?.message}
                                                />

                                                {/* Village */}
                                                <InputText
                                                    label='Village'
                                                    id='amsT_Village'
                                                    placeholder='Enter Village'
                                                    {...register('amsT_Village')}
                                                    error={errors.amsT_Village?.message}
                                                />
                                            </div>
                                        </div>

                                        {/* Siblings Count details */}

                                        <div className='space-y-4'>
                                            <h3 className='font-semibold text-gray-800 text-lg'>Siblings Count Details</h3>

                                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                <InputText
                                                    label='No of Siblings'
                                                    id='amsT_NoOfSiblings'
                                                    placeholder='Enter No of Siblings'
                                                    {...register('amsT_NoOfSiblings')}
                                                    error={errors.amsT_NoOfSiblings?.message}
                                                />

                                                <InputText
                                                    label='No of Siblings in School'
                                                    id='amsT_NoOfSiblingsSchool'
                                                    placeholder='Enter No of Siblings in School'
                                                    {...register('amsT_NoOfSiblingsSchool')}
                                                    error={errors.amsT_NoOfSiblingsSchool?.message}
                                                />

                                                <InputText
                                                    label='No of Dependencies'
                                                    id=' amsT_NoOfDependencies'
                                                    placeholder='Enter No of Dependencies'
                                                    {...register('amsT_NoOfDependencies')}
                                                    error={errors.amsT_NoOfDependencies?.message}
                                                />

                                                <InputText
                                                    label='No of Brothers'
                                                    id='amsT_Noofbrothers'
                                                    placeholder='Enter No of Brothers'
                                                    {...register('amsT_Noofbrothers')}
                                                    error={errors.amsT_Noofbrothers?.message}
                                                />

                                                <InputText
                                                    label='No of Elder Brothers'
                                                    id='amsT_NoOfElderBrothers'
                                                    placeholder='Enter No of Elder Brothers'
                                                    {...register('amsT_NoOfElderBrothers')}
                                                    error={errors.amsT_NoOfElderBrothers?.message}
                                                />

                                                <InputText
                                                    label='No of Younger Brothers'
                                                    id='amsT_NoOfYoungerBrothers'
                                                    placeholder='Enter No of Younger Brothers'
                                                    {...register('amsT_NoOfYoungerBrothers')}
                                                    error={errors.amsT_NoOfYoungerBrothers?.message}
                                                />

                                                <InputText
                                                    label='No of Sisters'
                                                    id='amsT_Noofsisters'
                                                    placeholder='Enter No of Sisters'
                                                    {...register('amsT_Noofsisters')}
                                                    error={errors.amsT_Noofsisters?.message}
                                                />

                                                <InputText
                                                    label='No of Elder Sisters'
                                                    id='amsT_NoOfElderSisters'
                                                    placeholder='Enter No of Elder Sisters'
                                                    {...register('amsT_NoOfElderSisters')}
                                                    error={errors.amsT_NoOfElderSisters?.message}
                                                />

                                                <InputText
                                                    label='No of Younger Sisters'
                                                    id='amsT_NoOfYoungerSisters'
                                                    placeholder='Enter No of Younger Sisters'
                                                    {...register('amsT_NoOfYoungerSisters')}
                                                    error={errors.amsT_NoOfYoungerSisters?.message}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Health and Medical Details */}
                                {currentStep === 5 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Health and Medical Details</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please provide Health details</p>
                                        </div>

                                        <div className='space-y-8'>
                                            <div className='space-y-4'>
                                                {/* <h3 className='font-semibold text-gray-800 text-lg'>Residential Address</h3> */}
                                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    <InputText
                                                        label='Student Health'
                                                        id='amsT_Studentillness'
                                                        placeholder='Enter Student Health'
                                                        {...register('amsT_Studentillness')}
                                                        error={errors.amsT_Studentillness?.message}
                                                    />
                                                    <InputText
                                                        label='Medical Complaints'
                                                        id='amsT_MedicalComplaints'
                                                        placeholder='Enter Medical Complaints'
                                                        {...register('amsT_MedicalComplaints')}
                                                        error={errors.amsT_MedicalComplaints?.message}
                                                    />
                                                    <InputText
                                                        label='Admission Reason'
                                                        id='amsT_AdmissionReason'
                                                        placeholder='Enter Admission Reason'
                                                        {...register('amsT_AdmissionReason')}
                                                        error={errors.amsT_AdmissionReason?.message}
                                                    />

                                                    <InputText
                                                        label='School DISE Code'
                                                        id='amsT_SchoolDISECode'
                                                        placeholder='Enter School DISE Code'
                                                        {...register('amsT_SchoolDISECode')}
                                                        error={errors.amsT_SchoolDISECode?.message}
                                                    />
                                                    <InputText
                                                        label='First Language'
                                                        id='amsT_FirstLanguage'
                                                        placeholder='Enter First Language'
                                                        {...register('amsT_FirstLanguage')}
                                                        error={errors.amsT_FirstLanguage?.message}
                                                    />

                                                    <InputText
                                                        label='  Second Language'
                                                        id=' amsT_SecondLanguage'
                                                        placeholder='Enter Second Language'
                                                        {...register('amsT_SecondLanguage')}
                                                        error={errors.amsT_SecondLanguage?.message}
                                                    />
                                                    <InputText
                                                        label='Third Language'
                                                        id='amsT_Thirdlanguage'
                                                        placeholder='Enter Third Language'
                                                        {...register('amsT_Thirdlanguage')}
                                                        error={errors.amsT_Thirdlanguage?.message}
                                                    />

                                                    <InputText
                                                        label='Illness Details '
                                                        id='amsT_Illnessdetails'
                                                        placeholder='Enter Illness Details '
                                                        {...register('amsT_Illnessdetails')}
                                                        error={errors.amsT_Illnessdetails?.message}
                                                    />

                                                    <InputText
                                                        label='Other Informations'
                                                        id='amsT_OtherInformations'
                                                        placeholder='Enter Other Informations'
                                                        {...register('amsT_OtherInformations')}
                                                        error={errors.amsT_OtherInformations?.message}
                                                    />

                                                    <InputText
                                                        label='Extra Activity'
                                                        id='amsT_ExtraActivity'
                                                        placeholder='Enter Extra Activity'
                                                        {...register('amsT_ExtraActivity')}
                                                        error={errors.amsT_ExtraActivity?.message}
                                                    />

                                                    <InputText
                                                        label='Staying with'
                                                        id='amsT_Stayingwith'
                                                        placeholder='Enter Staying with'
                                                        {...register('amsT_Stayingwith')}
                                                        error={errors.amsT_Stayingwith?.message}
                                                    />

                                                    <InputText
                                                        label=' Domicile'
                                                        id='amsT_Domicile'
                                                        placeholder='Enter Domicile'
                                                        {...register('amsT_Domicile')}
                                                        error={errors.amsT_Domicile?.message}
                                                    />
                                                    <InputTextarea
                                                        label='Other Residential Address'
                                                        id='amsT_OtherResidential_Addr'
                                                        placeholder='Enter Other Residential Address'
                                                        {...register('amsT_OtherResidential_Addr')}
                                                        error={errors.amsT_OtherResidential_Addr?.message}
                                                    />
                                                    <InputTextarea
                                                        label=' Other Permanent Address'
                                                        id='amsT_OtherPermanentAddr'
                                                        placeholder='Enter Other Permanent Address'
                                                        {...register('amsT_OtherPermanentAddr')}
                                                        error={errors.amsT_OtherPermanentAddr?.message}
                                                    />
                                                    <div>{/* Empty */}</div>

                                                    <div className='flex items-center space-x-2'>
                                                        <Checkbox
                                                            id='amsT_TransferrableJobFlg'
                                                            checked={Boolean(watch('amsT_TransferrableJobFlg'))}
                                                            onCheckedChange={(checked) => {
                                                                setValue('amsT_TransferrableJobFlg', checked === true);
                                                            }}
                                                        />
                                                        <Label htmlFor='amsT_TransferrableJobFlg' className='cursor-pointer'>
                                                            Transferrable Flag
                                                        </Label>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <Checkbox
                                                            id='amsT_VaccinatedFlg'
                                                            checked={Boolean(watch('amsT_VaccinatedFlg'))}
                                                            onCheckedChange={(checked) => {
                                                                setValue('amsT_VaccinatedFlg', checked === true);
                                                            }}
                                                        />
                                                        <Label htmlFor='amsT_VaccinatedFlg' className='cursor-pointer'>
                                                            Vaccinated Flag
                                                        </Label>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <Checkbox
                                                            id='amsT_Tcflag"'
                                                            checked={Boolean(watch('amsT_Tcflag'))}
                                                            onCheckedChange={(checked) => {
                                                                setValue('amsT_Tcflag', checked === true);
                                                            }}
                                                        />
                                                        <Label htmlFor='amsT_Tcflag' className='cursor-pointer'>
                                                            TC Flag
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 6: Document Upload */}
                                {currentStep === 6 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Document Upload</h2>
                                            <p className='text-sm *:text-gray-500'>
                                                Please upload the required documents. Documents marked with{' '}
                                                <span className='text-red-500'>*</span> are mandatory.
                                            </p>
                                            <p className='text-red-500 text-sm'>
                                                NOTE: All documents uploaded should be self-attested by parents
                                            </p>
                                        </div>

                                        {/* Document uploads: users can add files which will be submitted with final form */}
                                        <div>
                                            <div className='mb-2 text-gray-600 text-sm'>
                                                Add documents required by you. Files are stored locally and sent on final submit.
                                            </div>
                                            {/* <label className='inline-flex cursor-pointer items-center gap-2 rounded-md border-2 border-dashed px-4 py-2 text-sm hover:border-primary'>
                                                <svg className='h-4 w-4 text-primary' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9'
                                                    />
                                                </svg>
                                                <span>Select documents</span>
                                                <input
                                                    type='file'
                                                    accept='.pdf,.jpg,.jpeg,.png'
                                                    className='hidden'
                                                    multiple
                                                    disabled={isSubmitting}
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        files.forEach((file) => {
                                                            // Use a generated id for ad-hoc documents
                                                            const generatedId = Number(
                                                                String(Date.now()) + Math.floor(Math.random() * 1000)
                                                            );
                                                            handleDocumentUpload(generatedId, file, file.name);
                                                        });
                                                        e.target.value = '';
                                                    }}
                                                />
                                            </label> */}

                                            {uploadedDocuments.length > 0 && (
                                                <div className='mt-4 space-y-2'>
                                                    {uploadedDocuments.map((d) => (
                                                        <div
                                                            key={d.amsmD_Id}
                                                            className='flex items-center justify-between rounded-lg border p-3'>
                                                            <div>
                                                                <div className='font-medium text-sm'>{d.documentName}</div>
                                                                <div className='text-gray-500 text-xs'>
                                                                    {d.file ? `${(d.file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                                                                </div>
                                                            </div>
                                                            <div className='flex gap-2'>
                                                                {d.document_Path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='ghost'
                                                                        onClick={() => window.open(d.document_Path, '_blank')}
                                                                        aria-label={`View ${d.documentName}`}>
                                                                        <Eye className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    type='button'
                                                                    size='sm'
                                                                    variant='destructive'
                                                                    onClick={() =>
                                                                        handleDocumentDelete(
                                                                            d.amsmD_Id,
                                                                            d.document_Path,
                                                                            d.documentName || 'Document'
                                                                        )
                                                                    }
                                                                    aria-label={`Delete ${d.documentName}`}>
                                                                    <Trash className='h-4 w-4' />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Parent photos & signatures (Step 6) - table style upload rows */}
                                        <div className='overflow-hidden rounded-lg border'>
                                            <table className='w-full table-fixed'>
                                                <thead>
                                                    <tr className='bg-gray-50'>
                                                        <th className='px-4 py-3 text-left text-gray-600 text-sm'>Document Name</th>
                                                        <th className='px-4 py-3 text-left text-gray-600 text-sm'>Status</th>
                                                        <th className='px-4 py-3 text-left text-gray-600 text-sm'>Upload</th>
                                                        <th className='px-4 py-3 text-left text-gray-600 text-sm'>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Father Photo */}
                                                    <tr className={`border-t ${fatherPhoto?.path ? 'bg-green-50' : 'bg-amber-50'}`}>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex flex-col'>
                                                                <span className='font-medium'>Father Photo</span>
                                                            </div>
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            {fatherPhoto?.isUploading ? (
                                                                <span className='flex items-center gap-2 text-gray-600 text-sm'>
                                                                    <Spinner size='sm' />
                                                                    Uploading...
                                                                </span>
                                                            ) : fatherPhoto?.path ? (
                                                                <span className='inline-flex items-center gap-2 text-green-700 text-sm'>
                                                                    <svg
                                                                        className='h-4 w-4 text-green-700'
                                                                        viewBox='0 0 24 24'
                                                                        fill='none'
                                                                        stroke='currentColor'>
                                                                        <path
                                                                            d='M20 6L9 17l-5-5'
                                                                            strokeWidth='2'
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                        />
                                                                    </svg>
                                                                    Uploaded
                                                                </span>
                                                            ) : (
                                                                <span className='text-gray-500 text-sm'>Not Uploaded</span>
                                                            )}
                                                        </td>
                                                        <td className='w-40 px-4 py-4'>
                                                            {!fatherPhoto || fatherPhoto.isUploading ? (
                                                                <label className='flex h-20 w-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-gray-300 border-dashed bg-white hover:border-primary'>
                                                                    <div className='flex flex-col items-center justify-center gap-1'>
                                                                        <svg
                                                                            className='h-6 w-6 text-purple-600'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                            stroke='currentColor'>
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M12 3v12m0 0l3-3m-3 3l-3-3'
                                                                            />
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3'
                                                                            />
                                                                        </svg>
                                                                        <span className='mt-1 text-gray-600 text-xs'>Click to upload</span>
                                                                    </div>
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
                                                                <div className='flex items-center gap-2'>
                                                                    <div
                                                                        className={
                                                                            'flex h-20 w-32 items-center justify-center rounded-md border bg-white'
                                                                        }>
                                                                        <img
                                                                            src={fatherPhoto.path}
                                                                            alt='Father'
                                                                            className='max-h-full max-w-full object-contain'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex gap-2'>
                                                                {fatherPhoto?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='ghost'
                                                                        onClick={() => window.open(fatherPhoto.path, '_blank')}
                                                                        aria-label='View father photo'>
                                                                        <Eye className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                                {fatherPhoto?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='destructive'
                                                                        onClick={handleFatherPhotoDelete}
                                                                        aria-label='Delete father photo'>
                                                                        <Trash className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Father Signature */}
                                                    <tr className={`border-t ${fatherSignature?.path ? 'bg-green-50' : 'bg-amber-50'}`}>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex flex-col'>
                                                                <span className='font-medium'>Father Signature</span>
                                                            </div>
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            {fatherSignature?.isUploading ? (
                                                                <span className='flex items-center gap-2 text-gray-600 text-sm'>
                                                                    <Spinner size='sm' />
                                                                    Uploading...
                                                                </span>
                                                            ) : fatherSignature?.path ? (
                                                                <span className='inline-flex items-center gap-2 text-green-700 text-sm'>
                                                                    <svg
                                                                        className='h-4 w-4 text-green-700'
                                                                        viewBox='0 0 24 24'
                                                                        fill='none'
                                                                        stroke='currentColor'>
                                                                        <path
                                                                            d='M20 6L9 17l-5-5'
                                                                            strokeWidth='2'
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                        />
                                                                    </svg>
                                                                    Uploaded
                                                                </span>
                                                            ) : (
                                                                <span className='text-gray-500 text-sm'>Not Uploaded</span>
                                                            )}
                                                        </td>
                                                        <td className='w-40 px-4 py-4'>
                                                            {!fatherSignature || fatherSignature.isUploading ? (
                                                                <label className='flex h-20 w-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-gray-300 border-dashed bg-white hover:border-primary'>
                                                                    <div className='flex flex-col items-center justify-center gap-1'>
                                                                        <svg
                                                                            className='h-6 w-6 text-purple-600'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                            stroke='currentColor'>
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M12 3v12m0 0l3-3m-3 3l-3-3'
                                                                            />
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3'
                                                                            />
                                                                        </svg>
                                                                        <span className='mt-1 text-gray-600 text-xs'>Click to upload</span>
                                                                    </div>
                                                                    <input
                                                                        id='father_signature'
                                                                        type='file'
                                                                        className='hidden'
                                                                        accept='image/jpeg,image/jpg,image/png'
                                                                        disabled={fatherSignature?.isUploading || isSubmitting}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                if (file.size > 5 * 1024 * 1024) {
                                                                                    toast.error('File size must be less than 5MB');
                                                                                    e.target.value = '';
                                                                                    return;
                                                                                }
                                                                                handleFatherSignatureUpload(file);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            ) : (
                                                                <div className='flex items-center gap-2'>
                                                                    <div
                                                                        className={
                                                                            'flex h-20 w-32 items-center justify-center rounded-md border bg-white'
                                                                        }>
                                                                        <img
                                                                            src={fatherSignature.path}
                                                                            alt='Father signature'
                                                                            className='max-h-full max-w-full object-contain'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex gap-2'>
                                                                {fatherSignature?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='ghost'
                                                                        onClick={() => window.open(fatherSignature.path, '_blank')}
                                                                        aria-label='View father signature'>
                                                                        <Eye className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                                {fatherSignature?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='destructive'
                                                                        onClick={handleFatherSignatureDelete}
                                                                        aria-label='Delete father signature'>
                                                                        <Trash className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Mother Photo */}
                                                    <tr className={`border-t ${motherPhoto?.path ? 'bg-green-50' : 'bg-amber-50'}`}>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex flex-col'>
                                                                <span className='font-medium'>Mother Photo</span>
                                                            </div>
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            {motherPhoto?.isUploading ? (
                                                                <span className='flex items-center gap-2 text-gray-600 text-sm'>
                                                                    <Spinner size='sm' />
                                                                    Uploading...
                                                                </span>
                                                            ) : motherPhoto?.path ? (
                                                                <span className='inline-flex items-center gap-2 text-green-700 text-sm'>
                                                                    <svg
                                                                        className='h-4 w-4 text-green-700'
                                                                        viewBox='0 0 24 24'
                                                                        fill='none'
                                                                        stroke='currentColor'>
                                                                        <path
                                                                            d='M20 6L9 17l-5-5'
                                                                            strokeWidth='2'
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                        />
                                                                    </svg>
                                                                    Uploaded
                                                                </span>
                                                            ) : (
                                                                <span className='text-gray-500 text-sm'>Not Uploaded</span>
                                                            )}
                                                        </td>
                                                        <td className='w-40 px-4 py-4'>
                                                            {!motherPhoto || motherPhoto.isUploading ? (
                                                                <label className='flex h-20 w-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-gray-300 border-dashed bg-white hover:border-primary'>
                                                                    <div className='flex flex-col items-center justify-center gap-1'>
                                                                        <svg
                                                                            className='h-6 w-6 text-purple-600'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                            stroke='currentColor'>
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M12 3v12m0 0l3-3m-3 3l-3-3'
                                                                            />
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3'
                                                                            />
                                                                        </svg>
                                                                        <span className='mt-1 text-gray-600 text-xs'>Click to upload</span>
                                                                    </div>
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
                                                                <div className='flex items-center gap-2'>
                                                                    <div
                                                                        className={
                                                                            'flex h-20 w-32 items-center justify-center rounded-md border bg-white'
                                                                        }>
                                                                        <img
                                                                            src={motherPhoto.path}
                                                                            alt='Mother'
                                                                            className='max-h-full max-w-full object-contain'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex gap-2'>
                                                                {motherPhoto?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='ghost'
                                                                        onClick={() => window.open(motherPhoto.path, '_blank')}
                                                                        aria-label='View mother photo'>
                                                                        <Eye className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                                {motherPhoto?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='destructive'
                                                                        onClick={handleMotherPhotoDelete}
                                                                        aria-label='Delete mother photo'>
                                                                        <Trash className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Mother Signature */}
                                                    <tr className={`border-t ${motherSignature?.path ? 'bg-green-50' : 'bg-amber-50'}`}>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex flex-col'>
                                                                <span className='font-medium'>Mother Signature</span>
                                                            </div>
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            {motherSignature?.isUploading ? (
                                                                <span className='flex items-center gap-2 text-gray-600 text-sm'>
                                                                    <Spinner size='sm' />
                                                                    Uploading...
                                                                </span>
                                                            ) : motherSignature?.path ? (
                                                                <span className='inline-flex items-center gap-2 text-green-700 text-sm'>
                                                                    <svg
                                                                        className='h-4 w-4 text-green-700'
                                                                        viewBox='0 0 24 24'
                                                                        fill='none'
                                                                        stroke='currentColor'>
                                                                        <path
                                                                            d='M20 6L9 17l-5-5'
                                                                            strokeWidth='2'
                                                                            strokeLinecap='round'
                                                                            strokeLinejoin='round'
                                                                        />
                                                                    </svg>
                                                                    Uploaded
                                                                </span>
                                                            ) : (
                                                                <span className='text-gray-500 text-sm'>Not Uploaded</span>
                                                            )}
                                                        </td>
                                                        <td className='w-40 px-4 py-4'>
                                                            {!motherSignature || motherSignature.isUploading ? (
                                                                <label className='flex h-20 w-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-gray-300 border-dashed bg-white hover:border-primary'>
                                                                    <div className='flex flex-col items-center justify-center gap-1'>
                                                                        <svg
                                                                            className='h-6 w-6 text-purple-600'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                            stroke='currentColor'>
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M12 3v12m0 0l3-3m-3 3l-3-3'
                                                                            />
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                strokeWidth={2}
                                                                                d='M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3'
                                                                            />
                                                                        </svg>
                                                                        <span className='mt-1 text-gray-600 text-xs'>Click to upload</span>
                                                                    </div>
                                                                    <input
                                                                        id='mother_signature'
                                                                        type='file'
                                                                        className='hidden'
                                                                        accept='image/jpeg,image/jpg,image/png'
                                                                        disabled={motherSignature?.isUploading || isSubmitting}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                if (file.size > 5 * 1024 * 1024) {
                                                                                    toast.error('File size must be less than 5MB');
                                                                                    e.target.value = '';
                                                                                    return;
                                                                                }
                                                                                handleMotherSignatureUpload(file);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            ) : (
                                                                <div className='flex items-center gap-2'>
                                                                    <div
                                                                        className={
                                                                            'flex h-20 w-32 items-center justify-center rounded-md border bg-white'
                                                                        }>
                                                                        <img
                                                                            src={motherSignature.path}
                                                                            alt='Mother signature'
                                                                            className='max-h-full max-w-full object-contain'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className='px-4 py-4'>
                                                            <div className='flex gap-2'>
                                                                {motherSignature?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='ghost'
                                                                        onClick={() => window.open(motherSignature.path, '_blank')}
                                                                        aria-label='View mother signature'>
                                                                        <Eye className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                                {motherSignature?.path && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        variant='destructive'
                                                                        onClick={handleMotherSignatureDelete}
                                                                        aria-label='Delete mother signature'>
                                                                        <Trash className='h-4 w-4' />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Hostel / Transport checkboxes for final submission */}
                                        <div className='mt-4 flex flex-col gap-3'>
                                            <div className='flex items-center space-x-6'>
                                                <div className='flex items-center space-x-2'>
                                                    <Controller
                                                        name='hostelRequired'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                id='hostelRequired'
                                                                checked={field.value || false}
                                                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                                            />
                                                        )}
                                                    />
                                                    <Label htmlFor='hostelRequired' className='cursor-pointer'>
                                                        Hostel Required
                                                    </Label>
                                                </div>

                                                <div className='flex items-center space-x-2'>
                                                    <Controller
                                                        name='transportRequired'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                id='transportRequired'
                                                                checked={field.value || false}
                                                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                                            />
                                                        )}
                                                    />
                                                    <Label htmlFor='transportRequired' className='cursor-pointer'>
                                                        Transport Required
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Upload Summary: show number of selected documents */}
                                        {uploadedDocuments.length > 0 && (
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
                                                        <p className='font-medium text-blue-900 text-sm'>Upload Summary</p>
                                                        <p className='mt-1 text-blue-700 text-sm'>
                                                            {uploadedDocuments.length} document(s) selected and will be submitted with the
                                                            form
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Footer */}
                            <div className='flex items-center justify-between border-t bg-gray-50 px-6 py-4 md:px-8'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    disabled={isSubmitting}
                                    className='w-fit transition-all duration-200 hover:scale-105'>
                                    Reset Form
                                </Button>

                                <div className='flex gap-3'>
                                    {currentStep > 1 && (
                                        <Button type='button' variant='outline' onClick={prevStep} disabled={isSubmitting}>
                                            <ChevronLeft className='mr-2 h-4 w-4' />
                                            Previous
                                        </Button>
                                    )}

                                    {currentStep < steps.length ? (
                                        <Button
                                            type='button'
                                            onClick={() => {
                                                if (hasUnsavedGuardian) {
                                                    toast.error('Please save guardian details before proceeding.');
                                                    return;
                                                }
                                                nextStep();
                                            }}
                                            disabled={isSavingStep || isSubmitting}
                                            className={hasUnsavedGuardian ? 'opacity-60' : ''}>
                                            {isSavingStep ? (
                                                <>
                                                    <Spinner className='mr-2 h-4 w-4' size='sm' />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    Next
                                                    <ChevronRight className='ml-2 h-4 w-4' />
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            type='button'
                                            onClick={submitWithoutValidation}
                                            disabled={isSubmitting || submittingFinal}
                                            className='min-w-[160px] transition-all duration-200 hover:scale-105'>
                                            {isSubmitting || submittingFinal ? (
                                                <span>Submitting...</span>
                                            ) : (
                                                <>
                                                    <Save className='mr-2 h-4 w-4' />
                                                    Submit Application
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
