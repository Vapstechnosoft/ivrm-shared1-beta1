'use client';

import { LIBRARY_QUERY_KEYS } from '@/constants/query-keys';
import {
    getBookDetails,
    getBookTransactionDetails,
    getDesignationsByDepartment,
    getStaffByDepartment,
    getStudentDetailsById,
    getStudentsByClassSection,
    issueBook,
    renewBook,
    returnBook,
    searchBooks,
    showFine
} from '@/server/library/transactions/book-return';
import type {
    BookCategory,
    BookType,
    IIssueBookRequest,
    IRenewalBookRequest,
    IReturnBookRequest,
    MemberType
} from '@/types/library/transactions/book-transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Hook for initial data
export function useBookTransaction(params: {
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMAL_Id?: number;
    ASMAY_Id?: number;
    ASMCL_Id?: number;
    ASMS_Id?: number;
}) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.BOOK_TRANSACTION, params],
        queryFn: () => getBookTransactionDetails(params),
        staleTime: 5 * 60 * 1000 // 5 minutes,
    });
}

// Hook for issuing a book
export function useIssueBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IIssueBookRequest) => issueBook(data),
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success('Book issued successfully!');
                queryClient.invalidateQueries({ queryKey: [LIBRARY_QUERY_KEYS.BOOK_TRANSACTION] });
            } else if (response.data?.duplicate) {
                toast.error('Book already assigned');
            } else if (response.data?.maxmsg === 'exceed') {
                toast.error('Exceeds the number of books that can be issued');
            } else {
                toast.error('Failed to issue book');
            }
        },
        onError: () => {
            toast.error('An error occurred while issuing the book');
        }
    });
}

// Hook for returning a book
export function useReturnBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IReturnBookRequest) => returnBook(data),
        onSuccess: (response) => {
            if (response.data?.returnval) {
                toast.success('Book returned successfully!');
                queryClient.invalidateQueries({ queryKey: [LIBRARY_QUERY_KEYS.BOOK_TRANSACTION] });
            } else {
                toast.error('Failed to return book');
            }
        },
        onError: () => {
            toast.error('An error occurred while returning the book');
        }
    });
}

// Hook for renewing a book
export function useRenewBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IRenewalBookRequest) => renewBook(data),
        onSuccess: (response) => {
            if (response.data?.renew) {
                toast.error('Exceeds the renewal limits! Please return this book.');
            } else if (response.data?.returnval) {
                toast.success('Book renewed successfully!');
                queryClient.invalidateQueries({ queryKey: [LIBRARY_QUERY_KEYS.BOOK_TRANSACTION] });
            } else if (response.data?.duplicate) {
                toast.error('Book already assigned');
            } else {
                toast.error('Failed to renew book');
            }
        },
        onError: () => {
            toast.error('An error occurred while renewing the book');
        }
    });
}

// Hook for getting student details
export function useStudentDetails(
    params: {
        ASMAY_Id?: number;
        AMST_Id: number;
        LMBANO_Id?: number;
        LMB_Id?: number;
        booktype: BookType;
        issuertype: MemberType;
        bookcat_type: BookCategory;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.STUDENT_DETAILS, params],
        queryFn: () => getStudentDetailsById(params),
        enabled: enabled && !!params.AMST_Id
    });
}

// Hook for getting book details
export function useBookDetails(
    params: {
        LMBANO_Id: number;
        LMB_Id: number;
        booktype: BookType;
        issuertype: MemberType;
        bookcat_type: BookCategory;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.BOOK_DETAILS, params],
        queryFn: () => getBookDetails(params),
        enabled: enabled && !!params.LMBANO_Id && !!params.LMB_Id
    });
}

// Hook for searching books
export function useSearchBooks(
    params: {
        searchfilter: string;
        booktype: BookType;
        issuertype: MemberType;
        bookcat_type: BookCategory;
        LMAL_Id?: number;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.SEARCH_BOOKS, params],
        queryFn: () => searchBooks(params),
        enabled: enabled && params.searchfilter.length >= 3
    });
}

// Hook for getting students by class/section
export function useStudentsByClassSection(
    params: {
        ASMAY_Id: number;
        ASMCL_Id: number;
        ASMS_Id: number;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.STUDENTS_BY_CLASS, params],
        queryFn: () => getStudentsByClassSection(params),
        enabled: enabled && !!params.ASMAY_Id && !!params.ASMCL_Id && !!params.ASMS_Id
    });
}

// Hook for getting staff by department
export function useStaffByDepartment(
    params: {
        HRMDES_Id: number;
        HRMD_Id: number;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.STAFF_BY_DEPARTMENT, params],
        queryFn: () => getStaffByDepartment(params),
        enabled: enabled && !!params.HRMDES_Id && !!params.HRMD_Id
    });
}

// Hook for getting designations by department
export function useDesignationsByDepartment(
    params: {
        HRMD_Id: number;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.DESIGNATIONS_BY_DEPARTMENT, params],
        queryFn: () => getDesignationsByDepartment(params),
        enabled: enabled && !!params.HRMD_Id
    });
}

// Hook for showing fine
export function useShowFine(
    params: {
        Book_Trans_Id: number;
        issuertype: MemberType;
        FODM_Id?: number;
    },
    enabled = false
) {
    return useQuery({
        queryKey: [LIBRARY_QUERY_KEYS.SHOW_FINE, params],
        queryFn: () => showFine(params),
        enabled: enabled && !!params.Book_Trans_Id
    });
}
