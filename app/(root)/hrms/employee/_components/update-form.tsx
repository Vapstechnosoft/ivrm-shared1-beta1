'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateField } from '@/components/ui/dateField';
import { Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStateDropdown } from '@/hooks/hrms/useEmployeeRegister';
import {
    useArrearsList,
    useBankDropdown,
    useBloodGroupDropdown,
    useCasteCategoryDropdown,
    useCasteDropdown,
    useContactTypeDropdown,
    useCountryDropdown,
    useCourseDropdown,
    useDeductionList,
    useDepartmentDropdown,
    useDesignationDropdown,
    useEarningList,
    useEmployeeById,
    useEmployeeRegisterOnload,
    useEmployeeTypeDropdown,
    useGenderDropdown,
    useGradeDropdown,
    useGroupTypeDropdown,
    useInstitutionDropdown,
    useLeaveReasonDropdown,
    useMaritalStatusDropdown,
    usePaymentModeDropdown,
    useReligionDropdown,
    useSalaryTypeDropdown,
    useSaveBankDetails,
    useSaveEmployee,
    useSaveEmployeeDocument,
    useSaveEmployeeExperience,
    useSaveEmployeeMedical,
    useSaveEmployeeOtherDetails,
    useSaveEmployeeQualification,
    useSaveEmployeeSalaryDetails,
    useScoreTypeDropdown,
    useSpecializationDropdown,
    useTeachingTypeDropdown,
    useUploadStaffPhoto
} from '@/hooks/hrms/useEmployeeRegister';
import { getIconByName } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import { employeeRegisterSchemas, type qualificationDetailSchema } from '@/schemas/hrms/employee-register-schemas';
import type { SavePersonalDetailsApiRequest } from '@/types/hrms/employee-register';
import type { IEmployeeList } from '@/types/hrms/hrms-config/employee';
import type {
    IBankDropdown,
    IBloodGroupDropdown,
    ICasteCategoryDropdown,
    ICasteDropdown,
    IContactTypeDropdown,
    ICountryDropdown,
    ICourseDropdown,
    IDepartmentDropdown,
    IDesignationDropdown,
    IEmployeeTypeDropdown,
    IGenderDropdown,
    IGradeDropdown,
    IGroupTypeDropdown,
    IInstitutionDropdown,
    ILeaveReasonDropdown,
    IMaritalStatusDropdown,
    IPaymentModeDropdown,
    IReligionDropdown,
    ISalaryTypeDropdown,
    IScoreTypeDropdown,
    ISpecializationDropdown,
    IStateDropdown,
    ITeachingTypeDropdown
} from '@/types/hrms/hrms-config/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronLeft, ChevronRight, Plus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import {
    employeeRegisterSteps,
    fileToBase64,
    mapApiResponseToFormFields,
    mapFormDataToApiFormat,
    mapFormDataToApiFormatWithoutAddress,
    mapFormDataToPascalCaseApiFormat,
    tabFieldMap
} from './employee-register-helper';
import { PayrollTab } from './payroll-tab';

