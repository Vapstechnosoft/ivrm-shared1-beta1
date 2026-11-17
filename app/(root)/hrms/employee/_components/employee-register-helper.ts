import { HRMS_MI_ID } from '@/constants/hrms-config';
import type { employeeRegisterSchemas } from '@/schemas/hrms/employee-register-schemas';
import type { SavePersonalDetailsApiRequest } from '@/types/hrms/employee-register';
import { format } from 'date-fns';
import type { z } from 'zod';

type FormFields = z.infer<typeof employeeRegisterSchemas.add>;

/**
 * Helper function to convert empty string to null
 */
function toNullIfEmpty(value: any): string | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const str = String(value).trim();
    return str === '' ? null : str;
}

/**
 * Helper to convert File to Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Map form data to API format for SavePersonalDetails
 * Uses lowercase field names and sends null for empty strings
 */
export function mapFormDataToApiFormat(
    data: FormFields,
    employeeId = 0,
    selectedPhoto: string | null = null
): SavePersonalDetailsApiRequest {
    // Get mobile and email from arrays (take first/default)
    const defaultMobile = data.mobileDetails?.[0]?.mobileNo || '';
    const defaultEmail = data.emailDetails?.[0]?.emailId || '';
    // Get bank account from bank details (take first/default)
    const defaultBankAccount = data.bankDetails?.[0]?.bankAccountNo || '';

    // Construct Employee Object
    const employee: any = {
        hrmE_Id: employeeId,
        HRME_Id: employeeId, // Alias for PascalCase backend requirements
        mI_Id: HRMS_MI_ID, // Fixed: Use HRMS_MI_ID (30) instead of department ID
        hrmeT_Id: Number(data.typeOfEmployment) || 0,
        hrmgT_Id: Number(data.employeeGroup) || 0,
        hrmD_Id: Number(data.department) || 0, // Map Department to hrmD_Id correctly
        hrmdeS_Id: Number(data.designation) || 0,
        hrmG_Id: Number(data.grade) || 0,
        hrmE_EmployeeFirstName: toNullIfEmpty(data.firstName),
        hrmE_EmployeeMiddleName: toNullIfEmpty(data.middleName) || '',
        hrmE_EmployeeLastName: toNullIfEmpty(data.lastName),
        hrmE_EmployeeCode: toNullIfEmpty(data.employeeCode),
        hrmE_BiometricCode: toNullIfEmpty(data.biometricCode) || '',
        hrmE_RFCardId: toNullIfEmpty(data.rfCardId) || '',
        hrmE_PerStreet: toNullIfEmpty(data.permanentAddress) || '',
        hrmE_PerArea: toNullIfEmpty(data.permanentArea) || '',
        hrmE_PerCity: toNullIfEmpty(data.permanentCity) || '',
        hrmE_PerAdd4: '',
        hrmE_PerStateId: Number(data.permanentState) || 0,
        hrmE_PerCountryId: Number(data.permanentCountry) || 0,
        hrmE_PerPincode: Number(data.permanentPincode) || 0,
        hrmE_LocStreet: toNullIfEmpty(data.contactAddress) || '',
        hrmE_LocArea: toNullIfEmpty(data.contactArea) || '',
        hrmE_LocCity: toNullIfEmpty(data.contactCity) || '',
        hrmE_LocAdd4: '',
        hrmE_LocStateId: Number(data.contactState) || 0,
        hrmE_LocCountryId: Number(data.contactCountry) || 0,
        hrmE_LocPincode: Number(data.contactPincode) || 0,
        ivrmmmS_Id: Number(data.maritalStatus) || 0,
        ivrmmG_Id: Number(data.gender) || 0,
        casteCategoryId: Number(data.casteCategory) || 0,
        casteId: Number(data.caste) || 0,
        religionId: Number(data.religion) || 0,
        hrmE_FatherName: toNullIfEmpty(data.fatherName),
        hrmE_MotherName: toNullIfEmpty(data.motherName),
        hrmE_SpouseName: toNullIfEmpty((data as any).spouseName) || '',
        hrmE_SpouseOccupation: toNullIfEmpty((data as any).spouseOccupation) || '',
        hrmE_SpouseMobileNo: Number((data as any).spouseMobileNo) || 0,
        hrmE_SpouseEmailId: toNullIfEmpty((data as any).spouseEmailId) || '',
        hrmE_SpouseAddress: toNullIfEmpty((data as any).spouseAddress) || '',
        hrmE_DOB: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
        hrmE_DOJ: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString() : null,
        hrmE_ExpectedRetirementDate: data.dateOfRetirement ? new Date(data.dateOfRetirement).toISOString() : null,
        hrmE_PFDate: data.pfDate ? new Date(data.pfDate).toISOString() : null,
        hrmE_ESIDate: data.esiDate ? new Date(data.esiDate).toISOString() : null,
        hrmE_MobileNo: Number(defaultMobile) || 0,
        hrmE_EmailId: toNullIfEmpty(defaultEmail),
        hrmE_BloodGroup: toNullIfEmpty(data.bloodGroup) || '',
        hrmE_PaymentType: toNullIfEmpty(data.modeOfPayment) || '',
        hrmE_BankAccountNo: toNullIfEmpty(defaultBankAccount) || '',
        hrmE_PFApplicableFlag: data.pfApplicable || false,
        hrmE_PFMaxFlag: data.pfMaxAmount || false,
        hrmE_PFFixedFlag: data.pfFixedAmount || false,
        hrmE_PFAccNo: toNullIfEmpty(data.pfAccNo) || '',
        hrmE_ESIAccNo: toNullIfEmpty(data.esiAccNo) || '',
        hrmE_GratuityAccNo: toNullIfEmpty(data.gratuityAccNo) || '',
        hrmE_ESIApplicableFlag: data.esiApplicable || false,
        hrmE_Photo: toNullIfEmpty(selectedPhoto) || '',
        hrmE_LeftFlag: data.employeeLeft || false,
        hrmE_DOL: data.lastWorkingDay ? new Date(data.lastWorkingDay).toISOString() : null,
        hrmE_LeavingReason: toNullIfEmpty(data.reasonForLeaving) || '',
        hrmE_Height: toNullIfEmpty(data.employeeHeight) || '',
        hrmE_HeightUOM: toNullIfEmpty(data.employeeHeightUnit) || '',
        hrmE_Weight: Number(data.employeeWeight) || 0,
        hrmE_WeightUOM: toNullIfEmpty(data.employeeWeightUnit) || '',
        hrmE_IdentificationMark: toNullIfEmpty(data.identificationMark) || '',
        hrmE_ApprovalNo: '',
        hrmE_PANCardNo: toNullIfEmpty(data.panCardNo) || '',
        hrmE_AadharCardNo: Number(data.aadharNo) || 0,
        hrmE_SubstituteFlag: false,
        hrmE_NationalSSN: toNullIfEmpty(data.nationalSSN) || '',
        hrmE_SalaryType: toNullIfEmpty(data.salaryType) || '',
        hrmE_EmployeeOrder: 0,
        hrmE_ActiveFlag: true,
        hrmE_UINumber: toNullIfEmpty(data.uanNumber) || '',
        hrmE_doc: data.dateOfConfirmation ? new Date(data.dateOfConfirmation).toISOString() : null,
        hrmE_SubjectsTaught: toNullIfEmpty(data.subjectTaught) || '',
        hrmE_AppDownloadedDeviceId: '',
        hrmE_PHDResearchGuideFlg: data.phdResearchGuide || false,
        hrmE_TechNonTeachingFlg: toNullIfEmpty(data.teachingNonTeaching === 'Non Teaching' ? 'Non Teaching' : 'Teaching') || '',
        hrmE_RGRecognitionYear: Number(data.recognitionYear) || 0,
        hrmE_AnyHealthIssue: toNullIfEmpty(data.anyHealthIssue) || '',
        hrmE_EyeSightIssue: toNullIfEmpty(data.eyeSightIssue) || '',
        hrmE_TransfferedTo: 0,
        hrmE_RecordTransferredFlg: false,
        hrmE_MSTeamsUserId: toNullIfEmpty(data.msTeamsUserName) || '',
        hrmE_MSTeamsEmailId: toNullIfEmpty((data as any).msTeamsEmailId) || '',
        hrmE_MSTeamsPassword: toNullIfEmpty(data.msTeamsPassword) || '',
        hrmE_ExcPunch: data.punchRelaxation || false,
        hrmE_RetiredFlg: data.stopPension || false,
        hrmE_PensionStoppedDate: data.dateOfStopPension ? new Date(data.dateOfStopPension).toISOString() : null,
        hrmE_FPFNotApplicableFlg: !data.ppf,
        hrmE_EPFNotApplicableFlg: !data.epf,
        hrmE_AllowSoftwareAccessFlg: true,
        // PascalCase Aliases for flat API requirements (Medical, Other details etc.)
        MI_Id: HRMS_MI_ID,
        HRMET_Id: Number(data.typeOfEmployment) || 0,
        HRMGT_Id: Number(data.employeeGroup) || 0,
        HRMD_Id: Number(data.department) || 0,
        HRMDES_Id: Number(data.designation) || 0,
        HRMG_Id: Number(data.grade) || 0,
        HRME_Height: toNullIfEmpty(data.employeeHeight) || '',
        HRME_HeightUOM: toNullIfEmpty(data.employeeHeightUnit) || '',
        HRME_Weight: Number(data.employeeWeight) || 0,
        HRME_WeightUOM: toNullIfEmpty(data.employeeHeightUnit) || '',
        HRME_IdentificationMark: toNullIfEmpty(data.identificationMark) || '',
        HRME_AnyHealthIssue: toNullIfEmpty(data.anyHealthIssue) || '',
        HRME_EyeSightIssue: toNullIfEmpty(data.eyeSightIssue) || '',
        // Aliases for validation requirements
        EmployeePhoto: toNullIfEmpty(selectedPhoto) || '',
        HrmeId: employeeId
    };

    // Construct Payload
    const payload: any = {
        employee: employee
    };

    // Add Bank Request if details exist
    if (data.bankDetails && data.bankDetails.length > 0) {
        payload.bankRequest = {
            mI_Id: HRMS_MI_ID, // Use consistent HRMS_MI_ID (30)
            hrmE_Id: employeeId,
            bankDetails: data.bankDetails.map((bank: any) => ({
                hrmeB_Id: bank.hrmeB_Id || 0,
                hrmE_Id: employeeId,
                hrmbD_Id: Number(bank.employerBankName) || 0,
                hrmeB_AccountNo: bank.bankAccountNo || '',
                hrmeB_ActiveFlag: bank.isActive ?? true
            }))
        };
    }

    return payload;
}

