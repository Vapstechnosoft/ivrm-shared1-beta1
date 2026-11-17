'use server';
import { api } from '@/lib/apiService';
import type { ApiResponse } from '@/types/hrms/employee-loan';
import type {
    EmployeeDetailsResponse,
    EmployeeLoanDeleteRequest,
    EmployeeLoanGridResponse,
    EmployeeLoanItem,
    EmployeeLoanMastersResponse,
    EmployeeLoanOnloadRequest,
    EmployeeLoanOnloadResponse,
    EmployeeLoanSaveRequest,
    EmployeeLoanSaveResponse
} from '@/types/hrms/employee-loan';

/**
 * Get Masters and Configuration (Legacy Facade + New Dropdowns)
 * GET /api/MasterDropDown/active_loan_employees_dropdown
 * GET /api/MasterDropDown/GetLoanType
 * GET /api/MasterDropDown/mode_of_payment_drop_down_for_loan
 * POST /api/HREmpLoanFacade/onloadgetdetails (Legacy for Config)
 */
export async function getEmployeeLoanMasters(
    payload?: EmployeeLoanOnloadRequest
): Promise<ApiResponse<EmployeeLoanMastersResponse>> {
    const onloadUrl = '/api/HREmpLoanFacade/onloadgetdetails';
    const employeeDropdownUrl = 'https://ivrm-dev-hrms-api.azurewebsites.net/api/MasterDropDown/active_loan_employees_dropdown';
    const loanTypeUrl = 'https://ivrm-dev-hrms-api.azurewebsites.net/api/MasterDropDown/GetLoanType';
    const paymentModeUrl = 'https://ivrm-dev-hrms-api.azurewebsites.net/api/MasterDropDown/mode_of_payment_drop_down_for_loan';

    const requestBody = {
        page: 1,
        page_size: 10,
        MIID: payload?.MIID ?? 30,
        LoginUserId: payload?.LoginUserId ?? 0,
        UserRole: payload?.UserRole ?? ''
    };

    try {
        console.log('Fetching Employee Loan Masters...');
        // Fetch specific dropdowns + legacy config in parallel using allSettled to prevent total failure
        const results = await Promise.allSettled([
            api.post<EmployeeLoanMastersResponse>('hrms', onloadUrl, requestBody),
            api.get<any>('hrms', employeeDropdownUrl),
            api.get<any>('hrms', loanTypeUrl),
            api.get<any>('hrms', paymentModeUrl)
        ]);

        const onloadResult = results[0];
        const employeeResult = results[1];
        const loanTypeResult = results[2];
        const paymentModeResult = results[3];

        if (onloadResult.status === 'rejected') console.error('Onload Config Failed:', onloadResult.reason);
        if (employeeResult.status === 'rejected') console.error('Employee Dropdown Failed:', employeeResult.reason);
        if (loanTypeResult.status === 'rejected') console.error('Loan Type Dropdown Failed:', loanTypeResult.reason);
        if (paymentModeResult.status === 'rejected') console.error('Payment Mode Dropdown Failed:', paymentModeResult.reason);

        // Process Legacy Onload (Config)
        const onloadResponse = onloadResult.status === 'fulfilled' ? onloadResult.value : { success: false, data: null };

        // Process Employee Dropdown
        let mappedEmployees: any[] = [];
        if (employeeResult.status === 'fulfilled' && employeeResult.value.success && Array.isArray(employeeResult.value.data)) {
            mappedEmployees = employeeResult.value.data.map((emp: any) => ({
                HRME_Id: emp.hrmE_Id,
                employeeName: emp.employeeName,
                HRME_EmployeeCode: '',
                HRME_EmployeeFirstName: emp.employeeName,
                HRME_EmployeeMiddleName: '',
                HRME_EmployeeLastName: ''
            }));
        } else {
            mappedEmployees = onloadResponse.data?.employeedropdown || [];
        }

        // Process Loan Type Dropdown
        let mappedLoanTypes: any[] = [];
        if (loanTypeResult.status === 'fulfilled' && loanTypeResult.value.success && Array.isArray(loanTypeResult.value.data)) {
            mappedLoanTypes = loanTypeResult.value.data.map((lt: any) => ({
                HRMLN_Id: lt.key,
                HRML_LoanType: lt.value,
                HRMLN_ActiveFlag: true
            }));
        } else {
            mappedLoanTypes = onloadResponse.data?.masterloandropdown || [];
        }

        // Process Payment Mode Dropdown
        let mappedPaymentModes: any[] = [];
        if (paymentModeResult.status === 'fulfilled' && paymentModeResult.value.success && Array.isArray(paymentModeResult.value.data)) {
            mappedPaymentModes = paymentModeResult.value.data.map((pm: any) => ({
                IVRMMOD_Id: pm.ivrmmoD_Id,
                IVRMMOD_ModeOfPayment: pm.ivrmmoD_ModeOfPayment,
                IVRMMOD_ActiveFlag: true
            }));
        } else {
            mappedPaymentModes = onloadResponse.data?.modeOfPaymentdropdown || [];
        }

        const mastersData: EmployeeLoanMastersResponse = {
            employeedropdown: mappedEmployees,
            masterloandropdown: mappedLoanTypes,
            modeOfPaymentdropdown: mappedPaymentModes,
            configurationDetails: onloadResponse.data?.configurationDetails || null,
            ASMAY_Id: onloadResponse.data?.ASMAY_Id || 0,
            roleId: onloadResponse.data?.roleId || 0,
            retrunMsg: onloadResponse.data?.retrunMsg || '',
        };

        return {
            success: true,
            message: 'Masters loaded successfully',
            data: mastersData
        };
    } catch (error: any) {
        console.error('Critical Error in getEmployeeLoanMasters:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load master data',
            data: null
        };
    }
}

