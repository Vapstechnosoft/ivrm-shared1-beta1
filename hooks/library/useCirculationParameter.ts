import {
    getCirculationData,
    getCirculationParameterDetails,
    getCirculationParameterTypeChange,
    saveCirculationParameter,
    toggleCirculationParameterStatus
} from '@/server/library/transactions/circulation_parameter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCirculationParameterDetails = () => {
    return useQuery({
        queryKey: ['circulationParameterDetails'],
        queryFn: () => getCirculationParameterDetails(),
        meta: {
            errorMessage: 'Failed to load circulation parameter details'
        }
    });
};

export const useCirculationData = () => {
    return useMutation({
        mutationFn: getCirculationData,
        onError: (error: any) => {
            console.warn('Circulation data notice:', error?.message || error);
        }
    });
};

export const useCirculationParameterTypeChange = () => {
    return useMutation({
        mutationFn: getCirculationParameterTypeChange,
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to fetch book types');
        }
    });
};

export const useSaveCirculationParameter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveCirculationParameter,
        onSuccess: (data: any, variables: any) => {
            const isEditing = Boolean(variables?.lbcpa_Id || variables?.circ_Id || variables?.lbcpA_Id || variables?.lnbcpA_Id || variables?.lbcpaS_Id);
            if (data?.duplicate) {
                toast.warning(data?.message || 'Record already exists for this selection');
            } else if (data?.returnval === false || data?.success === false) {
                toast.error(data?.message || `Record Not ${isEditing ? 'Updated' : 'Saved'} Successfully!!!`);
            } else {
                const message =
                    (typeof data?.returnval === 'string' && data.returnval.trim())
                        ? data.returnval
                        : data?.message || `Record ${isEditing ? 'Updated' : 'Saved'} Successfully!!!`;
                toast.success(message);
            }
            queryClient.invalidateQueries({ queryKey: ['circulationParameterDetails'] });
        },
        onError: (error: any, variables: any) => {
            const isEditing = Boolean(variables?.lbcpa_Id || variables?.circ_Id || variables?.lbcpA_Id || variables?.lnbcpA_Id || variables?.lbcpaS_Id);
            toast.error(error?.message || `Record Not ${isEditing ? 'Updated' : 'Saved'} Successfully!!!`);
        }
    });
};

export const useToggleCirculationParameterStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleCirculationParameterStatus,
        onSuccess: (data: any, variables: any) => {
            const isDeactivating = variables?.currentActiveStatus ?? true;
            const actionWord = isDeactivating ? 'Deactivated' : 'Activated';

            if (data?.success === false || data?.returnval === false) {
                toast.error(data?.message || `Record Not ${actionWord} Successfully!!!`);
            } else {
                const message =
                    (typeof data?.returnval === 'string' && data.returnval.trim())
                        ? data.returnval
                        : data?.message || `Record ${actionWord} Successfully!!!`;
                toast.success(message);
            }
            queryClient.invalidateQueries({ queryKey: ['circulationParameterDetails'] });
        },
        onError: (error: any, variables: any) => {
            const isDeactivating = variables?.currentActiveStatus ?? true;
            const actionWord = isDeactivating ? 'Deactivated' : 'Activated';
            toast.error(error?.message || `Record Not ${actionWord} Successfully!!!`);
        }
    });
};
