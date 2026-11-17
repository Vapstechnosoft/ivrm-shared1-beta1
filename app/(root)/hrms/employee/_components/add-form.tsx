'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DateField } from '@/components/ui/dateField';
import { FormError, Label } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { InputTextarea } from '@/components/ui/extension/input-textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HRMS_MI_ID } from '@/constants/hrms-config';
import { useStateDropdown } from '@/hooks/hrms/useEmployeeRegister';
import {
    useBankDropdown,
    useBloodGroupDropdown,
    useCasteCategoryDropdown,
    useCasteDropdown,
    useContactTypeDropdown,
    useCountryDropdown,
    useCourseDropdown,
    useDepartmentDropdown,
    useDesignationDropdown,
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
    useSaveEmployee,
    useSaveEmployeeDocument,
    useSaveEmployeeExperience,
    useSaveEmployeeMedical,
    useSaveEmployeeOtherDetails,
    useSaveEmployeeQualification,
    useSaveEmployeeSalaryDetails,
    useScoreTypeDropdown,
    useSpecializationDropdown,
    useTeachingTypeDropdown
} from '@/hooks/hrms/useEmployeeRegister';
import { getIconByName } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import { employeeRegisterSchemas } from '@/schemas/hrms/employee-register-schemas';
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
import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import {
    employeeRegisterSteps,
    fileToBase64,
    mapFormDataToApiFormat,
    mapFormDataToApiFormatWithoutAddress,
    mapFormDataToPascalCaseApiFormat,
    tabFieldMap
} from './employee-register-helper';
import { PayrollTab } from './payroll-tab';

