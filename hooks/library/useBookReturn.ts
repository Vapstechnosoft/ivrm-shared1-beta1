import {
    getBookDetails,
    getBookTransactionDetails,
    getDepartmentDetails,
    getStaffDetails,
    getStudentDetailsById,
    lostBook,
    renewBook,
    returnBook,
    searchByBarcodeForReturn,
    showFine
} from '@/server/library/transactions/book-return';
import type {
    BookCategory,
    BookType,
    IRenewalBookRequest,
    IReturnBookRequest,
    MemberType
} from '@/types/library/transactions/book-transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useBookReturnInitialData = (params: {
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
}) => {
    return useQuery({
        queryKey: ['book-return-initial', params],
        queryFn: () => getBookTransactionDetails(params),
        refetchOnWindowFocus: false
    });
};

export const useStudentDetails = () => {
    return useMutation({
        mutationFn: getStudentDetailsById,
        onError: (error) => {
            console.error('Error fetching student details:', error);
            toast.error('Failed to fetch student details');
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

export const useBookDetails = () => {
    return useMutation({
        mutationFn: getBookDetails,
        onError: (error) => {
            console.error('Error fetching book details:', error);
            toast.error('Failed to fetch book details');
        }
    });
};

export const useReturnBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IReturnBookRequest) => returnBook(data),
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Book returned successfully');
                queryClient.invalidateQueries({ queryKey: ['book-return-initial'] });
            } else {
                toast.error('Failed to return book');
            }
        },
        onError: (error) => {
            console.error('Error returning book:', error);
            toast.error('An error occurred while returning the book');
        }
    });
};

export const useRenewBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IRenewalBookRequest) => renewBook(data),
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Book renewed successfully');
                queryClient.invalidateQueries({ queryKey: ['book-return-initial'] });
            } else if (data.duplicate) {
                toast.warning('Book already renewed');
            } else {
                toast.error('Failed to renew book');
            }
        },
        onError: (error) => {
            console.error('Error renewing book:', error);
            toast.error('An error occurred while renewing the book');
        }
    });
};

export const useCalculateFine = () => {
    return useMutation({
        mutationFn: showFine
    });
};

export const useBarcodeSearch = () => {
    return useMutation({
        mutationFn: searchByBarcodeForReturn
    });
};

export const useLostBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => lostBook(data),
        onSuccess: (data) => {
            if (data.returnval) {
                toast.success('Book marked as lost successfully');
                queryClient.invalidateQueries({ queryKey: ['book-return-initial'] });
            } else {
                toast.error('Failed to mark book as lost');
            }
        },
        onError: (error) => {
            console.error('Error marking book as lost:', error);
            toast.error('An error occurred while marking book as lost');
        }
    });
};
