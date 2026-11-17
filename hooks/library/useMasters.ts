import { LIBRARY_QUERY_KEYS } from '@/constants/query-keys';
import { getMasterCategory } from '@/server/admission/preadmission/masters/category';
import { getMasterClassCategory } from '@/server/admission/preadmission/masters/class_category';
import { getMasterAccessories } from '@/server/library/masters/accessories';
import { getMasterDepartment } from '@/server/library/masters/department';
import { getMasterCategoryList } from '@/server/library/masters/library_category';
import { getMasterVendorList } from '@/server/library/masters/library_vendor';
import { getMasterAuthorList } from '@/server/library/masters/master_author';
import { getMasterLanguageList } from '@/server/library/masters/master_language';
import { getMasterLibraryList } from '@/server/library/masters/master_library';
import { getMasterPublisherList } from '@/server/library/masters/master_publisher';
import { getMasterSubjectList, getparentsubjectdropdown } from '@/server/library/masters/master_subject';
import { getMasterRackDetails } from '@/server/library/masters/rack-details';
import { getMasterTimeSlab, getMasterTimeSlabList } from '@/server/library/masters/time-slab';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterLibrary = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_LIBRARY_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterLibraryList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_LIBRARY_LIST_DATA]
            })
    };
};

export const useMasterVendor = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_VENDOR_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterVendorList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_VENDOR_LIST_DATA]
            })
    };
};

export const useMasterCategoryListData = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_CATEGORY_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterCategoryList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_CATEGORY_LIST_DATA]
            })
    };
};

export const useMasterPublisherList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_PUBLISHER_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterPublisherList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_PUBLISHER_LIST_DATA]
            })
    };
};
export const useLibraryMasterAuthor = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_AUTHOR_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterAuthorList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_AUTHOR_LIST_DATA]
            })
    };
};

export const useMasterLanguage = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_LANGUAGE_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterLanguageList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_LANGUAGE_LIST_DATA]
            })
    };
};

export const useMasterRackDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['MASTER_RACK_DETAILS', searchParams ?? {}],
            queryFn: async () => getMasterRackDetails(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['MASTER_RACK_DETAILS']
            });
        }
    };
};

export const useMasterDepartment = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_DEPARTMENT, searchParams ?? {}],
            queryFn: async () => getMasterDepartment(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_DEPARTMENT]
            });
        }
    };
};

export function useMasterAccessories(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_ACCESSORIES, searchParams ?? {}],
            queryFn: async () => getMasterAccessories(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_ACCESSORIES]
            });
        }
    };
}

export function useMasterTimeSlab(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['MASTER_TIME_SLAB', searchParams ?? {}],
            queryFn: async () => getMasterTimeSlab(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['MASTER_TIME_SLAB']
            });
        }
    };
}

export function useMasterTimeSlabList(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['MASTER_TIME_SLAB_LIST', searchParams ?? {}],
            queryFn: async () => getMasterTimeSlabList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['MASTER_TIME_SLAB_LIST']
            });
        }
    };
}

export function useMasterCategory(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['MASTER_CATEGORY', searchParams ?? {}],
            queryFn: async () => getMasterCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['MASTER_CATEGORY']
            });
        }
    };
}

export function useMasterClassCategory(searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['MASTER_CLASS_CATEGORY', searchParams ?? {}],
            queryFn: async () => getMasterClassCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['MASTER_CLASS_CATEGORY']
            });
        }
    };
}

export const useMasterSubject = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.MASTER_SUBJECT_LIST_DATA, searchParams ?? {}],
            queryFn: async () => getMasterSubjectList(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.MASTER_SUBJECT_LIST_DATA]
            })
    };
};

export const parentsubjectdropdowndata = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [LIBRARY_QUERY_KEYS.LIBRARY_MASTER_SUBJECT_DROPDOWNDATADETAILS],
            queryFn: async () => getparentsubjectdropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [LIBRARY_QUERY_KEYS.LIBRARY_MASTER_SUBJECT_DROPDOWNDATADETAILS]
            });
        }
    };
};
