'use server';

import { api } from '@/lib/apiService';
import { auth } from '@/lib/auth';
import type {
    BookCategory,
    BookType,
    IBookAvailability,
    IBookDetails,
    IBookTransactionInitialData,
    IIssueBookRequest,
    IRenewalBookRequest,
    IReturnBookRequest,
    IStaffDetails,
    IStudentDetails,
    MemberType
} from '@/types/library/transactions/book-transaction';

const FACADE = 'BookTransaction';

// Get initial data for the page
export async function getBookTransactionDetails(data: {
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMAL_Id?: number;
    ASMAY_Id?: number;
    ASMCL_Id?: number;
    ASMS_Id?: number;
}) {
    try {
        const url = `${FACADE}/Get_Student_Details1`;
        return await api.post<IBookTransactionInitialData>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/Get_Student_Details1 failed:`, err?.message || err);
        return {} as IBookTransactionInitialData;
    }
}

// Issue a book
export async function issueBook(data: IIssueBookRequest) {
    try {
        const url = `${FACADE}/Savedata`;
        return await api.post<{ returnval: boolean; duplicate: boolean; maxmsg: string }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/Savedata failed:`, err?.message || err);
        return { returnval: false, duplicate: false, maxmsg: 'Failed to issue book' };
    }
}

// Return a book
export async function returnBook(data: IReturnBookRequest) {
    try {
        const url = `${FACADE}/returndata`;
        return await api.post<{ returnval: boolean }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/returndata failed:`, err?.message || err);
        return { returnval: false };
    }
}

// Renew a book
export async function renewBook(data: IRenewalBookRequest) {
    try {
        const url = `${FACADE}/renewaldata`;
        return await api.post<{ returnval: boolean; duplicate: boolean; renew: boolean }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/renewaldata failed:`, err?.message || err);
        return { returnval: false, duplicate: false, renew: false };
    }
}

// Get student details
export async function getStudentDetailsById(data: {
    ASMAY_Id?: number;
    AMST_Id: number;
    LMBANO_Id?: number;
    LMB_Id?: number;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/studentdetails`;
        return await api.post<{
            studentdata: IStudentDetails[];
            alldata: any[];
            circularparamdetails: Array<{
                max_Issue_Days: number;
                max_No_Renewals: number;
                max_Issue_Items: number;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/studentdetails failed:`, err?.message || err);
        return { studentdata: [], alldata: [], circularparamdetails: [] };
    }
}

// Get staff details
export async function getStaffDetails(data: {
    LMBANO_Id?: number;
    HRME_Id: number;
    LMB_Id?: number;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/studentdetails`;
        return await api.post<{
            selctstaffdata: IStaffDetails[];
            alldata: any[];
            circularparamdetails: Array<{
                max_Issue_Days: number;
                max_No_Renewals: number;
                max_Issue_Items: number;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/studentdetails failed:`, err?.message || err);
        return { selctstaffdata: [], alldata: [], circularparamdetails: [] };
    }
}

// Get department details
export async function getDepartmentDetails(data: {
    LMBANO_Id?: number;
    HRMD_Id: number;
    LMB_Id?: number;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/studentdetails`;
        return await api.post<{
            circularparamdetails: Array<{
                max_Issue_Days: number;
                max_No_Renewals: number;
                max_Issue_Items: number;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/studentdetails failed:`, err?.message || err);
        return { circularparamdetails: [] };
    }
}

// Get book details
export async function getBookDetails(data: {
    LMBANO_Id: number;
    LMB_Id: number;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/get_bookdetails`;
        return await api.post<{
            bookdetails: IBookDetails[];
            circularparamdetails: Array<{
                max_Issue_Days: number;
                max_No_Renewals: number;
                max_Issue_Items: number;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/get_bookdetails failed:`, err?.message || err);
        return { bookdetails: [], circularparamdetails: [] };
    }
}

