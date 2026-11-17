import {
    deleteAttPrivileges,
    getDataByTypeSelected,
    getEmployeeData,
    getLoginPrivileges,
    saveLoginPrivilege
} from '@/server/admission/preadmission/attendance-entry/login_privilege';
import type { ILoginPrivilegeDTO } from '@/types/admission/preadmission/login_privilege';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'admission_login_privileges';

export const useLoginPrivileges = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => getLoginPrivileges(),
        staleTime: 0
    });

    const createMutation = useMutation({
        mutationFn: (data: ILoginPrivilegeDTO) => saveLoginPrivilege(data),
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.message);
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            } else {
                toast.error(res.message || 'Failed to save privilege');
            }
        },
        onError: () => toast.error('An error occurred while saving')
    });

    const deleteMutation = useMutation({
        mutationFn: ({ asaluC_Id, asalucS_Id }: { asaluC_Id: number; asalucS_Id: number }) => deleteAttPrivileges(asaluC_Id, asalucS_Id),
        onSuccess: (res: any) => {
            if (res.returnVal || res.success) {
                toast.success(res.message || 'Subject privilege deleted successfully');
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            } else {
                toast.error('Failed to delete privilege');
            }
        },
        onError: () => toast.error('Failed to delete privilege')
    });

    const searchMutation = useMutation({
        mutationFn: (data: any) => getDataByTypeSelected(data),
        onError: () => toast.error('Failed to fetch details')
    });

    return {
        ...query,
        createPrivilege: createMutation.mutateAsync,
        deletePrivilege: deleteMutation.mutateAsync,
        fetchDataByType: searchMutation.mutateAsync, // Expose Search
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isSearching: searchMutation.isPending
    };
};

export const useGetLoginPrivilegeEmployees = () => {
    return useQuery({
        queryKey: [QUERY_KEY, 'employees'],
        queryFn: async () => {
            const res = await getEmployeeData({});
            return (res as any)?.data || res || [];
        },
        staleTime: 0
    });
};
