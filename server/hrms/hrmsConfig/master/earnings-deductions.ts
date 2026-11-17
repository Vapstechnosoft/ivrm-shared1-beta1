'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type {
    IAmountOrPercentageDropdown,
    IEarningsDeductionsTypeDropdown,
    IMasterEarningsDeductionsList,
    IRoundingTypeDropdown,
    ISalaryComponentTypeDropdown
} from '@/types/hrms/hrms-config/master';

/**
 * Get basic data for master earnings deductions with search, sort, and pagination
 * GET /api/MasterEarningsDeductions/master_earnings_deductions_get_load_data
 */
export async function getMasterEarningsDeductionsList(searchParams?: ApiSearchparams) {
    try {
        const searchableColumns = 'hrmeD_Name,hrmeD_EDTypeFlag,hrmeD_EarnDedFlag,hrmeD_AmountPercentFlag,hrmeD_RoundOffFlag';
        // Prioritize search columns provided in searchParams (e.g. from the page.tsx override)
        const columnsToSearch = (searchParams as any)?.search_column || (searchParams as any)?.search_columns || searchableColumns;
        const urlParams = getSearchParamsUrl(searchParams ?? {}, columnsToSearch);
        const url = `/api/MasterEarningsDeductions/master_earnings_deductions_get_load_data?${urlParams}`;
        return await api.get<IMasterEarningsDeductionsList[]>('hrms', url);
    } catch (error: any) {
        console.error('🔴 [MasterEarningsDeductionsList] Error:', error);
        return {
            success: false,
            message: error?.message || 'Failed to load earnings/deductions list',
            data: [],
            total: 0,
            page: searchParams?.page || 1,
            page_size: searchParams?.page_size || 10
        };
    }
}

/**
 * Save or Update master earnings deductions record
 * POST /api/MasterEarningsDeductions/master_earnings_deduction_save_update
 */
export async function saveMasterEarningsDeductions(data: any) {
    const url = '/api/MasterEarningsDeductions/master_earnings_deduction_save_update';
    return await api.post<any>('hrms', url, data);
}

/**
 * Toggle master earnings deductions record (activate/deactivate)
 * PUT /api/MasterEarningsDeductions/master_earning_deduction_toggle/{id}
 * Returns the updated earnings deduction object
 */
export async function activateDeactivateMasterEarningsDeductions(id: number) {
    const url = `/api/MasterEarningsDeductions/master_earning_deduction_toggle/${id}`;
    return await api.put<IMasterEarningsDeductionsList>('hrms', url);
}

/**
 * Save Earnings Deductions Type
 * POST /api/MasterEarningsDeductions/master_earnings_deduction_save_update_type
 */
export async function saveEarningsDeductionsType(data: any) {
    const url = '/api/MasterEarningsDeductions/master_earnings_deduction_save_update_type';
    return await api.post<any>('hrms', url, data);
}

/**
 * Get Master Earnings Deductions By Id
 * POST /api/MasterEarningsDeductions/getmaster_earnings_deduction_save_update_byID/{id}
 */
export async function getMasterEarningsDeductionsById(id: number) {
    const url = `/api/MasterEarningsDeductions/getmaster_earnings_deduction_save_update_byID/${id}`;
    return await api.post<any>('hrms', url, {});
}

/**
 * Get Master Earnings Deductions Order List
 * GET /api/MasterEarningsDeductions/master_earning_deduction_set_order_list
 */
export async function getMasterEarningsDeductionsOrderList() {
    const url = '/api/MasterEarningsDeductions/master_earning_deduction_set_order_list';
    return await api.get<IMasterEarningsDeductionsList[]>('hrms', url);
}

/**
 * Save Master Earnings Deductions Order
 * PUT /api/MasterEarningsDeductions/master_earning_deduction_set_order_save_update
 */
export async function saveMasterEarningsDeductionsOrder(data: any) {
    const url = '/api/MasterEarningsDeductions/master_earning_deduction_set_order_save_update';
    return await api.put<any>('hrms', url, data);
}

/**
 * Get Earnings Deductions Type List for dropdowns
 * GET /api/MasterDropDown/GetEarningsDeductionsType
 */
export async function getEarningsDeductionsTypeDropdown() {
    const url = '/api/MasterDropDown/GetEarningsDeductionsType';
    const response = await api.get<IEarningsDeductionsTypeDropdown[]>('hrms', url);
    console.log(response);
    return response
}

/**
 * Get Rounding Type List for dropdowns
 * GET /api/MasterDropDown/GetRoundingType
 */
export async function getRoundingTypeDropdown() {
    const url = '/api/MasterDropDown/GetRoundingType';
    return await api.get<IRoundingTypeDropdown[]>('hrms', url);
}

/**
 * Get Amount Or Percentage List for dropdowns
 * GET /api/MasterDropDown/GetAmountOrPercentage
 */
export async function getAmountOrPercentageDropdown() {
    const url = '/api/MasterDropDown/GetAmountOrPercentage';
    return await api.get<IAmountOrPercentageDropdown[]>('hrms', url);
}

/**
 * Get Salary Component Type List for dropdowns
 * GET /api/MasterDropDown/GetSalaryComponentType
 */
export async function getSalaryComponentTypeDropdown() {
    const url = '/api/MasterDropDown/GetSalaryComponentType';
    return await api.get<ISalaryComponentTypeDropdown[]>('hrms', url);
}