/**
 * Map form data to API format without address fields (for employee tab only)
 */
export function mapFormDataToApiFormatWithoutAddress(
    data: FormFields,
    employeeId = 0,
    selectedPhoto: string | null = null
): SavePersonalDetailsApiRequest {
    const payload = mapFormDataToApiFormat(data, employeeId, selectedPhoto);
    // Set all address fields to empty string/0
    // Now payload structure is { employee: {...}, bankRequest?: {...} }
    if (payload.employee) {
        payload.employee.hrmE_LocStreet = '';
        payload.employee.hrmE_LocArea = '';
        payload.employee.hrmE_LocCity = '';
        payload.employee.hrmE_LocAdd4 = '';
        payload.employee.hrmE_LocStateId = 0;
        payload.employee.hrmE_LocCountryId = 0;
        payload.employee.hrmE_LocPincode = 0;
        payload.employee.hrmE_PerStreet = '';
        payload.employee.hrmE_PerArea = '';
        payload.employee.hrmE_PerCity = '';
        payload.employee.hrmE_PerAdd4 = '';
        payload.employee.hrmE_PerStateId = 0;
        payload.employee.hrmE_PerCountryId = 0;
        payload.employee.hrmE_PerPincode = 0;
    }
    return payload;
}

/**
 * Tab field mapping for validation
 */
export const tabFieldMap: Record<string, (keyof FormFields)[]> = {
    employee: [
        'firstName',
        'middleName',
        'lastName',
        'employeeCode',
        'typeOfEmployment',
        'employeeGroup',
        'department',
        'designation',
        'grade',
        'fatherName',
        'motherName',
        'dateOfBirth',
        'dateOfJoining',
        'dateOfConfirmation',
        'dateOfRetirement',
        'gender',
        'maritalStatus',
        'religion',
        'casteCategory',
        'caste',
        'bloodGroup',
        'salaryType',
        'modeOfPayment',
        'subjectTaught',
        'epf',
        'ppf',
        'phdResearchGuide',
        'recognitionYear',
        'teachingNonTeaching',
        'pfApplicable',
        'ptMaxAmount',
        'pfMaxAmount',
        'pfFixedAmount',
        'pfAccNo',
        'uanNumber',
        'pfDate',
        'esiApplicable',
        'esiAccNo',
        'gratuityAccNo',
        'esiDate',
        'nationalSSN',
        'aadharNo',
        'panCardNo',
        'employeePhoto',
        'mobileDetails',
        'emailDetails',
        'bankDetails'
    ],
    address: [
        'contactAddress',
        'contactArea',
        'contactCountry',
        'contactState',
        'contactCity',
        'contactPincode',
        'permanentAddress',
        'permanentArea',
        'permanentCountry',
        'permanentState',
        'permanentCity',
        'permanentPincode',
        'sameAsCommunicationAddress'
    ],
    qualification: ['qualificationDetails'],
    experience: [],
    document: ['documentList'],
    medical: [
        'employeeHeight',
        'employeeHeightUnit',
        'employeeWeight',
        'employeeWeightUnit',
        'eyeSightIssue',
        'anyHealthIssue',
        'identificationMark'
    ],
    other: [
        'biometricCode',
        'rfCardId',
        'punchRelaxation',
        'stopPension',
        'dateOfStopPension',
        'msTeamsUserName',
        'msTeamsPassword',
        'employeeLeft',
        'lastWorkingDay',
        'reasonForLeaving'
    ],
    payroll: ['earningList', 'deductionList', 'arrearList']
};

/**
 * Steps configuration for the form
 */
export const employeeRegisterSteps = [
    {
        id: 1,
        name: 'Employee Information',
        description: 'Basic details',
        icon: 'User',
        tabKey: 'employee'
    },
    {
        id: 2,
        name: 'Address Information',
        description: 'Residential & Permanent',
        icon: 'MapPinHouse',
        tabKey: 'address'
    },
    {
        id: 3,
        name: 'Qualification & Education',
        description: 'Educational qualifications',
        icon: 'GraduationCap',
        tabKey: 'qualification'
    },
    {
        id: 4,
        name: 'Experience',
        description: 'Work experience',
        icon: 'Briefcase',
        tabKey: 'experience'
    },
    {
        id: 5,
        name: 'Document Upload',
        description: 'Required documents',
        icon: 'FileUp',
        tabKey: 'document'
    },
    {
        id: 6,
        name: 'Medical Record',
        description: 'Health information',
        icon: 'Heart',
        tabKey: 'medical'
    },
    {
        id: 7,
        name: 'Other Details',
        description: 'Additional information',
        icon: 'ReceiptText',
        tabKey: 'other'
    },
    {
        id: 8,
        name: 'Payroll',
        description: 'Salary & deductions',
        icon: 'DollarSign',
        tabKey: 'payroll'
    }
];

/**
 * Helper function to ensure SelectItem value is never empty string
 */
export function ensureNonEmptyValue(value: any, fallback: any = null): string | null {
    if (value == null || value === undefined) {
        if (fallback != null && fallback !== undefined) {
            const fallbackStr = String(fallback);
            if (fallbackStr.trim() !== '' && fallbackStr !== '') {
                return fallbackStr;
            }
        }
        return null;
    }
    if (value === '') {
        if (fallback != null && fallback !== undefined && fallback !== '') {
            const fallbackStr = String(fallback);
            if (fallbackStr.trim() !== '' && fallbackStr !== '') {
                return fallbackStr;
            }
        }
        return null;
    }
    const str = String(value);
    if (str === '' || str.trim() === '') {
        if (fallback != null && fallback !== undefined && fallback !== '') {
            const fallbackStr = String(fallback);
            if (fallbackStr.trim() !== '' && fallbackStr !== '') {
                return fallbackStr;
            }
        }
        return null;
    }
    const trimmed = str.trim();
    if (trimmed === '' || trimmed.length === 0) {
        return null;
    }
    return trimmed;
}

/**
 * Map API response from GetEmployeeDetailsById to form fields
 * Converts API response structure to form field structure
 */
