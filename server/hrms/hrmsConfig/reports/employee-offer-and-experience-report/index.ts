'use server';
import { api, type ApiResponse } from '@/lib/apiService';
import type {
    EmployeeOfferAndExperienceReportFilterRequest,
    EmployeeOfferAndExperienceReportFilterResponse,
    EmployeeOfferAndExperienceReportSearchRequest,
    EmployeeOfferAndExperienceReportSearchResponse
} from '@/types/hrms/reports/employee-offer-and-experience-report';
/**
 * Filter employee data for offer and experience report
 * POST /api/EmployeeOfferAndExperienceReportFacade/FilterEmployeeData
 * Request: { MI_Id, HRMGT_Id, HRMD_Id, HRMDES_Id, LogInUserId }
 */
export async function filterEmployeeOfferAndExperienceData(
    requestBody: EmployeeOfferAndExperienceReportFilterRequest
): Promise<ApiResponse<EmployeeOfferAndExperienceReportFilterResponse>> {
    console.log('📥 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Request payload:', JSON.stringify(requestBody, null, 2));

    const url = '/api/EmployeeOfferAndExperienceReportFacade/FilterEmployeeData';
    console.log('🌐 [EMPLOYEE OFFER AND EXPERIENCE REPORT] API URL:', url);
    console.log('🌐 [EMPLOYEE OFFER AND EXPERIENCE REPORT] API Base: hrms');
    console.log('🌐 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Method: POST');

    // If running in development, return a local mocked employeedropdown to simplify UI testing
    if (process.env.NODE_ENV === 'development') {
        const mockEmployeedropdown = [
            {
                HRME_Id: 1,
                HRME_EmployeeCode: 'EMP001',
                HRME_EmployeeFirstName: 'chandrakala',
                HRME_EmployeeMiddleName: 'j',
                HRME_EmployeeLastName: 'k',
                HRMD_Id: 1,
                HRMD_DepartmentName: 'Teaching',
                HRMDES_Id: 1,
                HRMDES_DesignationName: 'Senior yoga teacher',
                HRMGT_Id: 1,
                HRMGT_EmployeeGroupType: 'Teaching',
                HRME_DOJ: '2021-05-01',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 1,
                HRMET_EmployeeType: 'Permanent'
            },
            {
                HRME_Id: 2,
                HRME_EmployeeCode: 'EMP002',
                HRME_EmployeeFirstName: 'John',
                HRME_EmployeeLastName: 'Doe',
                HRMD_Id: 2,
                HRMD_DepartmentName: 'JUNIOR SCHOOL',
                HRMDES_Id: 3,
                HRMDES_DesignationName: 'Assistant Teacher',
                HRMGT_Id: 1,
                HRMGT_EmployeeGroupType: 'Teaching',
                HRME_DOJ: '2023-03-15',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 1,
                HRMET_EmployeeType: 'Permanent'
            },
            {
                HRME_Id: 3,
                HRME_EmployeeCode: 'EMP003',
                HRME_EmployeeFirstName: 'Anita',
                HRME_EmployeeLastName: 'Sharma',
                HRMD_Id: 3,
                HRMD_DepartmentName: 'SENIOR SCHOOL',
                HRMDES_Id: 4,
                HRMDES_DesignationName: 'Vice Principal',
                HRMGT_Id: 1,
                HRMGT_EmployeeGroupType: 'Teaching',
                HRME_DOJ: '2019-08-01',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 1,
                HRMET_EmployeeType: 'Permanent'
            },
            {
                HRME_Id: 4,
                HRME_EmployeeCode: 'EMP004',
                HRME_EmployeeFirstName: 'Ramesh',
                HRME_EmployeeLastName: 'Kumar',
                HRMD_Id: 4,
                HRMD_DepartmentName: 'OFFICE STAFF',
                HRMDES_Id: 1,
                HRMDES_DesignationName: 'Senior yoga teacher',
                HRMGT_Id: 2,
                HRMGT_EmployeeGroupType: 'Non Teaching',
                HRME_DOJ: '2020-11-20',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 2,
                HRMET_EmployeeType: 'Probationary'
            }
        ];

        return {
            success: true,
            message: 'Mocked employeedropdown (development)',
            data: {
                MI_Id: requestBody.MI_Id || 30,
                retrunMsg: 'Mocked data',
                roleId: 0,
                employeedropdown: mockEmployeedropdown
            }
        } as ApiResponse<EmployeeOfferAndExperienceReportFilterResponse>;
    }

    try {
        const response = await api.post<EmployeeOfferAndExperienceReportFilterResponse>('hrms', url, requestBody);

        console.log('✅ [EMPLOYEE OFFER AND EXPERIENCE REPORT] API Response received');
        console.log('📤 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Response structure:', {
            hasSuccess: 'success' in response,
            hasData: 'data' in response,
            responseKeys: Object.keys(response || {})
        });

        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const responseData = response.data as unknown as EmployeeOfferAndExperienceReportFilterResponse;
            console.log('📊 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Response data summary:', {
                hasEmployeedropdown: !!responseData?.employeedropdown,
                employeedropdownCount: Array.isArray(responseData?.employeedropdown) ? responseData.employeedropdown.length : 0,
                retrunMsg: responseData?.retrunMsg
            });
            return response as ApiResponse<EmployeeOfferAndExperienceReportFilterResponse>;
        }
        // Wrap raw response data
        const rawResponse = response as unknown as EmployeeOfferAndExperienceReportFilterResponse;
        return {
            success: true,
            message: rawResponse?.retrunMsg || 'Filter completed successfully',
            data: rawResponse
        };
    } catch (error: any) {
        console.error('❌ [EMPLOYEE OFFER AND EXPERIENCE REPORT] Error in filterEmployeeOfferAndExperienceData:', error);
        console.error('❌ [EMPLOYEE OFFER AND EXPERIENCE REPORT] Error details:', {
            message: error?.message,
            stack: error?.stack,
            response: error?.response
        });

        return {
            success: false,
            message: error?.message || 'Failed to filter employee data',
            data: null
        };
    }
}
/**
 * Get employee details by selection for offer and experience report
 * POST /api/EmployeeOfferAndExperienceReportFacade/getEmployeedetailsBySelection
 * Request: { MI_Id, HRMGT_Id, HRMD_Id, HRMDES_Id, LogInUserId }
 */
