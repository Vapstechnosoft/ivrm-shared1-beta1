'use client';

import { LIBRARY_QUERY_KEYS } from '@/constants/query-keys';
import {
    addOrUpdateMasterLibrary,
    getMasterLibraryById,
    getMasterLibraryEditClass,
    getMasterLibraryList,
    getMasterLibraryMappedClassList,
    getMasterLibraryUsername,
    saveClassMapping,
    saveStaffMapping
} from '@/server/library/masters/master_library';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMasterLibraryMapping() {
    const queryClient = useQueryClient();

    const libraryQuery = useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.MASTER_LIBRARY_LIST_DATA, {}],
        queryFn: async () => getMasterLibraryList({})
    });

    const mappingListQuery = useQuery({
        queryKey: ['MASTER_LIBRARY_MAPPED_LIST_DATA'],
        queryFn: async () => getMasterLibraryMappedClassList()
    });

    const usernameQuery = useQuery({
        queryKey: ['MASTER_LIBRARY_USERNAME_DATA'],
        queryFn: async () => getMasterLibraryUsername()
    });

    const responseData = (libraryQuery.data as any)?.data || (libraryQuery.data as any);
    const mappingResponse = (mappingListQuery.data as any)?.data || (mappingListQuery.data as any);
    const usernameResponse = (usernameQuery.data as any)?.data || (usernameQuery.data as any);

    // Extract roles from either get-master-library-list response, get-mapped-class-list response, or getusername response
    const rolesList =
        responseData?.role ||
        mappingResponse?.rolist ||
        mappingResponse?.role_type_list ||
        mappingResponse?.roleList ||
        mappingResponse?.ivrmrT_List ||
        (usernameQuery.data as any)?.rolist ||
        (usernameQuery.data as any)?.role_type_list ||
        (usernameQuery.data as any)?.roleList ||
        (usernameQuery.data as any)?.ivrmrT_List ||
        [];

    // Extract staff/users from getusername response (with fallback to get-mapped-class-list response)
    const staffList =
        Array.isArray(usernameResponse) && usernameResponse.length > 0
            ? usernameResponse
            : mappingResponse?.stafflist ||
              mappingResponse?.user_list ||
              mappingResponse?.employee_list ||
              mappingResponse?.staffList ||
              mappingResponse?.ivrmuL_List ||
              [];

    const rawLibraries = responseData?.liballdata || responseData?.list || responseData?.librylist || [];

    // Map libraries to resolve username and mapped staff info
    const resolvedLibraries = rawLibraries.map((lib: any) => {
        const listsToSearch = [
            mappingResponse?.gridlist,
            mappingResponse?.alldata,
            mappingResponse?.mapped_staff_list,
            mappingResponse?.mappedstafflist,
            mappingResponse?.mappedstaff,
            mappingResponse?.liststaffdetails,
            mappingResponse?.stafflist,
            responseData?.gridlist,
            responseData?.alldata,
            staffList
        ];

        let mappedUser: any = null;
        for (const list of listsToSearch) {
            if (Array.isArray(list)) {
                const found = list.find(
                    (item: any) =>
                        item &&
                        Number(item.lmaL_Id) === Number(lib.lmaL_Id) &&
                        (item.ivrmuL_Id || item.hrmE_Id || item.empName || item.normalizedUserName || item.ivrmuL_UserName || item.userName)
                );
                if (found) {
                    mappedUser = found;
                    break;
                }
            }
        }

        const userName =
            lib.empName ||
            lib.normalizedUserName ||
            lib.ivrmuL_UserName ||
            lib.hrmE_EmployeeFirstName ||
            lib.userName ||
            mappedUser?.empName ||
            mappedUser?.normalizedUserName ||
            mappedUser?.ivrmuL_UserName ||
            mappedUser?.userName ||
            mappedUser?.hrmE_EmployeeFirstName ||
            '---';

        const luL_Id = lib.luL_Id || lib.lmL_Id || mappedUser?.luL_Id || mappedUser?.lmL_Id || 0;

        return {
            ...lib,
            userName,
            empName: lib.empName || mappedUser?.empName,
            normalizedUserName: lib.normalizedUserName || mappedUser?.normalizedUserName,
            ivrmuL_UserName: lib.ivrmuL_UserName || mappedUser?.ivrmuL_UserName,
            luL_Id
        };
    });

    const rawStaffMappings =
        responseData?.alldata || responseData?.gridlist || responseData?.mapped_staff_list || responseData?.mappedstafflist || [];
    const staffMappings = rawStaffMappings.map((item: any) => {
        const userName = item.hrmE_EmployeeFirstName || item.empName || item.normalizedUserName || item.userName || '---';
        return {
            ...item,
            libraryName: item.lmaL_LibraryName,
            userName
        };
    });

    return {
        libraries: resolvedLibraries,
        classes:
            responseData?.classlist ||
            responseData?.classList ||
            responseData?.clssslist ||
            mappingResponse?.classlist ||
            mappingResponse?.classList ||
            mappingResponse?.clssslist ||
            [],
        roles: rolesList,
        staff: staffList,
        staffMappings,
        isLoading: libraryQuery.isLoading || mappingListQuery.isLoading || usernameQuery.isLoading,
        refetchAll: () => {
            libraryQuery.refetch();
            mappingListQuery.refetch();
            usernameQuery.refetch();
        }
    };
}

export function useMasterLibraryEditData() {
    const editClassMutation = useMutation({
        mutationFn: (id: number) => getMasterLibraryEditClass(id)
    });

    const editStaffMutation = useMutation({
        mutationFn: ({ id1, id2 }: { id1: number; id2: number }) => getMasterLibraryById(id1, id2)
    });

    return {
        fetchEditClass: editClassMutation.mutateAsync,
        isFetchingClass: editClassMutation.isPending,
        fetchEditStaff: editStaffMutation.mutateAsync,
        isFetchingStaff: editStaffMutation.isPending
    };
}

export function useMasterLibrarySaveMapping() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => addOrUpdateMasterLibrary(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LIBRARY_QUERY_KEYS.MASTER_LIBRARY_LIST_DATA] });
            queryClient.invalidateQueries({ queryKey: ['MASTER_LIBRARY_MAPPED_LIST_DATA'] });
            queryClient.invalidateQueries({ queryKey: ['MASTER_LIBRARY_USERNAME_DATA'] });
        }
    });
}

export function useMasterLibrarySaveClassMapping() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { LMAL_Id: number; classlst: { ASMCL_Id: number }[] }) => saveClassMapping(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LIBRARY_QUERY_KEYS.MASTER_LIBRARY_LIST_DATA] });
            queryClient.invalidateQueries({ queryKey: ['MASTER_LIBRARY_MAPPED_LIST_DATA'] });
        }
    });
}

export function useMasterLibrarySaveStaffMapping() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { LUL_Id: number; LMAL_Id: number; IVRMUL_Id: number }) => saveStaffMapping(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LIBRARY_QUERY_KEYS.MASTER_LIBRARY_LIST_DATA] });
            queryClient.invalidateQueries({ queryKey: ['MASTER_LIBRARY_MAPPED_LIST_DATA'] });
            queryClient.invalidateQueries({ queryKey: ['MASTER_LIBRARY_USERNAME_DATA'] });
        }
    });
}