export function mapApiResponseToFormFields(apiData: any, targetId?: number): Partial<FormFields> & { photo?: string } {
    console.log(`🔍 [HELPER DEBUG] mapApiResponseToFormFields input, targetId: ${targetId}`);
    try {
        const preview = JSON.stringify(
            apiData,
            (key, value) => {
                if (key === 'photo' || key === 'hrmE_Photo') return '[PHOTO_BASE64_OMITTED]';
                if (Array.isArray(value) && value.length > 5) return `[Array(${value.length})]`; // Truncate long arrays
                return value;
            },
            2
        );
        console.log('🔍 [HELPER DEBUG] API RESPONSE DUMP:', preview.substring(0, 2000) + (preview.length > 2000 ? '...' : ''));
    } catch (e) {
        console.warn('Could not stringify apiData for debug', e);
    }
    const data = extractDataObject(apiData, targetId);
    console.log('🔍 [HELPER DEBUG] extracted data:', data);
    if (apiData) {
        console.log('🔍 [HELPER DEBUG] apiData keys:', Object.keys(apiData));
        if (apiData.data) {
            console.log('🔍 [HELPER DEBUG] apiData.data keys:', Object.keys(apiData.data));
            if (Array.isArray(apiData.data) && apiData.data.length > 0) {
                console.log('🔍 [HELPER DEBUG] apiData.data[0] keys:', Object.keys(apiData.data[0]));
            }
        }
    }

    let finalData = data;
    if (!finalData || Object.keys(finalData).length === 0) {
        console.warn(
            '⚠️ [HELPER] extractDataObject returned empty. Proceeding with empty object to allow Fallback/Nuclear searches to run.'
        );
        finalData = {};
        // Do NOT return here. We want to fall through to the Qualification/Experience array logic
        // which might use apiData directly (Nuclear Option).
    }
    // Update local variable reference to be safe
    let safeData = finalData;

    // DEEP MERGE STRATEGY:
    // If the found object doesn't have address keys, but valid address data exists elsewhere in the tree, find and merge it.
    // This handles cases where API returns { employee: {...}, address: {...} } separately.

    // Helper to find ANY object in the tree that has a specific key with a non-empty value
    const findObjectWithKey = (obj: any, keyFragment: string, visited = new WeakSet()): any | null => {
        if (!obj || typeof obj !== 'object') return null;
        if (visited.has(obj)) return null;
        visited.add(obj);

        // Check if this object has the key
        const keys = Object.keys(obj);
        const match = keys.find((k) => k.toLowerCase().includes(keyFragment.toLowerCase()));
        if (match && obj[match]) {
            return obj;
        }

        // Recursively search
        const values = Array.isArray(obj) ? obj : Object.values(obj);
        for (const val of values) {
            if (typeof val === 'object' && val !== null) {
                const found = findObjectWithKey(val, keyFragment, visited);
                if (found) return found;
            }
        }
        return null;
    };

    // If address is missing in main object, try to find it
    if (!safeData.hrmE_LocStreet && !safeData.hrmE_PerStreet && !safeData.HRME_LocStreet) {
        console.log('🔍 [HELPER] Address keys missing in main object. Searching tree for address data...');
        const addressObj = findObjectWithKey(apiData, 'LocStreet') || findObjectWithKey(apiData, 'PerStreet');
        if (addressObj) {
            console.log('✅ [HELPER] Found separate Address object. Merging...');
            safeData = { ...safeData, ...addressObj };
        }
    }

    // If other critical fields are missing, try to find them (e.g. religion, caste)
    if (!safeData.religionId && !safeData.hrmE_ReligionId) {
        const religionObj = findObjectWithKey(apiData, 'religionId') || findObjectWithKey(apiData, 'ReligionId');
        if (religionObj && religionObj !== safeData) {
            safeData = { ...safeData, ...religionObj };
        }
    }

    // Helper to format date from API (ISO string) to form format (YYYY-MM-DD)
    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) return '';
            return format(date, 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Heuristic search: Find any array in the object tree that contains objects with a specific key
    const findArrayWithKey = (obj: any, keyFragment: string, visited = new WeakSet()): any[] | null => {
        if (!obj || typeof obj !== 'object') return null;
        if (visited.has(obj)) return null;
        visited.add(obj);

        // Check if this object is an array and elements have the key
        if (Array.isArray(obj) && obj.length > 0) {
            const first = obj[0];
            // Check if first element has a key containing the fragment (case-insensitive)
            if (first && typeof first === 'object') {
                const hasKey = Object.keys(first).some((k) => k.toLowerCase().includes(keyFragment.toLowerCase()));
                if (hasKey) {
                    console.log(`✅ [HELPER] Found heuristic match for array with key fragment '${keyFragment}'`);
                    return obj;
                }
            }
        }

        // Recursively search children
        // Use simpler loop for object values
        const values = Array.isArray(obj) ? obj : Object.values(obj);
        for (const val of values) {
            if (typeof val === 'object' && val !== null) {
                const found = findArrayWithKey(val, keyFragment, visited);
                if (found) return found;
            }
        }
        return null;
    };

    // Helper to extract array from either extracted data or raw API response
    const getArrayFromResponse = (discriminatorKey: string | null, ...keys: string[]): any[] => {
        const searchIn = (obj: any): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;

            for (const key of keys) {
                // 1. Direct matches
                if (Array.isArray(obj[key])) return obj[key];

                // 2. Case-insensitive search
                const lowerKey = key.toLowerCase();
                const foundKey = Object.keys(obj).find((k) => k.toLowerCase() === lowerKey);
                if (foundKey && Array.isArray(obj[foundKey])) return obj[foundKey];

                // 3. Normalized search (remove underscores, e.g. qualification_details -> qualificationdetails)
                const normalizedKey = lowerKey.replace(/_/g, '');
                const foundNormalizedKey = Object.keys(obj).find((k) => k.toLowerCase().replace(/_/g, '') === normalizedKey);
                if (foundNormalizedKey && Array.isArray(obj[foundNormalizedKey])) return obj[foundNormalizedKey];

                // 4. Fuzzy "Contains" Search (NEW) - helpful if API returns odd names like "employeeQualificationList" when we search "qualification"
                // Only use the first key as the "primary" search term for fuzzy match (usually the most specific one like 'qualificationDetails')
                // actually, let's use the current key loop.
                const partialMatchKey = Object.keys(obj).find(
                    (k) => k.toLowerCase().includes(lowerKey) || k.toLowerCase().includes(normalizedKey)
                );
                if (partialMatchKey && Array.isArray(obj[partialMatchKey])) {
                    console.log(`⚠️ [HELPER] Found fuzzy match for '${key}': '${partialMatchKey}'`);
                    return obj[partialMatchKey];
                }
            }
            return null;
        };

        // PRIORITY CHECK: Case-insensitive check on apiData (root response)
        if (apiData) {
            const apiKeys = Object.keys(apiData);
            for (const key of keys) {
                const lowerK = key.toLowerCase();
                const matchedKey = apiKeys.find((ak) => ak.toLowerCase() === lowerK);
                if (matchedKey && Array.isArray(apiData[matchedKey])) {
                    console.log(`✅ [HELPER] Found array '${matchedKey}' (matched from '${key}') directly in apiData`);
                    return apiData[matchedKey];
                }
            }
        }

        // FUZZY SEARCH FALLBACK: If standard keys fail, search for any array that looks like qualification data
        if (keys.some((k) => k.toLowerCase().includes('qual'))) {
            const findQualificationArray = (obj: any, visited = new Set()): any[] | null => {
                if (!obj || typeof obj !== 'object' || visited.has(obj)) return null;
                visited.add(obj);

                if (Array.isArray(obj) && obj.length > 0) {
                    const first = obj[0];
                    if (first && typeof first === 'object') {
                        const fKeys = Object.keys(first).join(',').toLowerCase();
                        if (fKeys.includes('qual') || fKeys.includes('college') || fKeys.includes('course') || fKeys.includes('degree')) {
                            console.log('✅ [HELPER] Found fuzzy-matched qualification array via keys:', fKeys);
                            return obj;
                        }
                    }
                }

                for (const k in obj) {
                    const res = findQualificationArray(obj[k], visited);
                    if (res) return res;
                }
                return null;
            };
            const fuzzyRes = findQualificationArray(apiData);
            if (fuzzyRes) return fuzzyRes;
        }

        // Try in order: extracted data, raw apiData, apiData.data, apiData.data[0]
        const fromData = searchIn(data);
        if (fromData) {
            console.log(`✅ [HELPER] Found array in extracted data, length:`, fromData.length);
            return fromData;
        }

        const fromApiData = searchIn(apiData);
        if (fromApiData) {
            console.log(`✅ [HELPER] Found array in apiData root, length:`, fromApiData.length);
            return fromApiData;
        }

        if (apiData?.data) {
            const fromApiDataData = searchIn(apiData.data);
            if (fromApiDataData) {
                console.log(`✅ [HELPER] Found array in apiData.data, length:`, fromApiDataData.length);
                return fromApiDataData;
            }

            // CRITICAL: Check if apiData.data is an array using targetId logic if possible, OR check children
            if (Array.isArray(apiData.data) && apiData.data.length > 0) {
                // Should we filter arrays too?
                // If the main 'data' extraction worked (via extractDataObject), we trust it.
                // This block is fallback for finding sibling arrays.
                // If apiData.data[0] is correct, fine. If not, it's risky.
                // But arrays (like Qualification) are usually inside the employee object (which we extracted in `data`)
                // So `fromData` (above) should have caught it.
                // This fallback is only needed if "lists" are separate siblings.
                // Assuming 1st element is OK for fallback if we couldn't find better path.
                const fromFirstElement = searchIn(apiData.data[0]);
                if (fromFirstElement) {
                    console.log(`✅ [HELPER] Found array in apiData.data[0], length:`, fromFirstElement.length);
                    return fromFirstElement;
                }
            }
        }

        console.warn(`⚠️ [HELPER] Could not find array for keys: ${keys.join(', ')}`);

        // Final fallback: Heuristic search
        if (discriminatorKey) {
            console.log(`🔍 [HELPER] Attempting heuristic search for array with properties like '${discriminatorKey}'...`);
            const heuristicMatch = findArrayWithKey(apiData, discriminatorKey);
            if (heuristicMatch) return heuristicMatch;
        }

        return [];
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(safeData, key);

    // Map qualification details
    console.log('🔍 [HELPER] Root apiData keys:', apiData ? Object.keys(apiData) : 'null');
    if (apiData?.data) console.log('🔍 [HELPER] apiData.data keys:', Object.keys(apiData.data));

    let qualificationData: any[] = [];

    // 1. DIRECT CHECK for structure confirmed by user JSON: { data: { qualification: [...] } }
    if (apiData?.data?.qualification && Array.isArray(apiData.data.qualification)) {
        console.log('✅ [HELPER] Found qualification array at apiData.data.qualification (Direct Match)');
        qualificationData = apiData.data.qualification;
    }
    // 2. FALLBACK to fuzzy search
    else {
        qualificationData = getArrayFromResponse(
            'QualificationName',
            'qualificationDetails',
            'QualificationDetails',
            'qualificationList',
            'qualifications',
            'qualification',
            'educationalDetails',
            'educational',
            'education',
            'qualificationlist_dto',
            'educationalDetailList',
            'qualificationlist',
            'qualificationListDTO',
            'employeeQualification'
        );
    }

    // 2. SEARCH BY KEYWORDS (Nuclear Option)
    // If not found by direct path, search the ENTIRE object tree for an array containing items with specific keys
    if (!qualificationData || qualificationData.length === 0) {
        console.log('🔍 [HELPER] Direct paths failed, starting AGGRESSIVE recursive search for Qualification data...');

        const findVapsArray = (obj: any, keySignatures: string[], visited = new WeakSet()): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            if (visited.has(obj)) return null;
            visited.add(obj);

            // Check if current object is the target array
            if (Array.isArray(obj) && obj.length > 0) {
                const first = obj[0];
                if (first && typeof first === 'object') {
                    const keys = Object.keys(first).map((k) => k.toLowerCase());
                    const match = keySignatures.some((sig) => keys.some((k) => k.includes(sig.toLowerCase())));
                    if (match) {
                        console.log(`✅ [HELPER] Found AGGRESSIVE match with keys: ${keys.join(', ')}`);
                        return obj;
                    }
                }
            }

            // Recursive search
            const values = Array.isArray(obj) ? obj : Object.values(obj);
            for (const val of values) {
                if (typeof val === 'object' && val !== null) {
                    const found = findVapsArray(val, keySignatures, visited);
                    if (found) return found;
                }
            }
            return null;
        };

        // Search for specific VAPS keys
        qualificationData =
            findVapsArray(apiData, ['hrmeQ_Id', 'hrmeQ_QualificationName', 'hrmeQ_YearOfPassing', 'hrmeQ_UniversityName']) || [];
    }
    console.log('✅ [HELPER] Final qualificationData length:', qualificationData.length);

    const qualificationDetails =
        qualificationData.length > 0
            ? qualificationData.map((qual: any, qIndex: number) => {
                if (qIndex === 0) {
                    console.log('🔴 [HELPER DEBUG] First Qualification Item Keys:', Object.keys(qual));
                }
                // Use exact keys found in JSON
                const courseVal =
                    numToString(getValue(qual, 'hrmC_Id')) ||
                    numToString(getValue(qual, 'hrmeQ_CourseId')) ||
                    numToString(getValue(qual, 'hrmeQ_Course_Id')) ||
                    '';
                const countryVal = numToString(getValue(qual, 'hrmeQ_CountryId')) || numToString(getValue(qual, 'hrmE_Country_Id'));
                const stateVal = numToString(getValue(qual, 'hrmeQ_StateId')) || numToString(getValue(qual, 'hrmE_State_Id'));
                const yearVal = numToString(getValue(qual, 'hrmeQ_YearOfPassing')) || String(getValue(qual, 'hrmeQ_YearOfPassing') || '');

                return {
                    hrmeQ_Id: getValue(qual, 'hrmeQ_Id') || 0,
                    qualification: getValue(qual, 'hrmE_QualificationName') || getValue(qual, 'hrmeQ_QualificationName') || '',
                    course: courseVal,
                    college: getValue(qual, 'hrmeQ_CollegeName') || '',
                    university: getValue(qual, 'hrmeQ_UniversityName') || '',
                    yearOfPassing: yearVal,
                    qualificationCountry: countryVal,
                    qualificationState: stateVal,
                    registrationNo: getValue(qual, 'hrmeQ_RegistrationNo') || '',
                    result: getValue(qual, 'hrmeQ_Result') || '',
                    cgpaOrPercentage: getValue(qual, 'hrmeQ_CGPAOrPerFlag') || 'CGPA',
                    cgpa: String(
                        getValue(qual, 'hrmeQ_CGPAOrPerFlag') === 'Percentage'
                            ? getValue(qual, 'hrmeQ_Percentage') || getValue(qual, 'hrmeQ_CGPA') || ''
                            : getValue(qual, 'hrmeQ_CGPA') || getValue(qual, 'hrmeQ_Percentage') || ''
                    ),
                    percentage: String(getValue(qual, 'hrmeQ_Percentage') || ''),
                    areaOfSpecialisation:
                        numToString(getValue(qual, 'hrmeQ_AreaOfSpecialisation')) ||
                        numToString(getValue(qual, 'hrmeQ_AreaOfSpecialization')) ||
                        numToString(getValue(qual, 'specialisation')) ||
                        numToString(getValue(qual, 'specialization')) ||
                        numToString(getValue(qual, 'hrmeQ_SpecialisationId')) ||
                        numToString(getValue(qual, 'hrmeQ_SpecializationId')) ||
                        numToString(getValue(qual, 'hrmspL_Id')) ||
                        numToString(getValue(qual, 'HRMSPL_Id')) ||
                        '',
                    phdFlag: getValue(qual, 'hrmeQ_PHDFlg') || false,
                    thesisTitle: getValue(qual, 'hrmeQ_ThesisTitle') || '',
                    registrationYear: numToString(getValue(qual, 'hrmeQ_RegistrationYear')),
                    guideName: getValue(qual, 'hrmeQ_GuideName') || '',
                    qualifiedDate: formatDate(getValue(qual, 'hrmeQ_Date')),
                    medicalCouncil: getValue(qual, 'hrmeQ_MedicalCouncil') || '',
                    hardcopy: getValue(qual, 'hrmeQ_Hardcopy') || ''
                };
            })
            : [];

    // Map experience details
    let experienceData: any[] = [];
    // Explicit check for structure: apiData.data.experience
    if (apiData?.data?.experience && Array.isArray(apiData.data.experience)) {
        console.log('✅ [HELPER] Found experience array at apiData.data.experience');
        experienceData = apiData.data.experience;
    } else {
        experienceData = getArrayFromResponse(
            'OrganisationName',
            'experienceDetails',
            'ExperienceDetails',
            'experienceList',
            'experiences',
            'experience',
            'selectedexperience_list_dto',
            'experience_list_dto',
            'experiencelist',
            'employeeExperience'
        );
    }

    // 2. SEARCH BY KEYWORDS (Nuclear Option)
    if (!experienceData || experienceData.length === 0) {
        console.log('🔍 [HELPER] Direct paths failed, starting AGGRESSIVE recursive search for Experience data...');

        const findVapsArrayExp = (obj: any, keySignatures: string[], visited = new WeakSet()): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            if (visited.has(obj)) return null;
            visited.add(obj);

            // Check if current object is the target array
            if (Array.isArray(obj) && obj.length > 0) {
                const first = obj[0];
                if (first && typeof first === 'object') {
                    const keys = Object.keys(first).map((k) => k.toLowerCase());
                    const match = keySignatures.some((sig) => keys.some((k) => k.includes(sig.toLowerCase())));
                    if (match) {
                        console.log(`✅ [HELPER] Found AGGRESSIVE match for Experience with keys: ${keys.join(', ')}`);
                        return obj;
                    }
                }
            }

            // Recursive search
            const values = Array.isArray(obj) ? obj : Object.values(obj);
            for (const val of values) {
                if (typeof val === 'object' && val !== null) {
                    const found = findVapsArrayExp(val, keySignatures, visited);
                    if (found) return found;
                }
            }
            return null;
        };

        // Search for specific VAPS keys for experience
        experienceData = findVapsArrayExp(apiData, ['hrmeE_Id', 'hrmeE_OrganisationName', 'hrmeE_Designation', 'hrmeE_Department']) || [];
    }

    if (!experienceData || experienceData.length === 0) {
        if (apiData?.data?.[0]?.experienceDetails && Array.isArray(apiData.data[0].experienceDetails))
            experienceData = apiData.data[0].experienceDetails;
        else if (apiData?.experiencelist && Array.isArray(apiData.experiencelist)) experienceData = apiData.experiencelist;
    }

    if (!experienceData || experienceData.length === 0) {
        if (apiData?.data?.experience && Array.isArray(apiData.data.experience)) experienceData = apiData.data.experience;
        else if (apiData?.experience && Array.isArray(apiData.experience)) experienceData = apiData.experience;
    }
    const experienceDetails =
        experienceData.length > 0
            ? experienceData.map((exp: any) => ({
                hrmeE_Id: getValue(exp, 'hrmeE_Id') || getValue(exp, 'HRMEE_Id') || 0, // Preserve ID for updates
                organisationName:
                    getValue(exp, 'hrmeE_OrganisationName') ||
                    getValue(exp, 'hrmE_OrganisationName') ||
                    getValue(exp, 'organisationName') ||
                    '',
                organisationAddress:
                    getValue(exp, 'hrmeE_OrganisationAddress') ||
                    getValue(exp, 'hrmE_OrganisationAddress') ||
                    getValue(exp, 'organisationAddress') ||
                    '',
                department: getValue(exp, 'hrmeE_Department') || getValue(exp, 'hrmE_Department') || getValue(exp, 'department') || '',
                designation:
                    getValue(exp, 'hrmeE_Designation') || getValue(exp, 'hrmE_Designation') || getValue(exp, 'designation') || '',
                joinDate: formatDate(
                    getValue(exp, 'hrmeE_JoinDate') ||
                    getValue(exp, 'hrmE_JoinDate') ||
                    getValue(exp, 'joinDate') ||
                    getValue(exp, 'hrmE_DateOfJoining')
                ),
                exitDate: formatDate(
                    getValue(exp, 'hrmeE_ExitDate') ||
                    getValue(exp, 'hrmE_ExitDate') ||
                    getValue(exp, 'exitDate') ||
                    getValue(exp, 'hrmE_DateOfLeaving')
                ),
                noOfYears: numToString(getValue(exp, 'hrmeE_NoOfYears') || getValue(exp, 'hrmE_NoOfYears') || getValue(exp, 'noOfYears')),
                noOfMonths: numToString(
                    getValue(exp, 'hrmeE_NoOfMonths') || getValue(exp, 'hrmE_NoOfMonths') || getValue(exp, 'noOfMonths')
                ),
                annualSalary: numToString(
                    getValue(exp, 'hrmeE_AnnualSalary') || getValue(exp, 'hrmE_AnnualSalary') || getValue(exp, 'annualSalary')
                ),
                reasonForLeaving:
                    getValue(exp, 'hrmeE_ReasonForLeaving') ||
                    getValue(exp, 'hrmE_ReasonForLeaving') ||
                    getValue(exp, 'reasonForLeaving') ||
                    ''
            }))
            : [];

    // Map document list
    let documentData = getArrayFromResponse('DocumentName', 'documentList', 'DocumentList', 'documents', 'document', 'employeeDocument');

    // Nuclear search for Documents if not found
    if (!documentData || documentData.length === 0) {
        console.log('🔍 [HELPER] Direct paths failed for Documents, starting recursive search...');
        const findVapsArrayDoc = (obj: any, keySignatures: string[], visited = new WeakSet()): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            if (visited.has(obj)) return null;
            visited.add(obj);

            if (Array.isArray(obj) && obj.length > 0) {
                const first = obj[0];
                if (first && typeof first === 'object') {
                    const keys = Object.keys(first).map((k) => k.toLowerCase());
                    const match = keySignatures.some((sig) => keys.some((k) => k.includes(sig.toLowerCase())));
                    if (match) return obj;
                }
            }
            const values = Array.isArray(obj) ? obj : Object.values(obj);
            for (const val of values) {
                if (typeof val === 'object' && val !== null) {
                    const found = findVapsArrayDoc(val, keySignatures, visited);
                    if (found) return found;
                }
            }
            return null;
        };
        documentData = findVapsArrayDoc(apiData, ['hrmedS_DocumentName', 'hrmedS_DucumentDescription']) || [];
    }

    const documentList =
        documentData.length > 0
            ? documentData.map((doc: any) => ({
                hrmedS_Id: getValue(doc, 'hrmedS_Id') || 0,
                documentName: getValue(doc, 'hrmedS_DocumentName') || '',
                documentDescription: getValue(doc, 'hrmedS_DucumentDescription') || '',
                document: null,
                documentImageName: getValue(doc, 'hrmedS_DocumentImageName') || '', // Match key expected by update-form
                imageName: getValue(doc, 'hrmedS_DocumentImageName') || '' // Keep alias for safety
            }))
            : [];

    // Map bank details
    const bankData = getArrayFromResponse('hrmbD_Id', 'employeebankDetails', 'EmployeeBankDetails', 'bankDetails', 'bank', 'bank_details');
    const bankDetails =
        bankData.length > 0
            ? bankData.map((bank: any) => ({
                hrmeB_Id: getValue(bank, 'hrmeB_Id') || 0, // Preserve ID for updates
                employerBankName: numToString(bank.hrmbD_Id), // Changed to employerBankName from bank to match type
                bankAccountNo: bank.hrmeB_AccountNo || '',
                accountType: '', // Added missing required property
                isActive: bank.hrmeB_ActiveFlag === 'Y' || bank.hrmeB_ActiveFlag === true
            }))
            : [];

    // Map mobile details (from selectedmobile_list_dto or use hrmE_MobileNo)
    const mobileData = getArrayFromResponse('selectedmobile_list_dto', 'mobileList', 'mobile');
    const mobileDetails =
        mobileData.length > 0
            ? mobileData.map((mobile: any) => ({
                mobileNo: numToString(mobile.hrmemno_MobileNo || mobile.hrmemnO_MobileNo || mobile.hrmemno_MobileNo),
                type: mobile.hrmemno_DeFaultFlag || mobile.hrmemno_DeFaultFlag || 'Default'
            }))
            : data.hrmE_MobileNo
                ? [{ mobileNo: numToString(data.hrmE_MobileNo), type: 'Default' }]
                : [{ mobileNo: '', type: 'Default' }];

    // Map email details (from selectedemail_list_dto or use hrmE_EmailId)
    const emailData = getArrayFromResponse('selectedemail_list_dto', 'emailList', 'email');
    const emailDetails =
        emailData.length > 0
            ? emailData.map((email: any) => ({
                emailId: email.hrmem_EmailId || email.hrmeM_EmailId || '',
                type: email.hrmem_DeFaultFlag || email.hrmem_DeFaultFlag || 'Default'
            }))
            : data.hrmE_EmailId
                ? [{ emailId: data.hrmE_EmailId, type: 'Default' }]
                : [{ emailId: '', type: 'Default' }];

    // Return mapped form fields
    // Map all fields using the robust v() helper to handle casing variations
    const mappedData = {
        // Basic employee info
        firstName: v('hrmE_EmployeeFirstName') || '',
        middleName: v('hrmE_EmployeeMiddleName') || '',
        lastName: v('hrmE_EmployeeLastName') || '',
        employeeCode: v('hrmE_EmployeeCode') || '',
        typeOfEmployment: numToString(
            v('hrmeT_Id') ||
            v('HRMET_Id') ||
            v('employeeTypeId') ||
            v('EmployeeTypeId') ||
            v('hrmet_id') ||
            (apiData && apiData.HRMET_Id) ||
            (data && data.HRMET_Id)
        ),
        employeeGroup: numToString(v('hrmgT_Id') || v('HRMGT_Id')),
        department: numToString(v('hrmD_Id') || v('HRMD_Id') || v('mI_Id') || v('MI_Id')),
        designation: numToString(v('hrmdeS_Id') || v('HRMDES_Id')),
        grade: numToString(v('hrmG_Id') || v('HRMG_Id')),
        gender: numToString(v('ivrmmG_Id') || v('IVRMMG_Id')),
        maritalStatus: numToString(v('ivrmmmS_Id') || v('IVRMMMS_Id')),
        religion: numToString(v('religionId') || v('ivrmmmR_Id') || v('IVRMMMR_Id')),
        casteCategory: numToString(v('casteCategoryId') || v('imcC_Id') || v('IMCC_Id')),
        caste: numToString(v('casteId') || v('imC_Id') || v('IMC_Id')),
        bloodGroup: v('hrmE_BloodGroup') || '',
        salaryType: v('hrmE_SalaryType') || '',
        modeOfPayment: v('hrmE_PaymentType') || '',
        subjectTaught: v('hrmE_SubjectsTaught') || '',
        // Personal details
        fatherName: v('hrmE_FatherName') || '',
        motherName: v('hrmE_MotherName') || '',
        // Dates
        dateOfBirth: formatDate(v('hrmE_DOB')),
        dateOfJoining: formatDate(v('hrmE_DOJ')),
        dateOfConfirmation: formatDate(v('hrmE_DOC') || v('hrmE_doc')),
        dateOfRetirement: formatDate(v('hrmE_ExpectedRetirementDate')),
        // Address - Contact/Local
        contactAddress: v('hrmE_LocStreet') || '',
        contactArea: v('hrmE_LocArea') || '',
        contactCity: v('hrmE_LocCity') || '',
        contactState: numToString(v('hrmE_LocStateId')),
        contactCountry: numToString(v('hrmE_LocCountryId')),
        contactPincode: numToString(v('hrmE_LocPincode')),
        // Address - Permanent
        permanentAddress: v('hrmE_PerStreet') || '',
        permanentArea: v('hrmE_PerArea') || '',
        permanentCity: v('hrmE_PerCity') || '',
        permanentState: numToString(v('hrmE_PerStateId')),
        permanentCountry: numToString(v('hrmE_PerCountryId')),
        permanentPincode: numToString(v('hrmE_PerPincode')),
        sameAsCommunicationAddress: false, // Will be set based on comparison
        // PF Details
        pfApplicable: v('hrmE_PFApplicableFlag') || false,
        pfMaxAmount: v('hrmE_PFMaxFlag') || false,
        pfFixedAmount: v('hrmE_PFFixedFlag') || false,
        pfAccNo: v('hrmE_PFAccNo') || '',
        uanNumber: v('hrmE_UINumber') || '',
        pfDate: formatDate(v('hrmE_PFDate')),
        // ESI Details
        esiApplicable: v('hrmE_ESIApplicableFlag') || false,
        esiAccNo: v('hrmE_ESIAccNo') || '',
        gratuityAccNo: v('hrmE_GratuityAccNo') || '',
        esiDate: formatDate(v('hrmE_ESIDate')),
        // Other flags
        epf: !v('hrmE_EPFNotApplicableFlg'),
        ppf: !v('hrmE_FPFNotApplicableFlg'),
        // Biometric and RFID
        biometricCode: v('hrmE_BiometricCode') || '',
        rfCardId: v('hrmE_RFCardId') || '',
        // Arrays
        mobileDetails,
        emailDetails,
        bankDetails,
        // Arrays
        qualificationDetails,
        experienceDetails,
        documentList,
        // Other details tab
        employeeLeft: v('hrmE_LeftFlag') || false,
        lastWorkingDay: formatDate(v('hrmE_DOL')),
        reasonForLeaving: v('hrmE_LeavingReason') || '',
        stopPension: v('hrmE_RetiredFlg') || false,
        dateOfStopPension: formatDate(v('hrmE_PensionStoppedDate')),
        // Medical details
        employeeHeight: v('hrmE_Height') || '',
        employeeHeightUnit: v('hrmE_HeightUOM') || '',
        employeeWeight: numToString(v('hrmE_Weight')),
        employeeWeightUnit: v('hrmE_WeightUOM') || '',
        identificationMark: v('hrmE_IdentificationMark') || '',
        anyHealthIssue: v('hrmE_AnyHealthIssue') || '',
        eyeSightIssue: v('hrmE_EyeSightIssue') || '',
        // Documents
        panCardNo: v('hrmE_PANCardNo') || '',
        aadharNo: numToString(v('hrmE_AadharCardNo')),
        nationalSSN: v('hrmE_NationalSSN') || '',
        // Other flags
        phdResearchGuide: v('hrmE_PHDResearchGuideFlg') || false,
        teachingNonTeaching: v('hrmE_TechNonTeachingFlg') || '',
        recognitionYear: numToString(v('hrmE_RGRecognitionYear')),
        msTeamsUserName: v('hrmE_MSTeamsUserId') || '',
        msTeamsPassword: v('hrmE_MSTeamsPassword') || '',
        punchRelaxation: v('hrmE_ExcPunch') || false,
        photo: v('hrmE_Photo') || ''
    } as any;

    // Debug: Log final mapped address values
    console.log('🔍 [HELPER] Final Mapped Address Values:');
    console.log('  - contactAddress:', mappedData.contactAddress);
    console.log('  - contactArea:', mappedData.contactArea);
    console.log('  - contactCity:', mappedData.contactCity);
    console.log('  - contactState:', mappedData.contactState);
    console.log('  - contactCountry:', mappedData.contactCountry);
    console.log('  - contactPincode:', mappedData.contactPincode);

    return mappedData;
}