// Helper component for Qualification State Dropdown (needs to be separate component to use hooks)
function QualificationStateDropdown({
    control,
    index,
    countryId,
    setValue,
    fallbackStates = []
}: {
    control: any;
    index: number;
    countryId: string | null;
    setValue?: any;
    fallbackStates?: any[];
}) {
    const countryIdNum = countryId ? (Number.isNaN(Number(countryId)) ? null : Number(countryId)) : null;
    const { data: fetchedStates = [], isLoading } = useStateDropdown(countryIdNum);
    const availableStates: IStateDropdown[] = countryIdNum
        ? Array.isArray(fetchedStates)
            ? fetchedStates
            : []
        : (fallbackStates as IStateDropdown[]);
    const prevCountryIdRef = useRef<string | null>(countryId);
    useEffect(() => {
        if (!setValue) return;
        if (prevCountryIdRef.current !== countryId) {
            prevCountryIdRef.current = countryId;
            setValue(`qualificationDetails.${index}.qualificationState`, '', {
                shouldValidate: false
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryId, index, setValue]);
    return (
        <Controller
            name={`qualificationDetails.${index}.qualificationState`}
            control={control}
            render={({ field, fieldState }) => (
                <div className='flex flex-col gap-1.5'>
                    <Label>State*</Label>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger className='h-9'>
                            <SelectValue placeholder='Select State' />
                        </SelectTrigger>
                        <SelectContent>
                            {isLoading ? (
                                <SelectItem value='loading' disabled>
                                    Loading states...
                                </SelectItem>
                            ) : (
                                availableStates
                                    .filter((state: IStateDropdown) => {
                                        return state.key != null && state.key !== undefined && state.key !== 0;
                                    })
                                    .map((state: IStateDropdown) => {
                                        const key = state.key?.toString().trim();
                                        if (!key || key === '') return null;
                                        const value = state.value || String(state.key);
                                        return (
                                            <SelectItem key={state.key} value={key} textValue={value}>
                                                {value}
                                            </SelectItem>
                                        );
                                    })
                                    .filter(Boolean)
                            )}
                        </SelectContent>
                    </Select>
                    {fieldState.error && <div className='font-medium text-[0.8rem] text-destructive'>{fieldState.error.message}</div>}
                </div>
            )}
        />
    );
}

// Helper to validate value for SelectItem
const getSafeValue = (value: any) => {
    if (value == null || value === undefined || value === '') return null;
    const strValue = String(value).trim();
    return strValue === '' ? null : strValue;
};

// Type definition using imported schema
type FormFields = z.infer<typeof employeeRegisterSchemas.update>;

const steps = employeeRegisterSteps;

interface UpdateEmployeeFormProps {
    selectedRow: IEmployeeList;
    onSuccess?: () => void;
    className?: string;
}

const DebugPanel = null;

/**
 * Update Employee Form - Standalone form for updating existing employees
 * Matches the pattern from preadmission application-form update-form
 * Loads employee details but NO old API mapping - endpoints not provided yet
 */
export default function UpdateEmployeeForm({ selectedRow, onSuccess, className = '' }: UpdateEmployeeFormProps): React.ReactElement {
    // Grade dropdown - API: /api/MasterDropDown/GetGradeList
    const { data: gradeDropdownResponse, isLoading: isLoadingGrades } = useGradeDropdown();
    // Memoize dropdown to prevent infinite loops from unstable array references
    const gradeDropdown: IGradeDropdown[] = useMemo(
        () => (Array.isArray(gradeDropdownResponse) ? gradeDropdownResponse : (gradeDropdownResponse as any)?.data || []),
        [gradeDropdownResponse]
    );

    // Group Type dropdown - API: /api/MasterDropDown/GroupType
    const { data: groupTypeDropdownResponse, isLoading: isLoadingGroupTypes } = useGroupTypeDropdown();
    // Memoize and transform to ensure stable reference
    const groupTypeDropdown: IGroupTypeDropdown[] = useMemo(() => {
        const rawGroupTypes = Array.isArray(groupTypeDropdownResponse)
            ? groupTypeDropdownResponse
            : (groupTypeDropdownResponse as any)?.data || [];

        return rawGroupTypes
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                return {
                    key: Number(item.HRMGT_Id ?? item.hrmgT_Id ?? item.key ?? 0),
                    value: String(item.HRMGT_EmployeeGroupType ?? item.hrmgT_EmployeeGroupType ?? item.value ?? item.label ?? '')
                };
            })
            .filter((item: IGroupTypeDropdown) => item.key != null && item.key !== undefined && item.key !== 0);
    }, [groupTypeDropdownResponse]);

    // Employee Type dropdown - API: /api/MasterDropDown/GetEmployeeType
    const { data: employeeTypeDropdownResponse, isLoading: isLoadingEmployeeTypes } = useEmployeeTypeDropdown();

    const employeeTypeDropdown: IEmployeeTypeDropdown[] = useMemo(() => {
        const rawEmployeeTypes = Array.isArray(employeeTypeDropdownResponse)
            ? employeeTypeDropdownResponse
            : (employeeTypeDropdownResponse as any)?.data || [];

        return rawEmployeeTypes
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                return {
                    key: Number(item.HRMET_Id ?? item.hrmeT_Id ?? item.key ?? 0),
                    value: String(item.HRMET_EmployeeType ?? item.hrmeT_EmployeeType ?? item.value ?? item.label ?? '')
                };
            })
            .filter((item: IEmployeeTypeDropdown) => item.key != null && item.key !== undefined && item.key !== 0);
    }, [employeeTypeDropdownResponse]);

    // Institution dropdown - API: /api/MasterDropDown/GetInstitutionList
    const { data: institutionDropdownResponse, isLoading: isLoadingInstitutions } = useInstitutionDropdown();
    const institutionDropdown: IInstitutionDropdown[] = useMemo(
        () => (Array.isArray(institutionDropdownResponse) ? institutionDropdownResponse : (institutionDropdownResponse as any)?.data || []),
        [institutionDropdownResponse]
    );

    // Designation dropdown - API: /api/MasterDropDown/GetDesignation
    const { data: designationDropdownResponse, isLoading: isLoadingDesignations } = useDesignationDropdown();
    const designationDropdown: IDesignationDropdown[] = useMemo(
        () => (Array.isArray(designationDropdownResponse) ? designationDropdownResponse : (designationDropdownResponse as any)?.data || []),
        [designationDropdownResponse]
    );

    // Department dropdown (for School field) - API: /api/MasterDropDown/GetDepartments
    const { data: departmentDropdownResponse, isLoading: isLoadingDepartments } = useDepartmentDropdown();

    const departmentDropdown: any[] = useMemo(() => {
        const rawData = Array.isArray(departmentDropdownResponse)
            ? departmentDropdownResponse
            : (departmentDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Department Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                // Try logging individual item to see structure
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Department Item:', item);
                return {
                    key: Number(item.hrmD_Id ?? item.HRMD_Id ?? item.departmentId ?? item.key ?? 0),
                    value: String(
                        item.hrmD_DepartmentName ??
                        item.HRMD_DepartmentName ??
                        item.hrmD_Name ??
                        item.HRMD_Name ??
                        item.name ??
                        item.departmentName ??
                        item.HRMD_ProjectName ??
                        item.value ??
                        item.label ??
                        ''
                    )
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== 0);
    }, [departmentDropdownResponse]);

    // Gender dropdown - API: /api/MasterDropDown/GetGenderList
    const { data: genderDropdownResponse, isLoading: isLoadingGenders } = useGenderDropdown();
    const genderDropdown: IGenderDropdown[] = useMemo(
        () => (Array.isArray(genderDropdownResponse) ? genderDropdownResponse : (genderDropdownResponse as any)?.data || []),
        [genderDropdownResponse]
    );

    // Marital Status dropdown - API: /api/MasterDropDown/GetMaritalStateList
    const { data: maritalStatusDropdownResponse, isLoading: isLoadingMaritalStatuses } = useMaritalStatusDropdown();
    const maritalStatusDropdown: IMaritalStatusDropdown[] = useMemo(
        () =>
            Array.isArray(maritalStatusDropdownResponse)
                ? maritalStatusDropdownResponse
                : (maritalStatusDropdownResponse as any)?.data || [],
        [maritalStatusDropdownResponse]
    );

    // Religion dropdown - API: /api/MasterDropDown/GeAllReligionList
    const { data: religionDropdownResponse, isLoading: isLoadingReligions } = useReligionDropdown();

    const religionDropdown: IReligionDropdown[] = useMemo(() => {
        const rawData = Array.isArray(religionDropdownResponse) ? religionDropdownResponse : (religionDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Religion Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Religion Item:', item);
                return {
                    key: Number(
                        item.ivrmmR_Id ?? item.IVRMMR_Id ?? item.hrmR_Id ?? item.religionId ?? item.ReligionId ?? item.id ?? item.key ?? 0
                    ),
                    value: String(
                        item.ivrmmR_Name ??
                        item.IVRMMR_Name ??
                        item.hrmR_Name ??
                        item.name ??
                        item.religionName ??
                        item.ReligionName ??
                        item.value ??
                        item.label ??
                        ''
                    )
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== 0);
    }, [religionDropdownResponse]);

    // Payment Mode dropdown - API: /api/MasterDropDown/GetPaymentModeList
    const { data: paymentModeDropdownResponse, isLoading: isLoadingPaymentModes } = usePaymentModeDropdown();
    const paymentModeDropdown: IPaymentModeDropdown[] = useMemo(
        () => (Array.isArray(paymentModeDropdownResponse) ? paymentModeDropdownResponse : (paymentModeDropdownResponse as any)?.data || []),
        [paymentModeDropdownResponse]
    );

    // Bank dropdown - API: /api/MasterDropDown/GetBankList
    const { data: bankDropdownResponse, isLoading: isLoadingBanks } = useBankDropdown();
    const bankDropdown: IBankDropdown[] = useMemo(
        () => (Array.isArray(bankDropdownResponse) ? bankDropdownResponse : (bankDropdownResponse as any)?.data || []),
        [bankDropdownResponse]
    );

    // Country dropdown - API: /api/MasterDropDown/GetCountryList
    const { data: countryDropdownResponse, isLoading: isLoadingCountries } = useCountryDropdown();
    const countryDropdown: ICountryDropdown[] = useMemo(
        () => (Array.isArray(countryDropdownResponse) ? countryDropdownResponse : (countryDropdownResponse as any)?.data || []),
        [countryDropdownResponse]
    );

    // Specialization dropdown - API: /api/MasterDropDown/GetSpecialisationList
    const { data: specializationDropdownResponse, isLoading: isLoadingSpecializations } = useSpecializationDropdown();
    const specializationDropdown: ISpecializationDropdown[] = useMemo(() => {
        const rawData = Array.isArray(specializationDropdownResponse)
            ? specializationDropdownResponse
            : (specializationDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Specialization Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Specialization Item:', item);
                return {
                    key: String(item.hrmspL_Id ?? item.HRMSPL_Id ?? item.hrmS_Id ?? item.HRMS_Id ?? item.id ?? item.key ?? ''),
                    value: String(
                        item.hrmspL_SpecialisationName ??
                        item.HRMSPL_SpecialisationName ??
                        item.hrmS_SpecialisationName ??
                        item.HRMS_SpecialisationName ??
                        item.masterSpecialisationName ??
                        item.specialisationName ??
                        item.specializationName ??
                        item.name ??
                        item.value ??
                        item.label ??
                        'Unknown'
                    )
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [specializationDropdownResponse]);

    // Leave Reason dropdown - API: /api/MasterDropDown/GetLeaveReasonList
    const { data: leaveReasonDropdownResponse, isLoading: isLoadingLeaveReasons } = useLeaveReasonDropdown();
    const leaveReasonDropdown: ILeaveReasonDropdown[] = useMemo(
        () => (Array.isArray(leaveReasonDropdownResponse) ? leaveReasonDropdownResponse : (leaveReasonDropdownResponse as any)?.data || []),
        [leaveReasonDropdownResponse]
    );

    // Blood Group dropdown - API: /api/MasterDropDown/GetBloodGroupList
    const { data: bloodGroupDropdownResponse, isLoading: isLoadingBloodGroups } = useBloodGroupDropdown();
    const bloodGroupDropdown: IBloodGroupDropdown[] = useMemo(
        () => (Array.isArray(bloodGroupDropdownResponse) ? bloodGroupDropdownResponse : (bloodGroupDropdownResponse as any)?.data || []),
        [bloodGroupDropdownResponse]
    );

    // Salary Type dropdown - API: /api/MasterDropDown/GetSalaryTypeList
    const { data: salaryTypeDropdownResponse, isLoading: isLoadingSalaryTypes } = useSalaryTypeDropdown();
    const salaryTypeDropdown: ISalaryTypeDropdown[] = useMemo(
        () => (Array.isArray(salaryTypeDropdownResponse) ? salaryTypeDropdownResponse : (salaryTypeDropdownResponse as any)?.data || []),
        [salaryTypeDropdownResponse]
    );

    // Teaching Type dropdown - API: /api/MasterDropDown/GetTeachingTypeList
    const { data: teachingTypeDropdownResponse, isLoading: isLoadingTeachingTypes } = useTeachingTypeDropdown();
    const teachingTypeDropdown: ITeachingTypeDropdown[] = useMemo(
        () =>
            Array.isArray(teachingTypeDropdownResponse) ? teachingTypeDropdownResponse : (teachingTypeDropdownResponse as any)?.data || [],
        [teachingTypeDropdownResponse]
    );

    // Score Type dropdown - API: /api/MasterDropDown/ScoreTypeList
    const { data: scoreTypeDropdownResponse, isLoading: isLoadingScoreTypes } = useScoreTypeDropdown();
    const scoreTypeDropdown: IScoreTypeDropdown[] = useMemo(
        () => (Array.isArray(scoreTypeDropdownResponse) ? scoreTypeDropdownResponse : (scoreTypeDropdownResponse as any)?.data || []),
        [scoreTypeDropdownResponse]
    );

    // Contact Type dropdown - API: /api/MasterDropDown/GetContactType
    const { data: contactTypeDropdownResponse, isLoading: isLoadingContactTypes } = useContactTypeDropdown();
    const contactTypeDropdown: IContactTypeDropdown[] = useMemo(
        () => (Array.isArray(contactTypeDropdownResponse) ? contactTypeDropdownResponse : (contactTypeDropdownResponse as any)?.data || []),
        [contactTypeDropdownResponse]
    );

    // Course dropdown - API: /api/MasterDropDown/GetCourseList
    const { data: courseDropdownResponse, isLoading: isLoadingCourses } = useCourseDropdown();
    const courseDropdown: ICourseDropdown[] = useMemo(() => {
        const rawData = Array.isArray(courseDropdownResponse) ? courseDropdownResponse : (courseDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Course Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Course Item:', item);
                return {
                    key: String(item.hrmC_Id ?? item.HRMC_Id ?? item.courseId ?? item.id ?? item.key ?? ''),
                    value: String(
                        item.hrmC_CourseName ??
                        item.HRMC_CourseName ??
                        item.courseName ??
                        item.name ??
                        item.value ??
                        item.label ??
                        'Unknown'
                    )
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [courseDropdownResponse]);

    const { mutate: saveEmployeeMutation, isPending } = useSaveEmployee();
    const { mutate: saveQualificationMutation, isPending: isSavingQualification } = useSaveEmployeeQualification();
    const { mutate: saveExperienceDetails, isPending: isSavingExperience } = useSaveEmployeeExperience();
    const { mutate: saveDocumentDetails, mutateAsync: saveDocumentDetailsAsync, isPending: isSavingDocument } = useSaveEmployeeDocument();
    const { mutate: saveMedicalDetails, isPending: isSavingMedical } = useSaveEmployeeMedical();
    const { mutate: saveOtherDetails, isPending: isSavingOther } = useSaveEmployeeOtherDetails();
    const { mutate: saveSalaryDetails, isPending: isSavingSalaryDetails } = useSaveEmployeeSalaryDetails();
    const { mutate: uploadStaffPhoto, isPending: isUploadingPhoto } = useUploadStaffPhoto();
    const { mutate: saveBankDetails, isPending: isSavingBankDetails } = useSaveBankDetails();

    // Alias for consistency
    const savePersonalDetails = saveEmployeeMutation;
    const saveQualificationDetails = saveQualificationMutation;

    // Bank details might use saveEmployeeMutation if it's part of main employee update,
    // or if there is a specific hook. Assuming saveEmployee for now as per original code,
    // but clearly marked.
    const _saveBankDetails = saveEmployeeMutation;
    const isSavingBank = isPending;

    // Update form - edit mode enabled
    const _isEditMode = true;
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [_photoFile, setPhotoFile] = useState<File | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [savedEmployeeId, setSavedEmployeeId] = useState<number | null>(selectedRow?.hrmE_Id || null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    // Empty default values for update form
    const formDefaultValues = useMemo(
        () => ({
            firstName: '',
            middleName: '',
            lastName: '',
            employeeCode: '',
            typeOfEmployment: '',
            employeeGroup: '',
            department: '',
            designation: '',
            gender: '',
            maritalStatus: '',
            religion: '',
            casteCategory: '',
            caste: '',
            bloodGroup: '',
            salaryType: '',
            modeOfPayment: '',
            contactCountry: '',
            contactState: '',
            permanentCountry: '',
            permanentState: '',
            sameAsCommunicationAddress: false,
            qualificationDetails: [],
            experienceDetails: [],
            documentList: [],
            mobileDetails: [{ mobileNo: '', type: 'Default' }],
            emailDetails: [{ emailId: '', type: 'Default' }],
            bankDetails: [],
            dateOfBirth: '',
            dateOfRetirement: ''
        }),
        []
    );
    // Refs for tracking initialization state
    const _employeeDetailsRef = useRef<any>(null);

    const { control, register, handleSubmit, reset, watch, getValues, setValue, trigger, setError, clearErrors, formState } =
        useForm<FormFields>({
            resolver: zodResolver(employeeRegisterSchemas.update),
            mode: 'onChange',
            reValidateMode: 'onChange',
            defaultValues: formDefaultValues,
            shouldUnregister: false // Ensure values persist when tabs unmount
        });

    const { errors, isSubmitting } = formState;

    const isSubmittingAny =
        isSubmitting ||
        isSavingQualification ||
        isSavingExperience ||
        isSavingDocument ||
        isSavingMedical ||
        isSavingBank ||
        isSavingOther ||
        isSavingSalaryDetails;

    // Get MI_Id from selectedRow or assume it's available (fallback to 0 which might fail if API is strict)
    const MI_Id = selectedRow?.mI_Id || 0;
    const {
        data: onloadData,
        isLoading: isLoadingEmployee,
        refetch: refetchEmployee
    } = useEmployeeRegisterOnload(MI_Id, selectedRow?.hrmE_Id);

    // Fetch payroll lists explicitly as requested by user
    const { data: earningListData } = useEarningList();
    const { data: deductionListData } = useDeductionList();
    const { data: arrearsListData } = useArrearsList();

    // Value watchers for dependent dropdowns (Moved after useForm)
    const religionId = useWatch({ control, name: 'religion' });
    const casteCategoryId = useWatch({ control, name: 'casteCategory' });
    const selectedReligionId = religionId ? (Number.isNaN(Number(religionId)) ? null : Number(religionId)) : null;
    const selectedCasteCategoryId = casteCategoryId ? (Number.isNaN(Number(casteCategoryId)) ? null : Number(casteCategoryId)) : null;

    // Caste Category dropdown - Dependent on Religion
    const { data: casteCategoryDropdownResponse, isLoading: isLoadingCasteCategories } = useCasteCategoryDropdown(selectedReligionId || 0);

    const casteCategoryDropdown: ICasteCategoryDropdown[] = useMemo(() => {
        const rawData = Array.isArray(casteCategoryDropdownResponse)
            ? casteCategoryDropdownResponse
            : (casteCategoryDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] CasteCategory Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First CasteCategory Item:', item);
                return {
                    key: String(item.IMCC_Id ?? item.imcC_Id ?? item.key ?? ''),
                    value: String(item.IMCC_CategoryName ?? item.imcC_CategoryName ?? item.value ?? item.label ?? '')
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [casteCategoryDropdownResponse]);

    // Caste dropdown - Dependent on Caste Category
    const { data: casteDropdownResponse, isLoading: isLoadingCastes } = useCasteDropdown(selectedCasteCategoryId || 0);

    const casteDropdown: ICasteDropdown[] = useMemo(() => {
        const rawData = Array.isArray(casteDropdownResponse) ? casteDropdownResponse : (casteDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Caste Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Caste Item:', item);
                return {
                    key: String(item.IMC_Id ?? item.imC_Id ?? item.key ?? ''),
                    value: String(item.IMC_CasteName ?? item.imC_CasteName ?? item.value ?? item.label ?? '')
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [casteDropdownResponse]);

    // Options object - Moved here to have access to dependent dropdowns
    const options = useMemo(() => {
        return {
            grades: gradeDropdown || [],
            groupTypes: groupTypeDropdown || [],
            empTypes: employeeTypeDropdown || [],
            institutions: institutionDropdown || [],
            designations: designationDropdown || [],
            genders: genderDropdown || [],
            maritalStatuses: maritalStatusDropdown || [],
            religions: religionDropdown || [],
            casteCategories: casteCategoryDropdown || [],
            castes: casteDropdown || [],
            modeOfPayment: paymentModeDropdown || [],
            banks: bankDropdown || [],
            countries: countryDropdown || [],
            departments: departmentDropdown || [],
            states: [],
            courses: courseDropdown || [],
            specialisations: specializationDropdown || [],
            teachingNonTeaching: teachingTypeDropdown || [],
            bloodGroups: bloodGroupDropdown || [],
            salaryTypes: salaryTypeDropdown || [],
            addressTypes: [],
            phoneTypes: contactTypeDropdown || [],
            contactTypes: contactTypeDropdown || [],
            cgpaPercentageTypes: scoreTypeDropdown || [],
            leavingReasons: leaveReasonDropdown || [],
            earningList:
                (Array.isArray(earningListData) ? earningListData : (earningListData as any)?.data) ||
                (onloadData as any)?.data?.earningList ||
                [],
            detectionList:
                (Array.isArray(deductionListData) ? deductionListData : (deductionListData as any)?.data) ||
                (onloadData as any)?.data?.detectionList ||
                [],
            arrearList:
                (Array.isArray(arrearsListData) ? arrearsListData : (arrearsListData as any)?.data) ||
                (onloadData as any)?.data?.arrearList ||
                [],
            grossList: (onloadData as any)?.data?.grossList || [],
            documentList: [],
            employeedetailList: []
        };
    }, [
        gradeDropdown,
        groupTypeDropdown,
        employeeTypeDropdown,
        institutionDropdown,
        designationDropdown,
        genderDropdown,
        maritalStatusDropdown,
        religionDropdown,
        casteCategoryDropdown,
        casteDropdown,
        paymentModeDropdown,
        bankDropdown,
        countryDropdown,
        departmentDropdown,
        courseDropdown,
        specializationDropdown,
        leaveReasonDropdown,
        bloodGroupDropdown,
        salaryTypeDropdown,
        teachingTypeDropdown,
        scoreTypeDropdown,
        onloadData, // Add onloadData dependency
        earningListData,
        deductionListData,
        arrearsListData
    ]);

    // Consolidate loading states for UI usage
    const dropdownLoadingStates = {
        grades: isLoadingGrades,
        groupTypes: isLoadingGroupTypes,
        empTypes: isLoadingEmployeeTypes,
        institutions: isLoadingInstitutions,
        departments: isLoadingDepartments,
        designations: isLoadingDesignations,
        genders: isLoadingGenders,
        maritalStatuses: isLoadingMaritalStatuses,
        religions: isLoadingReligions,
        casteCategories: isLoadingCasteCategories,
        castes: isLoadingCastes,
        paymentModes: isLoadingPaymentModes,
        banks: isLoadingBanks,
        countries: isLoadingCountries,
        specializations: isLoadingSpecializations,
        leaveReasons: isLoadingLeaveReasons,
        bloodGroups: isLoadingBloodGroups,
        salaryTypes: isLoadingSalaryTypes,
        teachingTypes: isLoadingTeachingTypes,
        scoreTypes: isLoadingScoreTypes,
        contactTypes: isLoadingContactTypes,
        courses: isLoadingCourses
    };

    // Fetch full employee details when selectedRow changes
    // MOVED HERE: To ensure 'reset' from useForm is defined
    // Use the onload API which returns comprehensive data + dropdowns

    // Effect to refetch when selectedRow changes (ensures fresh data on repeated edits)
    useEffect(() => {
        if (selectedRow?.hrmE_Id) {
            console.log('🔄 [UPDATE-FORM] Selected row changed to ID:', selectedRow.hrmE_Id);
            setSavedEmployeeId(selectedRow.hrmE_Id);
            setIsFormInitialized(false); // Reset initialization flag
            hasAppliedDetailedData.current = false; // Reset detailed data flag
            refetchEmployee();
        }
    }, [selectedRow?.hrmE_Id, refetchEmployee]);

    // SAFETY: Re-hydrate arrays when switching tabs if they appear empty but data exists

    // Define local mapping helpers that were missing
    const mapFormDataToApiFormatLocal = (data: FormFields): SavePersonalDetailsApiRequest => {
        // Fallback to employeeIdFromDetails if savedEmployeeId is not yet set
        const empId = savedEmployeeId || 0;
        return mapFormDataToApiFormat(data, empId, selectedPhoto);
    };

    const mapFormDataToApiFormatWithoutAddressLocal = (data: FormFields): SavePersonalDetailsApiRequest => {
        const empId = savedEmployeeId || 0;
        return mapFormDataToApiFormatWithoutAddress(data, empId, selectedPhoto);
    };

    const mapFormDataToPascalCaseLocal = (data: any) => {
        return mapFormDataToPascalCaseApiFormat(data, savedEmployeeId || selectedRow?.hrmE_Id || 0, selectedPhoto);
    };

    // Helper to get current tab key from step
    const getCurrentTabKey = () => steps.find((s) => s.id === currentStep)?.tabKey || 'employee';

    // Function to go to previous step
    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Function to go to next step
    const nextStep = async () => {
        // Prevent duplicate submissions
        if (isSavingQualification || isSavingExperience || isSubmittingAny) {
            console.warn('⚠️ [DEBUG] nextStep - Already saving, ignoring duplicate call');
            return;
        }

        const currentTabKey = getCurrentTabKey();
        const currentTabFields = tabFieldMap[currentTabKey] || [];

        console.log('🔍 [DEBUG] nextStep called - Step:', currentStep, 'TabKey:', currentTabKey);

        if (currentTabFields.length > 0) {
            const isValid = await trigger(currentTabFields as any);
            console.log('🔍 [DEBUG] Validation result:', isValid);
            if (!isValid) {
                const formErrors = formState.errors;
                console.log('🔍 [DEBUG] Form errors:', formErrors);

                // Function to extract error message from nested structure
                const extractErrorMessage = (errors: any): string | null => {
                    if (!errors) return null;

                    // If it's a direct error with message
                    if (typeof errors === 'string') return errors;
                    if (errors?.message) return errors.message;

                    // If it's an array (like qualificationDetails)
                    if (Array.isArray(errors)) {
                        for (const item of errors) {
                            if (item && typeof item === 'object') {
                                // Check each field in the array item
                                for (const key in item) {
                                    const fieldError = item[key];
                                    if (fieldError) {
                                        const msg = extractErrorMessage(fieldError);
                                        if (msg) return msg;
                                    }
                                }
                            }
                        }
                    }

                    // If it's an object, check nested properties
                    if (typeof errors === 'object') {
                        for (const key in errors) {
                            const nestedError = errors[key];
                            const msg = extractErrorMessage(nestedError);
                            if (msg) return msg;
                        }
                    }

                    return null;
                };

                // Extract and show first error message
                const errorMessages: string[] = [];
                currentTabFields.forEach((field) => {
                    const fieldError = (formErrors as any)[field];
                    if (fieldError) {
                        const msg = typeof fieldError === 'string' ? fieldError : fieldError?.message;
                        if (msg) errorMessages.push(msg);
                    }
                });

                const errorMessage = errorMessages.length > 0 ? errorMessages[0] : extractErrorMessage(formErrors);
                if (errorMessage) {
                    toast.error(errorMessage);
                } else {
                    toast.error('Please fix the validation errors before proceeding');
                }
                return;
            }
        }

        const data = getValues();
        const currentStepId = currentStep;

        // Apply robust payment mode fix to ensure the name is sent to API and bank details are cleared for non-Bank modes
        const fixPaymentMode = (p: any) => {
            const paymentModeObj = (options.modeOfPayment as any[])?.find(
                (m: any) =>
                    String(m.key || m.ivrmmod_Id || '') === String(data.modeOfPayment) ||
                    String(m.value || m.ivrmmod_ModeOfPayment || '').toLowerCase() === String(data.modeOfPayment).toLowerCase()
            );
            const paymentModeName = paymentModeObj?.value || paymentModeObj?.ivrmmod_ModeOfPayment || data.modeOfPayment;

            if (p.employee) {
                p.employee.hrmE_PaymentType = paymentModeName;
            }

            if (paymentModeName && String(paymentModeName).toLowerCase() !== 'bank') {
                if (p.employee) {
                    p.employee.hrmE_BankAccountNo = null;
                }
                if (p.bankRequest) {
                    delete p.bankRequest;
                }
            }
            return p;
        };

        console.log('🔍 [DEBUG] Proceeding to save - Step ID:', currentStepId);
        console.log('🔍 [DEBUG] nextStep - Checking conditions:');
        console.log('  - currentStepId === 1:', currentStepId === 1);
        console.log('  - currentStepId === 2:', currentStepId === 2);
        console.log('  - currentStepId === 3:', currentStepId === 3);
        console.log('  - currentStepId === 4:', currentStepId === 4);
        console.log('  - currentStepId type:', typeof currentStepId);
        console.log('  - currentStepId value:', currentStepId);

        // For steps 1 and 2, we need to save data via API before moving to next step
        if (currentStepId === 1) {
            // Employee Information tab - call /api/EmployeeRegistration/SavePersonalDetails
            // Save employee details without address (address fields will be null)
            const payload = fixPaymentMode(mapFormDataToApiFormatWithoutAddressLocal(data));
            payload.employee.hrmE_Id = selectedRow?.hrmE_Id || 0; // Use existing employee ID

            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Form Data:', data);
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Payload:', payload);
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Employee ID:', payload.employee.hrmE_Id);
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Address Fields Check:');
            console.log(
                '  - Contact Address:',
                payload.employee.hrmE_LocStreet,
                payload.employee.hrmE_LocCity,
                payload.employee.hrmE_LocStateId
            );
            console.log(
                '  - Permanent Address:',
                payload.employee.hrmE_PerStreet,
                payload.employee.hrmE_PerCity,
                payload.employee.hrmE_PerStateId
            );
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Calling savePersonalDetails...');

            savePersonalDetails(payload as any, {
                onSuccess: (response: any) => {
                    console.log('✅ [DEBUG] Tab 1 (Employee Information) - Save Success:', response);
                    // Show API response message
                    if (response?.success && response?.message) {
                        toast.success(response.message);
                    } else if (response?.message) {
                        toast.info(response.message);
                    }
                    // API returns hrmE_Id (lowercase) in response
                    const employeeId =
                        response?.data?.hrmE_Id ||
                        response?.data?.HRME_Id ||
                        response?.hrmE_Id ||
                        response?.HRME_Id ||
                        selectedRow?.hrmE_Id ||
                        0;
                    console.log('🔍 [DEBUG] Tab 1 - Extracted Employee ID:', employeeId);
                    if (employeeId && employeeId > 0) {
                        setSavedEmployeeId(employeeId);
                        setCurrentStep(2);
                    } else {
                        console.error('❌ [DEBUG] Tab 1 - Failed to get employee ID from response');
                        toast.error('Failed to get employee ID from response');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Tab 1 (Employee Information) - Save Error:', error);
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save employee details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 2) {
            // Address Information tab - call same endpoint /api/EmployeeRegistration/SavePersonalDetails
            // Update with address details using the hrmE_Id
            const employeeId = savedEmployeeId || selectedRow?.hrmE_Id;
            if (!employeeId) {
                console.error('❌ [DEBUG] Tab 2 - No employee ID found');
                toast.error('Please save Employee details first');
                setCurrentStep(1);
                return;
            }
            const payload = fixPaymentMode(mapFormDataToApiFormatLocal(data));
            payload.employee.hrmE_Id = employeeId; // Use the employee ID

            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Form Data:', data);
            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Payload:', payload);
            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Employee ID:', employeeId);
            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Address Fields:');
            console.log('  - Contact Address:', {
                street: payload.employee.hrmE_LocStreet,
                area: payload.employee.hrmE_LocArea,
                city: payload.employee.hrmE_LocCity,
                stateId: payload.employee.hrmE_LocStateId,
                countryId: payload.employee.hrmE_LocCountryId,
                pincode: payload.employee.hrmE_LocPincode
            });
            console.log('  - Permanent Address:', {
                street: payload.employee.hrmE_PerStreet,
                area: payload.employee.hrmE_PerArea,
                city: payload.employee.hrmE_PerCity,
                stateId: payload.employee.hrmE_PerStateId,
                countryId: payload.employee.hrmE_PerCountryId,
                pincode: payload.employee.hrmE_PerPincode
            });
            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Calling savePersonalDetails...');

            savePersonalDetails(payload as any, {
                onSuccess: (response: any) => {
                    console.log('✅ [DEBUG] Tab 2 (Address Information) - Save Success:', response);
                    console.log('🔍 [DEBUG] Tab 2 - Full API Response:', JSON.stringify(response, null, 2));
                    console.log('🔍 [DEBUG] Tab 2 - Response Success:', response?.success);
                    console.log('🔍 [DEBUG] Tab 2 - Response Message:', response?.message);
                    console.log('🔍 [DEBUG] Tab 2 - Response Data:', response?.data);

                    // Show API response message
                    if (response?.success && response?.message) {
                        toast.success(response.message);
                    } else if (response?.message) {
                        toast.info(response.message);
                    } else if (response?.success === false) {
                        console.warn('⚠️ [DEBUG] Tab 2 - API returned success: false');
                        toast.warning('Address saved but API returned success: false. Please verify the data was saved.');
                    }

                    // Verify address fields were sent
                    console.log('🔍 [DEBUG] Tab 2 - Verification - Address fields sent in payload:');
                    console.log('  Contact:', {
                        street: payload.employee.hrmE_LocStreet,
                        area: payload.employee.hrmE_LocArea,
                        city: payload.employee.hrmE_LocCity,
                        stateId: payload.employee.hrmE_LocStateId,
                        countryId: payload.employee.hrmE_LocCountryId,
                        pincode: payload.employee.hrmE_LocPincode
                    });
                    console.log('  Permanent:', {
                        street: payload.employee.hrmE_PerStreet,
                        area: payload.employee.hrmE_PerArea,
                        city: payload.employee.hrmE_PerCity,
                        stateId: payload.employee.hrmE_PerStateId,
                        countryId: payload.employee.hrmE_PerCountryId,
                        pincode: payload.employee.hrmE_PerPincode
                    });

                    setCurrentStep(3);
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Tab 2 (Address Information) - Save Error:', error);
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save address details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 3) {
            // Qualification tab - save qualification details
            console.log('🔍 [DEBUG] Qualification tab - Starting save process');
            const employeeId = savedEmployeeId || selectedRow?.hrmE_Id;
            console.log(
                '🔍 [DEBUG] Employee ID:',
                employeeId,
                'savedEmployeeId:',
                savedEmployeeId,
                'selectedRow?.hrmE_Id:',
                selectedRow?.hrmE_Id
            );

            if (!employeeId) {
                console.error('❌ [DEBUG] No employee ID found');
                toast.error('Please save Employee and Address details first');
                setCurrentStep(1);
                return;
            }

            const qualificationList = data.qualificationDetails || [];
            console.log('🔍 [DEBUG] Qualification list:', qualificationList, 'Length:', qualificationList.length);

            if (qualificationList.length === 0) {
                console.error('❌ [DEBUG] No qualifications found');
                setError('qualificationDetails', {
                    type: 'required',
                    message: 'Please add at least one qualification'
                });
                toast.error('Please add at least one qualification');
                return;
            }
            // Map qualification data to new API format
            console.log(
                '🔍 [DEBUG] Qualification IDs Check (nextStep):',
                qualificationList.map((q: any, i: number) => ({
                    index: i,
                    hrmeQ_Id: q.hrmeQ_Id,
                    HRMEQ_Id: q.HRMEQ_Id,
                    hasId: !!(q.hrmeQ_Id || q.HRMEQ_Id)
                }))
            );
            const qualificationsPayload = qualificationList.map((qual: any, index: number) => {
                const id = qual.hrmeQ_Id || qual.HRMEQ_Id || 0; // Check both cases
                console.log(`🔍 [DEBUG] Qualification #${index + 1} (nextStep) - ID from form:`, id);
                return {
                    hrmeQ_Id: id, // Use existing ID if updating, 0 for new
                    hrmC_Id: Number(qual.course) || 0,
                    hrmE_Id: employeeId,
                    mI_Id: MI_Id,
                    hrmE_QualificationName: qual.qualification || '',
                    hrmeQ_CollegeName: qual.college || '',
                    hrmeQ_UniversityName: qual.university || '',
                    hrmeQ_YearOfPassing: Number(qual.yearOfPassing) || 0,
                    hrmeQ_RegistrationNo: qual.registrationNo || '',
                    hrmeQ_Result: qual.result || '',
                    hrmeQ_CGPAOrPerFlag: qual.cgpaOrPercentage || 'CGPA',
                    hrmeQ_CGPA: qual.cgpaOrPercentage === 'CGPA' ? qual.cgpa || '' : '',
                    hrmeQ_Percentage: qual.cgpaOrPercentage === 'Percentage' ? qual.percentage || '' : '',
                    hrmeQ_AreaOfSpecialisation: qual.areaOfSpecialisation || qual.specialisation || '',
                    hrmeQ_PHDFlg: qual.phdFlag || false,
                    hrmeQ_StateId: Number(qual.qualificationState) || 0,
                    hrmeQ_CountryId: Number(qual.qualificationCountry) || 0,
                    hrmeQ_ThesisTitle: qual.thesisTitle || '',
                    hrmeQ_RegistrationYear: Number(qual.registrationYear) || 0,
                    hrmeQ_GuideName: qual.guideName || '',
                    hrmeQ_Date: qual.qualifiedDate ? new Date(qual.qualifiedDate).toISOString() : null,
                    hrmeQ_MedicalCouncil: qual.medicalCouncil || '',
                    hrmeQ_Hardcopy: qual.hardcopy || '',
                    retrunMsg: ''
                };
            });

            console.log('🔍 [DEBUG] Qualification Payload Count:', qualificationsPayload.length);
            console.log('🔍 [DEBUG] Qualification Payload:', qualificationsPayload);
            console.log('🔍 [DEBUG] Employee ID:', employeeId);
            console.log('🔍 [DEBUG] Calling saveQualificationDetails mutation ONCE with array of', qualificationsPayload.length, 'items');
            console.log('🔍 [DEBUG] saveQualificationDetails function:', typeof saveQualificationDetails);
            console.log('🔍 [DEBUG] isSavingQualification:', isSavingQualification);

            if (!saveQualificationDetails) {
                console.error('❌ [DEBUG] saveQualificationDetails is not defined!');
                toast.error('Save qualification function is not available');
                return;
            }

            if (isSavingQualification) {
                console.warn('⚠️ [DEBUG] Already saving qualification, ignoring duplicate call');
                return;
            }

            // Ensure we only call the API once with the entire array
            saveQualificationDetails(qualificationsPayload, {
                onSuccess: (response: any) => {
                    console.log('✅ [DEBUG] Qualification Save Success:', response);
                    // Show API response message
                    if (response?.success) {
                        if (response.message) toast.success(response.message);
                        setCurrentStep(4);
                    } else {
                        console.warn('⚠️ [DEBUG] Tab 3 - API returned success: false', response);
                        toast.error(response?.message || 'Failed to save qualification details');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Qualification Save Error:', error);
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save qualification details';
                    toast.error(errorMessage);
                }
            });

            console.log('🔍 [DEBUG] Mutation call completed');
        } else if (currentStepId === 4) {
            // Experience tab - save experience details
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Starting save process in nextStep');
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Employee ID:', savedEmployeeId || selectedRow?.hrmE_Id);

            const employeeId = savedEmployeeId || selectedRow?.hrmE_Id;

            if (!employeeId) {
                console.error('❌ [DEBUG] Tab 4 - No employee ID found');
                toast.error('Please save Employee and Address details first');
                setCurrentStep(1);
                return;
            }

            const experienceList = data.experienceDetails || [];
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Form Data:', data);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Experience List (Raw):', experienceList);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Experience Count:', experienceList.length);

            if (experienceList.length === 0) {
                console.log('🔍 [DEBUG] Tab 4 - No experiences found, skipping to next step');
                setCurrentStep(5);
                return;
            }

            // Map experience data to API format (matching API request body format)
            console.log(
                '🔍 [DEBUG] Experience IDs Check:',
                experienceList.map((e: any, i: number) => ({
                    index: i,
                    hrmeE_Id: e.hrmeE_Id,
                    HRMEE_Id: e.HRMEE_Id,
                    hasId: !!(e.hrmeE_Id || e.HRMEE_Id)
                }))
            );
            const experiencesPayload = experienceList.map((exp: any, index: number) => {
                const id = exp.hrmeE_Id || exp.HRMEE_Id || 0; // Check both cases
                console.log(`🔍 [DEBUG] Experience #${index + 1} - ID from form:`, id, 'Full exp:', exp);
                const mapped = {
                    hrmeE_Id: id, // Use existing ID if updating, 0 for new
                    hrmE_Id: employeeId,
                    mI_Id: MI_Id,
                    hrmeE_OrganisationName: exp.organisationName || '',
                    hrmeE_OrganisationAddress: exp.organisationAddress || '',
                    hrmeE_Department: exp.department || '',
                    hrmeE_Designation: exp.designation || '',
                    hrmeE_JoinDate: exp.joinDate ? new Date(exp.joinDate).toISOString() : '',
                    hrmeE_ExitDate: exp.exitDate ? new Date(exp.exitDate).toISOString() : '',
                    hrmeE_NoOfYears: Number(exp.noOfYears) || 0,
                    hrmeE_NoOfMonths: Number(exp.noOfMonths) || 0,
                    hrmeE_AnnualSalary: Number(exp.annualSalary) || 0,
                    hrmeE_ReasonForLeaving: exp.reasonForLeaving || ''
                };
                console.log(`🔍 [DEBUG] Tab 4 - Experience #${index + 1} Mapping:`, {
                    raw: exp,
                    mapped: mapped
                });
                return mapped;
            });

            console.log('🔍 [DEBUG] Tab 4 (Experience) - Payload Count:', experiencesPayload.length);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Payload:', experiencesPayload);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Payload (JSON):', JSON.stringify(experiencesPayload, null, 2));
            console.log(
                '🔍 [DEBUG] Tab 4 (Experience) - Calling saveExperienceDetails ONCE with array of',
                experiencesPayload.length,
                'items'
            );
            console.log('🔍 [DEBUG] Tab 4 (Experience) - saveExperienceDetails function type:', typeof saveExperienceDetails);

            if (!saveExperienceDetails) {
                console.error('❌ [DEBUG] Tab 4 - saveExperienceDetails is not defined!');
                toast.error('Experience save function is not available. Please refresh the page.');
                return;
            }

            // Ensure we only call the API once with the entire array
            saveExperienceDetails(experiencesPayload, {
                onSuccess: (response: any) => {
                    console.log('✅ [DEBUG] Tab 4 (Experience) - Save Success:', response);
                    console.log('🔍 [DEBUG] Tab 4 - Full API Response:', JSON.stringify(response, null, 2));
                    console.log('🔍 [DEBUG] Tab 4 - Response Success:', response?.success);
                    console.log('🔍 [DEBUG] Tab 4 - Response Message:', response?.message);
                    console.log('🔍 [DEBUG] Tab 4 - Response Data:', response?.data);

                    // Verify experience data was saved
                    if (response?.data && Array.isArray(response.data)) {
                        console.log('🔍 [DEBUG] Tab 4 - Response contains experience array, length:', response.data.length);
                        console.log('🔍 [DEBUG] Tab 4 - Response Experiences:', response.data);
                    }

                    // Show API response message
                    if (response?.success) {
                        if (response.message) toast.success(response.message);
                        setCurrentStep(5);
                    } else {
                        console.warn('⚠️ [DEBUG] Tab 4 - API returned success: false', response);
                        toast.error(response?.message || 'Failed to save experience details');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Tab 4 (Experience) - Save Error:', error);
                    console.error('❌ [DEBUG] Tab 4 - Error Details:', JSON.stringify(error, null, 2));
                    console.error('❌ [DEBUG] Tab 4 - Error Response:', error?.response);
                    console.error('❌ [DEBUG] Tab 4 - Error Message:', error?.message);
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save experience details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 5) {
            // Document tab - save document details
            console.log('🔍 [DEBUG] Tab 5 (Document) - handling save via handleDocumentSave');
            await handleDocumentSave();
        } else if (currentStepId === 6) {
            // Medical tab
            console.log('🔍 [DEBUG] Tab 6 (Medical) - Starting save process');
            if (!savedEmployeeId) {
                toast.error('Please save Employee and Address details first');
                setCurrentStep(1);
                return;
            }
            const payload = mapFormDataToPascalCaseLocal(data);
            console.log('Final Medical Payload to API:', JSON.stringify(payload, null, 2));
            saveMedicalDetails(payload, {
                onSuccess: (response: any) => {
                    console.log('✅ [API DEBUG] Tab 6 (Medical) - Save Success Response:', response);
                    if (response?.success) {
                        toast.success(response.message || 'Medical details saved successfully');
                        setCurrentStep(7);
                    } else {
                        console.error('❌ [API DEBUG] Tab 6 (Medical) - API returned success: false', response);
                        toast.error(response?.message || 'Failed to save medical details');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [API DEBUG] Tab 6 (Medical) - API Error:', error);
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save medical details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 7) {
            // Other Details tab
            console.log('🔍 [DEBUG] Tab 7 (Other) - Starting save process');
            if (!savedEmployeeId) {
                toast.error('Please save Employee and Address details first');
                setCurrentStep(1);
                return;
            }
            const payload = mapFormDataToPascalCaseLocal(data);
            console.log('Final Other Details Payload to API:', JSON.stringify(payload, null, 2));
            saveOtherDetails(payload, {
                onSuccess: (response: any) => {
                    console.log('✅ [API DEBUG] Tab 7 (Other) - Save Success Response:', response);
                    if (response?.success) {
                        toast.success(response.message || 'Other details saved successfully');
                        // Call salary details save API as requested by user
                        if (savedEmployeeId) {
                            saveSalaryDetails(
                                { hrme_id: savedEmployeeId, MI_Id: MI_Id },
                                {
                                    onSuccess: (salaryResponse: any) => {
                                        console.log('✅ [API DEBUG] Tab 7 (Salary Save) - Success:', salaryResponse);
                                        setCurrentStep(8);
                                    },
                                    onError: (salaryError: any) => {
                                        console.error('❌ [API DEBUG] Tab 7 (Salary Save) - Error:', salaryError);
                                        // Move to next step anyway as requested, but warning is fine.
                                        setCurrentStep(8);
                                    }
                                }
                            );
                        } else {
                            setCurrentStep(8);
                        }
                    } else {
                        console.error('❌ [API DEBUG] Tab 7 (Other) - API returned success: false', response);
                        toast.error(response?.message || 'Failed to save other details');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [API DEBUG] Tab 7 (Other) - API Error:', error);
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save other details';
                    toast.error(errorMessage);
                }
            });
        } else {
            // For other steps, just move to next step without API call
            console.log('🔍 [DEBUG] nextStep - Falling through to else clause (Step 8)');
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    // Helper to handle document save logic (shared between nextStep and onFormSubmit)
    const handleDocumentSave = async () => {
        const data = getValues();
        const documentList = data.documentList || [];

        if (!savedEmployeeId) {
            toast.error('Please save Employee details first');
            setCurrentStep(1);
            return;
        }

        if (documentList.length === 0) {
            setError('documentList', {
                type: 'required',
                message: 'Please add at least one document'
            });
            return;
        }

        const toastId = toast.loading('Processing documents...', { id: 'doc-upload-update' });

        try {
            // Process documents - convert to base64 if file exists
            const processedDocuments = await Promise.all(
                documentList.map(async (doc: any) => {
                    const documentName = doc.documentName || doc.name || '';
                    const documentDescription = doc.description || doc.documentDescription || '';

                    let blobBase64 = '';
                    let fileName = '';

                    const fileObj = doc.document?.[0] || doc.file || null;
                    if (fileObj instanceof File) {
                        blobBase64 = await fileToBase64(fileObj);
                        fileName = fileObj.name;
                    } else {
                        // Fallback for existing documents
                        blobBase64 = doc.blobBase64 || '';
                        fileName = doc.fileName || doc.documentImageName || doc.imageName || '';
                    }

                    return {
                        hrmedS_Id: doc.hrmedS_Id || 0,
                        hrmE_Id: savedEmployeeId,
                        mI_Id: 30, // Default Institution ID
                        MI_Id: 30,
                        hrmedS_DocumentName: documentName,
                        hrmedS_DocumentImageName: fileName,
                        hrmedS_DucumentDescription: documentDescription,
                        blobBase64: blobBase64,
                        fileName: fileName
                    };
                })
            );

            console.log('🔍 [API DEBUG] Tab 5 (Document) - Array Payload:', JSON.stringify(processedDocuments, null, 2));

            // Use mutateAsync to await completion
            await saveDocumentDetailsAsync(processedDocuments, {
                onSuccess: (response: any) => {
                    console.log('✅ [API DEBUG] Tab 5 (Document) - Save Success Response:', response);
                    if (response?.success) {
                        // Toast handled by hook or generic success toast
                        // If hook handles it commit message, we don't need to duplicate success toast here unless logic demands
                        // But we MUST dismiss the loading toast.
                        toast.dismiss(toastId);
                        if (currentStep === 5) {
                            setCurrentStep(6);
                        }
                    } else {
                        console.error('❌ [API DEBUG] Tab 5 (Document) - API returned success: false', response);
                        toast.error(response?.message || 'Failed to save document details', { id: toastId });
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [API DEBUG] Tab 5 (Document) - API Error:', error);
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save document details';
                    toast.error(errorMessage, { id: toastId });
                }
            });
        } catch (error: any) {
            console.error('❌ [DEBUG] Tab 5 - Document processing error:', error);
            toast.error('An error occurred while processing documents', { id: toastId });
        }
    };

    // Function to go to specific step
    const _goToStep = (step: number) => {
        setCurrentStep(step);
    };

    // Refs to track initialization per tab
    const _hasInitializedTab1 = useRef(false);
    const _hasInitializedTab2 = useRef(false);
    const _hasInitializedTab3 = useRef(false);
    const _hasInitializedTab4 = useRef(false);
    const _hasInitializedTab5 = useRef(false);
    const _hasInitializedTab6 = useRef(false);
    const _hasInitializedTab7 = useRef(false);

    // Track originally loaded IDs to identify deleted items
    const _originalQualificationIds = useRef<number[]>([]);
    const _originalExperienceIds = useRef<number[]>([]);
    const _hasInitializedTab8 = useRef(false);
    const lastResetEmployeeId = useRef<number | null>(null);
    const hasRehydratedStep = useRef<Record<number, boolean>>({});
    // Track if we have applied the full detailed data (to override onload data)
    const hasAppliedDetailedData = useRef(false);

    // Watch for country changes
    const contactCountry = useWatch({ control, name: 'contactCountry' });
    const permanentCountry = useWatch({ control, name: 'permanentCountry' });
    const dateOfBirth = useWatch({ control, name: 'dateOfBirth' });
    const sameAsCommunicationAddress = useWatch({
        control,
        name: 'sameAsCommunicationAddress'
    });
    const contactAddress = useWatch({ control, name: 'contactAddress' });
    const contactArea = useWatch({ control, name: 'contactArea' });
    const contactState = useWatch({ control, name: 'contactState' });
    const contactCity = useWatch({ control, name: 'contactCity' });
    const contactPincode = useWatch({ control, name: 'contactPincode' });
    const _permanentState = useWatch({ control, name: 'permanentState' });

    // Convert country string to number for API call
    const contactCountryId = contactCountry ? Number(contactCountry) : null;
    const permanentCountryId = permanentCountry ? Number(permanentCountry) : null;

    // Fetch states for contact country
    const { data: contactStates = [], isLoading: isLoadingContactStates } = useStateDropdown(contactCountryId);
    // Fetch states for permanent country
    const { data: permanentStates = [], isLoading: isLoadingPermanentStates } = useStateDropdown(permanentCountryId);

    // Use fetched states if country is selected, otherwise fall back to empty array
    const availableContactStates: IStateDropdown[] = contactCountryId ? (Array.isArray(contactStates) ? contactStates : []) : [];

    // If syncing from communication address, use contact states immediately to avoid race conditions
    // where permanent states are still loading when the sync happens
    const availablePermanentStates: IStateDropdown[] = sameAsCommunicationAddress
        ? availableContactStates
        : permanentCountryId
            ? Array.isArray(permanentStates)
                ? permanentStates
                : []
            : [];

    // Copy communication address to permanent address when checkbox is checked
    const prevSameAsAddress = useRef(sameAsCommunicationAddress);
    const prevContactValues = useRef({
        contactAddress,
        contactArea,
        contactCity,
        contactState,
        contactPincode,
        contactCountry
    });

    // Sync communication address to permanent address when "Same As Communication Address" is checked
    useEffect(() => {
        if (sameAsCommunicationAddress) {
            console.log('🔄 [DEBUG] Update Form - Syncing address fields:', {
                contactAddress,
                contactArea,
                contactCity,
                contactState,
                contactPincode,
                contactCountry
            });

            // Update permanent address fields with communication address values
            setValue('permanentAddress', contactAddress || '', { shouldValidate: true, shouldDirty: true });
            setValue('permanentArea', contactArea || '', { shouldValidate: true, shouldDirty: true });
            setValue('permanentCity', contactCity || '', { shouldValidate: true, shouldDirty: true });
            setValue('permanentPincode', contactPincode || '', { shouldValidate: true, shouldDirty: true });
            setValue('permanentCountry', contactCountry || '', { shouldValidate: true, shouldDirty: true });

            // Set state with a tiny timeout to ensure the country change and options sharing
            // has propagated through the form state
            setTimeout(() => {
                setValue('permanentState', contactState || '', { shouldValidate: true, shouldDirty: true });
            }, 0);

            // Update ref for change tracking if needed
            prevContactValues.current = {
                contactAddress,
                contactArea,
                contactCity,
                contactState,
                contactPincode,
                contactCountry
            };
        }
    }, [sameAsCommunicationAddress, contactAddress, contactArea, contactCity, contactState, contactPincode, contactCountry, setValue]);

    // Memoize bank options specifically to prevent Select recreation
    const memoizedBankOptions = useMemo(() => {
        if (!options?.banks) return [];
        return (options.banks || [])
            .filter((b: IBankDropdown) => {
                return b.key != null && b.key !== undefined && b.key !== 0;
            })
            .map((b: IBankDropdown) => {
                const key = b.key?.toString().trim();
                if (!key || key === '') return null;
                return {
                    id: key,
                    name: b.value || String(b.key),
                    value: key
                };
            })
            .filter(Boolean);
    }, [options?.banks]);

    // Watch documentList for file handling
    const watchDocuments = watch('documentList');
    // Watch for OtherDetailsTab conditional fields
    const stopPension = useWatch({ control, name: 'stopPension' });
    const employeeLeft = useWatch({ control, name: 'employeeLeft' });

    // Helper function to calculate years and months between two dates
    const calculateYearsAndMonths = (startDate: string | Date, endDate: string | Date) => {
        const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
        const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
            return { years: 0, months: 0 };
        }
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        if (end.getDate() < start.getDate()) {
            months--;
            if (months < 0) {
                years--;
                months += 12;
            }
        }
        return { years: Math.max(0, years), months: Math.max(0, months) };
    };

    // Field arrays
    const {
        fields: mobileFields,
        append: appendMobile,
        remove: removeMobile,
        replace: replaceMobile
    } = useFieldArray({
        control,
        name: 'mobileDetails'
    });

    const {
        fields: emailFields,
        append: appendEmail,
        remove: removeEmail,
        replace: replaceEmail
    } = useFieldArray({
        control,
        name: 'emailDetails'
    });

    const {
        fields: bankFields,
        append: appendBank,
        remove: removeBank,
        replace: replaceBank
    } = useFieldArray({
        control,
        name: 'bankDetails'
    });

    const {
        fields: qualificationFields,
        append: appendQualification,
        remove: removeQualification,
        replace: replaceQualification
    } = useFieldArray({
        control,
        name: 'qualificationDetails'
    });

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
        replace: replaceExperience
    } = useFieldArray({
        control,
        name: 'experienceDetails'
    });

    const {
        fields: documentFields,
        append: appendDocument,
        remove: removeDocument,
        replace: replaceDocument
    } = useFieldArray({
        control,
        name: 'documentList'
    });

    // Map form data to API format - use helper functions
    // Map form data to API format - use helper functions

    // Custom submit handler - same as add-form

    // Effect to populate form when employeeData is loaded
    // Fetch specific employee details using the ID-based endpoint (likely has better data)
    const { data: employeeDetailsData, isLoading: isLoadingDetails } = useEmployeeById(selectedRow?.hrmE_Id || null);

    // Effect to populate form when employeeData is loaded
    useEffect(() => {
        // PRIORITIZE employeeDetailsData (from GetEmployeeDetailsById) over onloadData
        // But we still need onloadData for everything else to be ready?
        // Actually, let's try to map WHICHEVER is available and has data.

        const sourceData = employeeDetailsData || onloadData;

        if (sourceData) {
            const currentSelectedId = selectedRow?.hrmE_Id || 0;

            // Only proceed if we haven't successfully initialized for this ID yet
            // OR if we are switching sources (e.g. details arrived after onload)
            // Fix: Wait for detailed data if available, or if checking against same ID but we haven't applied detailed data yet
            const needsInitialization = lastResetEmployeeId.current !== currentSelectedId;
            const canApplyDetailedData = employeeDetailsData && !hasAppliedDetailedData.current;

            if (needsInitialization || canApplyDetailedData) {
                console.log(`🔍 [UPDATE-FORM DEBUG] Attempting to map data for ID: ${currentSelectedId}`);
                console.log('🔍 [UPDATE-FORM DEBUG] Source:', employeeDetailsData ? 'GetEmployeeDetailsById' : 'OnloadData');
                console.log('🔍 [UPDATE-FORM DEBUG] Initialization Reason:', needsInitialization ? 'New ID' : 'Detailed Data Arrived');

                if (employeeDetailsData) {
                    console.log('🔍 [UPDATE-FORM DEBUG] Detailed Data Keys:', Object.keys(employeeDetailsData));
                    if ((employeeDetailsData as any).data)
                        console.log('🔍 [UPDATE-FORM DEBUG] Detailed Data.data Keys:', Object.keys((employeeDetailsData as any).data));
                }
                if (onloadData) console.log('🔍 [UPDATE-FORM DEBUG] Onload Data Keys:', Object.keys(onloadData));

                try {
                    const formData = mapApiResponseToFormFields(sourceData, currentSelectedId);

                    // VALIDATION: Ensure we actually found the employee data
                    const hasData = (formData as any).firstName || (formData as any).employeeCode || (formData as any).hrmE_Id;

                    if (hasData || currentSelectedId === 0) {
                        console.log('✅ [UPDATE-FORM DEBUG] Mapped Data found, performing binding:', formData);

                        // Mark as initialized
                        setIsFormInitialized(true);
                        lastResetEmployeeId.current = currentSelectedId;

                        if (employeeDetailsData) {
                            hasAppliedDetailedData.current = true;
                        }

                        console.log('🔍 [UPDATE-FORM DEBUG] Raw Source Data:', sourceData);
                        console.log('🔍 [UPDATE-FORM DEBUG] Mapped formData:', formData);
                        console.log('🔍 [UPDATE-FORM DEBUG] Qualification Details in formData:', (formData as any).qualificationDetails);
                        console.log('🔍 [UPDATE-FORM DEBUG] Qualification Details LENGTH:', (formData as any).qualificationDetails?.length);
                        console.log('🔍 [UPDATE-FORM DEBUG] Experience Details in formData:', (formData as any).experienceDetails);

                        // Fix for Photo binding - explicitly set the state
                        if ((formData as any).photo) {
                            console.log('✅ [UPDATE-FORM DEBUG] Found photo in mapped data:', (formData as any).photo);
                            setSelectedPhoto((formData as any).photo);
                        } else {
                            console.warn('⚠️ [UPDATE-FORM DEBUG] No photo found in mapped formData');
                        }

                        // Bind all fields manually to ensure arrays are populated correctly
                        Object.entries(formData).forEach(([key, value]) => {
                            if (
                                [
                                    'mobileDetails',
                                    'emailDetails',
                                    'bankDetails',
                                    'qualificationDetails',
                                    'experienceDetails',
                                    'documentList'
                                ].includes(key)
                            ) {
                                // Arrays - use replace directly
                                const arrVal = Array.isArray(value) ? value : [];
                                if (key === 'mobileDetails') replaceMobile(arrVal as any);
                                if (key === 'emailDetails') replaceEmail(arrVal as any);
                                if (key === 'bankDetails') replaceBank(arrVal as any);
                                if (key === 'qualificationDetails') {
                                    console.log('🔄 [UPDATE-FORM] Replacing qualificationDetails with:', arrVal);
                                    replaceQualification(arrVal as any);
                                }
                                if (key === 'experienceDetails') replaceExperience(arrVal as any);
                                if (key === 'documentList') replaceDocument(arrVal as any);
                            } else {
                                // Scalar values - use setValue
                                if (value !== undefined) {
                                    setValue(key as any, value);
                                }
                            }
                        });
                    } else {
                        console.warn('⚠️ [UPDATE-FORM DEBUG] Mapped data appears empty, waiting for more data...');
                    }
                } catch (err) {
                    console.error('❌ [UPDATE-FORM DEBUG] Error mapping data:', err);
                }
            }
        }
    }, [
        onloadData,
        employeeDetailsData,
        selectedRow?.hrmE_Id,
        setValue,
        replaceMobile,
        replaceEmail,
        replaceBank,
        replaceQualification,
        replaceExperience,
        replaceDocument
    ]);

    // SAFETY: Re-hydrate arrays when switching tabs if they appear empty but data exists
    useEffect(() => {
        if (!isFormInitialized) return;

        // Logic to force re-hydration if length matches but first item is empty
        const rehydrateIfEmpty = (fieldName: any, currentFields: any[], replaceFn: any, contentKey?: string) => {
            const currentVals = getValues(fieldName);
            if (!currentVals || currentVals.length === 0) return;

            // Check if fields are empty or if first item is basically empty
            const needsSync =
                !currentFields ||
                currentFields.length === 0 ||
                (contentKey && currentFields.length > 0 && !currentFields[0][contentKey] && currentVals[0][contentKey]);

            if (needsSync) {
                console.log(`🔄 [TAB-SWITCH] Re-hydrating ${fieldName} fields...`);
                replaceFn(currentVals);
            }
        };

        // Step 1: Employee Info (Mobile/Email)
        if (currentStep === 1) {
            rehydrateIfEmpty('mobileDetails', mobileFields, replaceMobile, 'mobileNo');
            rehydrateIfEmpty('emailDetails', emailFields, replaceEmail, 'emailId');
        }

        // Step 2: Bank Details (Personal)
        if (currentStep === 2) {
            rehydrateIfEmpty('bankDetails', bankFields, replaceBank, 'bankAccountNo');
        }

        // Step 3: Qualification
        if (currentStep === 3) {
            rehydrateIfEmpty('qualificationDetails', qualificationFields, replaceQualification, 'qualification');
        }

        // Step 4: Experience
        if (currentStep === 4) {
            rehydrateIfEmpty('experienceDetails', experienceFields, replaceExperience, 'organisationName');
        }

        // Step 5: Document Upload
        if (currentStep === 5) {
            rehydrateIfEmpty('documentList', documentFields, replaceDocument, 'documentName');
        }
    }, [
        currentStep,
        isFormInitialized,
        mobileFields,
        emailFields,
        bankFields,
        qualificationFields,
        experienceFields,
        documentFields,
        getValues,
        replaceMobile,
        replaceEmail,
        replaceBank,
        replaceQualification,
        replaceExperience,
        replaceDocument
    ]);

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Prevent duplicate submissions
        if (isSavingQualification || isSavingExperience || isSubmittingAny) {
            console.warn('⚠️ [DEBUG] onFormSubmit - Already saving, ignoring duplicate call');
            return;
        }

        const currentStepId = currentStep;

        // If we are not on the last step, delegate to nextStep
        if (currentStepId < steps.length) {
            await nextStep();
            return;
        }

        const currentTabKey = getCurrentTabKey();
        const currentTabFields = tabFieldMap[currentTabKey] || [];

        if (currentTabFields.length > 0) {
            const isValid = await trigger(currentTabFields as any);
            if (!isValid) {
                const formErrors = formState.errors;
                const errorMessages: string[] = [];
                currentTabFields.forEach((field) => {
                    const fieldError = (formErrors as any)[field];
                    if (fieldError) {
                        const msg = typeof fieldError === 'string' ? fieldError : fieldError?.message;
                        if (msg) errorMessages.push(msg);
                    }
                });
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0]);
                }
                return;
            }
        }

        try {
            if (currentStepId === 8) {
                // Payroll tab - handled by PayrollTab component
                toast.success('Employee update completed successfully!');
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during update');
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedPhoto(base64String);
                setValue('employeePhoto', base64String, { shouldValidate: true, shouldDirty: true });
                // Explicitly trigger validation to clear any "required" error
                trigger('employeePhoto');
            };
            reader.readAsDataURL(file);
        }
    };

    // Show loading for dropdowns or employee details
    if (
        isLoadingGrades ||
        isLoadingGroupTypes ||
        isLoadingEmployeeTypes ||
        isLoadingInstitutions ||
        isLoadingDepartments ||
        isLoadingDesignations ||
        isLoadingGenders ||
        isLoadingMaritalStatuses ||
        isLoadingReligions ||
        isLoadingCasteCategories ||
        isLoadingCastes ||
        isLoadingPaymentModes ||
        isLoadingBanks ||
        isLoadingCountries ||
        isLoadingSpecializations ||
        isLoadingLeaveReasons ||
        isLoadingBloodGroups ||
        isLoadingSalaryTypes ||
        isLoadingTeachingTypes ||
        isLoadingScoreTypes ||
        isLoadingContactTypes ||
        isLoadingEmployee
    ) {
        return (
            <div className='flex items-center justify-center p-8'>
                <div className='text-muted-foreground'>Loading form data...</div>
            </div>
        );
    }

    // Form UI - standalone update form (old API mapping removed, using empty defaults until endpoints are provided)
    return (
        <div className={cn('mx-auto w-full max-w-7xl px-4 py-2', className)}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // Only handle form submit for the last step, otherwise let nextStep handle it
                    if (currentStep === steps.length) {
                        onFormSubmit(e);
                    }
                }}
                className='space-y-6'>
                {/* Main Layout: Vertical Stepper + Form */}
                <div className='flex flex-col gap-6 lg:flex-row'>
                    {/* Stepper - Vertical on desktop, horizontal on mobile */}
                    <div className='lg:w-50 lg:flex-shrink-0'>
                        {/* Mobile: Horizontal Stepper */}
                        <div className='block overflow-x-auto lg:hidden'>
                            <div className='flex min-w-max items-center justify-between px-4'>
                                {steps.map((step, index) => {
                                    const IconComponent = getIconByName(step.icon);
                                    const isDisabled = step.tabKey === 'payroll' && !savedEmployeeId;
                                    return (
                                        <div key={step.id} className='flex flex-1 items-center'>
                                            <div className='flex flex-col items-center'>
                                                <Button
                                                    type='button'
                                                    disabled={isSubmittingAny || isDisabled}
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
                                    const isDisabled = step.tabKey === 'payroll' && !savedEmployeeId;
                                    return (
                                        <div key={step.id} className='flex items-start'>
                                            <div className='flex flex-col items-center'>
                                                <button
                                                    type='button'
                                                    disabled={isSubmittingAny || isDisabled}
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
                                {/* Step 1: Employee Information */}
                                {currentStep === 1 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Employee Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please provide the employee&apos;s basic information
                                            </p>
                                        </div>
                                        <div className='space-y-6'>
                                            {/* Main Form Fields in Two Columns */}
                                            <div className='grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-6'>
                                                {/* Left Column */}
                                                <div className='space-y-4'>
                                                    <InputText
                                                        label='First Name'
                                                        required
                                                        id='firstName'
                                                        maxLength={50}
                                                        onKeyDown={(e) => {
                                                            const allowedKeys = /^[a-zA-Z\s\-']$/;
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).value.endsWith(' ')) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).selectionStart === 0) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!allowedKeys.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('firstName', {
                                                            required: 'First Name is required'
                                                        })}
                                                        error={errors.firstName?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='Middle Name'
                                                        id='middleName'
                                                        maxLength={50}
                                                        onKeyDown={(e) => {
                                                            const allowedKeys = /^[a-zA-Z\s\-']$/;
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).value.endsWith(' ')) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).selectionStart === 0) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!allowedKeys.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('middleName')}
                                                        error={errors.middleName?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='Last Name'
                                                        id='lastName'
                                                        maxLength={50}
                                                        onKeyDown={(e) => {
                                                            const allowedKeys = /^[a-zA-Z\s\-']$/;
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).value.endsWith(' ')) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).selectionStart === 0) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!allowedKeys.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('lastName')}
                                                        error={errors.lastName?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='Employee Code'
                                                        required
                                                        id='employeeCode'
                                                        maxLength={20}
                                                        {...register('employeeCode', {
                                                            required: 'Employee code is required'
                                                        })}
                                                        error={errors.employeeCode?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label="Father's Name *"
                                                        id='fatherName'
                                                        maxLength={50}
                                                        onKeyDown={(e) => {
                                                            const allowedKeys = /^[a-zA-Z\s\-']$/;
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).value.endsWith(' ')) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).selectionStart === 0) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!allowedKeys.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('fatherName')}
                                                        error={errors.fatherName?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label="Mother's Name *"
                                                        id='motherName'
                                                        maxLength={50}
                                                        onKeyDown={(e) => {
                                                            const allowedKeys = /^[a-zA-Z\s\-']$/;
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).value.endsWith(' ')) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === ' ' && (e.target as HTMLInputElement).selectionStart === 0) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!allowedKeys.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('motherName')}
                                                        error={errors.motherName?.message as string | undefined}
                                                    />
                                                    <Controller
                                                        name='typeOfEmployment'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.empTypes || []).filter(
                                                                (it: IEmployeeTypeDropdown) =>
                                                                    it.key != null && it.key !== undefined && it.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Type of Employment <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`typeOfEmployment-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {(options?.empTypes || [])
                                                                                .filter((it: IEmployeeTypeDropdown) => {
                                                                                    return (
                                                                                        it.key != null &&
                                                                                        it.key !== undefined &&
                                                                                        it.key !== 0
                                                                                    );
                                                                                })
                                                                                .map((item: any) => {
                                                                                    const val = getSafeValue(item.key);
                                                                                    if (!val) return null;
                                                                                    return (
                                                                                        <SelectItem key={item.key} value={val}>
                                                                                            {item.value || String(item.key)}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })
                                                                                .filter(Boolean)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='employeeGroup'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.groupTypes || []).filter(
                                                                (gt: IGroupTypeDropdown) =>
                                                                    gt.key != null && gt.key !== undefined && gt.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Employee Group <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`employeeGroup-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {(options?.groupTypes || [])
                                                                                .filter((gt: IGroupTypeDropdown) => {
                                                                                    return (
                                                                                        gt.key != null &&
                                                                                        gt.key !== undefined &&
                                                                                        gt.key !== 0
                                                                                    );
                                                                                })
                                                                                .map((gt: IGroupTypeDropdown) => {
                                                                                    const val = getSafeValue(gt.key);
                                                                                    if (!val) return null;
                                                                                    return (
                                                                                        <SelectItem key={gt.key} value={val}>
                                                                                            {gt.value || String(gt.key)}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })
                                                                                .filter(Boolean)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='department'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.departments || []).filter((dept: any) => {
                                                                return dept.key != null && dept.key !== undefined && dept.key !== 0;
                                                            });
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Department <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`department-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {dropdownLoadingStates.departments ? (
                                                                                <SelectItem value='__loading__' disabled>
                                                                                    Loading departments...
                                                                                </SelectItem>
                                                                            ) : (options?.departments || []).length === 0 ? (
                                                                                <SelectItem value='__no_options__' disabled>
                                                                                    No options available
                                                                                </SelectItem>
                                                                            ) : (
                                                                                (options?.departments || [])
                                                                                    .filter((dept: any) => {
                                                                                        return (
                                                                                            dept.key != null &&
                                                                                            dept.key !== undefined &&
                                                                                            dept.key !== 0
                                                                                        );
                                                                                    })
                                                                                    .map((dept: IDepartmentDropdown) => {
                                                                                        const val = getSafeValue(dept.key);
                                                                                        if (!val) return null;
                                                                                        return (
                                                                                            <SelectItem key={dept.key} value={val}>
                                                                                                {dept.value || String(dept.key)}
                                                                                            </SelectItem>
                                                                                        );
                                                                                    })
                                                                                    .filter(Boolean)
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='designation'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            // DEBUG: Log designation dropdown binding
                                                            const availableOptions = (options?.designations || []).filter(
                                                                (dg: IDesignationDropdown) => {
                                                                    return dg.key != null && dg.key !== undefined && dg.key !== 0;
                                                                }
                                                            );

                                                            // Normalize both values for comparison
                                                            const fieldValueNormalized = field.value?.toString().trim();

                                                            const matchingOption = availableOptions.find((dg: IDesignationDropdown) => {
                                                                const keyNormalized = dg.key?.toString().trim();
                                                                return keyNormalized === fieldValueNormalized;
                                                            });

                                                            // DEBUG: Always log when there's a value (first time only)
                                                            if (field.value && availableOptions.length > 0) {
                                                                const hasMatch = !!matchingOption;
                                                                console.log(
                                                                    `🔍 [DEBUG] Designation Dropdown - Field Value: "${fieldValueNormalized}" (${typeof field.value}), Match Found: ${hasMatch}`,
                                                                    {
                                                                        fieldValue: field.value,
                                                                        fieldValueNormalized: fieldValueNormalized,
                                                                        fieldValueType: typeof field.value,
                                                                        matchingOption: matchingOption
                                                                            ? {
                                                                                key: matchingOption.key,
                                                                                value: matchingOption.value
                                                                            }
                                                                            : null,
                                                                        sampleKeys: availableOptions.slice(0, 3).map((dg) => ({
                                                                            key: dg.key,
                                                                            keyNormalized: dg.key?.toString().trim(),
                                                                            keyType: typeof dg.key,
                                                                            value: dg.value
                                                                        })),
                                                                        totalOptions: availableOptions.length
                                                                    }
                                                                );
                                                            }

                                                            // If no match found, log warning
                                                            if (field.value && !matchingOption && availableOptions.length > 0) {
                                                                console.warn('⚠️ [DEBUG] Designation Dropdown - NO MATCH FOUND:', {
                                                                    fieldValue: field.value,
                                                                    fieldValueNormalized: fieldValueNormalized,
                                                                    allAvailableKeys: availableOptions.map((dg) =>
                                                                        dg.key?.toString().trim()
                                                                    )
                                                                });
                                                            }

                                                            // Ensure value is set as string and matches dropdown format
                                                            const selectValue = field.value ? String(field.value).trim() : '';

                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Designation <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`designation-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions
                                                                                .map((dg: IDesignationDropdown) => {
                                                                                    const val = getSafeValue(dg.key);
                                                                                    if (!val) return null;
                                                                                    return (
                                                                                        <SelectItem key={dg.key} value={val}>
                                                                                            {dg.value || String(dg.key)}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })
                                                                                .filter(Boolean)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <InputText
                                                        label='Subject Taught'
                                                        id='subjectTaught'
                                                        maxLength={50}
                                                        placeholder='Enter subject taught'
                                                        {...register('subjectTaught')}
                                                        error={errors.subjectTaught?.message as string | undefined}
                                                    />
                                                    <Controller
                                                        name='grade'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.grades || []).filter(
                                                                (gr: IGradeDropdown) => {
                                                                    return gr.key != null && gr.key !== undefined && gr.key !== 0;
                                                                }
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Grade <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`grade-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {(options?.grades || [])
                                                                                .filter((gr: IGradeDropdown) => {
                                                                                    return (
                                                                                        gr.key != null &&
                                                                                        gr.key !== undefined &&
                                                                                        gr.key !== 0
                                                                                    );
                                                                                })
                                                                                .map((gr: IGradeDropdown) => {
                                                                                    const val = getSafeValue(gr.key);
                                                                                    if (!val) return null;
                                                                                    return (
                                                                                        <SelectItem key={gr.key} value={val}>
                                                                                            {gr.value || String(gr.key)}
                                                                                        </SelectItem>
                                                                                    );
                                                                                })
                                                                                .filter(Boolean)}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='dateOfJoining'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <DateField
                                                                field={field}
                                                                fieldState={fieldState}
                                                                label='Date Of Joining'
                                                                placeholder='Pick date of joining'
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name='dateOfConfirmation'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <DateField
                                                                field={field}
                                                                fieldState={fieldState}
                                                                label='Date Of Confirmation'
                                                                placeholder='Pick date of confirmation'
                                                            />
                                                        )}
                                                    />
                                                    <div className='space-y-3'>
                                                        <Controller
                                                            name='epf'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div className='flex items-center space-x-2'>
                                                                    <Checkbox
                                                                        id='epf'
                                                                        checked={!!field.value}
                                                                        onCheckedChange={(v) => field.onChange(!!v)}
                                                                    />
                                                                    <Label htmlFor='epf'>EPF</Label>
                                                                </div>
                                                            )}
                                                        />
                                                        <Controller
                                                            name='ppf'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div className='flex items-center space-x-2'>
                                                                    <Checkbox
                                                                        id='ppf'
                                                                        checked={!!field.value}
                                                                        onCheckedChange={(v) => field.onChange(!!v)}
                                                                    />
                                                                    <Label htmlFor='ppf'>PPF</Label>
                                                                </div>
                                                            )}
                                                        />
                                                        <Controller
                                                            name='phdResearchGuide'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div className='flex items-center space-x-2'>
                                                                    <Checkbox
                                                                        id='phdResearchGuide'
                                                                        checked={!!field.value}
                                                                        onCheckedChange={(v) => field.onChange(!!v)}
                                                                    />
                                                                    <Label htmlFor='phdResearchGuide'>PHD Research Guide ?</Label>
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    {watch?.('phdResearchGuide') ? (
                                                        <InputText
                                                            label='Recognition Year'
                                                            id='recognitionYear'
                                                            maxLength={4}
                                                            onKeyDown={(e) => {
                                                                const controlKeys = [
                                                                    'Backspace',
                                                                    'Delete',
                                                                    'Tab',
                                                                    'Escape',
                                                                    'Enter',
                                                                    'ArrowLeft',
                                                                    'ArrowRight',
                                                                    'ArrowUp',
                                                                    'ArrowDown'
                                                                ];
                                                                if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                    return;
                                                                }
                                                                if (e.key === ' ') {
                                                                    e.preventDefault();
                                                                    return;
                                                                }
                                                                if (!/^[0-9]$/.test(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            {...register('recognitionYear')}
                                                            error={errors.recognitionYear?.message as string | undefined}
                                                        />
                                                    ) : null}
                                                    <Controller
                                                        name='teachingNonTeaching'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            // Normalize value for string-based dropdown
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.teachingNonTeaching || []).filter(
                                                                (tt: ITeachingTypeDropdown) =>
                                                                    tt.key != null && tt.key !== '' && String(tt.key).trim() !== ''
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Teaching/NonTeaching <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`teachingNonTeaching-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((tt: ITeachingTypeDropdown) => {
                                                                                const val = tt.key?.toString().trim();
                                                                                if (!val || val === '') return null;
                                                                                return (
                                                                                    <SelectItem key={tt.key} value={val}>
                                                                                        {tt.value || String(tt.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='pfApplicable'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div className='flex items-center space-x-2'>
                                                                <Checkbox
                                                                    id='pfApplicable'
                                                                    checked={!!field.value}
                                                                    onCheckedChange={(v) => field.onChange(!!v)}
                                                                />
                                                                <Label htmlFor='pfApplicable'>PF Applicable?</Label>
                                                            </div>
                                                        )}
                                                    />
                                                    {watch?.('pfApplicable') ? (
                                                        <div className='space-y-4 border-blue-500 border-l-4 pl-4'>
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='pfMaxAmount'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <div className='flex items-center space-x-2'>
                                                                            <Checkbox
                                                                                id='pfMaxAmount'
                                                                                checked={!!field.value}
                                                                                onCheckedChange={(checked) => {
                                                                                    field.onChange(!!checked);
                                                                                    if (checked) {
                                                                                        setValue('pfFixedAmount', false, {
                                                                                            shouldValidate: false,
                                                                                            shouldDirty: false
                                                                                        });
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Label htmlFor='pfMaxAmount'>PF Max Amount</Label>
                                                                        </div>
                                                                    )}
                                                                />
                                                                <Controller
                                                                    name='pfFixedAmount'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <div className='flex items-center space-x-2'>
                                                                            <Checkbox
                                                                                id='pfFixedAmount'
                                                                                checked={!!field.value}
                                                                                onCheckedChange={(checked) => {
                                                                                    field.onChange(!!checked);
                                                                                    if (checked) {
                                                                                        setValue('pfMaxAmount', false, {
                                                                                            shouldValidate: false,
                                                                                            shouldDirty: false
                                                                                        });
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Label htmlFor='pfFixedAmount'>PF Fixed Amount</Label>
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                            <InputText
                                                                label='PF Acc No.'
                                                                id='pfAccNo'
                                                                maxLength={22}
                                                                {...register('pfAccNo')}
                                                                error={errors.pfAccNo?.message as string | undefined}
                                                            />
                                                            <InputText
                                                                label='UAN Number'
                                                                id='uanNumber'
                                                                maxLength={12}
                                                                {...register('uanNumber')}
                                                                error={errors.uanNumber?.message as string | undefined}
                                                            />
                                                            <Controller
                                                                name='pfDate'
                                                                control={control}
                                                                render={({ field, fieldState }) => (
                                                                    <DateField
                                                                        field={field}
                                                                        fieldState={fieldState}
                                                                        label='PF Date'
                                                                        placeholder='Pick PF date'
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    ) : null}
                                                    <Controller
                                                        name='esiApplicable'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div className='flex items-center space-x-2'>
                                                                <Checkbox
                                                                    id='esiApplicable'
                                                                    checked={!!field.value}
                                                                    onCheckedChange={(v) => field.onChange(!!v)}
                                                                />
                                                                <Label htmlFor='esiApplicable'>ESI Applicable?</Label>
                                                            </div>
                                                        )}
                                                    />
                                                    {watch?.('esiApplicable') ? (
                                                        <div className='space-y-4 border-green-500 border-l-4 pl-4'>
                                                            <InputText
                                                                label='ESI Acc No.'
                                                                id='esiAccNo'
                                                                maxLength={10}
                                                                onKeyDown={(e) => {
                                                                    const controlKeys = [
                                                                        'Backspace',
                                                                        'Delete',
                                                                        'Tab',
                                                                        'Escape',
                                                                        'Enter',
                                                                        'ArrowLeft',
                                                                        'ArrowRight',
                                                                        'ArrowUp',
                                                                        'ArrowDown'
                                                                    ];
                                                                    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                        return;
                                                                    }
                                                                    if (e.key === ' ') {
                                                                        e.preventDefault();
                                                                        return;
                                                                    }
                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                {...register('esiAccNo')}
                                                                error={errors.esiAccNo?.message as string | undefined}
                                                            />
                                                            <InputText
                                                                label='Gratuity Acc No.'
                                                                id='gratuityAccNo'
                                                                maxLength={25}
                                                                {...register('gratuityAccNo')}
                                                                error={errors.gratuityAccNo?.message as string | undefined}
                                                            />
                                                            <Controller
                                                                name='esiDate'
                                                                control={control}
                                                                render={({ field, fieldState }) => (
                                                                    <DateField
                                                                        field={field}
                                                                        fieldState={fieldState}
                                                                        label='ESI Date'
                                                                        placeholder='Pick ESI date'
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    ) : null}
                                                    <InputText
                                                        label='National SSN'
                                                        id='nationalSSN'
                                                        maxLength={9}
                                                        onKeyDown={(e) => {
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ') {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!/^[0-9]$/.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('nationalSSN')}
                                                        error={errors.nationalSSN?.message as string | undefined}
                                                    />
                                                </div>
                                                {/* Right Column */}
                                                <div className='space-y-4'>
                                                    <Controller
                                                        name='religion'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.religions || []).filter(
                                                                (rel: IReligionDropdown) =>
                                                                    rel.key != null && rel.key !== undefined && rel.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Religion <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`religion-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((rel: IReligionDropdown) => {
                                                                                const val = getSafeValue(rel.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={rel.key} value={val}>
                                                                                        {rel.value || String(rel.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='casteCategory'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.casteCategories || []).filter(
                                                                (cc: ICasteCategoryDropdown) =>
                                                                    cc.key != null && cc.key !== undefined && cc.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Caste Category <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`casteCategory-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((cc: ICasteCategoryDropdown) => {
                                                                                const val = getSafeValue(cc.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={cc.key} value={val}>
                                                                                        {cc.value || String(cc.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='caste'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.castes || []).filter(
                                                                (c: ICasteDropdown) => c.key != null && c.key !== undefined && c.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Caste <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`caste-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='Select Caste' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((c: ICasteDropdown) => {
                                                                                const val = getSafeValue(c.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={c.key} value={val}>
                                                                                        {c.value || String(c.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='dateOfBirth'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <DateField
                                                                field={field}
                                                                fieldState={fieldState}
                                                                label='Date Of Birth'
                                                                placeholder='Pick date of birth'
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name='dateOfRetirement'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='mt-5 flex flex-col gap-1.5'>
                                                                <Label htmlFor={field.name}>
                                                                    Date Of Retirement
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <div className='flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-muted-foreground text-sm'>
                                                                    {field.value
                                                                        ? (() => {
                                                                            try {
                                                                                const date = new Date(field.value);
                                                                                return date.toLocaleDateString('en-GB', {
                                                                                    day: '2-digit',
                                                                                    month: '2-digit',
                                                                                    year: 'numeric'
                                                                                });
                                                                            } catch {
                                                                                return field.value;
                                                                            }
                                                                        })()
                                                                        : 'Pick date of retirement'}
                                                                </div>
                                                                {fieldState?.error && (
                                                                    <div className='text-destructive text-sm'>
                                                                        {fieldState.error.message}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    />
                                                    <Controller
                                                        name='gender'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.genders || []).filter(
                                                                (g: IGenderDropdown) => g.key != null && g.key !== undefined && g.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Gender <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`gender-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((g: IGenderDropdown) => {
                                                                                const val = getSafeValue(g.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={g.key} value={val}>
                                                                                        {g.value || String(g.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='maritalStatus'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.maritalStatuses || []).filter(
                                                                (ms: IMaritalStatusDropdown) =>
                                                                    ms.key != null && ms.key !== undefined && ms.key !== 0
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Marital Status <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`maritalStatus-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((ms: IMaritalStatusDropdown) => {
                                                                                const val = getSafeValue(ms.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={ms.key} value={val}>
                                                                                        {ms.value || String(ms.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    {/* Multiple Mobile Numbers */}
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label>
                                                            Mobile No. <span className='text-red-500'>*</span>
                                                        </Label>
                                                        <div className='space-y-2'>
                                                            {mobileFields.map((field, index) => (
                                                                <div key={field.id} className='flex items-center gap-2'>
                                                                    <Controller
                                                                        name={`mobileDetails.${index}.type`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value || undefined}>
                                                                                <SelectTrigger className='w-28'>
                                                                                    <SelectValue placeholder='Select' />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {(options?.contactTypes || []).length === 0 ? (
                                                                                        <SelectItem value='no-options' disabled>
                                                                                            No options available
                                                                                        </SelectItem>
                                                                                    ) : (
                                                                                        (options?.contactTypes || [])
                                                                                            .filter((item: any) => {
                                                                                                const key =
                                                                                                    item.key || item.value || item.id;
                                                                                                return (
                                                                                                    key != null &&
                                                                                                    key !== '' &&
                                                                                                    String(key).trim() !== ''
                                                                                                );
                                                                                            })
                                                                                            .map((item: any) => {
                                                                                                const val = getSafeValue(
                                                                                                    item.key || item.value || item.id
                                                                                                );
                                                                                                if (!val) return null;
                                                                                                const value =
                                                                                                    item.value ||
                                                                                                    item.label ||
                                                                                                    item.name ||
                                                                                                    String(val);
                                                                                                return (
                                                                                                    <SelectItem key={val} value={val}>
                                                                                                        {value}
                                                                                                    </SelectItem>
                                                                                                );
                                                                                            })
                                                                                            .filter(Boolean)
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                    <InputText
                                                                        placeholder='Enter mobile number'
                                                                        maxLength={10}
                                                                        {...register(`mobileDetails.${index}.mobileNo`)}
                                                                        className='min-w-[200px] flex-1'
                                                                        error={(errors.mobileDetails as any)?.[index]?.mobileNo?.message as string}
                                                                    />
                                                                    <Button
                                                                        type='button'
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        className='h-9 w-9 p-0'
                                                                        onClick={() => removeMobile(index)}>
                                                                        <X className='h-4 w-4' />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            <div className='flex gap-2'>
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    size='sm'
                                                                    className='flex-1 border-primary/30 text-primary hover:bg-primary/10'
                                                                    onClick={() => {
                                                                        const vals = getValues('mobileDetails');
                                                                        if (vals && vals.length > 0) replaceMobile(vals);
                                                                    }}>
                                                                    <RefreshCw className='mr-1 h-3.5 w-3.5' /> Force Binding
                                                                </Button>
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    size='sm'
                                                                    className='flex-1'
                                                                    onClick={() =>
                                                                        appendMobile({
                                                                            mobileNo: '',
                                                                            type: 'Default'
                                                                        })
                                                                    }>
                                                                    <Plus className='mr-1 h-4 w-4' /> Add Mobile
                                                                </Button>
                                                            </div>
                                                            {errors.mobileDetails && !Array.isArray(errors.mobileDetails) && (
                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                    {(errors.mobileDetails as any).message}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Multiple Email IDs */}
                                                    <div className='flex flex-col gap-1.5'>
                                                        <Label>Email -Id</Label>
                                                        <div className='space-y-2'>
                                                            {emailFields.map((field, index) => (
                                                                <div key={field.id} className='flex items-center gap-2'>
                                                                    <Controller
                                                                        name={`emailDetails.${index}.type`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value || undefined}>
                                                                                <SelectTrigger className='w-28'>
                                                                                    <SelectValue placeholder='Select' />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {(options?.contactTypes || []).length === 0 ? (
                                                                                        <SelectItem value='no-options' disabled>
                                                                                            No options available
                                                                                        </SelectItem>
                                                                                    ) : (
                                                                                        (options?.contactTypes || [])
                                                                                            .filter((item: any) => {
                                                                                                const key =
                                                                                                    item.key || item.value || item.id;
                                                                                                return (
                                                                                                    key != null &&
                                                                                                    key !== '' &&
                                                                                                    String(key).trim() !== ''
                                                                                                );
                                                                                            })
                                                                                            .map((item: any) => {
                                                                                                const val = getSafeValue(
                                                                                                    item.key || item.value || item.id
                                                                                                );
                                                                                                if (!val) return null;
                                                                                                const value =
                                                                                                    item.value ||
                                                                                                    item.label ||
                                                                                                    item.name ||
                                                                                                    String(val);
                                                                                                return (
                                                                                                    <SelectItem key={val} value={val}>
                                                                                                        {value}
                                                                                                    </SelectItem>
                                                                                                );
                                                                                            })
                                                                                            .filter(Boolean)
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                    <InputText
                                                                        type='email'
                                                                        placeholder='Enter email address'
                                                                        maxLength={100}
                                                                        {...register(`emailDetails.${index}.emailId`)}
                                                                        className='min-w-[200px] flex-1'
                                                                    />
                                                                    <Button
                                                                        type='button'
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        className='h-9 w-9 p-0'
                                                                        onClick={() => removeEmail(index)}>
                                                                        <X className='h-4 w-4' />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            <div className='flex gap-2'>
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    size='sm'
                                                                    className='flex-1 border-primary/30 text-primary hover:bg-primary/10'
                                                                    onClick={() => {
                                                                        const vals = getValues('emailDetails');
                                                                        if (vals && vals.length > 0) replaceEmail(vals);
                                                                    }}>
                                                                    <RefreshCw className='mr-1 h-3.5 w-3.5' /> Force Binding
                                                                </Button>
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    size='sm'
                                                                    className='flex-1'
                                                                    onClick={() =>
                                                                        appendEmail({
                                                                            emailId: '',
                                                                            type: 'Default'
                                                                        })
                                                                    }>
                                                                    <Plus className='mr-1 h-4 w-4' /> Add Email
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <InputText
                                                        label='Aadhaar No.'
                                                        required
                                                        id='aadharNo'
                                                        maxLength={12}
                                                        onKeyDown={(e) => {
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ') {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (!/^[0-9]$/.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('aadharNo')}
                                                        error={errors.aadharNo?.message as string}
                                                    />
                                                    <InputText
                                                        label='PAN Card No.'
                                                        required
                                                        id='panCardNo'
                                                        maxLength={10}
                                                        onKeyDown={(e) => {
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ') {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                        }}
                                                        {...register('panCardNo')}
                                                        error={errors.panCardNo?.message as string}
                                                    />
                                                    <Controller
                                                        name='bloodGroup'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            // Normalize value for string-based dropdown
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.bloodGroups || []).filter(
                                                                (bg: IBloodGroupDropdown) =>
                                                                    bg.key != null && bg.key !== '' && String(bg.key).trim() !== ''
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>Blood Group</Label>
                                                                    <Select
                                                                        key={`bloodGroup-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((bg: IBloodGroupDropdown) => {
                                                                                const val = getSafeValue(bg.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={bg.key} value={val}>
                                                                                        {bg.value || String(bg.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='salaryType'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            // Normalize value for string-based dropdown
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.salaryTypes || []).filter(
                                                                (st: ISalaryTypeDropdown) =>
                                                                    st.key != null && st.key !== '' && String(st.key).trim() !== ''
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Salary Type <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`salaryType-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((st: ISalaryTypeDropdown) => {
                                                                                const val = getSafeValue(st.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={st.key} value={val}>
                                                                                        {st.value || String(st.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Controller
                                                        name='modeOfPayment'
                                                        control={control}
                                                        render={({ field, fieldState }) => {
                                                            // Normalize value for string-based dropdown
                                                            const selectValue = field.value ? String(field.value).trim() : '';
                                                            const availableOptions = (options?.modeOfPayment || []).filter(
                                                                (pm: IPaymentModeDropdown) =>
                                                                    pm.key != null && pm.key !== '' && String(pm.key).trim() !== ''
                                                            );
                                                            return (
                                                                <div className='flex flex-col gap-1.5'>
                                                                    <Label>
                                                                        Mode of Payment <span className='text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        key={`modeOfPayment-${selectValue}-${availableOptions.length}`}
                                                                        onValueChange={field.onChange}
                                                                        value={selectValue || undefined}>
                                                                        <SelectTrigger
                                                                            className={cn(
                                                                                fieldState.error
                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                    : 'border-input focus-visible:ring-ring'
                                                                            )}>
                                                                            <SelectValue placeholder='--Select--' />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableOptions.map((pm: IPaymentModeDropdown) => {
                                                                                const val = getSafeValue(pm.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={pm.key} value={val}>
                                                                                        {pm.value || String(pm.key)}
                                                                                    </SelectItem>
                                                                                );
                                                                            })}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {fieldState.error && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {fieldState.error.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    {/* Employee Photo Upload */}
                                                    <div className='space-y-2'>
                                                        <Label>
                                                            Upload Employee Photo <span className='text-red-500'>*</span>
                                                        </Label>
                                                        <div
                                                            className={cn(
                                                                'rounded-lg border-2 border-dashed p-4 text-center',
                                                                errors.employeePhoto
                                                                    ? 'border-destructive bg-destructive/5'
                                                                    : 'border-gray-300'
                                                            )}>
                                                            <div className='mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-100'>
                                                                {selectedPhoto ? (
                                                                    <img
                                                                        src={selectedPhoto}
                                                                        alt='Employee Preview'
                                                                        className='h-full w-full rounded-lg object-cover'
                                                                    />
                                                                ) : (
                                                                    <Upload className='h-12 w-12 text-gray-400' />
                                                                )}
                                                            </div>
                                                            <div className='space-y-2'>
                                                                <input
                                                                    type='file'
                                                                    id='employeePhoto'
                                                                    accept='image/*'
                                                                    onChange={handlePhotoUpload}
                                                                    className='hidden'
                                                                />
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                    className='w-full bg-gray-100'
                                                                    onClick={() => document.getElementById('employeePhoto')?.click()}>
                                                                    {selectedPhoto ? 'Change Photo' : 'Upload Employee Photo'}
                                                                </Button>
                                                                {selectedPhoto && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                                                        onClick={() => {
                                                                            setSelectedPhoto(null);
                                                                            setPhotoFile(null);
                                                                            setValue('employeePhoto', '', {
                                                                                shouldValidate: true,
                                                                                shouldDirty: true
                                                                            });
                                                                            const fileInput = document.getElementById(
                                                                                'employeePhoto'
                                                                            ) as HTMLInputElement;
                                                                            if (fileInput) fileInput.value = '';
                                                                        }}>
                                                                        Remove Photo
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {errors.employeePhoto && (
                                                            <div className='font-medium text-[0.8rem] text-destructive'>
                                                                {errors.employeePhoto.message as string}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Bank Details - Conditional on Mode of Payment */}
                                                    {watch('modeOfPayment') === 'Bank' ? (
                                                        <div className='space-y-4'>
                                                            <div className='rounded-md bg-gray-200 px-4 py-2'>
                                                                <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                                    EMPLOYEE BANK DETAILS: <span className='text-red-500'>*</span>
                                                                </h3>
                                                            </div>
                                                            {(errors.bankDetails ||
                                                                (watch('modeOfPayment') === 'Bank' && bankFields.length === 0)) && (
                                                                    <div className='font-medium text-[0.8rem] text-destructive'>
                                                                        {(errors.bankDetails as any)?.message ||
                                                                            'Bank Details are required when Mode of Payment is Bank'}
                                                                    </div>
                                                                )}
                                                            <div className='rounded-lg border bg-card'>
                                                                <div className='rounded-t-lg bg-gray-200 px-4 py-2 text-gray-900'>
                                                                    <div className='grid grid-cols-5 gap-2 font-semibold text-sm'>
                                                                        <div>Serial No.</div>
                                                                        <div>Employer Bank Name</div>
                                                                        <div>Bank Account No.</div>
                                                                        <div>Account Type</div>
                                                                        <div>Action</div>
                                                                    </div>
                                                                </div>
                                                                <div className='space-y-2 p-4'>
                                                                    {bankFields.map((field, index) => (
                                                                        <div key={field.id} className='grid grid-cols-5 items-center gap-2'>
                                                                            <div>{index + 1}</div>
                                                                            <div>
                                                                                <Controller
                                                                                    name={`bankDetails.${index}.employerBankName`}
                                                                                    control={control}
                                                                                    render={({ field, fieldState }) => (
                                                                                        <div className='flex flex-col gap-1.5'>
                                                                                            <Select
                                                                                                onValueChange={field.onChange}
                                                                                                value={field.value || ''}>
                                                                                                <SelectTrigger
                                                                                                    className={cn(
                                                                                                        fieldState.error
                                                                                                            ? 'border-destructive focus-visible:ring-destructive'
                                                                                                            : 'border-input focus-visible:ring-ring'
                                                                                                    )}>
                                                                                                    <SelectValue placeholder='--Select--' />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    {memoizedBankOptions.map(
                                                                                                        (bank: any) => {
                                                                                                            const val = getSafeValue(
                                                                                                                bank.value
                                                                                                            );
                                                                                                            if (!val) return null;
                                                                                                            return (
                                                                                                                <SelectItem
                                                                                                                    key={bank.id}
                                                                                                                    value={val}>
                                                                                                                    {bank.name}
                                                                                                                </SelectItem>
                                                                                                            );
                                                                                                        }
                                                                                                    )}
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                            {fieldState.error && (
                                                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                                    {fieldState.error.message}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <InputText
                                                                                    placeholder='Bank Account No.'
                                                                                    maxLength={14}
                                                                                    onKeyDown={(e) => {
                                                                                        const controlKeys = [
                                                                                            'Backspace',
                                                                                            'Delete',
                                                                                            'Tab',
                                                                                            'Escape',
                                                                                            'Enter',
                                                                                            'ArrowLeft',
                                                                                            'ArrowRight',
                                                                                            'ArrowUp',
                                                                                            'ArrowDown'
                                                                                        ];
                                                                                        if (
                                                                                            controlKeys.includes(e.key) ||
                                                                                            e.ctrlKey ||
                                                                                            e.metaKey
                                                                                        ) {
                                                                                            return;
                                                                                        }
                                                                                        if (e.key === ' ') {
                                                                                            e.preventDefault();
                                                                                            return;
                                                                                        }
                                                                                        if (!/^[0-9]$/.test(e.key)) {
                                                                                            e.preventDefault();
                                                                                        }
                                                                                    }}
                                                                                    {...register(`bankDetails.${index}.bankAccountNo`)}
                                                                                    error={(errors.bankDetails as any)?.[index]?.bankAccountNo?.message as string}
                                                                                    className='w-full'
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Controller
                                                                                    name={`bankDetails.${index}.accountType`}
                                                                                    control={control}
                                                                                    render={({ field }) => (
                                                                                        <Select
                                                                                            onValueChange={field.onChange}
                                                                                            value={field.value || undefined}>
                                                                                            <SelectTrigger>
                                                                                                <SelectValue placeholder='Select' />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {(options?.contactTypes || []).length ===
                                                                                                    0 ? (
                                                                                                    <SelectItem value='no-options' disabled>
                                                                                                        No options available
                                                                                                    </SelectItem>
                                                                                                ) : (
                                                                                                    (options?.contactTypes || [])
                                                                                                        .filter((item: any) => {
                                                                                                            const key =
                                                                                                                item.key ||
                                                                                                                item.value ||
                                                                                                                item.id;
                                                                                                            return (
                                                                                                                key != null &&
                                                                                                                key !== '' &&
                                                                                                                String(key).trim() !== ''
                                                                                                            );
                                                                                                        })
                                                                                                        .map((item: any) => {
                                                                                                            const val = getSafeValue(
                                                                                                                item.key ||
                                                                                                                item.value ||
                                                                                                                item.id
                                                                                                            );
                                                                                                            if (!val) return null;
                                                                                                            return (
                                                                                                                <SelectItem
                                                                                                                    key={
                                                                                                                        item.key ||
                                                                                                                        item.value ||
                                                                                                                        item.id
                                                                                                                    }
                                                                                                                    value={val}>
                                                                                                                    {item.value ||
                                                                                                                        item.label ||
                                                                                                                        item.name ||
                                                                                                                        String(
                                                                                                                            item.key ||
                                                                                                                            item.value ||
                                                                                                                            item.id
                                                                                                                        )}
                                                                                                                </SelectItem>
                                                                                                            );
                                                                                                        })
                                                                                                        .filter(Boolean)
                                                                                                )}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Button
                                                                                    type='button'
                                                                                    variant='outline'
                                                                                    size='sm'
                                                                                    onClick={() => removeBank(index)}>
                                                                                    <Trash2 className='h-4 w-4' />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <Button
                                                                        type='button'
                                                                        variant='outline'
                                                                        size='sm'
                                                                        onClick={() =>
                                                                            appendBank({
                                                                                employerBankName: '',
                                                                                bankAccountNo: '',
                                                                                accountType: 'Default'
                                                                            })
                                                                        }>
                                                                        <Plus className='mr-1 h-4 w-4' /> Add Bank Account
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Address Information */}
                                {currentStep === 2 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Address Information</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please provide the employee&apos;s address details</p>
                                        </div>
                                        <div className='space-y-6'>
                                            {/* Contact Address */}
                                            <div className='space-y-4'>
                                                <div className='rounded-md border'>
                                                    <div className='border-b bg-muted px-4 py-2'>
                                                        <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                            CONTACT ADDRESS:
                                                        </h3>
                                                    </div>
                                                    <div className='p-4'>
                                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                                            <InputText
                                                                label='Address'
                                                                required
                                                                id='contactAddress'
                                                                maxLength={100}
                                                                {...register('contactAddress')}
                                                                error={errors.contactAddress?.message as string}
                                                            />
                                                            <InputText
                                                                label='Area'
                                                                required
                                                                id='contactArea'
                                                                {...register('contactArea')}
                                                                error={errors.contactArea?.message as string}
                                                            />
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='contactCountry'
                                                                    control={control}
                                                                    render={({ field }) => {
                                                                        console.log('🔍 [DROPDOWN] Contact Country:', {
                                                                            fieldValue: field.value,
                                                                            fieldValueType: typeof field.value,
                                                                            availableCountries: options?.countries?.length,
                                                                            firstCountryKey: options?.countries?.[0]?.key,
                                                                            firstCountryKeyType: typeof options?.countries?.[0]?.key
                                                                        });
                                                                        return (
                                                                            <>
                                                                                <Label>
                                                                                    Country <span className='text-red-500'>*</span>
                                                                                </Label>
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder='Select Country' />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {(options?.countries || [])
                                                                                            .filter((country: ICountryDropdown) => {
                                                                                                return (
                                                                                                    country.key != null &&
                                                                                                    country.key !== undefined &&
                                                                                                    country.key !== 0
                                                                                                );
                                                                                            })
                                                                                            .map((country: ICountryDropdown) => {
                                                                                                const val = getSafeValue(country.key);
                                                                                                if (!val) return null;
                                                                                                // Remove "Country" prefix if present
                                                                                                let displayValue =
                                                                                                    country.value || String(country.key);
                                                                                                if (displayValue.startsWith('Country ')) {
                                                                                                    displayValue = displayValue.replace(
                                                                                                        /^Country\s+/i,
                                                                                                        ''
                                                                                                    );
                                                                                                }
                                                                                                return (
                                                                                                    <SelectItem
                                                                                                        key={country.key}
                                                                                                        value={val}>
                                                                                                        {displayValue}
                                                                                                    </SelectItem>
                                                                                                );
                                                                                            })
                                                                                            .filter(Boolean)}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </>
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='contactState'
                                                                    control={control}
                                                                    render={({ field }) => {
                                                                        console.log('🔍 [DROPDOWN] Contact State:', {
                                                                            fieldValue: field.value,
                                                                            fieldValueType: typeof field.value,
                                                                            contactCountryId: contactCountryId,
                                                                            availableStates: availableContactStates?.length,
                                                                            firstStateKey: availableContactStates?.[0]?.key,
                                                                            firstStateKeyType: typeof availableContactStates?.[0]?.key
                                                                        });
                                                                        return (
                                                                            <>
                                                                                <Label>
                                                                                    State <span className='text-red-500'>*</span>
                                                                                </Label>
                                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder='Select State' />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {isLoadingContactStates ? (
                                                                                            <SelectItem value='loading' disabled>
                                                                                                Loading states...
                                                                                            </SelectItem>
                                                                                        ) : (
                                                                                            availableContactStates
                                                                                                .filter((state: IStateDropdown) => {
                                                                                                    return (
                                                                                                        state.key != null &&
                                                                                                        state.key !== undefined &&
                                                                                                        state.key !== 0
                                                                                                    );
                                                                                                })
                                                                                                .map((state: IStateDropdown) => {
                                                                                                    const val = getSafeValue(state.key);
                                                                                                    if (!val) return null;
                                                                                                    const value =
                                                                                                        state.value || String(state.key);
                                                                                                    return (
                                                                                                        <SelectItem
                                                                                                            key={`contact-state-${state.key}`}
                                                                                                            value={val}>
                                                                                                            {value}
                                                                                                        </SelectItem>
                                                                                                    );
                                                                                                })
                                                                                                .filter(Boolean)
                                                                                        )}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </>
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <InputText
                                                                label='City'
                                                                required
                                                                id='contactCity'
                                                                {...register('contactCity')}
                                                                error={errors.contactCity?.message as string}
                                                            />
                                                            <InputText
                                                                label='Pincode'
                                                                required
                                                                id='contactPincode'
                                                                maxLength={10}
                                                                onKeyDown={(e) => {
                                                                    const controlKeys = [
                                                                        'Backspace',
                                                                        'Delete',
                                                                        'Tab',
                                                                        'Escape',
                                                                        'Enter',
                                                                        'ArrowLeft',
                                                                        'ArrowRight',
                                                                        'ArrowUp',
                                                                        'ArrowDown'
                                                                    ];
                                                                    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                        return;
                                                                    }
                                                                    if (e.key === ' ') {
                                                                        e.preventDefault();
                                                                        return;
                                                                    }
                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                {...register('contactPincode')}
                                                                error={errors.contactPincode?.message as string}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Permanent Address */}
                                            <div className='space-y-4'>
                                                <div className='rounded-md border'>
                                                    <div className='border-b bg-muted px-4 py-2'>
                                                        <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                            PERMANENT ADDRESS:
                                                        </h3>
                                                    </div>
                                                    <div className='p-4'>
                                                        <div className='mb-4 flex items-center space-x-2'>
                                                            <Checkbox
                                                                id='sameAsCommunicationAddress'
                                                                checked={sameAsCommunicationAddress || false}
                                                                onCheckedChange={(checked) => {
                                                                    setValue('sameAsCommunicationAddress', !!checked);
                                                                }}
                                                            />
                                                            <Label htmlFor='sameAsCommunicationAddress'>
                                                                Same As Communication Address
                                                            </Label>
                                                        </div>
                                                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                                            <InputText
                                                                label='Address'
                                                                required
                                                                id='permanentAddress'
                                                                maxLength={100}
                                                                {...register('permanentAddress')}
                                                                error={errors.permanentAddress?.message as string}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                            <InputText
                                                                label='Area'
                                                                required
                                                                id='permanentArea'
                                                                {...register('permanentArea')}
                                                                error={errors.permanentArea?.message as string}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='permanentCountry'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <Label>
                                                                                Country <span className='text-red-500'>*</span>
                                                                            </Label>
                                                                            <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value}
                                                                                disabled={sameAsCommunicationAddress}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder='Select Country' />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {(options?.countries || [])
                                                                                        .filter((country: ICountryDropdown) => {
                                                                                            return (
                                                                                                country.key != null &&
                                                                                                country.key !== undefined &&
                                                                                                country.key !== 0
                                                                                            );
                                                                                        })
                                                                                        .map((country: ICountryDropdown) => {
                                                                                            const val = getSafeValue(country.key);
                                                                                            if (!val) return null;
                                                                                            // Remove "Country" prefix if present
                                                                                            let displayValue =
                                                                                                country.value || String(country.key);
                                                                                            if (displayValue.startsWith('Country ')) {
                                                                                                displayValue = displayValue.replace(
                                                                                                    /^Country\s+/i,
                                                                                                    ''
                                                                                                );
                                                                                            }
                                                                                            return (
                                                                                                <SelectItem key={country.key} value={val}>
                                                                                                    {displayValue}
                                                                                                </SelectItem>
                                                                                            );
                                                                                        })
                                                                                        .filter(Boolean)}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='permanentState'
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <Label>
                                                                                State <span className='text-red-500'>*</span>
                                                                            </Label>
                                                                            <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value}
                                                                                disabled={sameAsCommunicationAddress}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder='Select State' />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {isLoadingPermanentStates ? (
                                                                                        <SelectItem value='loading' disabled>
                                                                                            Loading states...
                                                                                        </SelectItem>
                                                                                    ) : (
                                                                                        availablePermanentStates
                                                                                            .filter((state: IStateDropdown) => {
                                                                                                return (
                                                                                                    state.key != null &&
                                                                                                    state.key !== undefined &&
                                                                                                    state.key !== 0
                                                                                                );
                                                                                            })
                                                                                            .map((state: IStateDropdown) => {
                                                                                                const val = getSafeValue(state.key);
                                                                                                if (!val) return null;
                                                                                                const value =
                                                                                                    state.value || String(state.key);
                                                                                                return (
                                                                                                    <SelectItem
                                                                                                        key={`permanent-state-${state.key}`}
                                                                                                        value={val}>
                                                                                                        {value}
                                                                                                    </SelectItem>
                                                                                                );
                                                                                            })
                                                                                            .filter(Boolean)
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </>
                                                                    )}
                                                                />
                                                            </div>
                                                            <InputText
                                                                label='City'
                                                                id='permanentCity'
                                                                {...register('permanentCity')}
                                                                error={errors.permanentCity?.message as string}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                            <InputText
                                                                label='Pincode'
                                                                id='permanentPincode'
                                                                maxLength={10}
                                                                onKeyDown={(e) => {
                                                                    const controlKeys = [
                                                                        'Backspace',
                                                                        'Delete',
                                                                        'Tab',
                                                                        'Escape',
                                                                        'Enter',
                                                                        'ArrowLeft',
                                                                        'ArrowRight',
                                                                        'ArrowUp',
                                                                        'ArrowDown'
                                                                    ];
                                                                    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                        return;
                                                                    }
                                                                    if (e.key === ' ') {
                                                                        e.preventDefault();
                                                                        return;
                                                                    }
                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                {...register('permanentPincode')}
                                                                error={errors.permanentPincode?.message as string}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Qualification */}
                                {currentStep === 3 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Qualification & Educational Details</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please provide the employee&apos;s educational and qualification details
                                            </p>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='rounded-md border'>
                                                <div className='flex items-center justify-between border-b bg-muted px-4 py-2'>
                                                    <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                        EMPLOYEE QUALIFICATION & EDUCATIONAL DETAILS
                                                    </h3>
                                                    <div className='flex items-center gap-2'>
                                                        <Button
                                                            type='button'
                                                            className='h-7 w-auto rounded-md bg-secondary px-2.5 py-1.5 text-secondary-foreground text-xs shadow-sm hover:bg-secondary/80'
                                                            onClick={() => {
                                                                appendQualification({
                                                                    hrmeQ_Id: 0, // New record - use lowercase to match form field
                                                                    qualification: '',
                                                                    course: '',
                                                                    college: '',
                                                                    university: '',
                                                                    yearOfPassing: '',
                                                                    cgpaOrPercentage: 'CGPA',
                                                                    cgpa: '',
                                                                    qualificationCountry: '',
                                                                    qualificationState: '',
                                                                    registrationNo: '',
                                                                    result: '',
                                                                    areaOfSpecialisation: '',
                                                                    medicalCouncil: '',
                                                                    phdFlag: false,
                                                                    thesisTitle: '',
                                                                    registrationYear: '',
                                                                    guideName: '',
                                                                    qualifiedDate: '',
                                                                    hardcopy: ''
                                                                } as any as z.infer<typeof qualificationDetailSchema>);
                                                            }}>
                                                            <Plus className='mr-1 h-3.5 w-3.5' /> Add Qualification
                                                        </Button>
                                                    </div>
                                                </div>
                                                {qualificationFields.length === 0 && (
                                                    <div className='rounded-md border p-6 text-muted-foreground text-sm'>
                                                        No qualifications added yet. Click "Add Qualification" to start.
                                                    </div>
                                                )}
                                                <div className='space-y-4'>
                                                    {(() => {
                                                        const allQuals = watch('qualificationDetails') || [];
                                                        return qualificationFields.map((field, index) => {
                                                            const cgpaOrPercentage = allQuals[index]?.cgpaOrPercentage || 'CGPA';

                                                            return (
                                                                <div key={field.id} className='rounded-lg border bg-card p-4 shadow-sm'>
                                                                    <div className='mb-4 flex items-center justify-between'>
                                                                        <div className='flex items-center gap-2'>
                                                                            <Badge variant='secondary'>Serial NO. {index + 1}</Badge>
                                                                            <div className='font-semibold'>Qualification #{index + 1}</div>
                                                                        </div>
                                                                        <Button
                                                                            type='button'
                                                                            className='h-7 w-auto rounded-md px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground'
                                                                            onClick={() => removeQualification(index)}>
                                                                            <Trash2 className='mr-1 h-3.5 w-3.5' /> Remove
                                                                        </Button>
                                                                    </div>
                                                                    <div className='space-y-4'>
                                                                        {/* Row 1: Qualification, Course */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <InputText
                                                                                label='Qualification *'
                                                                                id={`qualificationDetails.${index}.qualification`}
                                                                                maxLength={50}
                                                                                {...register(`qualificationDetails.${index}.qualification`)}
                                                                            />
                                                                            <Controller
                                                                                name={`qualificationDetails.${index}.course`}
                                                                                control={control}
                                                                                render={({ field }) => {
                                                                                    const courses = options?.courses || [];
                                                                                    return (
                                                                                        <div className='flex flex-col gap-1.5'>
                                                                                            <Label>Course *</Label>
                                                                                            <Select
                                                                                                onValueChange={field.onChange}
                                                                                                value={field.value || ''}>
                                                                                                <SelectTrigger className='h-9'>
                                                                                                    <SelectValue placeholder='Select Course' />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    {isLoadingCourses ? (
                                                                                                        <SelectItem
                                                                                                            value='loading'
                                                                                                            disabled>
                                                                                                            Loading courses...
                                                                                                        </SelectItem>
                                                                                                    ) : courses.length === 0 ? (
                                                                                                        <SelectItem
                                                                                                            value='no-options'
                                                                                                            disabled>
                                                                                                            No courses available
                                                                                                        </SelectItem>
                                                                                                    ) : (
                                                                                                        courses
                                                                                                            .filter(
                                                                                                                (
                                                                                                                    course: ICourseDropdown
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        course.key !=
                                                                                                                        null &&
                                                                                                                        course.key !==
                                                                                                                        undefined &&
                                                                                                                        course.key !== 0
                                                                                                                    );
                                                                                                                }
                                                                                                            )
                                                                                                            .map(
                                                                                                                (
                                                                                                                    course: ICourseDropdown
                                                                                                                ) => {
                                                                                                                    const key = course.key
                                                                                                                        ?.toString()
                                                                                                                        .trim();
                                                                                                                    if (!key || key === '')
                                                                                                                        return null;
                                                                                                                    const value =
                                                                                                                        course.value ||
                                                                                                                        String(course.key);
                                                                                                                    return (
                                                                                                                        <SelectItem
                                                                                                                            key={course.key}
                                                                                                                            value={key}>
                                                                                                                            {value}
                                                                                                                        </SelectItem>
                                                                                                                    );
                                                                                                                }
                                                                                                            )
                                                                                                            .filter(Boolean)
                                                                                                    )}
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                        </div>
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {/* Row 2: College, University */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <InputText
                                                                                label='College *'
                                                                                id={`qualificationDetails.${index}.college`}
                                                                                maxLength={100}
                                                                                {...register(`qualificationDetails.${index}.college`)}
                                                                            />
                                                                            <InputText
                                                                                label='University *'
                                                                                id={`qualificationDetails.${index}.university`}
                                                                                maxLength={100}
                                                                                {...register(`qualificationDetails.${index}.university`)}
                                                                            />
                                                                        </div>
                                                                        {/* Row 3: Year Of Passing, Country, State */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                                                            <InputText
                                                                                label='Year Of Passing *'
                                                                                id={`qualificationDetails.${index}.yearOfPassing`}
                                                                                maxLength={4}
                                                                                onKeyDown={(e) => {
                                                                                    const controlKeys = [
                                                                                        'Backspace',
                                                                                        'Delete',
                                                                                        'Tab',
                                                                                        'Escape',
                                                                                        'Enter',
                                                                                        'ArrowLeft',
                                                                                        'ArrowRight',
                                                                                        'ArrowUp',
                                                                                        'ArrowDown'
                                                                                    ];
                                                                                    if (
                                                                                        controlKeys.includes(e.key) ||
                                                                                        e.ctrlKey ||
                                                                                        e.metaKey
                                                                                    ) {
                                                                                        return;
                                                                                    }
                                                                                    if (e.key === ' ') {
                                                                                        e.preventDefault();
                                                                                        return;
                                                                                    }
                                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                {...register(`qualificationDetails.${index}.yearOfPassing`)}
                                                                            />
                                                                            <Controller
                                                                                name={`qualificationDetails.${index}.qualificationCountry`}
                                                                                control={control}
                                                                                render={({ field, fieldState }) => (
                                                                                    <div className='flex flex-col gap-1.5'>
                                                                                        <Label>Country*</Label>
                                                                                        <Select
                                                                                            onValueChange={(value) => {
                                                                                                field.onChange(value);
                                                                                                setValue(
                                                                                                    `qualificationDetails.${index}.qualificationState`,
                                                                                                    '',
                                                                                                    {
                                                                                                        shouldValidate: false
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                            value={field.value || ''}>
                                                                                            <SelectTrigger className='h-9'>
                                                                                                <SelectValue placeholder='Select Country' />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {(options?.countries || [])
                                                                                                    .filter((country: ICountryDropdown) => {
                                                                                                        return (
                                                                                                            country.key != null &&
                                                                                                            country.key !== undefined &&
                                                                                                            country.key !== 0
                                                                                                        );
                                                                                                    })
                                                                                                    .map((country: ICountryDropdown) => {
                                                                                                        const val = getSafeValue(
                                                                                                            country.key
                                                                                                        );
                                                                                                        if (!val) return null;
                                                                                                        // Remove "Country" prefix if present
                                                                                                        let displayValue =
                                                                                                            country.value ||
                                                                                                            String(country.key);
                                                                                                        if (
                                                                                                            displayValue.startsWith(
                                                                                                                'Country '
                                                                                                            )
                                                                                                        ) {
                                                                                                            displayValue =
                                                                                                                displayValue.replace(
                                                                                                                    /^Country\s+/i,
                                                                                                                    ''
                                                                                                                );
                                                                                                        }
                                                                                                        return (
                                                                                                            <SelectItem
                                                                                                                key={country.key}
                                                                                                                value={val}>
                                                                                                                {displayValue}
                                                                                                            </SelectItem>
                                                                                                        );
                                                                                                    })
                                                                                                    .filter(Boolean)}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                                {fieldState.error.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            />
                                                                            <QualificationStateDropdown
                                                                                control={control}
                                                                                index={index}
                                                                                countryId={
                                                                                    (watch('qualificationDetails') as any[])?.[index]
                                                                                        ?.qualificationCountry || null
                                                                                }
                                                                                setValue={setValue}
                                                                                fallbackStates={options?.states || []}
                                                                            />
                                                                        </div>
                                                                        {/* Row 4: Registration No., Result */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <InputText
                                                                                label='Registration No. *'
                                                                                id={`qualificationDetails.${index}.registrationNo`}
                                                                                maxLength={50}
                                                                                {...register(`qualificationDetails.${index}.registrationNo`)}
                                                                                error={(errors.qualificationDetails as any)?.[index]?.registrationNo?.message}
                                                                            />
                                                                            <InputText
                                                                                label='Result *'
                                                                                id={`qualificationDetails.${index}.result`}
                                                                                maxLength={20}
                                                                                {...register(`qualificationDetails.${index}.result`)}
                                                                                error={(errors.qualificationDetails as any)?.[index]?.result?.message}
                                                                            />
                                                                        </div>
                                                                        {/* Row 5: CGPA Or Percentage dropdown */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <Controller
                                                                                name={`qualificationDetails.${index}.cgpaOrPercentage`}
                                                                                control={control}
                                                                                render={({ field, fieldState }) => (
                                                                                    <div className='flex flex-col gap-1.5'>
                                                                                        <Label>CGPA Or Percentage *</Label>
                                                                                        <Select
                                                                                            onValueChange={(val) => {
                                                                                                field.onChange(val);
                                                                                                setValue(
                                                                                                    `qualificationDetails.${index}.cgpa`,
                                                                                                    ''
                                                                                                );
                                                                                                setValue(
                                                                                                    `qualificationDetails.${index}.percentage`,
                                                                                                    ''
                                                                                                );
                                                                                            }}
                                                                                            value={field.value || 'CGPA'}>
                                                                                            <SelectTrigger
                                                                                                className={cn(
                                                                                                    'h-9',
                                                                                                    fieldState.error
                                                                                                        ? 'border-destructive focus-visible:ring-destructive'
                                                                                                        : 'border-input focus-visible:ring-ring'
                                                                                                )}>
                                                                                                <SelectValue placeholder='Select' />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                {(options?.cgpaPercentageTypes || [])
                                                                                                    .filter((st: IScoreTypeDropdown) => {
                                                                                                        return (
                                                                                                            st.key != null &&
                                                                                                            st.key !== '' &&
                                                                                                            String(st.key).trim() !== ''
                                                                                                        );
                                                                                                    })
                                                                                                    .map((st: IScoreTypeDropdown) => {
                                                                                                        const val = getSafeValue(st.key);
                                                                                                        if (!val) return null;
                                                                                                        return (
                                                                                                            <SelectItem
                                                                                                                key={st.key}
                                                                                                                value={val}>
                                                                                                                {st.value || String(st.key)}
                                                                                                            </SelectItem>
                                                                                                        );
                                                                                                    })
                                                                                                    .filter(Boolean)}
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                                {fieldState.error.message}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            />
                                                                            <InputText
                                                                                label={
                                                                                    cgpaOrPercentage === 'Percentage'
                                                                                        ? 'Percentage'
                                                                                        : 'CGPA'
                                                                                }
                                                                                id={`qualificationDetails.${index}.${cgpaOrPercentage === 'Percentage' ? 'percentage' : 'cgpa'}`}
                                                                                maxLength={cgpaOrPercentage === 'Percentage' ? 3 : 4}
                                                                                onKeyDown={(e) => {
                                                                                    const controlKeys = [
                                                                                        'Backspace',
                                                                                        'Delete',
                                                                                        'Tab',
                                                                                        'Escape',
                                                                                        'Enter',
                                                                                        'ArrowLeft',
                                                                                        'ArrowRight',
                                                                                        'ArrowUp',
                                                                                        'ArrowDown'
                                                                                    ];
                                                                                    if (
                                                                                        controlKeys.includes(e.key) ||
                                                                                        e.ctrlKey ||
                                                                                        e.metaKey
                                                                                    ) {
                                                                                        return;
                                                                                    }
                                                                                    if (e.key === ' ') {
                                                                                        e.preventDefault();
                                                                                        return;
                                                                                    }
                                                                                    if (cgpaOrPercentage === 'Percentage') {
                                                                                        if (!/^[0-9]$/.test(e.key)) {
                                                                                            e.preventDefault();
                                                                                        }
                                                                                        return;
                                                                                    }
                                                                                    if (cgpaOrPercentage === 'CGPA') {
                                                                                        if (e.key === '.') {
                                                                                            const target = e.target as HTMLInputElement;
                                                                                            if (target.value.includes('.')) {
                                                                                                e.preventDefault();
                                                                                            }
                                                                                        } else if (!/^[0-9]$/.test(e.key)) {
                                                                                            e.preventDefault();
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                {...register(`qualificationDetails.${index}.${cgpaOrPercentage === 'Percentage' ? 'percentage' : 'cgpa'}`)}
                                                                                error={(errors.qualificationDetails as any)?.[index]?.[cgpaOrPercentage === 'Percentage' ? 'percentage' : 'cgpa']?.message}
                                                                            />
                                                                        </div>
                                                                        {/* Row 6: Area Of Specialization */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <Controller
                                                                                name={`qualificationDetails.${index}.areaOfSpecialisation`}
                                                                                control={control}
                                                                                render={({ field, fieldState }) => {
                                                                                    const specialisations = options?.specialisations || [];
                                                                                    return (
                                                                                        <div className='flex flex-col gap-1.5'>
                                                                                            <Label>Area Of Specialization*</Label>
                                                                                            <Select
                                                                                                onValueChange={field.onChange}
                                                                                                value={field.value || ''}>
                                                                                                <SelectTrigger className='h-9'>
                                                                                                    <SelectValue placeholder='Select' />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    {specialisations
                                                                                                        .filter(
                                                                                                            (
                                                                                                                spec: ISpecializationDropdown
                                                                                                            ) => {
                                                                                                                return (
                                                                                                                    spec.key != null &&
                                                                                                                    spec.key !==
                                                                                                                    undefined &&
                                                                                                                    spec.key !== 0
                                                                                                                );
                                                                                                            }
                                                                                                        )
                                                                                                        .map(
                                                                                                            (
                                                                                                                spec: ISpecializationDropdown
                                                                                                            ) => {
                                                                                                                const val = getSafeValue(
                                                                                                                    spec.key
                                                                                                                );
                                                                                                                if (!val) return null;
                                                                                                                const value =
                                                                                                                    spec.value ||
                                                                                                                    String(spec.key);
                                                                                                                return (
                                                                                                                    <SelectItem
                                                                                                                        key={spec.key}
                                                                                                                        value={val}>
                                                                                                                        {value}
                                                                                                                    </SelectItem>
                                                                                                                );
                                                                                                            }
                                                                                                        )
                                                                                                        .filter(Boolean)}
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                            {fieldState.error && (
                                                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                                    {fieldState.error.message}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {/* Row 7: PHD checkbox */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <div className='flex items-center space-x-2'>
                                                                                <Controller
                                                                                    name={`qualificationDetails.${index}.phdFlag`}
                                                                                    control={control}
                                                                                    render={({ field }) => (
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <Checkbox
                                                                                                id={`qualificationDetails.${index}.phdFlag`}
                                                                                                checked={field.value || false}
                                                                                                onCheckedChange={field.onChange}
                                                                                            />
                                                                                            <Label
                                                                                                htmlFor={`qualificationDetails.${index}.phdFlag`}
                                                                                                className='cursor-pointer'>
                                                                                                PHD
                                                                                            </Label>
                                                                                        </div>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* Row 8: Thesis Title and Medical Council */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                            <InputText
                                                                                label='Thesis Title'
                                                                                id={`qualificationDetails.${index}.thesisTitle`}
                                                                                maxLength={255}
                                                                                {...register(`qualificationDetails.${index}.thesisTitle`)}
                                                                            />
                                                                            <InputText
                                                                                label='Medical Council'
                                                                                id={`qualificationDetails.${index}.medicalCouncil`}
                                                                                maxLength={50}
                                                                                {...register(
                                                                                    `qualificationDetails.${index}.medicalCouncil`
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        {/* Row 9: Registration Year, Guide Name, Qualified Date */}
                                                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                                                            <InputText
                                                                                label='Registration Year'
                                                                                id={`qualificationDetails.${index}.registrationYear`}
                                                                                maxLength={4}
                                                                                placeholder='Enter year (e.g., 2024)'
                                                                                onKeyDown={(e) => {
                                                                                    const controlKeys = [
                                                                                        'Backspace',
                                                                                        'Delete',
                                                                                        'Tab',
                                                                                        'Escape',
                                                                                        'Enter',
                                                                                        'ArrowLeft',
                                                                                        'ArrowRight',
                                                                                        'ArrowUp',
                                                                                        'ArrowDown'
                                                                                    ];
                                                                                    if (
                                                                                        controlKeys.includes(e.key) ||
                                                                                        e.ctrlKey ||
                                                                                        e.metaKey
                                                                                    ) {
                                                                                        return;
                                                                                    }
                                                                                    if (e.key === ' ') {
                                                                                        e.preventDefault();
                                                                                        return;
                                                                                    }
                                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                {...register(
                                                                                    `qualificationDetails.${index}.registrationYear`
                                                                                )}
                                                                                error={
                                                                                    (errors.qualificationDetails as any)?.[index]?.registrationYear?.message
                                                                                }
                                                                            />
                                                                            <InputText
                                                                                label='Guide Name'
                                                                                id={`qualificationDetails.${index}.guideName`}
                                                                                maxLength={100}
                                                                                {...register(`qualificationDetails.${index}.guideName`)}
                                                                            />
                                                                            <Controller
                                                                                name={`qualificationDetails.${index}.qualifiedDate`}
                                                                                control={control}
                                                                                render={({ field, fieldState }) => (
                                                                                    <div className='flex flex-col gap-1.5 [&>div]:mt-0'>
                                                                                        <DateField
                                                                                            field={field}
                                                                                            fieldState={fieldState}
                                                                                            label='Qualified Date'
                                                                                            placeholder='Pick qualified date'
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Experience */}
                                {currentStep === 4 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Experience</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please provide the employee&apos;s work experience</p>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='rounded-md border'>
                                                <div className='flex items-center justify-between border-b bg-muted px-4 py-2'>
                                                    <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                        PREVIOUS EMPLOYMENT DETAILS
                                                    </h3>
                                                    <div className='flex items-center gap-2'>
                                                        <Button
                                                            type='button'
                                                            className='h-7 w-auto rounded-md bg-secondary px-2.5 py-1.5 text-secondary-foreground text-xs shadow-sm hover:bg-secondary/80'
                                                            onClick={() =>
                                                                appendExperience({
                                                                    hrmeE_Id: 0, // New record - use lowercase to match form field
                                                                    organisationName: '',
                                                                    organisationAddress: '',
                                                                    department: '',
                                                                    designation: '',
                                                                    joinDate: '',
                                                                    exitDate: '',
                                                                    noOfYears: '',
                                                                    noOfMonths: '',
                                                                    annualSalary: '',
                                                                    reasonForLeaving: ''
                                                                } as any)
                                                            }>
                                                            <Plus className='mr-1 h-3.5 w-3.5' /> Add Experience
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {experienceFields.length === 0 && (
                                                <div className='rounded-md border p-6 text-muted-foreground text-sm'>
                                                    No experience added yet. Click "Add Experience" to start.
                                                </div>
                                            )}
                                            <div className='space-y-4'>
                                                {experienceFields.map((field, index) => (
                                                    <div key={field.id} className='rounded-lg border bg-card p-4 shadow-sm'>
                                                        <div className='mb-3 flex items-center justify-between'>
                                                            <div className='font-semibold'>Experience #{index + 1}</div>
                                                            <div className='flex gap-2'>
                                                                <Badge variant='secondary'>Row {index + 1}</Badge>
                                                                <Button
                                                                    type='button'
                                                                    className='h-7 w-auto rounded-md px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground'
                                                                    onClick={() => removeExperience(index)}>
                                                                    <Trash2 className='mr-1 h-3.5 w-3.5' /> Remove
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                                                            <InputText
                                                                label='Organisation Name'
                                                                id={`experienceDetails.${index}.organisationName`}
                                                                maxLength={255}
                                                                {...register(`experienceDetails.${index}.organisationName`)}
                                                            />
                                                            <InputText
                                                                label='Department'
                                                                id={`experienceDetails.${index}.department`}
                                                                maxLength={100}
                                                                {...register(`experienceDetails.${index}.department`)}
                                                            />
                                                            <InputText
                                                                label='Designation'
                                                                id={`experienceDetails.${index}.designation`}
                                                                maxLength={100}
                                                                {...register(`experienceDetails.${index}.designation`)}
                                                            />
                                                            <Controller
                                                                name={`experienceDetails.${index}.joinDate`}
                                                                control={control}
                                                                render={({ field, fieldState }) => {
                                                                    const experienceDetails = watch('experienceDetails') as any[];
                                                                    const exitDate = experienceDetails[index]?.exitDate;
                                                                    return (
                                                                        <div className='flex flex-col gap-1.5 [&>div]:mt-0'>
                                                                            <DateField
                                                                                field={{
                                                                                    ...field,
                                                                                    onChange: (value: any) => {
                                                                                        field.onChange(value);
                                                                                        if (value && exitDate) {
                                                                                            const { years, months } =
                                                                                                calculateYearsAndMonths(value, exitDate);
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfYears`,
                                                                                                years.toString(),
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfMonths`,
                                                                                                months.toString(),
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                        } else {
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfYears`,
                                                                                                '',
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfMonths`,
                                                                                                '',
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                fieldState={fieldState}
                                                                                label='Join Date'
                                                                                placeholder='Pick join date'
                                                                            />
                                                                        </div>
                                                                    );
                                                                }}
                                                            />
                                                            <Controller
                                                                name={`experienceDetails.${index}.exitDate`}
                                                                control={control}
                                                                render={({ field, fieldState }) => {
                                                                    const experienceDetails = watch('experienceDetails') as any[];
                                                                    const joinDate = experienceDetails[index]?.joinDate;
                                                                    return (
                                                                        <div className='flex flex-col gap-1.5 [&>div]:mt-0'>
                                                                            <DateField
                                                                                field={{
                                                                                    ...field,
                                                                                    onChange: (value: any) => {
                                                                                        field.onChange(value);
                                                                                        if (value && joinDate) {
                                                                                            const { years, months } =
                                                                                                calculateYearsAndMonths(joinDate, value);
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfYears`,
                                                                                                years.toString(),
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfMonths`,
                                                                                                months.toString(),
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                        } else {
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfYears`,
                                                                                                '',
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                            setValue(
                                                                                                `experienceDetails.${index}.noOfMonths`,
                                                                                                '',
                                                                                                {
                                                                                                    shouldValidate: false,
                                                                                                    shouldDirty: false
                                                                                                }
                                                                                            );
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                fieldState={fieldState}
                                                                                label='Exit Date'
                                                                                placeholder='Pick exit date'
                                                                            />
                                                                        </div>
                                                                    );
                                                                }}
                                                            />
                                                            <InputText
                                                                label='No. Of Years'
                                                                id={`experienceDetails.${index}.noOfYears`}
                                                                {...register(`experienceDetails.${index}.noOfYears`)}
                                                                disabled
                                                                className='[&>input]:cursor-not-allowed [&>input]:bg-muted [&>input]:opacity-70'
                                                            />
                                                            <InputText
                                                                label='No. Of Months'
                                                                id={`experienceDetails.${index}.noOfMonths`}
                                                                {...register(`experienceDetails.${index}.noOfMonths`)}
                                                                disabled
                                                                className='[&>input]:cursor-not-allowed [&>input]:bg-muted [&>input]:opacity-70'
                                                            />
                                                            <InputText
                                                                label='Annual Salary'
                                                                id={`experienceDetails.${index}.annualSalary`}
                                                                maxLength={15}
                                                                {...register(`experienceDetails.${index}.annualSalary`)}
                                                            />
                                                            <div className='md:col-span-2 lg:col-span-3'>
                                                                <InputTextarea
                                                                    label='Organisation Address'
                                                                    id={`experienceDetails.${index}.organisationAddress`}
                                                                    maxLength={500}
                                                                    minHeight={60}
                                                                    {...register(`experienceDetails.${index}.organisationAddress`)}
                                                                    error={(errors.experienceDetails as any)?.[index]?.organisationAddress?.message}
                                                                    placeholder='Enter organisation address...'
                                                                />
                                                            </div>
                                                            <div className='md:col-span-2 lg:col-span-3'>
                                                                <InputTextarea
                                                                    label='Reason For Leaving'
                                                                    id={`experienceDetails.${index}.reasonForLeaving`}
                                                                    maxLength={500}
                                                                    minHeight={60}
                                                                    {...register(`experienceDetails.${index}.reasonForLeaving`)}
                                                                    error={(errors.experienceDetails as any)?.[index]?.reasonForLeaving?.message}
                                                                    placeholder='Enter reason for leaving...'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Document Upload */}
                                {currentStep === 5 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Document Upload</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please upload required documents</p>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='rounded-md border'>
                                                <div className='flex items-center justify-between border-b bg-muted px-4 py-2'>
                                                    <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                        DOCUMENT UPLOAD DETAILS [ONLY JPEG,DOCX,DOC,PDF FILES (0-2MB)]
                                                    </h3>
                                                    <div className='flex items-center gap-2'>
                                                        <Button
                                                            type='button'
                                                            variant='outline'
                                                            className='h-7 w-auto border-primary/30 text-primary hover:bg-primary/10'
                                                            onClick={() => {
                                                                const vals = getValues('documentList');
                                                                if (vals && vals.length > 0) replaceDocument(vals);
                                                            }}>
                                                            <RefreshCw className='mr-1 h-3.5 w-3.5' /> Force Binding
                                                        </Button>
                                                        <Button
                                                            type='button'
                                                            className='h-7 w-auto rounded-md bg-secondary px-2.5 py-1.5 text-secondary-foreground text-xs shadow-sm hover:bg-secondary/80'
                                                            onClick={() => appendDocument({} as any)}>
                                                            <Plus className='mr-1 h-3.5 w-3.5' /> Add Document
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            {documentFields.length === 0 && (
                                                <div className='rounded-md border p-6 text-muted-foreground text-sm'>
                                                    No documents added yet. Click "Add Document" to start.
                                                </div>
                                            )}
                                            <div className='space-y-4'>
                                                {documentFields.map((field, index) => {
                                                    const selectedFile = watchDocuments?.[index]?.document?.[0];
                                                    const fileName = selectedFile?.name;
                                                    const existingFileName = (watchDocuments?.[index] as any)?.documentImageName;
                                                    const displayFileName = fileName || existingFileName;
                                                    return (
                                                        <div key={field.id} className='rounded-lg border bg-card p-4 shadow-sm'>
                                                            <div className='mb-3 flex items-center justify-between'>
                                                                <div className='font-semibold'>Document #{index + 1}</div>
                                                                <div className='flex gap-2'>
                                                                    <Badge variant='secondary'>Row {index + 1}</Badge>
                                                                    <Button
                                                                        type='button'
                                                                        className='h-7 w-auto rounded-md px-2.5 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground'
                                                                        onClick={() => removeDocument(index)}>
                                                                        <Trash2 className='mr-1 h-3.5 w-3.5' /> Remove
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                                                                <InputText
                                                                    label='Document Name *'
                                                                    id={`documentList.${index}.documentName`}
                                                                    maxLength={255}
                                                                    {...register(`documentList.${index}.documentName`)}
                                                                    placeholder='Enter document name'
                                                                    error={(errors.documentList as any)?.[index]?.documentName?.message}
                                                                />
                                                                <InputText
                                                                    label='Description *'
                                                                    id={`documentList.${index}.documentDescription`}
                                                                    maxLength={400}
                                                                    {...register(`documentList.${index}.documentDescription`)}
                                                                    placeholder='Enter description'
                                                                    error={(errors.documentList as any)?.[index]?.documentDescription?.message}
                                                                />
                                                                <div className='space-y-2 md:col-span-2'>
                                                                    <Label>Upload Document</Label>
                                                                    <div className='flex items-center gap-2'>
                                                                        <input
                                                                            type='file'
                                                                            id={`documentList.${index}.document`}
                                                                            accept='.jpeg,.jpg,.docx,.doc,.pdf'
                                                                            {...register(`documentList.${index}.document`)}
                                                                            className='hidden'
                                                                        />
                                                                        <Button
                                                                            type='button'
                                                                            variant='outline'
                                                                            size='sm'
                                                                            className='w-fit'
                                                                            onClick={() =>
                                                                                document
                                                                                    .getElementById(`documentList.${index}.document`)
                                                                                    ?.click()
                                                                            }>
                                                                            <Upload className='mr-1 h-4 w-4' /> Choose File
                                                                        </Button>
                                                                        {displayFileName && (
                                                                            <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-2'>
                                                                                <span className='text-muted-foreground text-sm'>
                                                                                    Selected:
                                                                                </span>
                                                                                <span className='max-w-xs truncate font-medium text-sm'>
                                                                                    {displayFileName}
                                                                                </span>
                                                                                {selectedFile && (
                                                                                    <Badge variant='secondary' className='ml-2'>
                                                                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                                                                    </Badge>
                                                                                )}
                                                                                {existingFileName && !selectedFile && (
                                                                                    <Badge variant='outline' className='ml-2'>
                                                                                        Existing File
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {!displayFileName && (
                                                                            <span className='text-muted-foreground text-sm'>
                                                                                No file selected
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {(errors.documentList as any)?.[index]?.document?.message && (
                                                                        <div className='font-medium text-[0.8rem] text-destructive'>
                                                                            {String((errors.documentList as any)?.[index]?.document?.message)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 6: Medical Record */}
                                {currentStep === 6 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Medical Record</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please provide the employee&apos;s health information
                                            </p>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='rounded-md border'>
                                                <div className='border-b bg-muted px-4 py-2'>
                                                    <h3 className='font-semibold text-base text-gray-900 uppercase'>MEDICAL RECORD</h3>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <InputText
                                                        label="Employee's Height"
                                                        id='employeeHeight'
                                                        placeholder='Height (e.g., 175.50)'
                                                        maxLength={6}
                                                        onKeyDown={(e) => {
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ') {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === '.') {
                                                                const target = e.target as HTMLInputElement;
                                                                if (target.value.includes('.')) {
                                                                    e.preventDefault();
                                                                    return;
                                                                }
                                                            } else if (!/^[0-9]$/.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('employeeHeight')}
                                                        error={errors.employeeHeight?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='Unit of measure (Height)'
                                                        id='employeeHeightUnit'
                                                        placeholder='Unit of measure'
                                                        maxLength={10}
                                                        {...register('employeeHeightUnit')}
                                                        error={errors.employeeHeightUnit?.message as string | undefined}
                                                    />
                                                </div>
                                                <InputText
                                                    label='Eye Sight Issue'
                                                    id='eyeSightIssue'
                                                    maxLength={255}
                                                    {...register('eyeSightIssue')}
                                                    error={errors.eyeSightIssue?.message as string | undefined}
                                                />
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <InputText
                                                        label="Employee's Weight"
                                                        id='employeeWeight'
                                                        placeholder='Weight (e.g., 75.50)'
                                                        maxLength={6}
                                                        onKeyDown={(e) => {
                                                            const controlKeys = [
                                                                'Backspace',
                                                                'Delete',
                                                                'Tab',
                                                                'Escape',
                                                                'Enter',
                                                                'ArrowLeft',
                                                                'ArrowRight',
                                                                'ArrowUp',
                                                                'ArrowDown'
                                                            ];
                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
                                                                return;
                                                            }
                                                            if (e.key === ' ') {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            if (e.key === '.') {
                                                                const target = e.target as HTMLInputElement;
                                                                if (target.value.includes('.')) {
                                                                    e.preventDefault();
                                                                    return;
                                                                }
                                                            } else if (!/^[0-9]$/.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        {...register('employeeWeight')}
                                                        error={errors.employeeWeight?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='Unit of measure (Weight)'
                                                        id='employeeWeightUnit'
                                                        placeholder='Unit of measure'
                                                        maxLength={10}
                                                        {...register('employeeWeightUnit')}
                                                        error={errors.employeeWeightUnit?.message as string | undefined}
                                                    />
                                                </div>
                                                <InputText
                                                    label='Any Health Issue'
                                                    id='anyHealthIssue'
                                                    maxLength={500}
                                                    {...register('anyHealthIssue')}
                                                    error={errors.anyHealthIssue?.message as string | undefined}
                                                />
                                            </div>
                                            <InputTextarea
                                                label='Identification Mark'
                                                id='identificationMark'
                                                maxLength={255}
                                                minHeight={80}
                                                {...register('identificationMark')}
                                                error={errors.identificationMark?.message as string | undefined}
                                                placeholder='Enter identification mark details...'
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 7: Other Details */}
                                {currentStep === 7 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Other Details</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please provide additional information</p>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='rounded-md border'>
                                                <div className='border-b bg-muted px-4 py-2'>
                                                    <h3 className='font-semibold text-base text-gray-900 uppercase'>OTHER DETAILS</h3>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                                <div className='space-y-1.5'>
                                                    <InputText
                                                        label='Biometric Code'
                                                        id='biometricCode'
                                                        maxLength={50}
                                                        {...register('biometricCode')}
                                                        error={errors.biometricCode?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='RF card ID'
                                                        id='rfCardId'
                                                        maxLength={50}
                                                        {...register('rfCardId')}
                                                        error={errors.rfCardId?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='MS Teams UserName'
                                                        id='msTeamsUserName'
                                                        maxLength={100}
                                                        {...register('msTeamsUserName')}
                                                        error={errors.msTeamsUserName?.message as string | undefined}
                                                    />
                                                    <InputText
                                                        label='MS Teams Password'
                                                        id='msTeamsPassword'
                                                        type='password'
                                                        maxLength={255}
                                                        {...register('msTeamsPassword')}
                                                        error={errors.msTeamsPassword?.message as string | undefined}
                                                    />
                                                </div>
                                                <div className='space-y-4'>
                                                    <div className='space-y-2'>
                                                        <Label className='mb-2 block'>Options</Label>
                                                        <div className='space-y-3'>
                                                            <Controller
                                                                name='punchRelaxation'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className='flex items-center space-x-2'>
                                                                        <Checkbox
                                                                            id='punchRelaxation'
                                                                            checked={!!field.value}
                                                                            onCheckedChange={(v) => field.onChange(!!v)}
                                                                        />
                                                                        <Label
                                                                            htmlFor='punchRelaxation'
                                                                            className='cursor-pointer leading-none'>
                                                                            Punch Relaxation ?
                                                                        </Label>
                                                                    </div>
                                                                )}
                                                            />
                                                            <Controller
                                                                name='stopPension'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className='flex items-center space-x-2'>
                                                                        <Checkbox
                                                                            id='stopPension'
                                                                            checked={!!field.value}
                                                                            onCheckedChange={(v) => field.onChange(!!v)}
                                                                        />
                                                                        <Label
                                                                            htmlFor='stopPension'
                                                                            className='cursor-pointer leading-none'>
                                                                            Stop Pension ?
                                                                        </Label>
                                                                    </div>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    {stopPension && (
                                                        <Controller
                                                            name='dateOfStopPension'
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <DateField
                                                                    field={field}
                                                                    fieldState={fieldState}
                                                                    label='Date of Stop Pension'
                                                                    placeholder='Pick date of stop pension'
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                    <Controller
                                                        name='employeeLeft'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div className='flex items-center space-x-2'>
                                                                <Checkbox
                                                                    id='employeeLeft'
                                                                    checked={!!field.value}
                                                                    onCheckedChange={(v) => field.onChange(!!v)}
                                                                />
                                                                <Label htmlFor='employeeLeft' className='cursor-pointer leading-none'>
                                                                    Employee Left ?
                                                                </Label>
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            {employeeLeft && (
                                                <div className='w-[50%] rounded-lg border bg-muted/50 p-4'>
                                                    <div className='space-y-2 md:col-span-2'>
                                                        <Controller
                                                            name='lastWorkingDay'
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <DateField
                                                                    field={field}
                                                                    fieldState={fieldState}
                                                                    label='Last Working day'
                                                                    placeholder='Pick last working day'
                                                                />
                                                            )}
                                                        />
                                                        <Controller
                                                            name='reasonForLeaving'
                                                            control={control}
                                                            render={({ field }) => {
                                                                const leavingReasons = options?.leavingReasons || [];
                                                                return (
                                                                    <div className='space-y-2 md:col-span-2 '>
                                                                        <Label>Reason for Leaving *</Label>
                                                                        <Select onValueChange={field.onChange} value={field.value || ''}>
                                                                            <SelectTrigger
                                                                                className={cn(
                                                                                    errors.reasonForLeaving
                                                                                        ? 'border-destructive focus-visible:ring-destructive'
                                                                                        : 'border-input focus-visible:ring-ring'
                                                                                )}>
                                                                                <SelectValue placeholder='Select reason for leaving' />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {leavingReasons
                                                                                    .filter((reason: ILeaveReasonDropdown) => {
                                                                                        return (
                                                                                            reason.key != null &&
                                                                                            reason.key !== undefined &&
                                                                                            reason.key !== 0
                                                                                        );
                                                                                    })
                                                                                    .map((reason: ILeaveReasonDropdown) => {
                                                                                        const key = reason.key?.toString().trim();
                                                                                        if (!key || key === '') return null;
                                                                                        const value = reason.value || String(reason.key);
                                                                                        return (
                                                                                            <SelectItem key={reason.key} value={key}>
                                                                                                {value}
                                                                                            </SelectItem>
                                                                                        );
                                                                                    })
                                                                                    .filter(Boolean)}
                                                                            </SelectContent>
                                                                        </Select>
                                                                        {errors.reasonForLeaving && (
                                                                            <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                {errors.reasonForLeaving.message as string | undefined}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 8: Payroll */}
                                {currentStep === 8 && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h2 className='font-bold text-2xl text-gray-900'>Payroll</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>Please configure salary and deductions</p>
                                        </div>
                                        {savedEmployeeId && watch('employeeCode') ? (
                                            <PayrollTab
                                                employeeId={savedEmployeeId}
                                                employeeCode={watch('employeeCode')}
                                                MI_Id={30}
                                                onSuccess={onSuccess}
                                            />
                                        ) : (
                                            <div className='rounded-md border p-6 text-center text-muted-foreground'>
                                                Payroll tab will be available after saving employee details.
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
                                    onClick={() => {
                                        reset();
                                        setCurrentStep(1);
                                    }}
                                    disabled={isSubmittingAny}
                                    className='w-fit transition-all duration-200 hover:scale-105'>
                                    Reset Form
                                </Button>

                                <div className='flex gap-3'>
                                    {currentStep > 1 && (
                                        <Button type='button' variant='outline' onClick={prevStep} disabled={isSubmittingAny}>
                                            <ChevronLeft className='mr-2 h-4 w-4' />
                                            Previous
                                        </Button>
                                    )}

                                    {currentStep < steps.length ? (
                                        <Button type='button' onClick={nextStep} disabled={isSubmittingAny}>
                                            Next
                                            <ChevronRight className='ml-2 h-4 w-4' />
                                        </Button>
                                    ) : (
                                        <Button
                                            type='button'
                                            onClick={onFormSubmit}
                                            disabled={isSubmittingAny}
                                            className='min-w-[160px] transition-all duration-200 hover:scale-105'>
                                            {isSubmittingAny ? (
                                                <span>Saving...</span>
                                            ) : (
                                                <>
                                                    <Save className='mr-2 h-4 w-4' />
                                                    Submit Employee
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