/**
 * Get Employee Loan Grid Data (New REST API)
 * GET /api/HREmpLoan
 */
export async function getEmployeeLoanGrid(
    payload: EmployeeLoanOnloadRequest
): Promise<ApiResponse<EmployeeLoanGridResponse>> {
    const queryString = new URLSearchParams();
    if (payload.page) queryString.append('page', payload.page!.toString());
    if (payload.page_size) queryString.append('page_size', payload.page_size!.toString());

    const url = `/api/HREmpLoan?${queryString.toString()}`;

    try {
        const response = await api.get<any>('hrms', url);

        if (!response.success || !response.data) {
            return {
                success: false,
                message: response.message || 'Failed to load grid data',
                data: null
            };
        }

        const mappedItems: EmployeeLoanItem[] = Array.isArray(response.data)
            ? response.data.map((item: any) => ({
                HREL_Id: item.hreL_Id,
                MI_Id: item.mI_Id || 0,
                HRME_Id: item.hrmE_Id || 0,
                EmployeeFullName: item.employeeFullName || '', // Added
                HRME_EmployeeCode: item.masterEmployee?.hrmE_EmployeeCode,
                HRME_EmployeeFirstName: item.employeeFullName, // Use full name as fallback
                HRMLN_Id: item.hrmlN_Id || 0,
                HRML_LoanType: item.hrmL_LoanType, // Added
                HREL_AppliedDate: item.hreL_AppliedDate,
                HREL_EmpLoanId: item.hreL_EmpLoanId,
                HREL_LoanAmount: item.hreL_LoanAmount || 0,
                HREL_LoanInsallments: item.hreL_LoanInsallments,
                HREL_LaonEMI: item.hreL_LaonEMI,
                HREL_LoanStatus: item.hreL_LoanStatus,
                HREL_SanctionedAmount: item.hreL_SanctionedAmount || 0,
                HREL_TotalPrincipalPaid: item.hreL_TotalPrincipalPaid || 0,
                HREL_TotalInterestPaid: item.hreL_TotalInterestPaid || 0,
                HREL_TotalPending: item.hreL_TotalPending || 0,
                HREL_LoanInterest: item.hreL_LoanInterest || 0,
                HREL_ModeOfPayment: item.hreL_ModeOfPayment,
                HREL_ReferenceNo: item.hreL_ReferenceNo,
                HREL_ActiveFlag: item.hreL_ActiveFlag,
                HREL_NoofInstallment: item.hreL_NoofInstallment,
                CreatedDate: item.createdDate,
                UpdatedDate: item.updatedDate
            }))
            : [];

        return {
            success: true,
            message: 'Data loaded successfully',
            data: {
                emploanList: mappedItems,
                total: response.total || 0,
                page: Number(response.page) || 1,
                page_size: Number(response.page_size) || 10
            }
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to load grid data',
            data: null
        };
    }
}

/**
 * Save/Update employee loan
 * POST /api/HREmpLoan
 */
export async function saveEmployeeLoan(data: EmployeeLoanSaveRequest): Promise<EmployeeLoanSaveResponse> {
    const url = '/api/HREmpLoan';

    // Construct Payload matching user requirements
    const requestBody = {
        HREL_Id: data.HREL_Id || 0,
        HRME_Id: data.HRME_Id || 0,
        HREL_AppliedDate: data.HREL_AppliedDate, // "2026-01-23T00:00:00" format assumed passed from UI or handled here
        HREL_EmpLoanId: data.HREL_EmpLoanId || "0", // Defaulting if not passed
        HRMLN_Id: data.HRMLN_Id || 0,
        HREL_LoanAmount: data.HREL_LoanAmount || 0,
        HREL_LoanInsallments: String(data.HREL_LoanInsallments || ''),
        HREL_LaonEMI: String(data.HREL_LaonEMI || ''),
        HREL_SanctionedAmount: data.HREL_SanctionedAmount || data.HREL_LoanAmount, // Default to loan amount if not provided
        HREL_TotalPrincipalPaid: data.HREL_TotalPrincipalPaid || 0,
        HREL_TotalInterestPaid: data.HREL_TotalInterestPaid || 0,
        HREL_TotalPending: data.HREL_TotalPending || data.HREL_LoanAmount, // Default to loan amount if new
        HREL_LoanInterest: data.HREL_LoanInterest || 0,
        HREL_ModeOfPayment: data.HREL_ModeOfPayment || '',
        HREL_ReferenceNo: data.HREL_ReferenceNo,
        HREL_NoofInstallment: Number(data.HREL_LoanInsallments) || 0
    };

    try {
        const response = await api.post<any>('hrms', url, requestBody);
        return {
            success: response.success ?? true,
            message: response.message || 'Employee loan saved successfully',
            data: null
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to save employee loan',
            data: null
        };
    }
}