/**
 * Map API response to form fields for Tab 1 (Employee Information) only
 */
/**
 * Helper to recursively find the object containing employee data (identified by hrmE_Id or similar)
 */
function findDataRoot(obj: any, visited = new WeakSet(), targetId?: number): any {
    if (!obj || typeof obj !== 'object') return null;
    if (visited.has(obj)) return null; // Cycle detection
    visited.add(obj);

    // 1. Check if this object is the One (has employee ID)
    let foundId: number | undefined;

    // Case-insensitive search for hrme_id key
    const idKey = Object.keys(obj).find((k) => k.toLowerCase() === 'hrme_id');
    if (idKey) {
        foundId = obj[idKey];
    }

    if (foundId !== undefined && foundId !== null) {
        // If targetId is provided, MUST match
        if (targetId !== undefined && targetId !== 0) {
            // Loose equality check to handle string/number differences
            // eslint-disable-next-line eqeqeq
            if (foundId == targetId) {
                if (obj.hrmE_EmployeeCode || obj.HRME_EmployeeCode || obj.hrmE_EmployeeFirstName || obj.HRME_EmployeeFirstName) {
                    console.log(`✅ [HELPER] Found Data Root via ID match: ${foundId} (Target: ${targetId})`);
                    return obj;
                }
            } else {
                // Log mismatch for debugging
                // console.log(`⚠️ [HELPER] Object has ID ${foundId} but looking for ${targetId}`);
            }
        } else {
            // No target ID, just return first employee-like object
            if (obj.hrmE_EmployeeCode || obj.HRME_EmployeeCode || obj.hrmE_EmployeeFirstName || obj.HRME_EmployeeFirstName) {
                console.log(`✅ [HELPER] Found Data Root (No target ID): ${foundId}`);
                return obj;
            }
        }
    }

    // 2. If array, search elements
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const found = findDataRoot(item, visited, targetId);
            if (found) return found;
        }
    }

    // 3. If object, search values
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if (typeof val === 'object' && val !== null) {
                const found = findDataRoot(val, visited, targetId);
                if (found) return found;
            }
        }
    }

    return null;
}