export async function getEmployeeDetailsBySelection(
    requestBody: EmployeeOfferAndExperienceReportSearchRequest
): Promise<ApiResponse<EmployeeOfferAndExperienceReportSearchResponse>> {
    console.log('📥 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Request payload:', JSON.stringify(requestBody, null, 2));

    const url = '/api/EmployeeOfferAndExperienceReportFacade/getEmployeedetailsBySelection';
    console.log('🌐 [EMPLOYEE OFFER AND EXPERIENCE REPORT] API URL:', url);
    console.log('🌐 [EMPLOYEE OFFER AND EXPERIENCE REPORT] API Base: hrms');
    console.log('🌐 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Method: POST');

    // If running in development, return a local mocked employeedropdown to simplify UI testing
    if (process.env.NODE_ENV === 'development') {
        const mockEmployeedropdown = [
            {
                HRME_Id: 1,
                HRME_EmployeeCode: 'EMP001',
                HRME_EmployeeFirstName: 'chandrakala',
                HRME_EmployeeMiddleName: 'j',
                HRME_EmployeeLastName: 'k',
                HRMD_Id: 1,
                HRMD_DepartmentName: 'Teaching',
                HRMDES_Id: 1,
                HRMDES_DesignationName: 'Senior yoga teacher',
                HRMGT_Id: 1,
                HRMGT_EmployeeGroupType: 'Teaching',
                HRME_DOJ: '2021-05-01',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 1,
                HRMET_EmployeeType: 'Permanent'
            },
            {
                HRME_Id: 2,
                HRME_EmployeeCode: 'EMP002',
                HRME_EmployeeFirstName: 'John',
                HRME_EmployeeLastName: 'Doe',
                HRMD_Id: 2,
                HRMD_DepartmentName: 'JUNIOR SCHOOL',
                HRMDES_Id: 3,
                HRMDES_DesignationName: 'Assistant Teacher',
                HRMGT_Id: 1,
                HRMGT_EmployeeGroupType: 'Teaching',
                HRME_DOJ: '2023-03-15',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 1,
                HRMET_EmployeeType: 'Permanent'
            },
            {
                HRME_Id: 3,
                HRME_EmployeeCode: 'EMP003',
                HRME_EmployeeFirstName: 'Anita',
                HRME_EmployeeLastName: 'Sharma',
                HRMD_Id: 3,
                HRMD_DepartmentName: 'SENIOR SCHOOL',
                HRMDES_Id: 4,
                HRMDES_DesignationName: 'Vice Principal',
                HRMGT_Id: 1,
                HRMGT_EmployeeGroupType: 'Teaching',
                HRME_DOJ: '2019-08-01',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 1,
                HRMET_EmployeeType: 'Permanent'
            },
            {
                HRME_Id: 4,
                HRME_EmployeeCode: 'EMP004',
                HRME_EmployeeFirstName: 'Ramesh',
                HRME_EmployeeLastName: 'Kumar',
                HRMD_Id: 4,
                HRMD_DepartmentName: 'OFFICE STAFF',
                HRMDES_Id: 1,
                HRMDES_DesignationName: 'Senior yoga teacher',
                HRMGT_Id: 2,
                HRMGT_EmployeeGroupType: 'Non Teaching',
                HRME_DOJ: '2020-11-20',
                HRME_DOL: undefined,
                HRME_LeftFlag: false,
                HRMET_Id: 2,
                HRMET_EmployeeType: 'Probationary'
            }
        ];

        return {
            success: true,
            message: 'Mocked employeedropdown (development)',
            data: {
                MI_Id: requestBody.MI_Id || 30,
                retrunMsg: 'Mocked data',
                roleId: 0,
                employeedropdown: mockEmployeedropdown
            }
        } as ApiResponse<EmployeeOfferAndExperienceReportSearchResponse>;
    }

    try {
        const response = await api.post<EmployeeOfferAndExperienceReportSearchResponse>('hrms', url, requestBody);

        console.log('✅ [EMPLOYEE OFFER AND EXPERIENCE REPORT] API Response received');
        console.log('📤 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Response structure:', {
            hasSuccess: 'success' in response,
            hasData: 'data' in response,
            responseKeys: Object.keys(response || {})
        });

        // The backend returns raw data, not wrapped in ApiResponse format
        // Wrap it to match the expected ApiResponse structure
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            // Already wrapped
            const responseData = response.data as unknown as EmployeeOfferAndExperienceReportSearchResponse;
            console.log('📊 [EMPLOYEE OFFER AND EXPERIENCE REPORT] Response data summary:', {
                hasEmployeedropdown: !!responseData?.employeedropdown,
                employeedropdownCount: Array.isArray(responseData?.employeedropdown) ? responseData.employeedropdown.length : 0,
                retrunMsg: responseData?.retrunMsg
            });
            return response as ApiResponse<EmployeeOfferAndExperienceReportSearchResponse>;
        }
        // Wrap raw response data
        const rawResponse = response as unknown as EmployeeOfferAndExperienceReportSearchResponse;
        return {
            success: true,
            message: rawResponse?.retrunMsg || 'Employee details retrieved successfully',
            data: rawResponse
        };
    } catch (error: any) {
        console.error('❌ [EMPLOYEE OFFER AND EXPERIENCE REPORT] Error in getEmployeeDetailsBySelection:', error);
        console.error('❌ [EMPLOYEE OFFER AND EXPERIENCE REPORT] Error details:', {
            message: error?.message,
            stack: error?.stack,
            response: error?.response
        });

        return {
            success: false,
            message: error?.message || 'Failed to get employee details',
            data: null
        };
    }
}
