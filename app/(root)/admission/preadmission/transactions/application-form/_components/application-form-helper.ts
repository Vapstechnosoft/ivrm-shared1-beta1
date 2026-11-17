import { calculateAge } from '@/lib/utils';
import type { IPreadmissionClassDropdown } from '@/types/admission/preadmission/transactions';

export const validateAgeForClass = (
    dob: Date,
    classData: IPreadmissionClassDropdown,
    config: any
): { isValid: boolean; reason?: string } => {
    const cutOffDate = config.ispaC_ApplCutOffDateFlag === 1 ? new Date(config.asmaY_Cut_Of_Date) : new Date();

    // Validate that DOB is not after cutoff date
    if (dob > cutOffDate) {
        return {
            isValid: false,
            reason: 'Date of birth cannot be after the application cutoff date'
        };
    }

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