/**
 * Helper to extract the actual data object using recursive search
 */
function extractDataObject(apiData: any, targetId?: number): any {
    if (!apiData) return {};

    console.log(`🔍 [HELPER] Starting recursive search for employee data... TargetID: ${targetId}`);
    const found = findDataRoot(apiData, new WeakSet(), targetId);

    if (found) {
        return found;
    }

    // Fallback: If no ID found, maybe it's the root object itself or first element if array (e.g. for new employee templates?)
    console.warn('⚠️ [HELPER] No object with matching hrmE_Id found. Falling back to basic extraction.');
    console.log('⚠️ [HELPER] Available keys in root object:', apiData ? Object.keys(apiData) : 'null');
    if (apiData?.data) {
        console.log('⚠️ [HELPER] Available keys in apiData.data:', Object.keys(apiData.data));
        if (Array.isArray(apiData.data) && apiData.data.length > 0) {
            console.log('⚠️ [HELPER] First element keys in apiData.data array:', Object.keys(apiData.data[0]));
        }
    }

    // If targetId was requested but not found via findDataRoot, strict filtering failed.
    // If targetId is NOT provided (e.g. Add mode), basic extraction is fine.

    if (Array.isArray(apiData) && apiData.length > 0) return apiData[0];
    if (apiData.data && typeof apiData.data === 'object') {
        if (Array.isArray(apiData.data) && apiData.data.length > 0) return apiData.data[0];
        return apiData.data;
    }

    return apiData;
}

