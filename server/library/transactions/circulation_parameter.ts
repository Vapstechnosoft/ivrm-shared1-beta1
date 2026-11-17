'use server';

import { api } from '@/lib/apiService';
import { auth } from '@/lib/auth';
import type { ICirculationParameterInitialData } from '@/types/library/transactions/circulationParameter';

const FACADE = 'CirculationParameter';

// Helper to check if error is 405 Method Not Allowed
function is405Error(err: any): boolean {
    const message = err?.message || err?.toString() || '';
    const status = err?.status || err?.response?.status;
    return status === 405 || message.includes('405');
}

export const getCirculationParameterDetails = async () => {
    try {
        return await api.get<any>('library', `${FACADE}/culationtransaction-getdetails`);
    } catch (err: any) {
        console.warn(`GET ${FACADE}/culationtransaction-getdetails failed:`, err?.message || err);
        try {
            return await api.get<any>('library', `${FACADE}/circulationtransaction-getdetails`);
        } catch {
            try {
                return await api.get<any>('library', `${FACADE}/getdetails`);
            } catch {
                return await api.get<any>('library', `${FACADE}Facade/getdetails`);
            }
        }
    }
};

export const getCirculationData = async (payload?: any) => {
    const session = await auth();
    const miId = payload?.MI_Id || payload?.mI_Id || (session?.mi_id ? Number(session.mi_id) : 0);
    const userId = payload?.IVRMUL_Id || payload?.ivrmuL_Id || (session?.ivrmuL_Id ? Number(session.ivrmuL_Id) : session?.user_id ? Number(session.user_id) : session?.roleId ? Number(session.roleId) : 0);

    const requestPayload = {
        MI_Id: miId,
        mI_Id: miId,
        IVRMUL_Id: userId,
        ivrmuL_Id: userId,
        ...payload
    };

    try {
        return await api.post<any>('library', `${FACADE}/get-circulation-data`, requestPayload);
    } catch (err: any) {
        if (is405Error(err)) {
            try {
                return await api.get<any>('library', `${FACADE}/get-circulation-data`, { params: requestPayload });
            } catch {
                try {
                    return await api.post<any>('library', `${FACADE}/get_circulation_data`, requestPayload);
                } catch {
                    return await api.get<any>('library', `${FACADE}/get_circulation_data`, { params: requestPayload });
                }
            }
        }
        throw err;
    }
};

export const getCirculationParameterTypeChange = async (payload: { LMB_BookTypeflag: string; LMC_CategoryName?: string; MI_Id?: number }) => {
    const session = await auth();
    const miId = payload?.MI_Id || (session?.mi_id ? Number(session.mi_id) : 0);
    const body = {
        ...payload,
        MI_Id: miId,
        mI_Id: miId
    };

    try {
        return await api.post<any>('library', `${FACADE}/gettype`, body);
    } catch (err: any) {
        if (is405Error(err)) {
            try {
                return await api.get<any>('library', `${FACADE}/gettype`, { params: body });
            } catch {
                try {
                    return await api.post<any>('library', `${FACADE}/get_type`, body);
                } catch {
                    return await api.get<any>('library', `${FACADE}/get_type`, { params: body });
                }
            }
        }
        throw err;
    }
};