// Show fine details
export async function showFine(data: {
    Book_Trans_Id: number;
    issuertype: MemberType;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/showfine`;
        return await api.post<{
            fine_Amount: number;
            finecollected: number;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/showfine failed:`, err?.message || err);
        return { fine_Amount: 0, finecollected: 0 };
    }
}

// Calculate due date considering holidays
export async function calculateDueDateWithHolidays(data: {
    Return_Date: string;
    Issue_Date: string;
    difftotaldays: number;
}) {
    try {
        const url = `${FACADE}/ShowDiffrentDays`;
        return await api.post<{
            configdata: Array<{ Holidays: string }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/ShowDiffrentDays failed:`, err?.message || err);
        return { configdata: [] };
    }
}

// Search books
export async function searchBooks(data: {
    searchfilter: string;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMAL_Id?: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/searchfilter`;
        return await api.post<{
            booktitle: Array<{
                lmB_Id: number;
                lmbanO_Id: number;
                lmB_BookTitle: string;
                lmbanO_AccessionNo: string;
                amsT_FirstName?: string;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/searchfilter failed:`, err?.message || err);
        return { booktitle: [] };
    }
}

// Barcode search for issue
export async function searchByBarcode(data: {
    searchfilter: string;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMAL_Id?: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/searchfilterbarcode`;
        return await api.post<{
            booktitle: Array<{
                lmB_Id: number;
                lmbanO_Id: number;
                lmB_BookTitle: string;
                lmbanO_AccessionNo: string;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/searchfilterbarcode failed:`, err?.message || err);
        return { booktitle: [] };
    }
}

// Barcode search for return/renewal
export async function searchByBarcodeForReturn(data: {
    searchfilter: string;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMAL_Id?: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/searchfilterbarcode1`;
        return await api.post<{
            getalldata: any[];
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/searchfilterbarcode1 failed:`, err?.message || err);
        return { getalldata: [] };
    }
}

// Get students by class/section
export async function getStudentsByClassSection(data: {
    ASMAY_Id?: number;
    ASMCL_Id?: number;
    ASMS_Id?: number;
    LMAL_Id?: number;
    booktype?: BookType;
    issuertype?: MemberType;
    bookcat_type?: BookCategory;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/Get_Student_Details1`;
        return await api.post<any>('library', url, {
            booktype: data.booktype || 'issue',
            issuertype: data.issuertype || 'std',
            bookcat_type: data.bookcat_type || 'book',
            ...data
        });
    } catch (err: any) {
        console.warn(`POST ${FACADE}/Get_Student_Details1 failed:`, err?.message || err);
        return { data: [] };
    }
}

// Get staff by department/designation
export async function getStaffByDepartment(data: {
    HRMDES_Id: number;
    HRMD_Id: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/get_staff1`;
        return await api.post<{
            stafftlist: Array<{
                hrmE_Id: number;
                hrmE_EmployeeFirstName: string;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/get_staff1 failed:`, err?.message || err);
        return { stafftlist: [] };
    }
}

// Get designations by department
export async function getDesignationsByDepartment(data: {
    HRMD_Id: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/getdepchange`;
        return await api.post<{
            filldesignation: Array<{
                hrmdeS_Id: number;
                hrmdeS_DesignationName: string;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/getdepchange failed:`, err?.message || err);
        return { filldesignation: [] };
    }
}

// Search in transaction grid
export async function searchTransactionGrid(data: {
    searctype: string;
    searchfilter?: string;
    booktype: BookType;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMAL_Id?: number;
    ASMCL_Id?: number;
    ASMS_Id?: number;
    Issue_Date?: string;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/stdSearch_Grid`;
        return await api.post<{
            getalldata: any[];
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/stdSearch_Grid failed:`, err?.message || err);
        return { getalldata: [] };
    }
}

// Load available books
export async function loadAvailableBooks(data: {
    LMAL_Id?: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/loadbookavail`;
        return await api.post<{
            avilbooktitle: Array<{
                lmB_Id: number;
                lmbanO_Id: number;
                lmB_BookTitle: string;
                lmbanO_AccessionNo: string;
            }>;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/loadbookavail failed:`, err?.message || err);
        return { avilbooktitle: [] };
    }
}

// Get book availability details
export async function getBookAvailabilityDetails(data: {
    LMBANO_Id: number;
    LMB_Id: number;
    FODM_Id?: number;
}) {
    try {
        const url = `${FACADE}/availget_bookdetails`;
        return await api.post<{
            avilbookdetails: IBookAvailability[];
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/availget_bookdetails failed:`, err?.message || err);
        return { avilbookdetails: [] };
    }
}

// Edit transaction data (for return/renewal)
export async function editTransactionData(data: {
    Book_Trans_Id: number;
    ASMCL_Id?: number;
    AMST_Id?: number;
    HRMGT_Id?: number;
    HRME_Id?: number;
    HRMD_Id?: number;
    issuertype: MemberType;
    booktype: BookType;
    bookcat_type: BookCategory;
}) {
    try {
        const url = `${FACADE}/Editdata`;
        return await api.post<{
            booktitle: any[];
            editlist: any[];
            circularparamdetails: Array<{
                max_Issue_Days: number;
                max_No_Renewals: number;
                max_Issue_Items: number;
            }>;
            fine_Amount: number;
            finecollected: number;
        }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/Editdata failed:`, err?.message || err);
        return { booktitle: [], editlist: [], circularparamdetails: [], fine_Amount: 0, finecollected: 0 };
    }
}

// Lost Book
export async function lostBook(data: {
    Book_Trans_Id: number;
    LMBANO_Id: number;
    LMB_Id: number;
    issuertype: MemberType;
    bookcat_type: BookCategory;
    LMB_BookTitle: string;
    LBTR_FineCollected: number;
    LBTR_TotalFine: number;
}) {
    try {
        const url = `${FACADE}/LostBook`;
        return await api.post<{ returnval: boolean }>('library', url, data);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/LostBook failed:`, err?.message || err);
        return { returnval: false };
    }
}

// Get Book Details on Load (for book title, class, section, years, libraries)
export async function getBookDetailsOnLoad(data?: any) {
    try {
        let miId = data?.mI_Id || data?.MI_Id || 48;
        let userId = data?.IVRMUL_Id || data?.ivrmuL_Id || 0;
        let asmayId = data?.ASMAY_Id || data?.asmaY_Id || 0;

        try {
            const session = await auth();
            if (session?.mi_id) miId = Number(session.mi_id);
            if (session?.ivrmuL_Id) userId = Number(session.ivrmuL_Id);
            else if (session?.user_id) userId = Number(session.user_id);
            if (session?.asmaY_Id) asmayId = Number(session.asmaY_Id);
        } catch (authErr) {
            console.warn('Session reading note in getBookDetailsOnLoad:', authErr);
        }

        const payload = {
            MI_Id: miId,
            mI_Id: miId,
            ASMAY_Id: asmayId,
            asmaY_Id: asmayId,
            IVRMUL_Id: userId,
            ivrmuL_Id: userId,
            ...data
        };

        const url = `${FACADE}/get-book-details`;
        return await api.post<any>('library', url, payload);
    } catch (err: any) {
        console.warn(`POST ${FACADE}/get-book-details failed:`, err?.message || err);
        return { success: false, data: null };
    }
}

// Get Student Details via GET (for student name, admission no, and student list)
export async function getStudentDetails1() {
    try {
        const session = await auth();
        const miId = session?.mi_id ? Number(session.mi_id) : 48;
        const url = `${FACADE}/Get_Student_Details1`;
        return await api.post<any>('library', url, { MI_Id: miId, mI_Id: miId });
    } catch (err: any) {
        console.warn(`POST ${FACADE}/Get_Student_Details1 failed:`, err?.message || err);
        return { success: false, data: null };
    }
}