/**
 * Helper to safely get value from data object with case-insensitive fallback
 */
export function getValue(data: any, key: string): any {
    if (!data) return undefined;

    // 1. Try exact match
    if (data[key] !== undefined) return data[key];

    // 2. Try PascalCase variation (common in VAPS: hrmE_ -> HRME_)
    if (key.startsWith('hrmE_')) {
        const pascalKey = 'HRME_' + key.substring(5);
        if (data[pascalKey] !== undefined) return data[pascalKey];
    }

    // 3. Try another common variation (hrm -> HRM)
    if (key.startsWith('hrm')) {
        const pascalKey = 'HRM' + key.substring(3);
        if (data[pascalKey] !== undefined) return data[pascalKey];
    }

    // 4. Try lowercase match (expensive but safe)
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(data).find((k) => k.toLowerCase() === lowerKey);
    if (foundKey) return data[foundKey];

    // 5. Try removing underscores from data keys (e.g. qualification_details -> qualificationdetails)
    const normalizedKey = lowerKey.replace(/_/g, '');
    const foundNormalizedKey = Object.keys(data).find((k) => k.toLowerCase().replace(/_/g, '') === normalizedKey);
    if (foundNormalizedKey) return data[foundNormalizedKey];

    return undefined;
}

/**
 * Map API response to form fields for Tab 1 (Employee Information) only
 */
export function mapApiResponseToTab1Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to format date from API (ISO string) to form format (YYYY-MM-DD)
    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) return '';
            return format(date, 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    // Map mobile details (from selectedmobile_list_dto or use hrmE_MobileNo)
    let mobileData = v('selectedmobile_list_dto');
    if (!mobileData && apiData) {
        mobileData = getValue(apiData, 'selectedmobile_list_dto');
        if (!mobileData && apiData.data && !Array.isArray(apiData.data)) {
            mobileData =
                getValue(apiData.data, 'selectedmobile_list_dto') ||
                getValue(apiData.data, 'mobileList') ||
                getValue(apiData.data, 'MobileList');
        }
    }
    const mobileDetails =
        Array.isArray(mobileData) && mobileData.length > 0
            ? mobileData.map((mobile: any) => ({
                mobileNo: numToString(getValue(mobile, 'hrmemno_MobileNo') || getValue(mobile, 'hrmemnO_MobileNo')),
                type: getValue(mobile, 'hrmemno_DeFaultFlag') || 'Default'
            }))
            : v('hrmE_MobileNo')
                ? [{ mobileNo: numToString(v('hrmE_MobileNo')), type: 'Default' }]
                : [{ mobileNo: '', type: 'Default' }];

    // Map email details
    let emailData = v('selectedemail_list_dto');
    if (!emailData && apiData) {
        emailData = getValue(apiData, 'selectedemail_list_dto');
        if (!emailData && apiData.data && !Array.isArray(apiData.data)) {
            emailData =
                getValue(apiData.data, 'selectedemail_list_dto') ||
                getValue(apiData.data, 'emailList') ||
                getValue(apiData.data, 'EmailList');
        }
    }
    const emailDetails =
        Array.isArray(emailData) && emailData.length > 0
            ? emailData.map((email: any) => ({
                emailId: getValue(email, 'hrmem_EmailId') || getValue(email, 'hrmeM_EmailId') || '',
                type: getValue(email, 'hrmem_DeFaultFlag') || 'Default'
            }))
            : v('hrmE_EmailId')
                ? [{ emailId: v('hrmE_EmailId'), type: 'Default' }]
                : [{ emailId: '', type: 'Default' }];

    // Return only Tab 1 fields (Employee Information)
    return {
        // Basic employee info
        firstName: v('hrmE_EmployeeFirstName') || '',
        middleName: v('hrmE_EmployeeMiddleName') || '',
        lastName: v('hrmE_EmployeeLastName') || '',
        employeeCode: v('hrmE_EmployeeCode') || '',
        typeOfEmployment: numToString(v('hrmeT_Id')),
        employeeGroup: numToString(v('hrmgT_Id')),
        school: numToString(v('mI_Id') || v('MI_Id') || v('hrmD_Id') || v('HRMD_Id')),
        designation: numToString(v('hrmdeS_Id')),
        grade: numToString(v('hrmG_Id')),
        gender: numToString(v('ivrmmG_Id')),
        maritalStatus: numToString(v('ivrmmmS_Id')),
        religion: numToString(v('religionId') || v('impl_ReligionId') || v('IMPL_ReligionId') || v('IVRMMR_Id')),
        casteCategory: numToString(v('casteCategoryId') || v('imcC_Id') || v('IMCC_Id')),
        caste: numToString(v('casteId') || v('imC_Id') || v('IMC_Id')),
        bloodGroup: v('hrmE_BloodGroup') || '',
        salaryType: v('hrmE_SalaryType') || '',
        modeOfPayment: v('hrmE_PaymentType') || '',
        subjectTaught: v('hrmE_SubjectsTaught') || '',
        photo: v('hrmE_Photo') || '',
        // Personal details
        fatherName: v('hrmE_FatherName') || '',
        motherName: v('hrmE_MotherName') || '',
        // Dates
        dateOfBirth: formatDate(v('hrmE_DOB')),
        dateOfJoining: formatDate(v('hrmE_DOJ')),
        dateOfConfirmation: formatDate(v('hrmE_DOC') || v('hrmE_doc')),
        dateOfRetirement: formatDate(v('hrmE_ExpectedRetirementDate')),
        // Contact arrays (for Tab 1)
        mobileDetails,
        emailDetails,
        // PF Details
        pfApplicable: v('hrmE_PFApplicableFlag') || false,
        pfMaxAmount: v('hrmE_PFMaxFlag') || false,
        pfFixedAmount: v('hrmE_PFFixedFlag') || false,
        pfAccNo: v('hrmE_PFAccNo') || '',
        uanNumber: v('hrmE_UINumber') || '',
        pfDate: formatDate(v('hrmE_PFDate')),
        // ESI Details
        esiApplicable: v('hrmE_ESIApplicableFlag') || false,
        esiAccNo: v('hrmE_ESIAccNo') || '',
        gratuityAccNo: v('hrmE_GratuityAccNo') || '',
        esiDate: formatDate(v('hrmE_ESIDate')),
        // Other flags
        epf: !v('hrmE_EPFNotApplicableFlg'),
        ppf: !v('hrmE_FPFNotApplicableFlg'),
        // Biometric and RFID
        biometricCode: v('hrmE_BiometricCode') || '',
        rfCardId: v('hrmE_RFCardId') || '',
        // Bank account is in bankDetails array
        // Documents (Tab 1)
        panCardNo: v('hrmE_PANCardNo') || '',
        aadharNo: numToString(v('hrmE_AadharCardNo')),
        nationalSSN: v('hrmE_NationalSSN') || ''
    } as any;
}