// Helper component for Qualification State Dropdown
function QualificationStateDropdown({
    control,
    index,
    countryId: propCountryId,
    setValue,
    fallbackStates = []
}: {
    control: any;
    index: number;
    countryId?: string | null;
    setValue?: any;
    fallbackStates?: any[];
}) {
    // improved: useWatch directly for better reactivity
    const watchedCountry = useWatch({
        control,
        name: `qualificationDetails.${index}.qualificationCountry`
    });

    const countryId = propCountryId ?? watchedCountry;

    // Convert to number for API call
    const countryIdNum = countryId ? (Number.isNaN(Number(countryId)) ? null : Number(countryId)) : null;

    const { data: fetchedStates = [], isLoading } = useStateDropdown(countryIdNum);

    const availableStates: IStateDropdown[] = countryIdNum
        ? Array.isArray(fetchedStates)
            ? fetchedStates
            : []
        : (fallbackStates as IStateDropdown[]);

    const prevCountryIdRef = useRef<string | null>(countryId as string | null);

    useEffect(() => {
        if (!setValue) return;
        // Only clear if country actually changed
        if (prevCountryIdRef.current !== countryId) {
            prevCountryIdRef.current = countryId as string | null;
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
                            ) : availableStates.length === 0 ? (
                                <SelectItem value='no-options' disabled>
                                    {countryIdNum ? 'No states found' : 'Select Country first'}
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
                                            <SelectItem key={`qual-state-${index}-${state.key}`} value={key} textValue={value}>
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

// Helper function to render dropdown options with loading state
const renderDropdownOptions = <T extends { key?: any; value?: any }>(
    items: T[],
    isLoading: boolean,
    renderItem: (item: T) => React.ReactNode,
    loadingText = 'Loading...'
) => {
    if (isLoading) {
        return (
            <SelectItem value='__loading__' disabled>
                {loadingText}
            </SelectItem>
        );
    }
    if (items.length === 0) {
        return (
            <SelectItem value='__no_options__' disabled>
                No options available
            </SelectItem>
        );
    }
    return items.map(renderItem).filter(Boolean);
};

// Type definition using imported schema
type FormFields = z.infer<typeof employeeRegisterSchemas.add>;

const steps = employeeRegisterSteps;

interface AddEmployeeFormProps {
    onSuccess?: () => void;
    className?: string;
}

/**
 * Add Employee Form - Standalone form for adding new employees
 * Matches the pattern from preadmission application-form add-form
 * No edit logic - only add mode
 */
export default function AddEmployeeForm({ onSuccess, className = '' }: AddEmployeeFormProps): React.ReactElement {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        trigger,
        reset,
        setError,
        clearErrors,
        formState // Expose formState directly
    } = useForm<FormFields>({
        resolver: zodResolver(employeeRegisterSchemas.add),
        mode: 'onChange'
        // defaultValues: formDefaultValues // We need to move defaultValues here or define them before useForm
    });

    const { errors, isSubmitting } = formState;

    // Watch for dependent dropdown values
    const selectedReligion = useWatch({ control, name: 'religion' });
    const selectedCasteCategory = useWatch({ control, name: 'casteCategory' });

    // Fetch onload data for new employee (to get salary heads etc)
    const { data: onloadData } = useEmployeeRegisterOnload(HRMS_MI_ID, 0);

    // Grade dropdown - API: /api/MasterDropDown/GetGradeList
    const { data: gradeDropdownResponse, isLoading: isLoadingGrades } = useGradeDropdown();
    // Extract data from response (handle ApiResponse wrapper if needed)
    const gradeDropdown: IGradeDropdown[] = Array.isArray(gradeDropdownResponse)
        ? gradeDropdownResponse
        : (gradeDropdownResponse as any)?.data || [];

    // Group Type dropdown - API: /api/MasterDropDown/GroupType
    const { data: groupTypeDropdownResponse, isLoading: isLoadingGroupTypes } = useGroupTypeDropdown();
    // Extract data from response (handle ApiResponse wrapper if needed)
    const groupTypeDropdown: IGroupTypeDropdown[] = Array.isArray(groupTypeDropdownResponse)
        ? groupTypeDropdownResponse
        : (groupTypeDropdownResponse as any)?.data || [];

    // Employee Type dropdown - API: /api/MasterDropDown/GetEmployeeType
    const { data: employeeTypeDropdownResponse, isLoading: isLoadingEmployeeTypes } = useEmployeeTypeDropdown();
    // Extract data from response (handle ApiResponse wrapper if needed)
    const employeeTypeDropdown: IEmployeeTypeDropdown[] = Array.isArray(employeeTypeDropdownResponse)
        ? employeeTypeDropdownResponse
        : (employeeTypeDropdownResponse as any)?.data || [];

    // Institution dropdown - API: /api/MasterDropDown/GetInstitutionList
    const { data: institutionDropdownResponse, isLoading: isLoadingInstitutions } = useInstitutionDropdown();
    // Extract data from response (handle ApiResponse wrapper if needed)
    const institutionDropdown: IInstitutionDropdown[] = Array.isArray(institutionDropdownResponse)
        ? institutionDropdownResponse
        : (institutionDropdownResponse as any)?.data || [];

    // Designation dropdown - API: /api/MasterDropDown/GetDesignation
    const { data: designationDropdownResponse, isLoading: isLoadingDesignations } = useDesignationDropdown();
    // Extract data from response (handle ApiResponse wrapper if needed)
    const designationDropdown: IDesignationDropdown[] = Array.isArray(designationDropdownResponse)
        ? designationDropdownResponse
        : (designationDropdownResponse as any)?.data || [];

    // Department dropdown - API: /api/MasterDropDown/GetDepartments
    const { data: departmentDropdownResponse, isLoading: isLoadingDepartments } = useDepartmentDropdown();
    const departmentDropdown: IDepartmentDropdown[] = useMemo(() => {
        const rawData = Array.isArray(departmentDropdownResponse)
            ? departmentDropdownResponse
            : (departmentDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Department Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                // Return item as is if it already matches interface (has key/value)
                if (item.key !== undefined && item.value !== undefined) return item;
                // Otherwise map from known API fields
                // Fallback debug log for first item
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Department Item:', item);
                return {
                    key: String(item.hrmD_Id ?? item.HRMD_Id ?? item.departmentId ?? item.key ?? ''),
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
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [departmentDropdownResponse]);

    // Gender dropdown - API: /api/MasterDropDown/GetGenderList
    const { data: genderDropdownResponse, isLoading: isLoadingGenders } = useGenderDropdown();
    const genderDropdown: IGenderDropdown[] = Array.isArray(genderDropdownResponse)
        ? genderDropdownResponse
        : (genderDropdownResponse as any)?.data || [];

    // Marital Status dropdown - API: /api/MasterDropDown/GetMaritalStateList
    const { data: maritalStatusDropdownResponse, isLoading: isLoadingMaritalStatuses } = useMaritalStatusDropdown();
    const maritalStatusDropdown: IMaritalStatusDropdown[] = Array.isArray(maritalStatusDropdownResponse)
        ? maritalStatusDropdownResponse
        : (maritalStatusDropdownResponse as any)?.data || [];

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
                    key: String(
                        item.ivrmmR_Id ?? item.IVRMMR_Id ?? item.hrmR_Id ?? item.religionId ?? item.ReligionId ?? item.id ?? item.key ?? ''
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
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [religionDropdownResponse]);

    // Caste Category dropdown - Dependent on Religion
    // API: /api/MasterDropDown/caste_category_drop_down_by_religion/{id}
    const { data: casteCategoryDropdownResponse, isLoading: isLoadingCasteCategories } = useCasteCategoryDropdown(selectedReligion);
    const casteCategoryDropdown: ICasteCategoryDropdown[] = useMemo(() => {
        const rawData = Array.isArray(casteCategoryDropdownResponse)
            ? casteCategoryDropdownResponse
            : (casteCategoryDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Caste Category Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Caste Category Item:', item);
                return {
                    key: String(item.ivrmmCC_Id ?? item.IVRMMCC_Id ?? item.imcC_Id ?? item.IMCC_Id ?? item.id ?? item.key ?? ''),
                    value: String(
                        item.ivrmmCC_Name ?? item.IVRMMCC_Name ?? item.imcC_CategoryName ?? item.name ?? item.value ?? item.label ?? ''
                    )
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [casteCategoryDropdownResponse]);

    // Caste dropdown - Dependent on Caste Category
    // API: /api/MasterDropDown/caste_drop_down_by_caste_category/{id}
    const { data: casteDropdownResponse, isLoading: isLoadingCastes } = useCasteDropdown(selectedCasteCategory);
    const casteDropdown: ICasteDropdown[] = useMemo(() => {
        const rawData = Array.isArray(casteDropdownResponse) ? casteDropdownResponse : (casteDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Caste Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                if (item.key !== undefined && item.value !== undefined) return item;
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Caste Item:', item);
                return {
                    key: String(item.ivrmmC_Id ?? item.IVRMMC_Id ?? item.imC_Id ?? item.IMC_Id ?? item.id ?? item.key ?? ''),
                    value: String(item.ivrmmC_Name ?? item.IVRMMC_Name ?? item.imC_CasteName ?? item.name ?? item.value ?? item.label ?? '')
                };
            })
            .filter((item: any) => item.key != null && item.key !== undefined && item.key !== '' && item.key !== '0');
    }, [casteDropdownResponse]);

    // Payment Mode dropdown - API: /api/MasterDropDown/GetPaymentModeList
    const { data: paymentModeDropdownResponse, isLoading: isLoadingPaymentModes } = usePaymentModeDropdown();
    const paymentModeDropdown: IPaymentModeDropdown[] = Array.isArray(paymentModeDropdownResponse)
        ? paymentModeDropdownResponse
        : (paymentModeDropdownResponse as any)?.data || [];

    // Bank dropdown - API: /api/MasterDropDown/GetBankList
    const { data: bankDropdownResponse, isLoading: isLoadingBanks } = useBankDropdown();
    const bankDropdown: IBankDropdown[] = Array.isArray(bankDropdownResponse)
        ? bankDropdownResponse
        : (bankDropdownResponse as any)?.data || [];

    // Country dropdown - API: /api/MasterDropDown/GetCountryList
    const { data: countryDropdownResponse, isLoading: isLoadingCountries } = useCountryDropdown();
    const countryDropdown: ICountryDropdown[] = Array.isArray(countryDropdownResponse)
        ? countryDropdownResponse
        : (countryDropdownResponse as any)?.data || [];

    // Specialization dropdown - API: /api/MasterDropDown/GetSpecialisationList
    const { data: specializationDropdownResponse, isLoading: isLoadingSpecializations } = useSpecializationDropdown();
    const specializationDropdown: ISpecializationDropdown[] = useMemo(() => {
        const rawData = Array.isArray(specializationDropdownResponse)
            ? specializationDropdownResponse
            : (specializationDropdownResponse as any)?.data || [];
        console.log('🔍 [DEBUG] Specialization Raw Data:', rawData);
        return rawData
            .map((item: any) => {
                // Return if already in correct format
                if (item.key !== undefined && item.value !== undefined) return item;
                // Log first item shape for debugging
                if (rawData.indexOf(item) === 0) console.log('🔍 [DEBUG] First Specialization Item:', item);
                // Map from likely API keys
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
    const leaveReasonDropdown: ILeaveReasonDropdown[] = Array.isArray(leaveReasonDropdownResponse)
        ? leaveReasonDropdownResponse
        : (leaveReasonDropdownResponse as any)?.data || [];

    // Blood Group dropdown - API: /api/MasterDropDown/GetBloodGroupList
    const { data: bloodGroupDropdownResponse, isLoading: isLoadingBloodGroups } = useBloodGroupDropdown();
    const bloodGroupDropdown: IBloodGroupDropdown[] = Array.isArray(bloodGroupDropdownResponse)
        ? bloodGroupDropdownResponse
        : (bloodGroupDropdownResponse as any)?.data || [];

    // Salary Type dropdown - API: /api/MasterDropDown/GetSalaryTypeList
    const { data: salaryTypeDropdownResponse, isLoading: isLoadingSalaryTypes } = useSalaryTypeDropdown();
    const salaryTypeDropdown: ISalaryTypeDropdown[] = Array.isArray(salaryTypeDropdownResponse)
        ? salaryTypeDropdownResponse
        : (salaryTypeDropdownResponse as any)?.data || [];

    // Teaching Type dropdown - API: /api/MasterDropDown/GetTeachingTypeList
    const { data: teachingTypeDropdownResponse, isLoading: isLoadingTeachingTypes } = useTeachingTypeDropdown();
    const teachingTypeDropdown: ITeachingTypeDropdown[] = Array.isArray(teachingTypeDropdownResponse)
        ? teachingTypeDropdownResponse
        : (teachingTypeDropdownResponse as any)?.data || [];

    // Score Type dropdown - API: /api/MasterDropDown/ScoreTypeList
    const { data: scoreTypeDropdownResponse, isLoading: isLoadingScoreTypes } = useScoreTypeDropdown();
    const scoreTypeDropdown: IScoreTypeDropdown[] = Array.isArray(scoreTypeDropdownResponse)
        ? scoreTypeDropdownResponse
        : (scoreTypeDropdownResponse as any)?.data || [];

    // Contact Type dropdown - API: /api/MasterDropDown/GetContactType
    const { data: contactTypeDropdownResponse, isLoading: isLoadingContactTypes } = useContactTypeDropdown();
    const contactTypeDropdown: IContactTypeDropdown[] = Array.isArray(contactTypeDropdownResponse)
        ? contactTypeDropdownResponse
        : (contactTypeDropdownResponse as any)?.data || [];

    // Course dropdown - API: /api/MasterDropDown/GetCourseList
    const { data: courseDropdownResponse, isLoading: isLoadingCourses } = useCourseDropdown();
    const courseDropdown: ICourseDropdown[] = Array.isArray(courseDropdownResponse)
        ? courseDropdownResponse
        : (courseDropdownResponse as any)?.data || [];

    // Options object - Multiple dropdowns are integrated, others will be added one by one as APIs are provided
    const options = useMemo(() => {
        return {
            grades: gradeDropdown || [],
            groupTypes: groupTypeDropdown || [],
            empTypes: employeeTypeDropdown.map((item) => ({
                key: item.key || item.hrmeT_Id || 0,
                value: item.value || item.hrmeT_EmployeeType || ''
            })),
            institutions: institutionDropdown || [],
            designations: designationDropdown || [],
            genders: genderDropdown || [],
            maritalStatuses: maritalStatusDropdown || [],
            religions: religionDropdown || [],
            casteCategories: casteCategoryDropdown || [],
            castes: casteDropdown || [],
            modeOfPayment: paymentModeDropdown || [],
            banks: bankDropdown || [],
            departments: departmentDropdown || [],
            countries: countryDropdown || [],
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
        courseDropdown,
        specializationDropdown,
        leaveReasonDropdown,
        bloodGroupDropdown,
        salaryTypeDropdown,
        teachingTypeDropdown,
        scoreTypeDropdown,
        onloadData
    ]);

    // Loading states object for individual dropdowns
    const dropdownLoadingStates = useMemo(() => {
        return {
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
            modeOfPayment: isLoadingPaymentModes,
            banks: isLoadingBanks,
            countries: isLoadingCountries,
            courses: isLoadingCourses,
            specialisations: isLoadingSpecializations,
            teachingNonTeaching: isLoadingTeachingTypes,
            bloodGroups: isLoadingBloodGroups,
            salaryTypes: isLoadingSalaryTypes,
            cgpaPercentageTypes: isLoadingScoreTypes,
            contactTypes: isLoadingContactTypes,
            leavingReasons: isLoadingLeaveReasons
        };
    }, [
        isLoadingGrades,
        isLoadingGroupTypes,
        isLoadingEmployeeTypes,
        isLoadingInstitutions,
        isLoadingDesignations,
        isLoadingGenders,
        isLoadingMaritalStatuses,
        isLoadingReligions,
        isLoadingCasteCategories,
        isLoadingCastes,
        isLoadingPaymentModes,
        isLoadingBanks,
        isLoadingCountries,
        isLoadingCourses,
        isLoadingSpecializations,
        isLoadingTeachingTypes,
        isLoadingBloodGroups,
        isLoadingSalaryTypes,
        isLoadingScoreTypes,
        isLoadingContactTypes,
        isLoadingLeaveReasons
    ]);

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
    const { mutate: saveEmployeeMutation, isPending } = useSaveEmployee();
    const { mutate: saveQualificationDetails, isPending: isSavingQualification } = useSaveEmployeeQualification();
    const { mutate: saveExperienceDetails, isPending: isSavingExperience } = useSaveEmployeeExperience();
    const { mutate: saveDocumentDetails, isPending: isSavingDocument } = useSaveEmployeeDocument();
    const { mutate: saveMedicalDetails, isPending: isSavingMedical } = useSaveEmployeeMedical();
    const { mutate: saveOtherDetails, isPending: isSavingOther } = useSaveEmployeeOtherDetails();
    const { mutate: saveSalaryDetails, isPending: isSavingSalaryDetails } = useSaveEmployeeSalaryDetails();
    const savePersonalDetails = saveEmployeeMutation;
    const _saveBankDetails = saveEmployeeMutation;
    const isSavingBank = isPending;

    const isSubmittingAny =
        isSubmitting ||
        isPending ||
        isSavingQualification ||
        isSavingExperience ||
        isSavingDocument ||
        isSavingMedical ||
        isSavingOther ||
        isSavingSalaryDetails;

    // Add form - no edit mode (removed isEditMode variable - not needed)
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    // Local helper for PascalCase mapping used by Step 6/7
    const mapFormDataToPascalCaseLocal = (data: any) => {
        return mapFormDataToPascalCaseApiFormat(data, savedEmployeeId || 0, selectedPhoto);
    };
    const [_photoFile, setPhotoFile] = useState<File | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [savedEmployeeId, setSavedEmployeeId] = useState<number | null>(null);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    // Define local mapping helpers that were missing
    // Wrapper to map form data to API format
    const mapFormDataToApiFormatLocal = (formData: FormFields) => {
        return mapFormDataToApiFormat(formData, savedEmployeeId || 0);
    };

    const mapFormDataToApiFormatWithoutAddressLocal = (data: FormFields) => {
        const empId = savedEmployeeId || 0;
        return mapFormDataToApiFormatWithoutAddress(data, empId, selectedPhoto);
    };

    // Helper to get current tab key from step
    const getCurrentTabKey = () => steps.find((s) => s.id === currentStep)?.tabKey || 'employee';

    // Function to go to previous step
    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Function to go to next step
    const nextStep = async () => {
        const currentTabKey = getCurrentTabKey();
        const currentTabFields = tabFieldMap[currentTabKey] || [];

        console.log('🔍 [DEBUG] nextStep - Current Tab Key:', currentTabKey);
        console.log('🔍 [DEBUG] nextStep - Current Step:', currentStep);
        console.log('🔍 [DEBUG] nextStep - Fields to validate:', currentTabFields);

        if (currentTabFields.length > 0) {
            const isValid = await trigger(currentTabFields as any);
            console.log('🔍 [DEBUG] nextStep - Validation result:', isValid);
            if (!isValid) {
                console.error('❌ [DEBUG] nextStep - Validation failed, not proceeding');
                const formErrors = formState.errors;
                const errorMessages: string[] = [];
                currentTabFields.forEach((field: any) => {
                    const fieldError = (formErrors as any)[field];
                    if (fieldError) {
                        const errorMsg = typeof fieldError === 'string' ? fieldError : (fieldError as any)?.message;
                        if (errorMsg) {
                            errorMessages.push(errorMsg);
                        }
                    }
                });

                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0]);
                } else {
                    toast.error('Please fix the validation errors before proceeding');
                }
                return;
            }

            // Manual check for employee photo if it's in the current tab as requested in implementation plan
            if (currentTabKey === 'employee') {
                const photoValue = getValues('employeePhoto');
                if (!photoValue || photoValue.trim() === '') {
                    setError('employeePhoto', {
                        type: 'manual',
                        message: 'Employee Photo Required'
                    });
                    toast.error('Employee Photo Required');
                    return;
                }
            }
        }

        const data = getValues();
        const currentStepId = currentStep;
        console.log('🔍 [DEBUG] nextStep - Proceeding with step ID:', currentStepId);

        // Apply robust payment mode fix to ensure the name is sent to API and bank details are cleared for non-bank modes
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
                    p.employee.hrmE_BankAccountNo = '';
                }
                // Ensure bankRequest is passed with empty array as requested by user
                p.bankRequest = {
                    mI_Id: p.employee?.mI_Id || 30,
                    hrmE_Id: p.employee?.hrmE_Id || 0,
                    bankDetails: []
                };
            }
            return p;
        };

        // For steps 1 and 2, we need to save data via API before moving to next step
        if (currentStepId === 1) {
            // Employee Information tab - call /api/EmployeeRegistration/SavePersonalDetails
            // Save employee details without address (address fields will be null)
            const rawPayload = mapFormDataToApiFormatWithoutAddressLocal(data);
            // Force string conversion for required fields to match IEmployeeSaveRequest
            const payload: any = fixPaymentMode({
                ...rawPayload,
                employee: {
                    ...rawPayload.employee,
                    // Force string conversion for required fields to match IEmployeeSaveRequest
                    hrmE_EmployeeFirstName: String(data.firstName || ''),
                    hrmE_EmployeeMiddleName: String(data.middleName || ''),
                    hrmE_EmployeeLastName: String(data.lastName || ''),
                    hrmE_EmployeeCode: String(data.employeeCode || ''),
                    hrmE_FatherName: String(data.fatherName || ''),
                    hrmE_MotherName: String(data.motherName || ''),
                    hrmE_Gender: String(data.gender || ''),
                    hrmE_DOB: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
                    hrmE_DOJ: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString() : null,
                    hrmE_Id: savedEmployeeId || 0
                }
            });

            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Form Data:', data);
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Payload:', payload);
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Employee ID:', payload.employee.hrmE_Id);
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Address Fields Check (should be null/empty):');
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
            console.log('🔍 [DEBUG] Tab 1 (Employee Information) - Calling savePersonalDetails...');

            savePersonalDetails(payload, {
                onSuccess: (response: any) => {
                    console.log('✅ [DEBUG] Tab 1 (Employee Information) - Save Success:', response);
                    console.log('🔍 [DEBUG] Tab 1 - Full API Response:', JSON.stringify(response, null, 2));
                    console.log('🔍 [DEBUG] Tab 1 - Response Success:', response?.success);
                    console.log('🔍 [DEBUG] Tab 1 - Response Message:', response?.message);
                    console.log('🔍 [DEBUG] Tab 1 - Response Data:', response?.data);

                    // Verify request vs response - compare key fields
                    const responseData = response?.data || {};
                    const mismatches: string[] = [];
                    const keyFields = [
                        { req: 'hrmeT_Id', res: 'hrmeT_Id' },
                        { req: 'hrmgT_Id', res: 'hrmgT_Id' },
                        { req: 'hrmD_Id', res: 'hrmD_Id' },
                        { req: 'hrmdeS_Id', res: 'hrmdeS_Id' },
                        { req: 'hrmG_Id', res: 'hrmG_Id' },
                        { req: 'hrmE_EmployeeFirstName', res: 'hrmE_EmployeeFirstName' },
                        { req: 'hrmE_EmployeeMiddleName', res: 'hrmE_EmployeeMiddleName' },
                        { req: 'hrmE_EmployeeLastName', res: 'hrmE_EmployeeLastName' },
                        { req: 'hrmE_EmployeeCode', res: 'hrmE_EmployeeCode' },
                        { req: 'hrmE_FatherName', res: 'hrmE_FatherName' },
                        { req: 'hrmE_MotherName', res: 'hrmE_MotherName' },
                        { req: 'religionId', res: 'religionId' },
                        { req: 'casteCategoryId', res: 'casteCategoryId' },
                        { req: 'casteId', res: 'casteId' },
                        { req: 'hrmE_BloodGroup', res: 'hrmE_BloodGroup' },
                        { req: 'hrmE_SalaryType', res: 'hrmE_SalaryType' },
                        { req: 'hrmE_PaymentType', res: 'hrmE_PaymentType' },
                        { req: 'hrmE_MobileNo', res: 'hrmE_MobileNo' },
                        { req: 'hrmE_EmailId', res: 'hrmE_EmailId' },
                        { req: 'hrmE_PANCardNo', res: 'hrmE_PANCardNo' },
                        { req: 'hrmE_AadharCardNo', res: 'hrmE_AadharCardNo' },
                        { req: 'hrmE_NationalSSN', res: 'hrmE_NationalSSN' },
                        { req: 'hrmE_TechNonTeachingFlg', res: 'hrmE_TechNonTeachingFlg' },
                        { req: 'ivrmmG_Id', res: 'ivrmmG_Id' },
                        { req: 'ivrmmmS_Id', res: 'ivrmmmS_Id' }
                    ];

                    console.log('🔍 [DEBUG] Tab 1 - Request vs Response Comparison:');
                    keyFields.forEach(({ req, res }) => {
                        const reqValue = (payload.employee as any)[req];
                        const resValue = responseData[res as keyof typeof responseData];
                        const match =
                            reqValue === resValue ||
                            (reqValue == null && resValue == null) ||
                            (reqValue === 0 && resValue === 0) ||
                            (reqValue === false && resValue === false);
                        if (!match) {
                            mismatches.push(`${req}: Request="${reqValue}" vs Response="${resValue}"`);
                        }
                        console.log(`  ${match ? '✅' : '❌'} ${req}: ${reqValue} → ${resValue}`);
                    });

                    // Check date fields (format might differ)
                    const dateFields = [
                        { req: 'hrmE_DOB', res: 'hrmE_DOB' },
                        { req: 'hrmE_DOJ', res: 'hrmE_DOJ' },
                        { req: 'hrmE_doc', res: 'hrmE_doc' },
                        { req: 'hrmE_ExpectedRetirementDate', res: 'hrmE_ExpectedRetirementDate' }
                    ];

                    console.log('🔍 [DEBUG] Tab 1 - Date Fields Comparison:');
                    dateFields.forEach(({ req, res }) => {
                        const reqValue = (payload.employee as any)[req];
                        const resValue = responseData[res as keyof typeof responseData];
                        if (reqValue && resValue) {
                            const reqDate = new Date(String(reqValue)).toISOString().split('T')[0];
                            const resDate = new Date(String(resValue)).toISOString().split('T')[0];
                            const match = reqDate === resDate;
                            if (!match) {
                                mismatches.push(`${req}: Request="${reqValue}" vs Response="${resValue}"`);
                            }
                            console.log(`  ${match ? '✅' : '❌'} ${req}: ${reqDate} → ${resDate}`);
                        } else {
                            console.log(`  ⚠️ ${req}: ${reqValue} → ${resValue} (one or both null)`);
                        }
                    });

                    // Check payroll fields
                    const payrollFields = [
                        { req: 'hrmE_PFApplicableFlag', res: 'hrmE_PFApplicableFlag' },
                        { req: 'hrmE_PFMaxFlag', res: 'hrmE_PFMaxFlag' },
                        { req: 'hrmE_PFFixedFlag', res: 'hrmE_PFFixedFlag' },
                        { req: 'hrmE_PFAccNo', res: 'hrmE_PFAccNo' },
                        { req: 'hrmE_UINumber', res: 'hrmE_UINumber' },
                        { req: 'hrmE_ESIApplicableFlag', res: 'hrmE_ESIApplicableFlag' },
                        { req: 'hrmE_ESIAccNo', res: 'hrmE_ESIAccNo' },
                        { req: 'hrmE_GratuityAccNo', res: 'hrmE_GratuityAccNo' },
                        { req: 'hrmE_EPFNotApplicableFlg', res: 'hrmE_EPFNotApplicableFlg' },
                        { req: 'hrmE_FPFNotApplicableFlg', res: 'hrmE_FPFNotApplicableFlg' },
                        { req: 'hrmE_PHDResearchGuideFlg', res: 'hrmE_PHDResearchGuideFlg' },
                        { req: 'hrmE_RGRecognitionYear', res: 'hrmE_RGRecognitionYear' }
                    ];

                    console.log('🔍 [DEBUG] Tab 1 - Payroll Fields Comparison:');
                    payrollFields.forEach(({ req, res }) => {
                        const reqValue = (payload.employee as any)[req];
                        const resValue = responseData[res as keyof typeof responseData];
                        const match =
                            reqValue === resValue ||
                            (reqValue == null && resValue == null) ||
                            (reqValue === 0 && resValue === 0) ||
                            (reqValue === false && resValue === false);
                        if (!match) {
                            mismatches.push(`${req}: Request="${reqValue}" vs Response="${resValue}"`);
                        }
                        console.log(`  ${match ? '✅' : '❌'} ${req}: ${reqValue} → ${resValue}`);
                    });

                    // Summary
                    if (mismatches.length > 0) {
                        console.warn('⚠️ [DEBUG] Tab 1 - Found mismatches between request and response:');
                        mismatches.forEach((m) => console.warn(`  - ${m}`));
                    } else {
                        console.log('✅ [DEBUG] Tab 1 - All key fields match between request and response!');
                    }

                    // Show API response message
                    if (response?.success) {
                        if (response.message) toast.success(response.message);

                        // API returns hrmE_Id (lowercase) in response
                        const employeeId =
                            response?.data?.hrmE_Id || response?.data?.HRME_Id || response?.hrmE_Id || response?.HRME_Id || 0;
                        console.log('🔍 [DEBUG] Tab 1 - Extracted Employee ID:', employeeId);

                        if (employeeId && employeeId > 0) {
                            setSavedEmployeeId(employeeId);
                            console.log('✅ [DEBUG] Tab 1 - Employee ID saved to state:', employeeId);
                            setCurrentStep(2);
                        } else {
                            console.error('❌ [DEBUG] Tab 1 - Failed to extract employee ID from response');
                            toast.error('Failed to get employee ID from response');
                        }
                    } else {
                        console.warn('⚠️ [DEBUG] Tab 1 - API returned success: false');
                        toast.error(response?.message || 'Failed to save employee details');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Tab 1 (Employee Information) - Save Error:', error);
                    console.error('❌ [DEBUG] Tab 1 - Error Details:', JSON.stringify(error, null, 2));
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save employee details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 2) {
            // Address Information tab - call same endpoint /api/EmployeeRegistration/SavePersonalDetails
            // Update with address details using the hrmE_Id from step 1
            if (!savedEmployeeId) {
                toast.error('Please save Employee details first');
                setCurrentStep(1);
                return;
            }
            const payload = fixPaymentMode(mapFormDataToApiFormatLocal(data));
            payload.employee.hrmE_Id = savedEmployeeId; // Use the ID from step 1

            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Form Data:', data);
            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Payload:', payload);
            console.log('🔍 [DEBUG] Tab 2 (Address Information) - Employee ID:', savedEmployeeId);
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

                    // Verify address fields - CRITICAL CHECK
                    const responseData = response?.data || {};
                    const addressMismatches: string[] = [];

                    console.log('🔍 [DEBUG] Tab 2 - Address Fields Comparison (CRITICAL):');

                    // Contact Address Comparison
                    const contactAddressFields = [
                        { req: 'hrmE_LocStreet', res: 'hrmE_LocStreet' },
                        { req: 'hrmE_LocArea', res: 'hrmE_LocArea' },
                        { req: 'hrmE_LocCity', res: 'hrmE_LocCity' },
                        { req: 'hrmE_LocStateId', res: 'hrmE_LocStateId' },
                        { req: 'hrmE_LocCountryId', res: 'hrmE_LocCountryId' },
                        { req: 'hrmE_LocPincode', res: 'hrmE_LocPincode' }
                    ];

                    console.log('📍 Contact Address:');
                    contactAddressFields.forEach(({ req, res }) => {
                        const reqValue = (payload.employee as any)[req];
                        const resValue = responseData[res as keyof typeof responseData];
                        const match =
                            reqValue === resValue ||
                            (reqValue == null && resValue == null) ||
                            (reqValue === 0 && resValue === 0) ||
                            (reqValue === '' && resValue == null);
                        if (!match) {
                            addressMismatches.push(`Contact ${req}: Sent="${reqValue}" but Received="${resValue}"`);
                        }
                        console.log(`  ${match ? '✅' : '❌'} ${req}: Sent="${reqValue}" → Received="${resValue}"`);
                    });

                    // Permanent Address Comparison
                    const permanentAddressFields = [
                        { req: 'hrmE_PerStreet', res: 'hrmE_PerStreet' },
                        { req: 'hrmE_PerArea', res: 'hrmE_PerArea' },
                        { req: 'hrmE_PerCity', res: 'hrmE_PerCity' },
                        { req: 'hrmE_PerStateId', res: 'hrmE_PerStateId' },
                        { req: 'hrmE_PerCountryId', res: 'hrmE_PerCountryId' },
                        { req: 'hrmE_PerPincode', res: 'hrmE_PerPincode' }
                    ];

                    console.log('📍 Permanent Address:');
                    permanentAddressFields.forEach(({ req, res }) => {
                        const reqValue = (payload.employee as any)[req];
                        const resValue = responseData[res as keyof typeof responseData];
                        const match =
                            reqValue === resValue ||
                            (reqValue == null && resValue == null) ||
                            (reqValue === 0 && resValue === 0) ||
                            (reqValue === '' && resValue == null);
                        if (!match) {
                            addressMismatches.push(`Permanent ${req}: Sent="${reqValue}" but Received="${resValue}"`);
                        }
                        console.log(`  ${match ? '✅' : '❌'} ${req}: Sent="${reqValue}" → Received="${resValue}"`);
                    });

                    // Summary
                    if (addressMismatches.length > 0) {
                        console.error('❌ [DEBUG] Tab 2 - ADDRESS FIELDS NOT SAVED BY BACKEND!');
                        console.error('❌ [DEBUG] Tab 2 - Mismatches found:');
                        addressMismatches.forEach((m) => console.error(`  - ${m}`));
                        console.error(
                            '⚠️ [DEBUG] Tab 2 - This indicates a BACKEND ISSUE - address fields are being sent correctly but not saved.'
                        );
                        toast.warning('Address fields were sent but may not have been saved. Please verify in database.');
                    } else {
                        console.log('✅ [DEBUG] Tab 2 - All address fields match between request and response!');
                    }

                    // Verify other fields are still intact
                    const otherFieldMismatches: string[] = [];
                    const keyFields = [
                        { req: 'hrmE_Id', res: 'hrmE_Id' },
                        { req: 'hrmE_EmployeeFirstName', res: 'hrmE_EmployeeFirstName' },
                        { req: 'hrmE_EmployeeCode', res: 'hrmE_EmployeeCode' },
                        { req: 'hrmE_MobileNo', res: 'hrmE_MobileNo' },
                        { req: 'hrmE_EmailId', res: 'hrmE_EmailId' }
                    ];

                    console.log('🔍 [DEBUG] Tab 2 - Other Key Fields Verification:');
                    keyFields.forEach(({ req, res }) => {
                        const reqValue = (payload.employee as any)[req];
                        const resValue = responseData[res as keyof typeof responseData];
                        const match = reqValue === resValue;
                        if (!match) {
                            otherFieldMismatches.push(`${req}: Request="${reqValue}" vs Response="${resValue}"`);
                        }
                        console.log(`  ${match ? '✅' : '❌'} ${req}: ${reqValue} → ${resValue}`);
                    });

                    if (otherFieldMismatches.length > 0) {
                        console.warn('⚠️ [DEBUG] Tab 2 - Other field mismatches:', otherFieldMismatches);
                    }

                    // Show API response message
                    if (response?.success) {
                        if (response.message) {
                            if (addressMismatches.length > 0) {
                                toast.warning(`${response.message} - But address fields may not have been saved.`);
                            } else {
                                toast.success(response.message);
                            }
                        }
                        setCurrentStep(3);
                    } else {
                        console.warn('⚠️ [DEBUG] Tab 2 - API returned success: false');
                        toast.error(response?.message || 'Failed to save address details');
                    }
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Tab 2 (Address Information) - Save Error:', error);
                    console.error('❌ [DEBUG] Tab 2 - Error Details:', JSON.stringify(error, null, 2));
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save address details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 3) {
            // Qualification tab - save qualification details
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Starting save process');
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Employee ID:', savedEmployeeId);

            if (!savedEmployeeId) {
                console.error('❌ [DEBUG] Tab 3 - No employee ID found');
                toast.error('Please save Employee and Address details first');
                setCurrentStep(1);
                return;
            }

            const qualificationList = data.qualificationDetails || [];
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Form Data:', data);
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Qualification List (Raw):', qualificationList);
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Qualification Count:', qualificationList.length);

            if (qualificationList.length === 0) {
                console.error('❌ [DEBUG] Tab 3 - No qualifications found');
                setError('qualificationDetails', {
                    type: 'required',
                    message: 'Please add at least one qualification'
                });
                return;
            }

            // Map qualification data to API format
            const qualificationsPayload = qualificationList.map((qual: any, index: number) => {
                const id = qual.hrmeQ_Id || qual.HRMEQ_Id || 0;
                const mapped = {
                    hrmeQ_Id: id,
                    hrmC_Id: Number(qual.course) || 0,
                    hrmE_Id: savedEmployeeId,
                    mI_Id: 30, // Default MI_Id
                    MI_Id: 30, // PascalCase fallback
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
                console.log(`🔍 [DEBUG] Tab 3 - Qualification #${index + 1} Mapping:`, {
                    raw: qual,
                    mapped: mapped
                });
                return mapped;
            });

            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Payload:', qualificationsPayload);
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Payload (JSON):', JSON.stringify(qualificationsPayload, null, 2));
            console.log('🔍 [DEBUG] Tab 3 (Qualification) - Calling saveQualificationDetails...');

            saveQualificationDetails(qualificationsPayload, {
                onSuccess: (response: any) => {
                    console.log('✅ [DEBUG] Tab 3 (Qualification) - Save Success:', response);
                    console.log('🔍 [DEBUG] Tab 3 - Full API Response:', JSON.stringify(response, null, 2));
                    console.log('🔍 [DEBUG] Tab 3 - Response Success:', response?.success);
                    console.log('🔍 [DEBUG] Tab 3 - Response Message:', response?.message);
                    console.log('🔍 [DEBUG] Tab 3 - Response Data:', response?.data);

                    // Verify qualification data was saved
                    if (response?.data && Array.isArray(response.data)) {
                        console.log('🔍 [DEBUG] Tab 3 - Response contains qualification array, length:', response.data.length);
                        console.log('🔍 [DEBUG] Tab 3 - Response Qualifications:', response.data);

                        // Compare sent vs received
                        if (response.data.length === qualificationsPayload.length) {
                            console.log('✅ [DEBUG] Tab 3 - Qualification count matches!');
                            qualificationsPayload.forEach((sent: any, index: number) => {
                                const received = response.data[index];
                                if (received) {
                                    console.log(`🔍 [DEBUG] Tab 3 - Qualification #${index + 1} Comparison:`, {
                                        sent: sent,
                                        received: received
                                    });

                                    // Check key fields
                                    const keyFields = [
                                        'hrmE_Id',
                                        'hrmC_Id',
                                        'hrmeQ_CollegeName',
                                        'hrmeQ_UniversityName',
                                        'hrmeQ_YearOfPassing'
                                    ];
                                    const mismatches: string[] = [];
                                    keyFields.forEach((field) => {
                                        if (sent[field as keyof typeof sent] !== received[field as keyof typeof received]) {
                                            mismatches.push(
                                                `${field}: Sent="${sent[field as keyof typeof sent]}" vs Received="${received[field as keyof typeof received]}"`
                                            );
                                        }
                                    });

                                    if (mismatches.length > 0) {
                                        console.warn(`⚠️ [DEBUG] Tab 3 - Qualification #${index + 1} mismatches:`, mismatches);
                                    } else {
                                        console.log(`✅ [DEBUG] Tab 3 - Qualification #${index + 1} key fields match!`);
                                    }
                                }
                            });
                        } else {
                            console.warn(
                                `⚠️ [DEBUG] Tab 3 - Qualification count mismatch: Sent=${qualificationsPayload.length}, Received=${response.data.length}`
                            );
                        }
                    } else {
                        console.warn('⚠️ [DEBUG] Tab 3 - Response data is not an array or is missing');
                    }

                    // Show API response message
                    if (response?.success && response?.message) {
                        toast.success(response.message);
                    } else if (response?.message) {
                        toast.info(response.message);
                    } else if (response?.success === false) {
                        console.warn('⚠️ [DEBUG] Tab 3 - API returned success: false');
                        toast.warning('Qualification saved but API returned success: false. Please verify the data was saved.');
                    }

                    setCurrentStep(4);
                },
                onError: (error: any) => {
                    console.error('❌ [DEBUG] Tab 3 (Qualification) - Save Error:', error);
                    console.error('❌ [DEBUG] Tab 3 - Error Details:', JSON.stringify(error, null, 2));
                    console.error('❌ [DEBUG] Tab 3 - Error Response:', error?.response);
                    console.error('❌ [DEBUG] Tab 3 - Error Message:', error?.message);
                    // Show API error message
                    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save qualification details';
                    toast.error(errorMessage);
                }
            });
        } else if (currentStepId === 4) {
            // Experience tab - save experience details
            console.log('🔍 [DEBUG] Tab 4 (Experience) - nextStep function reached for Tab 4');
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Condition check: currentStepId === 4', currentStepId === 4);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Starting save process');
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Employee ID:', savedEmployeeId);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Current Step ID:', currentStepId);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Type of currentStepId:', typeof currentStepId);

            if (!savedEmployeeId) {
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
                console.error('❌ [DEBUG] Tab 4 - No experiences found');
                setError('experienceDetails', {
                    type: 'required',
                    message: 'Please add at least one experience'
                });
                return;
            }

            // Map experience data to API format (matching API request body format)
            const experiencesPayload = experienceList.map((exp: any, index: number) => {
                const id = exp.hrmeE_Id || exp.HRMEE_Id || 0;
                const mapped = {
                    hrmeE_Id: id, // Use existing ID if updating, 0 for new
                    hrmE_Id: savedEmployeeId,
                    mI_Id: 30, // Default MI_Id
                    MI_Id: 30, // PascalCase fallback
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

            console.log('🔍 [DEBUG] Tab 4 (Experience) - Payload:', experiencesPayload);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Payload (JSON):', JSON.stringify(experiencesPayload, null, 2));
            console.log('🔍 [DEBUG] Tab 4 (Experience) - Calling saveExperienceDetails...');
            console.log('🔍 [DEBUG] Tab 4 (Experience) - saveExperienceDetails function type:', typeof saveExperienceDetails);
            console.log('🔍 [DEBUG] Tab 4 (Experience) - saveExperienceDetails function:', saveExperienceDetails);

            if (!saveExperienceDetails) {
                console.error('❌ [DEBUG] Tab 4 - saveExperienceDetails is not defined!');
                toast.error('Experience save function is not available. Please refresh the page.');
                return;
            }

            try {
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

                            // Compare sent vs received
                            if (response.data.length === experiencesPayload.length) {
                                console.log('✅ [DEBUG] Tab 4 - Experience count matches!');
                                experiencesPayload.forEach((sent: any, index: number) => {
                                    const received = response.data[index];
                                    if (received) {
                                        console.log(`🔍 [DEBUG] Tab 4 - Experience #${index + 1} Comparison:`, {
                                            sent: sent,
                                            received: received
                                        });

                                        // Check key fields
                                        const keyFields = [
                                            'hrmE_Id',
                                            'hrmeE_OrganisationName',
                                            'hrmeE_Department',
                                            'hrmeE_Designation',
                                            'hrmeE_NoOfYears'
                                        ];
                                        const mismatches: string[] = [];
                                        keyFields.forEach((field) => {
                                            if (sent[field as keyof typeof sent] !== received[field as keyof typeof received]) {
                                                mismatches.push(
                                                    `${field}: Sent="${sent[field as keyof typeof sent]}" vs Received="${received[field as keyof typeof received]}"`
                                                );
                                            }
                                        });

                                        if (mismatches.length > 0) {
                                            console.warn(`⚠️ [DEBUG] Tab 4 - Experience #${index + 1} mismatches:`, mismatches);
                                        } else {
                                            console.log(`✅ [DEBUG] Tab 4 - Experience #${index + 1} key fields match!`);
                                        }
                                    }
                                });
                            } else {
                                console.warn(
                                    `⚠️ [DEBUG] Tab 4 - Experience count mismatch: Sent=${experiencesPayload.length}, Received=${response.data.length}`
                                );
                            }
                        } else {
                            console.warn('⚠️ [DEBUG] Tab 4 - Response data is not an array or is missing');
                        }

                        // Show API response message
                        if (response?.success && response?.message) {
                            toast.success(response.message);
                        } else if (response?.message) {
                            toast.info(response.message);
                        } else if (response?.success === false) {
                            console.warn('⚠️ [DEBUG] Tab 4 - API returned success: false');
                            toast.warning('Experience saved but API returned success: false. Please verify the data was saved.');
                        }

                        setCurrentStep(5);
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
            } catch (error) {
                console.error('❌ [DEBUG] Tab 4 - Exception when calling saveExperienceDetails:', error);
                toast.error('An error occurred while calling the save function');
            }
        } else if (currentStepId === 5) {
            // Document tab
            if (!savedEmployeeId) {
                toast.error('Please save Employee and Address details first');
                setCurrentStep(1);
                return;
            }
            const documentList = data.documentList || [];
            if (documentList.length === 0) {
                setError('documentList', {
                    type: 'required',
                    message: 'Please add at least one document'
                });
                toast.error('Please add at least one document');
                return;
            }

            // Map form data to API format with Base64 support
            try {
                toast.loading('Processing documents...', { id: 'doc-upload' });

                const documentsPayload = await Promise.all(
                    documentList.map(async (doc: any) => {
                        const documentName = doc.documentName || doc.name || '';
                        const documentDescription = doc.description || doc.documentDescription || '';

                        // Handle File object from react-hook-form / file input
                        let blobBase64 = '';
                        let fileName = '';

                        const fileObj = doc.document?.[0] || doc.file || null;
                        if (fileObj instanceof File) {
                            blobBase64 = await fileToBase64(fileObj);
                            fileName = fileObj.name;
                        } else {
                            // Fallback for existing documents
                            blobBase64 = doc.blobBase64 || '';
                            fileName = doc.fileName || doc.imageName || '';
                        }

                        // Target payload as per user request + MI_Id for VAPS API compatibility
                        return {
                            hrmedS_Id: 0,
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

                toast.dismiss('doc-upload');

                console.log('🔍 [API DEBUG] Tab 5 (Document) - Array Payload:', JSON.stringify(documentsPayload, null, 2));

                (saveDocumentDetails as any)(documentsPayload, {
                    onSuccess: (response: any) => {
                        console.log('✅ [API DEBUG] Tab 5 (Document) - Save Success Response:', response);
                        if (response?.success) {
                            if (response.message) toast.success(response.message);
                            setCurrentStep(6);
                        } else {
                            console.error('❌ [API DEBUG] Tab 5 (Document) - API returned success: false', response);
                            toast.error(response?.message || 'Failed to save document details');
                        }
                    },
                    onError: (error: any) => {
                        console.error('❌ [API DEBUG] Tab 5 (Document) - API Error:', error);
                        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save document details';
                        toast.error(errorMessage);
                    }
                });
            } catch (err) {
                toast.dismiss('doc-upload');
                console.error('❌ [DEBUG] Tab 5 - Error processing documents:', err);
                toast.error('Error processing document files');
            }
        } else if (currentStepId === 6) {
            // Medical tab
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
            // Other details tab
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
                                { hrme_id: savedEmployeeId, MI_Id: HRMS_MI_ID },
                                {
                                    onSuccess: (salaryResponse: any) => {
                                        console.log('✅ [API DEBUG] Tab 7 (Salary Save) - Success:', salaryResponse);
                                        setCurrentStep(8);
                                    },
                                    onError: (salaryError: any) => {
                                        console.error('❌ [API DEBUG] Tab 7 (Salary Save) - Error:', salaryError);
                                        // Still move to next step but with a warning?
                                        // User said "i want to call one api because i want to save salaary details"
                                        // So it might be critical.
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
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    // Function to go to specific step
    const _goToStep = (step: number) => {
        setCurrentStep(step);
    };

    // Empty default values for add form (no old API mapping - endpoints not provided yet)
    const formDefaultValues = useMemo(
        () => ({
            firstName: '',
            middleName: '',
            lastName: '',
            employeeCode: '',
            typeOfEmployment: '',
            employeeGroup: '',
            school: '',
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

    // Watch for country changes
    const contactCountry = useWatch({ control, name: 'contactCountry' });
    const permanentCountry = useWatch({ control, name: 'permanentCountry' });
    const dateOfBirth = useWatch({ control, name: 'dateOfBirth' });
    const sameAsCommunicationAddress = useWatch({ control, name: 'sameAsCommunicationAddress' });
    const contactAddress = useWatch({ control, name: 'contactAddress' });
    const contactArea = useWatch({ control, name: 'contactArea' });
    const contactState = useWatch({ control, name: 'contactState' });
    const contactCity = useWatch({ control, name: 'contactCity' });
    const contactPincode = useWatch({ control, name: 'contactPincode' });
    const _permanentState = useWatch({ control, name: 'permanentState' });

    // Convert country string to number for API call
    const contactCountryId = contactCountry ? (Number.isNaN(Number(contactCountry)) ? null : Number(contactCountry)) : null;
    const permanentCountryId = permanentCountry ? (Number.isNaN(Number(permanentCountry)) ? null : Number(permanentCountry)) : null;

    // Fetch states for contact country
    const { data: contactStates = [], isLoading: isLoadingContactStates } = useStateDropdown(contactCountryId);
    // Fetch states for permanent country
    const { data: permanentStates = [], isLoading: isLoadingPermanentStates } = useStateDropdown(permanentCountryId);

    // Clear state when country changes
    const prevContactCountryId = useRef<number | null>(contactCountryId);
    const prevPermanentCountryId = useRef<number | null>(permanentCountryId);
    const prevContactValues = useRef<any>({});

    useEffect(() => {
        if (prevContactCountryId.current !== contactCountryId) {
            setValue('contactState', '');
            prevContactCountryId.current = contactCountryId;
        }
    }, [contactCountryId, setValue]);

    useEffect(() => {
        // Only clear permanent state if NOT syncing from communication address
        if (prevPermanentCountryId.current !== permanentCountryId) {
            if (!sameAsCommunicationAddress) {
                setValue('permanentState', '');
            }
            prevPermanentCountryId.current = permanentCountryId;
        }
    }, [permanentCountryId, setValue, sameAsCommunicationAddress]);

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

    // Sync communication address to permanent address when "Same As Communication Address" is checked
    useEffect(() => {
        if (sameAsCommunicationAddress) {
            console.log('🔄 [DEBUG] Syncing address fields:', {
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

            // Update ref for change tracking if needed (though dependency array handles it)
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

    // Auto-calculate retirement date from DOB
    useEffect(() => {
        if (dateOfBirth) {
            try {
                const dob = new Date(dateOfBirth);
                if (!Number.isNaN(dob.getTime())) {
                    const retirementDate = new Date(dob);
                    retirementDate.setFullYear(retirementDate.getFullYear() + 60);
                    const formattedDate = format(retirementDate, 'yyyy-MM-dd');
                    setValue('dateOfRetirement', formattedDate, { shouldValidate: true, shouldDirty: true });
                }
            } catch (_error) {
                // Invalid date, ignore
            }
        }
    }, [dateOfBirth, setValue]);

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
        remove: removeMobile
    } = useFieldArray({
        control,
        name: 'mobileDetails'
    });

    const {
        fields: emailFields,
        append: appendEmail,
        remove: removeEmail
    } = useFieldArray({
        control,
        name: 'emailDetails'
    });

    const {
        fields: bankFields,
        append: appendBank,
        remove: removeBank
    } = useFieldArray({
        control,
        name: 'bankDetails'
    });

    const {
        fields: qualificationFields,
        append: appendQualification,
        remove: removeQualification
    } = useFieldArray({
        control,
        name: 'qualificationDetails'
    });

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience
    } = useFieldArray({
        control,
        name: 'experienceDetails'
    });

    const {
        fields: documentFields,
        append: appendDocument,
        remove: removeDocument
    } = useFieldArray({
        control,
        name: 'documentList'
    });

    // Custom submit handler - now only handles the final step or redirects to nextStep
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

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
                        const errorMsg = typeof fieldError === 'string' ? fieldError : (fieldError as any)?.message;
                        if (errorMsg) {
                            errorMessages.push(errorMsg);
                        }
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
                toast.success('Employee registration completed!');
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
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

    // Form UI - standalone add form (no edit mode references)
    // Form renders immediately, dropdowns load in background and populate as data arrives
    return (
        <div className={cn('mx-auto w-full max-w-7xl px-4 py-2', className)}>
            <form onSubmit={onFormSubmit} className='space-y-6'>
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
                                                    onClick={() => setCurrentStep(step.id)}
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
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Type of Employment <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {dropdownLoadingStates.empTypes ? (
                                                                            <SelectItem value='__loading__' disabled>
                                                                                Loading employee types...
                                                                            </SelectItem>
                                                                        ) : (options?.empTypes || []).length === 0 ? (
                                                                            <SelectItem value='__no_options__' disabled>
                                                                                No options available
                                                                            </SelectItem>
                                                                        ) : (
                                                                            (options?.empTypes || [])
                                                                                .filter((et: IEmployeeTypeDropdown) => {
                                                                                    return (
                                                                                        et.key != null &&
                                                                                        et.key !== undefined &&
                                                                                        et.key !== 0
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
                                                        )}
                                                    />
                                                    <Controller
                                                        name='employeeGroup'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Employee Group <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {dropdownLoadingStates.groupTypes ? (
                                                                            <SelectItem value='__loading__' disabled>
                                                                                Loading group types...
                                                                            </SelectItem>
                                                                        ) : (options?.groupTypes || []).length === 0 ? (
                                                                            <SelectItem value='__no_options__' disabled>
                                                                                No options available
                                                                            </SelectItem>
                                                                        ) : (
                                                                            (options?.groupTypes || [])
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
                                                        )}
                                                    />
                                                    <Controller
                                                        name='department'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Department <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                                                                .filter((dept: IDepartmentDropdown) => {
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
                                                        )}
                                                    />
                                                    <Controller
                                                        name='designation'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Designation <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.designations || [])
                                                                            .filter((dg: IDesignationDropdown) => {
                                                                                return (
                                                                                    dg.key != null && dg.key !== undefined && dg.key !== 0
                                                                                );
                                                                            })
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
                                                        )}
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
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Grade <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                                                                    gr.key != null && gr.key !== undefined && gr.key !== 0
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
                                                        )}
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
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Teaching/NonTeaching <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.teachingNonTeaching || [])
                                                                            .filter((tt: ITeachingTypeDropdown) => {
                                                                                return (
                                                                                    tt.key != null &&
                                                                                    tt.key !== '' &&
                                                                                    String(tt.key).trim() !== ''
                                                                                );
                                                                            })
                                                                            .map((tt: ITeachingTypeDropdown) => {
                                                                                const val = getSafeValue(tt.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={tt.key} value={val}>
                                                                                        {tt.value || String(tt.key)}
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
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Religion <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.religions || [])
                                                                            .filter((rel: IReligionDropdown) => {
                                                                                return (
                                                                                    rel.key != null &&
                                                                                    rel.key !== undefined &&
                                                                                    rel.key !== 0
                                                                                );
                                                                            })
                                                                            .map((rel: IReligionDropdown) => {
                                                                                const val = getSafeValue(rel.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={rel.key} value={val}>
                                                                                        {rel.value || String(rel.key)}
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
                                                    <Controller
                                                        name='casteCategory'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Caste Category <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.casteCategories || [])
                                                                            .filter((cc: ICasteCategoryDropdown) => {
                                                                                return (
                                                                                    cc.key != null && cc.key !== undefined && cc.key !== 0
                                                                                );
                                                                            })
                                                                            .map((cc: ICasteCategoryDropdown) => {
                                                                                const val = getSafeValue(cc.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={cc.key} value={val}>
                                                                                        {cc.value || String(cc.key)}
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
                                                    <Controller
                                                        name='caste'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Caste <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='Select Caste' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.castes || [])
                                                                            .filter((c: ICasteDropdown) => {
                                                                                return c.key != null && c.key !== undefined && c.key !== 0;
                                                                            })
                                                                            .map((c: ICasteDropdown) => {
                                                                                const val = getSafeValue(c.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={c.key} value={val}>
                                                                                        {c.value || String(c.key)}
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
                                                            <DateField
                                                                field={field}
                                                                fieldState={fieldState}
                                                                label='Date Of Retirement'
                                                                placeholder='Pick date of retirement'
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name='gender'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Gender <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.genders || [])
                                                                            .filter((g: IGenderDropdown) => {
                                                                                return g.key != null && g.key !== undefined && g.key !== 0;
                                                                            })
                                                                            .map((g: IGenderDropdown) => {
                                                                                const val = getSafeValue(g.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={g.key} value={val}>
                                                                                        {g.value || String(g.key)}
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
                                                    <Controller
                                                        name='maritalStatus'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Marital Status <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.maritalStatuses || [])
                                                                            .filter((ms: IMaritalStatusDropdown) => {
                                                                                return (
                                                                                    ms.key != null && ms.key !== undefined && ms.key !== 0
                                                                                );
                                                                            })
                                                                            .map((ms: IMaritalStatusDropdown) => {
                                                                                const val = getSafeValue(ms.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={ms.key} value={val}>
                                                                                        {ms.value || String(ms.key)}
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
                                                            <Button
                                                                type='button'
                                                                variant='outline'
                                                                size='sm'
                                                                className='w-full'
                                                                onClick={() => appendMobile({ mobileNo: '', type: 'Default' })}>
                                                                <Plus className='mr-1 h-4 w-4' /> Add Mobile
                                                            </Button>
                                                            {errors.mobileDetails && !Array.isArray(errors.mobileDetails) && (
                                                                <FormError>{(errors.mobileDetails as any).message}</FormError>
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
                                                            <Button
                                                                type='button'
                                                                variant='outline'
                                                                size='sm'
                                                                className='w-full'
                                                                onClick={() => appendEmail({ emailId: '', type: 'Default' })}>
                                                                <Plus className='mr-1 h-4 w-4' /> Add Email
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <InputText
                                                        label='Aadhaar No.'
                                                        required
                                                        id='aadharNo'
                                                        placeholder='12 digit Aadhaar No'
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
                                                        placeholder='Enter PAN Card No'
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
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>Blood Group</Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.bloodGroups || [])
                                                                            .filter((bg: IBloodGroupDropdown) => {
                                                                                return (
                                                                                    bg.key != null &&
                                                                                    bg.key !== '' &&
                                                                                    String(bg.key).trim() !== ''
                                                                                );
                                                                            })
                                                                            .map((bg: IBloodGroupDropdown) => {
                                                                                const val = getSafeValue(bg.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={bg.key} value={val}>
                                                                                        {bg.value || String(bg.key)}
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
                                                    <Controller
                                                        name='salaryType'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Salary Type <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.salaryTypes || [])
                                                                            .filter((st: ISalaryTypeDropdown) => {
                                                                                return (
                                                                                    st.key != null &&
                                                                                    st.key !== '' &&
                                                                                    String(st.key).trim() !== ''
                                                                                );
                                                                            })
                                                                            .map((st: ISalaryTypeDropdown) => {
                                                                                const val = getSafeValue(st.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={st.key} value={val}>
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
                                                    <Controller
                                                        name='modeOfPayment'
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <div className='flex flex-col gap-1.5'>
                                                                <Label>
                                                                    Mode of Payment <span className='text-red-500'>*</span>
                                                                </Label>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger
                                                                        className={cn(
                                                                            fieldState.error
                                                                                ? 'border-destructive focus-visible:ring-destructive'
                                                                                : 'border-input focus-visible:ring-ring'
                                                                        )}>
                                                                        <SelectValue placeholder='--Select--' />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {(options?.modeOfPayment || [])
                                                                            .filter((pm: IPaymentModeDropdown) => {
                                                                                return (
                                                                                    pm.key != null &&
                                                                                    pm.key !== '' &&
                                                                                    String(pm.key).trim() !== ''
                                                                                );
                                                                            })
                                                                            .map((pm: IPaymentModeDropdown) => {
                                                                                const val = getSafeValue(pm.key);
                                                                                if (!val) return null;
                                                                                return (
                                                                                    <SelectItem key={pm.key} value={val}>
                                                                                        {pm.value || String(pm.key)}
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
                                                    {/* Employee Photo Upload */}
                                                    <div className='space-y-2'>
                                                        <Label>
                                                            Upload Employee Photo <span className='text-red-500'>*</span>
                                                        </Label>
                                                        <div className='rounded-lg border-2 border-gray-300 border-dashed p-4 text-center'>
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
                                                                    {selectedPhoto ? (
                                                                        'Change Photo'
                                                                    ) : (
                                                                        <span>
                                                                            Upload Employee Photo <span className='text-red-500'>*</span>
                                                                        </span>
                                                                    )}
                                                                </Button>
                                                                {selectedPhoto && (
                                                                    <Button
                                                                        type='button'
                                                                        size='sm'
                                                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                                                        onClick={() => {
                                                                            setSelectedPhoto(null);
                                                                            setPhotoFile(null);
                                                                            setValue('employeePhoto', '', { shouldValidate: true });
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
                                                            <div className='mt-2 font-medium text-[0.8rem] text-destructive'>
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
                                                                                                    {(memoizedBankOptions || []).map(
                                                                                                        (bank: any) => {
                                                                                                            return (
                                                                                                                <SelectItem
                                                                                                                    key={bank.id}
                                                                                                                    value={bank.value}>
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
                                                                                    maxLength={20}
                                                                                    {...register(`bankDetails.${index}.bankAccountNo`)}
                                                                                    error={(errors.bankDetails as any)?.[index]?.bankAccountNo?.message as string}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Controller
                                                                                    name={`bankDetails.${index}.accountType`}
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
                                                                                                    <SelectValue placeholder='Select' />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    {(options?.contactTypes || []).map(
                                                                                                        (item: any) => {
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
                                                                placeholder='Flat/House No, Building name, Street'
                                                                maxLength={100}
                                                                {...register('contactAddress')}
                                                                error={(errors.contactAddress as any)?.message}
                                                            />
                                                            <InputText
                                                                label='Area'
                                                                required
                                                                id='contactArea'
                                                                placeholder='Enter area name'
                                                                {...register('contactArea')}
                                                                error={(errors.contactArea as any)?.message}
                                                            />
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='contactCountry'
                                                                    control={control}
                                                                    render={({ field, fieldState }) => (
                                                                        <div className='flex flex-col gap-1.5'>
                                                                            <Label>
                                                                                Country <span className='text-red-500'>*</span>
                                                                            </Label>
                                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                                <SelectTrigger
                                                                                    className={cn(
                                                                                        fieldState.error
                                                                                            ? 'border-destructive focus-visible:ring-destructive'
                                                                                            : 'border-input focus-visible:ring-ring'
                                                                                    )}>
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
                                                                            {fieldState.error && (
                                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                    {fieldState.error.message}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='contactState'
                                                                    control={control}
                                                                    render={({ field, fieldState }) => (
                                                                        <div className='flex flex-col gap-1.5'>
                                                                            <Label>
                                                                                State <span className='text-red-500'>*</span>
                                                                            </Label>
                                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                                <SelectTrigger
                                                                                    className={cn(
                                                                                        fieldState.error
                                                                                            ? 'border-destructive focus-visible:ring-destructive'
                                                                                            : 'border-input focus-visible:ring-ring'
                                                                                    )}>
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
                                                                            {fieldState.error && (
                                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                    {fieldState.error.message}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                            <InputText
                                                                label='City'
                                                                required
                                                                id='contactCity'
                                                                placeholder='Enter city name'
                                                                {...register('contactCity')}
                                                                error={(errors.contactCity as any)?.message}
                                                            />
                                                            <InputText
                                                                label='Pincode'
                                                                required
                                                                id='contactPincode'
                                                                placeholder='Enter 6-digit pincode'
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
                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                {...register('contactPincode')}
                                                                error={errors.contactPincode?.message as string | undefined}
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
                                                                required={!sameAsCommunicationAddress}
                                                                id='permanentAddress'
                                                                placeholder='Flat/House No, Building name, Street'
                                                                maxLength={100}
                                                                {...register('permanentAddress')}
                                                                error={errors.permanentAddress?.message as string | undefined}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                            <InputText
                                                                label='Area'
                                                                required={!sameAsCommunicationAddress}
                                                                id='permanentArea'
                                                                placeholder='Enter area name'
                                                                {...register('permanentArea')}
                                                                error={errors.permanentArea?.message as string | undefined}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='permanentCountry'
                                                                    control={control}
                                                                    render={({ field, fieldState }) => (
                                                                        <div className='flex flex-col gap-1.5'>
                                                                            <Label>
                                                                                Country{' '}
                                                                                {!sameAsCommunicationAddress && (
                                                                                    <span className='text-red-500'>*</span>
                                                                                )}
                                                                            </Label>
                                                                            <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value}
                                                                                disabled={sameAsCommunicationAddress}>
                                                                                <SelectTrigger
                                                                                    className={cn(
                                                                                        fieldState.error
                                                                                            ? 'border-destructive focus-visible:ring-destructive'
                                                                                            : 'border-input focus-visible:ring-ring'
                                                                                    )}>
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
                                                                            {fieldState.error && (
                                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                    {fieldState.error.message}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className='space-y-2'>
                                                                <Controller
                                                                    name='permanentState'
                                                                    control={control}
                                                                    render={({ field, fieldState }) => (
                                                                        <div className='flex flex-col gap-1.5'>
                                                                            <Label>
                                                                                State{' '}
                                                                                {!sameAsCommunicationAddress && (
                                                                                    <span className='text-red-500'>*</span>
                                                                                )}
                                                                            </Label>
                                                                            <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value}
                                                                                disabled={sameAsCommunicationAddress}>
                                                                                <SelectTrigger
                                                                                    className={cn(
                                                                                        fieldState.error
                                                                                            ? 'border-destructive focus-visible:ring-destructive'
                                                                                            : 'border-input focus-visible:ring-ring'
                                                                                    )}>
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
                                                                            {fieldState.error && (
                                                                                <div className='font-medium text-[0.8rem] text-destructive'>
                                                                                    {fieldState.error.message}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                            </div>
                                                            <InputText
                                                                label='City'
                                                                required={!sameAsCommunicationAddress}
                                                                id='permanentCity'
                                                                placeholder='Enter city name'
                                                                {...register('permanentCity')}
                                                                error={errors.permanentCity?.message as string | undefined}
                                                                disabled={sameAsCommunicationAddress}
                                                            />
                                                            <InputText
                                                                label='Pincode'
                                                                required={!sameAsCommunicationAddress}
                                                                id='permanentPincode'
                                                                placeholder='Enter 6-digit pincode'
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
                                                                    if (!/^[0-9]$/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                {...register('permanentPincode')}
                                                                error={errors.permanentPincode?.message as string | undefined}
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
                                            <h2 className='font-bold text-2xl text-gray-900'>Qualification</h2>
                                            <p className='mt-1 text-gray-500 text-sm'>
                                                Please provide the employee&apos;s educational qualifications
                                            </p>
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='rounded-md border'>
                                                <div className='flex items-center justify-between border-b bg-muted px-4 py-2'>
                                                    <h3 className='font-semibold text-base text-gray-900 uppercase'>
                                                        EMPLOYEE QUALIFICATION DETAILS
                                                    </h3>
                                                    <Button
                                                        type='button'
                                                        className='h-7 w-auto rounded-md bg-secondary px-2.5 py-1.5 text-secondary-foreground text-xs shadow-sm hover:bg-secondary/80'
                                                        onClick={() => {
                                                            appendQualification({
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
                                                                qualifiedDate: ''
                                                            });
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
                                                {qualificationFields.map((field, index) => {
                                                    const qualificationDetails = watch('qualificationDetails') || [];
                                                    const cgpaOrPercentage = qualificationDetails[index]?.cgpaOrPercentage || 'CGPA';
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
                                                                        error={(errors.qualificationDetails as any)?.[index]?.qualification?.message}
                                                                    />
                                                                    <Controller
                                                                        name={`qualificationDetails.${index}.course`}
                                                                        control={control}
                                                                        render={({ field, fieldState }) => {
                                                                            const courses = options?.courses || [];
                                                                            return (
                                                                                <div className='flex flex-col gap-1.5'>
                                                                                    <Label>Course *</Label>
                                                                                    <Select
                                                                                        onValueChange={field.onChange}
                                                                                        value={field.value || ''}>
                                                                                        <SelectTrigger
                                                                                            className={cn(
                                                                                                'h-9',
                                                                                                fieldState.error
                                                                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                                                                    : 'border-input focus-visible:ring-ring'
                                                                                            )}>
                                                                                            <SelectValue placeholder='Select Course' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {isLoadingCourses ? (
                                                                                                <SelectItem value='loading' disabled>
                                                                                                    Loading courses...
                                                                                                </SelectItem>
                                                                                            ) : courses.length === 0 ? (
                                                                                                <SelectItem value='no-options' disabled>
                                                                                                    No courses available
                                                                                                </SelectItem>
                                                                                            ) : (
                                                                                                courses
                                                                                                    .filter((course: ICourseDropdown) => {
                                                                                                        return (
                                                                                                            course.key != null &&
                                                                                                            course.key !== undefined &&
                                                                                                            course.key !== 0
                                                                                                        );
                                                                                                    })
                                                                                                    .map((course: ICourseDropdown) => {
                                                                                                        const key = course.key
                                                                                                            ?.toString()
                                                                                                            .trim();
                                                                                                        if (!key || key === '') return null;
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
                                                                </div>
                                                                {/* Row 2: College, University */}
                                                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                                    <InputText
                                                                        label='College *'
                                                                        id={`qualificationDetails.${index}.college`}
                                                                        maxLength={100}
                                                                        {...register(`qualificationDetails.${index}.college`)}
                                                                        error={(errors.qualificationDetails as any)?.[index]?.college?.message}
                                                                    />
                                                                    <InputText
                                                                        label='University *'
                                                                        id={`qualificationDetails.${index}.university`}
                                                                        maxLength={100}
                                                                        {...register(`qualificationDetails.${index}.university`)}
                                                                        error={(errors.qualificationDetails as any)?.[index]?.university?.message}
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
                                                                        {...register(`qualificationDetails.${index}.yearOfPassing`)}
                                                                        error={(errors.qualificationDetails as any)?.[index]?.yearOfPassing?.message}
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
                                                                                                    country.key !== 0 &&
                                                                                                    String(country.key).trim() !== ''
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
                                                                                        // Clear both fields when type changes to avoid validation issues
                                                                                        setValue(`qualificationDetails.${index}.cgpa`, '');
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
                                                                                                    <SelectItem key={st.key} value={val}>
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
                                                                        label={cgpaOrPercentage === 'Percentage' ? 'Percentage' : 'CGPA'}
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
                                                                            if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
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
                                                                                                .filter((spec: ISpecializationDropdown) => {
                                                                                                    return (
                                                                                                        spec.key != null &&
                                                                                                        spec.key !== undefined &&
                                                                                                        spec.key !== 0
                                                                                                    );
                                                                                                })
                                                                                                .map((spec: ISpecializationDropdown) => {
                                                                                                    const val = getSafeValue(spec.key);
                                                                                                    if (!val) return null;
                                                                                                    const value =
                                                                                                        spec.value || String(spec.key);
                                                                                                    return (
                                                                                                        <SelectItem
                                                                                                            key={spec.key}
                                                                                                            value={val}>
                                                                                                            {value}
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
                                                                        {...register(`qualificationDetails.${index}.medicalCouncil`)}
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
                                                                        {...register(`qualificationDetails.${index}.registrationYear`)}
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
                                                })}
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
                                                    <Button
                                                        type='button'
                                                        className='h-7 w-auto rounded-md bg-secondary px-2.5 py-1.5 text-secondary-foreground text-xs shadow-sm hover:bg-secondary/80'
                                                        onClick={() => appendExperience({} as any)}>
                                                        <Plus className='mr-1 h-3.5 w-3.5' /> Add Experience
                                                    </Button>
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
                                                                    const experienceDetails = watch('experienceDetails') || [];
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
                                                                    const experienceDetails = watch('experienceDetails') || [];
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
                                                    <Button
                                                        type='button'
                                                        className='h-7 w-auto rounded-md bg-secondary px-2.5 py-1.5 text-secondary-foreground text-xs shadow-sm hover:bg-secondary/80'
                                                        onClick={() => appendDocument({} as any)}>
                                                        <Plus className='mr-1 h-3.5 w-3.5' /> Add Document
                                                    </Button>
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
                                                    const displayFileName = fileName || '';
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
                                                                                        const val = getSafeValue(reason.key);
                                                                                        if (!val) return null;
                                                                                        const value = reason.value || String(reason.key);
                                                                                        return (
                                                                                            <SelectItem key={reason.key} value={val}>
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