/**
 * Get employee loan record by ID
 * GET /api/HREmpLoan/employees_loan_by_id/{hrel_id}
 */
export async function getEmployeeLoanById(hrelId: number): Promise<ApiResponse<EmployeeLoanOnloadResponse>> {
    const url = `/api/HREmpLoan/employees_loan_by_id/${hrelId}`;

    try {
        const response = await api.get<any>('hrms', url);

        if (!response.success || !response.data) {
            return {
                success: false,
                message: response.message || 'Failed to retrieve record',
                data: null
            };
        }

        const loan = response.data.employeeLoan;
        const grossSal = response.data.empGrossSal;

        // Map to EmployeeLoanOnloadResponse structure for the UI
        const mappedData: EmployeeLoanOnloadResponse = {
            HREL_Id: loan.hreL_Id,
            MI_Id: loan.mI_Id,
            HRME_Id: loan.hrmE_Id,
            HREL_AppliedDate: loan.hreL_AppliedDate,
            HREL_EmpLoanId: loan.hreL_EmpLoanId,
            HRMLN_Id: loan.hrmlN_Id,
            HREL_LoanAmount: loan.hreL_LoanAmount,
            HREL_LoanInsallments: Number(loan.hreL_LoanInsallments),
            HREL_LaonEMI: Number(loan.hreL_LaonEMI),
            HREL_LoanStatus: loan.hreL_LoanStatus,
            HREL_SanctionedAmount: loan.hreL_SanctionedAmount,
            HREL_TotalPrincipalPaid: loan.hreL_TotalPrincipalPaid,
            HREL_TotalInterestPaid: loan.hreL_TotalInterestPaid,
            HREL_TotalPending: loan.hreL_TotalPending,
            HREL_LoanInterest: loan.hreL_LoanInterest,
            HREL_ModeOfPayment: loan.hreL_ModeOfPayment,
            HREL_ReferenceNo: loan.hreL_ReferenceNo,
            HREL_ActiveFlag: loan.hreL_ActiveFlag,
            HREL_NoofInstallment: loan.hreL_NoofInstallment,
            empGrossSal: grossSal,
            // Minimal required fields
            employeedropdown: [],
            masterloandropdown: [],
            modeOfPaymentdropdown: [],
            configurationDetails: null,
            ASMAY_Id: 0,
            roleId: 0,
            retrunMsg: '',
            emploanList: null,
            hrmE_EmployeeFirstName: '',
            HRML_LoanType: '',
            transnumconfigsettings: null
        };

        return {
            success: true,
            message: 'Record retrieved successfully',
            data: mappedData
        };

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to retrieve employee loan record',
            data: null
        };
    }
}

/**
 * Activate/Deactivate employee loan
 * PUT /api/HREmpLoan/toggle_employee_loan/{hrel_id}
 */
export async function activateDeactivateEmployeeLoan(data: EmployeeLoanDeleteRequest): Promise<ApiResponse<any>> {
    const url = `/api/HREmpLoan/toggle_employee_loan/${data.HREL_Id}`;

    try {
        const response = await api.put<any>('hrms', url, {});
        return {
            success: response.success ?? true,
            message: response.message || 'Status updated successfully',
            data: null
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to update status',
            data: null
        };
    }
}

/**
 * Get employee details by employee ID (Earnings/Deductions)
 * GET /api/HREmpLoan/employees_loan_by_employee_id?hrme_id={id}
 */
export async function getEmployeeLoanByEmployee(employeeId: number): Promise<ApiResponse<EmployeeDetailsResponse>> {
    const url = `/api/HREmpLoan/employees_loan_by_employee_id?hrme_id=${employeeId}`;

    try {
        const response = await api.get<any>('hrms', url);

        if (!response.success || !response.data) {
            return {
                success: false,
                message: response.message || 'Failed to retrieve employee details',
                data: null
            };
        }

        return {
            success: true,
            message: 'Employee details retrieved successfully',
            data: response.data as EmployeeDetailsResponse
        };

    } catch (error: any) {
        return {
            success: false,
            message: error?.message || 'Failed to retrieve employee loan details by employee',
            data: null
        };
    }
}