export function mapApiResponseToTab2Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    // Return only Tab 2 fields (Address Information)
    return {
        // Address - Contact/Local
        contactAddress: v('hrmE_LocStreet') || '',
        contactArea: v('hrmE_LocArea') || '',
        contactCity: v('hrmE_LocCity') || '',
        contactState: numToString(v('hrmE_LocStateId')),
        contactCountry: numToString(v('hrmE_LocCountryId')),
        contactPincode: numToString(v('hrmE_LocPincode')),
        // Address - Permanent
        permanentAddress: v('hrmE_PerStreet') || '',
        permanentArea: v('hrmE_PerArea') || '',
        permanentCity: v('hrmE_PerCity') || '',
        permanentState: numToString(v('hrmE_PerStateId')),
        permanentCountry: numToString(v('hrmE_PerCountryId')),
        permanentPincode: numToString(v('hrmE_PerPincode')),
        sameAsCommunicationAddress: false // Will be set based on comparison
    };
}

export function mapApiResponseToTab3Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to format date from API (ISO string) to form format (YYYY-MM-DD)
    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) return '';
            return format(date, 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    // Map qualification details
    let qualificationData = v('qualificationDetails');
    if (!qualificationData && apiData) {
        qualificationData = getValue(apiData, 'qualificationDetails') || getValue(apiData, 'QualificationDetails');
        if (!qualificationData && apiData.data && !Array.isArray(apiData.data)) {
            qualificationData =
                getValue(apiData.data, 'qualificationDetails') ||
                getValue(apiData.data, 'QualificationDetails') ||
                getValue(apiData.data, 'qualificationList') ||
                getValue(apiData.data, 'qualifications') ||
                getValue(apiData.data, 'qualification');
        }
    }
    const qualificationDetails = Array.isArray(qualificationData)
        ? qualificationData.map((qual: any) => {
            console.log('🔍 [HELPER] Mapping Qualification Item:', qual);
            return {
                hrmeQ_Id: getValue(qual, 'hrmeQ_Id') || getValue(qual, 'HRMEQ_Id') || 0, // Preserve ID for updates - CRITICAL!
                qualification:
                    getValue(qual, 'hrmeQ_QualificationName') ||
                    getValue(qual, 'HRMEQ_QualificationName') ||
                    getValue(qual, 'hrmE_QualificationName') ||
                    '',
                course: numToString(getValue(qual, 'hrmeQ_CourseId') || getValue(qual, 'hrmC_Id') || getValue(qual, 'hrmeQ_Course_Id')),
                college: getValue(qual, 'hrmeQ_CollegeName') || '',
                university: getValue(qual, 'hrmeQ_UniversityName') || '',
                yearOfPassing: numToString(getValue(qual, 'hrmeQ_YearOfPassing')),
                qualificationCountry: numToString(getValue(qual, 'hrmeQ_CountryId')),
                qualificationState: numToString(getValue(qual, 'hrmeQ_StateId')),
                registrationNo: getValue(qual, 'hrmeQ_RegistrationNo') || '',
                result: getValue(qual, 'hrmeQ_Result') || '',
                cgpaOrPercentage: getValue(qual, 'hrmeQ_CGPAOrPerFlag') || 'CGPA',
                cgpa:
                    (getValue(qual, 'hrmeQ_CGPAOrPerFlag') === 'Percentage'
                        ? getValue(qual, 'hrmeQ_Percentage') || ''
                        : getValue(qual, 'hrmeQ_CGPA') || '') || '',
                percentage: getValue(qual, 'hrmeQ_Percentage') || '',
                areaOfSpecialisation: numToString(
                    getValue(qual, 'hrmeQ_AreaOfSpecialisation') ||
                    getValue(qual, 'hrmeQ_AreaOfSpecialization') ||
                    getValue(qual, 'specialisation') ||
                    getValue(qual, 'specialization') ||
                    getValue(qual, 'hrmeQ_SpecialisationId') ||
                    getValue(qual, 'hrmeQ_SpecializationId') ||
                    getValue(qual, 'hrmspL_Id')
                ),
                phdFlag: getValue(qual, 'hrmeQ_PHDFlg') || false,
                medicalCouncil: getValue(qual, 'hrmeQ_MedicalCouncil') || '',
                thesisTitle: getValue(qual, 'hrmeQ_ThesisTitle') || '',
                registrationYear: numToString(getValue(qual, 'hrmeQ_RegistrationYear')),
                guideName: getValue(qual, 'hrmeQ_GuideName') || '',
                qualifiedDate: formatDate(getValue(qual, 'hrmeQ_Date')),
                hardcopy: getValue(qual, 'hrmeQ_Hardcopy') || ''
            };
        })
        : [];

    return {
        qualificationDetails
    };
}

export function mapApiResponseToTab4Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to format date from API (ISO string) to form format (YYYY-MM-DD)
    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) return '';
            return format(date, 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    // Map experience details
    let experienceData = v('experienceDetails');
    if (!experienceData && apiData) {
        experienceData = getValue(apiData, 'experienceDetails') || getValue(apiData, 'ExperienceDetails');
        if (!experienceData && apiData.data && !Array.isArray(apiData.data)) {
            experienceData =
                getValue(apiData.data, 'experienceDetails') ||
                getValue(apiData.data, 'ExperienceDetails') ||
                getValue(apiData.data, 'experienceList') ||
                getValue(apiData.data, 'experiences') ||
                getValue(apiData.data, 'experience') ||
                getValue(apiData.data, 'selectedexperience_list_dto') ||
                getValue(apiData.data, 'experience_list_dto') ||
                getValue(apiData.data, 'experiencelist');
        }
    }
    // Additional fallbacks for experienceData
    if (!experienceData || experienceData.length === 0) {
        if (apiData?.data?.[0]?.experienceDetails && Array.isArray(apiData.data[0].experienceDetails))
            experienceData = apiData.data[0].experienceDetails;
        else if (apiData?.experiencelist && Array.isArray(apiData.experiencelist)) experienceData = apiData.experiencelist;
    }
    if (!experienceData || experienceData.length === 0) {
        if (apiData?.data?.experience && Array.isArray(apiData.data.experience)) experienceData = apiData.data.experience;
        else if (apiData?.experience && Array.isArray(apiData.experience)) experienceData = apiData.experience;
    }

    const experienceDetails = Array.isArray(experienceData)
        ? experienceData.map((exp: any) => ({
            hrmeE_Id: getValue(exp, 'hrmeE_Id') || getValue(exp, 'HRMEE_Id') || 0, // Preserve ID for updates
            organisationName:
                getValue(exp, 'hrmeE_OrganisationName') ||
                getValue(exp, 'hrmE_OrganisationName') ||
                getValue(exp, 'organisationName') ||
                '',
            organisationAddress:
                getValue(exp, 'hrmeE_OrganisationAddress') ||
                getValue(exp, 'hrmE_OrganisationAddress') ||
                getValue(exp, 'organisationAddress') ||
                '',
            department: getValue(exp, 'hrmeE_Department') || getValue(exp, 'hrmE_Department') || getValue(exp, 'department') || '',
            designation: getValue(exp, 'hrmeE_Designation') || getValue(exp, 'hrmE_Designation') || getValue(exp, 'designation') || '',
            joinDate: formatDate(
                getValue(exp, 'hrmeE_JoinDate') ||
                getValue(exp, 'hrmE_JoinDate') ||
                getValue(exp, 'joinDate') ||
                getValue(exp, 'hrmE_DateOfJoining')
            ),
            exitDate: formatDate(
                getValue(exp, 'hrmeE_ExitDate') ||
                getValue(exp, 'hrmE_ExitDate') ||
                getValue(exp, 'exitDate') ||
                getValue(exp, 'hrmE_DateOfLeaving')
            ),
            noOfYears: numToString(getValue(exp, 'hrmeE_NoOfYears') || getValue(exp, 'hrmE_NoOfYears') || getValue(exp, 'noOfYears')),
            noOfMonths: numToString(getValue(exp, 'hrmeE_NoOfMonths') || getValue(exp, 'hrmE_NoOfMonths') || getValue(exp, 'noOfMonths')),
            annualSalary: numToString(
                getValue(exp, 'hrmeE_AnnualSalary') || getValue(exp, 'hrmE_AnnualSalary') || getValue(exp, 'annualSalary')
            ),
            reasonForLeaving:
                getValue(exp, 'hrmeE_ReasonForLeaving') ||
                getValue(exp, 'hrmE_ReasonForLeaving') ||
                getValue(exp, 'reasonForLeaving') ||
                ''
        }))
        : [];

    return {
        experienceDetails
    };
}

/**
 * Map API response to form fields for Tab 5 (Documents) only
 */
export function mapApiResponseToTab5Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    // Map document list
    let docData = v('documentList');
    if (!docData && apiData) {
        docData = getValue(apiData, 'documentList') || getValue(apiData, 'DocumentList');
        if (!docData && apiData.data && !Array.isArray(apiData.data)) {
            docData =
                getValue(apiData.data, 'documentList') ||
                getValue(apiData.data, 'DocumentList') ||
                getValue(apiData.data, 'documents') ||
                getValue(apiData.data, 'document');
        }
    }
    const documentList = Array.isArray(docData)
        ? docData.map((doc: any) => ({
            documentName: getValue(doc, 'hrmedS_DocumentName') || '',
            documentDescription: getValue(doc, 'hrmedS_DucumentDescription') || '',
            document: null, // File will be handled separately if needed
            imageName: getValue(doc, 'hrmedS_DocumentImageName') || ''
        }))
        : [];

    return {
        documentList
    };
}

/**
 * Map API response to form fields for Tab 6 (Medical) only
 */
export function mapApiResponseToTab6Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    return {
        // Medical details
        employeeHeight: v('hrmE_Height') || '',
        employeeHeightUnit: v('hrmE_HeightUOM') || '',
        employeeWeight: numToString(v('hrmE_Weight')),
        employeeWeightUnit: v('hrmE_WeightUOM') || '',
        identificationMark: v('hrmE_IdentificationMark') || '',
        anyHealthIssue: v('hrmE_AnyHealthIssue') || '',
        eyeSightIssue: v('hrmE_EyeSightIssue') || ''
    };
}

