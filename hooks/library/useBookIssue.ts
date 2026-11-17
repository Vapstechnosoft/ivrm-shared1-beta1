import {
    calculateDueDateWithHolidays,
    getBookDetailsOnLoad,
    getBookTransactionDetails,
    getDepartmentDetails,
    getStaffDetails,
    getStudentDetails1,
    getStudentDetailsById,
    getStudentsByClassSection,
    issueBook,
    loadAvailableBooks
} from '@/server/library/transactions/book-return';
import type { BookCategory, BookType, IIssueBookRequest, MemberType } from '@/types/library/transactions/book-transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useBookDetailsOnLoad = () => {
    return useQuery({
        queryKey: ['book-details-on-load'],
        queryFn: () => getBookDetailsOnLoad(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
};

export const useStudentDetails1 = () => {
    return useQuery({
        queryKey: ['student-details-1'],
        queryFn: () => getBookDetailsOnLoad(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
};

export const useBookIssueInitialData = (params: {
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
}) => {
    return useQuery({
        queryKey: ['book-issue-initial', params],
        // For Issue, we might need 'issue' type or specific params
        queryFn: () => getBookTransactionDetails(params),
        refetchOnWindowFocus: false
    });
};


export const useIssueBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IIssueBookRequest) => issueBook(data),
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Book issued successfully');
                queryClient.invalidateQueries({ queryKey: ['book-details-on-load'] });
                queryClient.invalidateQueries({ queryKey: ['book-issue-initial'] });
            } else if (data.duplicate) {
                toast.warning('Book already issued or duplicate transaction');
            } else if (data.maxmsg) {
                toast.warning(data.maxmsg);
            } else {
                toast.error('Failed to issue book');
            }
        },
        onError: (error) => {
            console.error('Error issuing book:', error);
            toast.error('An error occurred while issuing the book');
        }
    });
};

export const useAvailableBooks = () => {
    return useMutation({
        mutationFn: loadAvailableBooks,
        onError: (error) => {
            console.error('Error fetching available books:', error);
        }
    });
};

// Reusing these as they are common
export const useStudentDetails = () => {
    return useMutation({
        mutationFn: getStudentDetailsById,
        onError: (error) => {
            console.warn('Error fetching student details:', error);
        }
    });
};

export const useStudentsByClassSection = () => {
    return useMutation({
        mutationFn: getStudentsByClassSection,
        onError: (error) => {
            console.warn('Error fetching students by class/section:', error);
        }
    });
};

export const useStaffDetails = () => {
    return useMutation({
        mutationFn: getStaffDetails,
        onError: (error) => {
            console.error('Error fetching staff details:', error);
            toast.error('Failed to fetch staff details');
        }
    });
};

export const useDepartmentDetails = () => {
    return useMutation({
        mutationFn: getDepartmentDetails,
        onError: (error) => {
            console.error('Error fetching department details:', error);
            toast.error('Failed to fetch department details');
        }
    });
};

export const useCalculateDueDate = () => {
    return useMutation({
        mutationFn: calculateDueDateWithHolidays,
        onError: (error) => {
            console.error('Error calculating due date:', error);
        }
    });
};
