import { PREADMISSION_QUERY_KEYS } from '@/constants/query-keys';
import { getPreAdmissionSetOrder, getPreAdmissionYear } from '@/server/admission/preadmission/configuration/academic_year_master';
import { checkPreadmissionLive } from '@/server/admission/preadmission/configuration/configuration';
import {
    getAcademicYearMasterConfiguration,
    getMasterConfiguration
} from '@/server/admission/preadmission/configuration/master_configuration';
import { getPreRegistrationNumbering, getRegistrationNumbering } from '@/server/admission/preadmission/configuration/transaction_numbering';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useCheckPreadmissionLive = (subDomain: string) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.CHECK_PREADMISSION_LIVE, subDomain],
            queryFn: async () => checkPreadmissionLive(subDomain),
            staleTime: 50000, // 5 seconds
            enabled: !!subDomain
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.CHECK_PREADMISSION_LIVE]
            });
        }
    };
};

export const useMasterConfiguration = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.MASTER_CONFIGURATION, searchParams ?? {}],
            queryFn: async () => getMasterConfiguration(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.MASTER_CONFIGURATION]
            });
        }
    };
};

export const usePreAdmissionAcademicYear = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.ACADEMIC_YEAR_MASTER, searchParams ?? {}],
            queryFn: async () => getPreAdmissionYear(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.ACADEMIC_YEAR_MASTER]
            });
        }
    };
};

export const usePreAdmissionAcademicYearSetOrder = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.SET_ORDER],
            queryFn: async () => getPreAdmissionSetOrder(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.SET_ORDER]
            });
        }
    };
};
export const useRegistrationNumbering = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.REGISTRATION_NUMBERING],
            queryFn: async () => getRegistrationNumbering(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.REGISTRATION_NUMBERING]
            });
        }
    };
};
export const usePreRegistrationNumbering = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.PRE_REGISTRATION_NUMBERING],
            queryFn: async () => getPreRegistrationNumbering(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.PRE_REGISTRATION_NUMBERING]
            });
        }
    };
};

export const useAcademicYearMasterConfiguration = (asmayId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [PREADMISSION_QUERY_KEYS.ACADEMIC_YEAR_MASTER_CONFIGURATION, asmayId],
            queryFn: async () => getAcademicYearMasterConfiguration(asmayId),
            staleTime: 0,
            enabled: !!asmayId
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [PREADMISSION_QUERY_KEYS.ACADEMIC_YEAR_MASTER_CONFIGURATION]
            });
        }
    };
};
