import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getInitialData, getStudents, saveStudentAge, getStudentAgeRecords } from '@/server/sports/transactions/student-age-calculation';
import { toast } from 'sonner';

export const useStudentAgeCalculation = () => {
    const queryClient = useQueryClient();
    const initialData = useQuery({
        queryKey: ['studentAgeCalculationInitial'],
        queryFn: () => getInitialData(),
    });

    const studentsData = useMutation({
        mutationFn: getStudents,
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const saveData = useMutation({
        mutationFn: saveStudentAge,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['studentAgeCalculationGrid'] });
            } else {
                toast.error(data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // For now, we simulate initial grid load with dummy records if needed, or trigger it based on search.
    // Based on requirements, grid shows on load? The prompt says "show the grid also on onload".
    // So we fetch initial grid data.
    const gridData = useQuery({
        queryKey: ['studentAgeCalculationGrid'],
        queryFn: () => getStudentAgeRecords({}),
    });

    return {
        initialData,
        studentsData,
        saveData,
        gridData
    };
};