/**
 * Map API response to form fields for Tab 7 (Other Details) only
 */
export function mapApiResponseToTab7Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to format date from API (ISO string) to form format (YYYY-MM-DD)
    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) return '';
            return format(date, 'yyyy-MM-dd');
        } catch {
            return '';
        }
    };

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    return {
        // Other details tab
        employeeLeft: v('hrmE_LeftFlag') || false,
        lastWorkingDay: formatDate(v('hrmE_DOL')),
        reasonForLeaving: v('hrmE_LeavingReason') || '',
        stopPension: v('hrmE_RetiredFlg') || false,
        dateOfStopPension: formatDate(v('hrmE_PensionStoppedDate')),
        // Documents
        panCardNo: v('hrmE_PANCardNo') || '',
        aadharNo: numToString(v('hrmE_AadharCardNo')),
        nationalSSN: v('hrmE_NationalSSN') || '',
        // Other flags
        phdResearchGuide: v('hrmE_PHDResearchGuideFlg') || false,
        teachingNonTeaching: v('hrmE_TechNonTeachingFlg') || '',
        recognitionYear: numToString(v('hrmE_RGRecognitionYear')),
        msTeamsUserName: v('hrmE_MSTeamsUserId') || '',
        msTeamsPassword: v('hrmE_MSTeamsPassword') || '',
        punchRelaxation: v('hrmE_ExcPunch') || false
    };
}

/**
 * Map API response to form fields for Tab 8 (Bank Details) only
 */
export function mapApiResponseToTab8Fields(apiData: any): Partial<FormFields> {
    const data = extractDataObject(apiData);

    if (!data || Object.keys(data).length === 0) {
        return {};
    }

    // Helper to convert number to string for form fields
    const numToString = (val: number | null | undefined): string => {
        if (val === null || val === undefined || val === 0) return '';
        return String(val);
    };

    // Helper to getting value using robust lookup
    const v = (key: string) => getValue(data, key);

    // Map bank details
    let bankData = v('employeebankDetails');
    if (!bankData && apiData) {
        bankData = getValue(apiData, 'employeebankDetails') || getValue(apiData, 'EmployeeBankDetails');
        if (!bankData && apiData.data && !Array.isArray(apiData.data)) {
            bankData =
                getValue(apiData.data, 'employeebankDetails') ||
                getValue(apiData.data, 'EmployeeBankDetails') ||
                getValue(apiData.data, 'bankDetails') ||
                getValue(apiData.data, 'BankDetails') ||
                getValue(apiData.data, 'bank');
        }
    }
    const bankDetails = Array.isArray(bankData)
        ? bankData.map((bank: any) => ({
            hrmeB_Id: getValue(bank, 'hrmeB_Id') || 0, // Preserve ID for updates
            employerBankName: numToString(getValue(bank, 'hrmbD_Id')),
            bankAccountNo: getValue(bank, 'hrmeB_AccountNo') || '',
            accountType: '',
            isActive: getValue(bank, 'hrmeB_ActiveFlag') === 'Y' || getValue(bank, 'hrmeB_ActiveFlag') === true
        }))
        : [];

    return {
        bankDetails
    };
}

/**
 * Map form data to STRICT PascalCase flat API format
 * Required for Medical and Other details APIs
 */
export function mapFormDataToPascalCaseApiFormat(data: FormFields, employeeId: number, selectedPhoto: string | null = null): any {
    // Get mobile and email from arrays (take first/default)
    const defaultMobile = Number(data.mobileDetails?.[0]?.mobileNo) || 0;
    const defaultEmail = data.emailDetails?.[0]?.emailId || '';
    const defaultBankAccount = data.bankDetails?.[0]?.bankAccountNo || '';

    // Map to the EXACT hybrid casing and structure requested by the user in Step 1220
    const payload: any = {
        hrmE_Id: employeeId || 0,
        hrmeT_Id: Number(data.typeOfEmployment) || 0,
        hrmgT_Id: Number(data.employeeGroup) || 0,
        hrmD_Id: Number(data.department) || 0,
        hrmdeS_Id: Number(data.designation) || 0,
        hrmG_Id: Number(data.grade) || 0,

        hrmE_EmployeeFirstName: data.firstName || 'string',
        hrmE_EmployeeMiddleName: data.middleName || '',
        hrmE_EmployeeLastName: data.lastName || '',
        hrmE_EmployeeCode: data.employeeCode || 'string',
        hrmE_BiometricCode: data.biometricCode || '',
        hrmE_RFCardId: data.rfCardId || '',

        hrmE_PerStreet: data.permanentAddress || '',
        hrmE_PerArea: data.permanentArea || '',
        hrmE_PerCity: data.permanentCity || '',
        hrmE_PerAdd4: '',
        hrmE_PerStateId: Number(data.permanentState) || 0,
        hrmE_PerCountryId: Number(data.permanentCountry) || 0,
        hrmE_PerPincode: Number(data.permanentPincode) || 0,

        hrmE_LocStreet: data.contactAddress || '',
        hrmE_LocArea: data.contactArea || '',
        hrmE_LocCity: data.contactCity || '',
        hrmE_LocAdd4: '',
        hrmE_LocStateId: Number(data.contactState) || 0,
        hrmE_LocCountryId: Number(data.contactCountry) || 0,
        hrmE_LocPincode: Number(data.contactPincode) || 0,

        ivrmmmS_Id: Number(data.maritalStatus) || 0,
        ivrmmG_Id: Number(data.gender) || 0,
        casteCategoryId: Number(data.casteCategory) || 0,
        casteId: Number(data.caste) || 0,
        religionId: Number(data.religion) || 0,

        hrmE_FatherName: data.fatherName || 'string',
        hrmE_MotherName: data.motherName || 'string',
        hrmE_SpouseName: (data as any).spouseName || '',
        hrmE_SpouseOccupation: (data as any).spouseOccupation || '',
        hrmE_SpouseMobileNo: Number((data as any).spouseMobileNo) || 0,
        hrmE_SpouseEmailId: (data as any).spouseEmailId || '',
        hrmE_SpouseAddress: (data as any).spouseAddress || '',

        hrmE_DOB: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : new Date().toISOString(),
        hrmE_DOJ: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString() : new Date().toISOString(),
        hrmE_ExpectedRetirementDate: data.dateOfRetirement ? new Date(data.dateOfRetirement).toISOString() : new Date().toISOString(),
        hrmE_PFDate: data.pfDate ? new Date(data.pfDate).toISOString() : new Date().toISOString(),
        hrmE_ESIDate: data.esiDate ? new Date(data.esiDate).toISOString() : new Date().toISOString(),

        hrmE_MobileNo: defaultMobile,
        hrmE_EmailId: defaultEmail,
        hrmE_BloodGroup: data.bloodGroup || '',
        hrmE_PaymentType: data.modeOfPayment || '',
        hrmE_BankAccountNo: defaultBankAccount,

        hrmE_PFApplicableFlag: !!data.pfApplicable,
        hrmE_PFMaxFlag: !!data.pfMaxAmount,
        hrmE_PFFixedFlag: !!data.pfFixedAmount,
        hrmE_PFAccNo: data.pfAccNo || '',
        hrmE_ESIAccNo: data.esiAccNo || '',
        hrmE_GratuityAccNo: data.gratuityAccNo || '',
        hrmE_ESIApplicableFlag: !!data.esiApplicable,

        hrmE_Photo: selectedPhoto || '',
        hrmE_LeftFlag: !!data.employeeLeft,
        hrmE_DOL: data.lastWorkingDay ? new Date(data.lastWorkingDay).toISOString() : new Date().toISOString(),
        hrmE_LeavingReason: data.reasonForLeaving || '',
        hrmE_Height: String(data.employeeHeight || '0'),
        hrmE_HeightUOM: data.employeeHeightUnit || '',
        hrmE_Weight: Number(data.employeeWeight) || 0,
        hrmE_WeightUOM: data.employeeWeightUnit || '',
        hrmE_IdentificationMark: data.identificationMark || 'string',
        hrmE_ApprovalNo: '',
        hrmE_PANCardNo: data.panCardNo || '',
        hrmE_AadharCardNo: Number(data.aadharNo) || 0,
        hrmE_SubstituteFlag: false,
        hrmE_NationalSSN: data.nationalSSN || '',
        hrmE_SalaryType: data.salaryType || '',
        hrmE_EmployeeOrder: 0,
        hrmE_ActiveFlag: true,
        hrmE_UINumber: data.uanNumber || '',
        hrmE_doc: data.dateOfConfirmation ? new Date(data.dateOfConfirmation).toISOString() : new Date().toISOString(),
        hrmE_SubjectsTaught: data.subjectTaught || '',
        hrmE_AppDownloadedDeviceId: '',
        hrmE_PHDResearchGuideFlg: !!data.phdResearchGuide,
        hrmE_TechNonTeachingFlg: data.teachingNonTeaching || 'string',
        hrmE_RGRecognitionYear: Number(data.recognitionYear) || 0,
        hrmE_AnyHealthIssue: data.anyHealthIssue || 'string',
        hrmE_EyeSightIssue: data.eyeSightIssue || 'string',
        hrmE_TransfferedTo: 0,
        hrmE_RecordTransferredFlg: false,
        hrmE_MSTeamsUserId: '',
        hrmE_MSTeamsEmailId: '',
        hrmE_MSTeamsPassword: '',
        hrmE_ExcPunch: !!data.punchRelaxation,
        hrmE_RetiredFlg: !!data.stopPension,
        hrmE_PensionStoppedDate: data.dateOfStopPension ? new Date(data.dateOfStopPension).toISOString() : new Date().toISOString(),
        hrmE_FPFNotApplicableFlg: !data.ppf,
        hrmE_EPFNotApplicableFlg: !data.epf,
        hrmE_AllowSoftwareAccessFlg: true
    };

    return payload;
}