export const saveCirculationParameter = async (payload: any) => {
    const session = await auth();
    const miId = Number(payload?.mi_Id ?? payload?.MI_Id ?? payload?.mI_Id ?? (session?.mi_id ? Number(session.mi_id) : 1));
    const userId = Number(payload?.ivrmul_Id ?? payload?.IVRMUL_Id ?? payload?.ivrmuL_Id ?? (session?.ivrmuL_Id ? Number(session.ivrmuL_Id) : session?.user_id ? Number(session.user_id) : session?.roleId ? Number(session.roleId) : 1));

    const lbcpaId = Number(payload?.lbcpa_Id ?? payload?.lbcpA_Id ?? payload?.LBCPA_Id ?? payload?.circ_Id ?? 0);
    const asmclId = Number(payload?.asmcl_Id ?? payload?.asmcL_Id ?? payload?.ASMCL_Id ?? 0);
    const lmcId = Number(payload?.lmc_Id ?? payload?.lmC_Id ?? payload?.LMC_Id ?? 0);
    const hrmgtId = Number(payload?.hrmgt_Id ?? payload?.hrmgT_Id ?? payload?.HRMGT_Id ?? 0);
    const hrmdId = Number(payload?.hrmd_Id ?? payload?.hrmD_Id ?? payload?.HRMD_Id ?? 0);
    const guestId = Number(payload?.guest_Id ?? payload?.Guest_Id ?? 0);
    const maxItems = Number(payload?.max_Issue_Items ?? payload?.Max_Issue_Items ?? payload?.lbcpaS_NoOfItems ?? 0);
    const maxDays = Number(payload?.max_Issue_Days ?? payload?.Max_Issue_Days ?? payload?.lbcpaS_IssueDays ?? 0);
    const maxRenewals = Number(payload?.max_No_Renewals ?? payload?.Max_No_Renewals ?? payload?.lbcpaS_NoOfRenewals ?? 0);
    const issuer = String(payload?.issuertype1 ?? payload?.schclgflag ?? 'STUDENT').toUpperCase();
    const catgName = String(payload?.catgname ?? payload?.bookType ?? payload?.LMB_BookType ?? payload?.lmB_BookType ?? payload?.categoryName ?? payload?.LMC_CategoryName ?? 'Issue');
    const bookFlag = String(payload?.bookflag ?? payload?.LMB_BookTypeflag ?? payload?.lmB_BookTypeflag ?? payload?.BOOKFLAG ?? 'BP').toUpperCase();
    const excludeHoliday = payload?.lbcpa_ExcludeHolidayFlg !== undefined ? Boolean(payload.lbcpa_ExcludeHolidayFlg) : true;

    const requestPayload: any = {
        lbcpa_Id: lbcpaId,
        asmcl_Id: asmclId,
        lmc_Id: lmcId,
        hrmgt_Id: hrmgtId,
        max_Issue_Items: maxItems,
        max_Issue_Days: maxDays,
        max_No_Renewals: maxRenewals,
        issuertype1: issuer,
        catgname: catgName,
        bookflag: bookFlag,
        lbcpa_ExcludeHolidayFlg: excludeHoliday,
        ivrmul_Id: userId,
        mi_Id: miId
    };

    if (hrmdId > 0 || issuer === 'DEPARTMENT') {
        requestPayload.hrmd_Id = hrmdId;
    }
    if (guestId > 0 || issuer === 'GUEST') {
        requestPayload.guest_Id = guestId;
    }

    try {
        return await api.post<{ returnval?: boolean; duplicate?: boolean; message?: string }>('library', `${FACADE}/Savedata`, requestPayload);
    } catch (err: any) {
        if (is405Error(err)) {
            try {
                return await api.post<any>('library', `${FACADE}/savedata`, requestPayload);
            } catch {
                return await api.put<any>('library', `${FACADE}/Savedata`, requestPayload);
            }
        }
        throw err;
    }
};

export const toggleCirculationParameterStatus = async (payload: {
    LBCPA_Id?: number;
    LNBCPA_Id?: number;
    Parmeter_Id?: number;
    BOOKFLAG?: string;
    issuertype1?: string;
    MI_SchoolCollegeFlag?: string;
    MI_Id?: number;
    mI_Id?: number;
    [key: string]: any;
}) => {
    const session = await auth();
    const miId = payload?.MI_Id || payload?.mI_Id || (session?.mi_id ? Number(session.mi_id) : 0);

    const requestPayload = {
        MI_Id: miId,
        mI_Id: miId,
        ...payload,
        LBCPA_Id: Number(payload?.LBCPA_Id ?? payload?.lbcpA_Id ?? 0),
        LNBCPA_Id: Number(payload?.LNBCPA_Id ?? payload?.lnbcpA_Id ?? 0),
        Parmeter_Id: Number(payload?.Parmeter_Id ?? payload?.parmeter_Id ?? payload?.lbcpaS_Id ?? payload?.circ_Id ?? 0),
        BOOKFLAG: String(payload?.BOOKFLAG || payload?.lmB_BookTypeflag || 'BP'),
        issuertype1: String(payload?.issuertype1 || payload?.schclgflag || 'STUDENT').toUpperCase(),
        MI_SchoolCollegeFlag: String(payload?.MI_SchoolCollegeFlag || payload?.mI_SchoolCollegeFlag || 'S')
    };

    try {
        return await api.post<any>('library', `${FACADE}/Circulation-deactiveY`, requestPayload);
    } catch (err: any) {
        if (is405Error(err)) {
            try {
                return await api.put<any>('library', `${FACADE}/Circulation-deactiveY`, requestPayload);
            } catch {
                try {
                    return await api.post<any>('library', `${FACADE}/deactiveY`, requestPayload);
                } catch {
                    return await api.put<any>('library', `${FACADE}/deactiveY`, requestPayload);
                }
            }
        }
        throw err;
    }
};
