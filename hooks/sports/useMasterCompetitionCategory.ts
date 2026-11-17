import { getMasterCompetitionCategories, getMasterCompetitionCategoryDetails } from '@/server/sports/masters/competition-category';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useMasterCompetitionCategories = (searchParams?: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: ['master-competition-categories', searchParams ?? {}],
            queryFn: async () => getMasterCompetitionCategories(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: ['master-competition-categories']
            });
        }
    };
};

export const useMasterCompetitionCategoryDetails = (id?: number) => {
    return useQuery({
        queryKey: ['master-competition-category-details', id],
        queryFn: async () => {
            if (!id) return null;
            return await getMasterCompetitionCategoryDetails(id);
        },
        enabled: !!id,
        staleTime: 0
    });
};
