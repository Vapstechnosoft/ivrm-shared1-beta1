'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IPreadmissionClassDropdown } from '@/types/admission/preadmission/transactions';

export interface ElectiveItem {
    ismS_Id: number;
    ismS_SubjectName: string;
}

export interface TotalStrengthParams {
    ASMAY_Id: number;
    ASMCL_Id: number;
    AMC_Id: number;
    status_Flag: string;
    AMST_SOL: string;
    withtc: string;
    withdeactive: string;
    electivearray: ElectiveItem[];
}

export async function GetStudentYearlyAttendance(ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'name,AMST_AdmNo,AMST_RegistrationNo,AMAY_RollNo,yearidname');
    const flag = ASMS_Id === 0 ? 'all' : 'indi';
    const url = `/StudentYearlyAttendance/GetStudentYearlyAttendance?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}&AllOrIndiFlag=${flag}&${urlParams}`;

    return await api.post<IPreadmissionClassDropdown[]>('admission', url);
}

export async function getPreadmissionClassDropdown1() {
    const url = '/master_class_category/master_class_drop_down_list';
    return await api.get<IPreadmissionClassDropdown[]>('admission', url);
}

export async function getadmissionStudentsDropdown(ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number) {
    const url = `/AdmissionRegister/GetStudentNamesByClassSection?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}`;
    return await api.get('admission', url);
}

export async function getadmissionSectionDropdown(asmcl_id: number) {
    const url = `/master_class_held/class_section_drop_down_list/${asmcl_id}`;
    return await api.get('admission', url);
}

export async function GetClassTeacherReport(ASMAY_Id: number, flag: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'name,AMST_AdmNo,AMST_RegistrationNo,AMAY_RollNo,yearidname');
    const url = `/ClassTeacherReportAttendance/GetReport?ASMAY_Id=${ASMAY_Id}&flag=${flag}&${urlParams}`;

    return await api.post<IPreadmissionClassDropdown[]>('admission', url);
}

export async function getTotalStrengthReport(
    asmay_Id: number,
    asmcL_Id: number,
    amC_Id: number,
    statusFlag: string,
    amsT_SOL: string,
    withtc: string,
    withdeactive: string,
    electivearray: ElectiveItem[],
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'name,AMST_AdmNo,AMST_RegistrationNo,AMAY_RollNo,yearidname');
    const url = `/TotalStrengthReport/GetTotalStrengthReport?ASMAY_Id=${asmay_Id}&AMST_SOL=${amsT_SOL}&Status_Flag=${statusFlag}&withtc=${withtc}&withdeactive=${withdeactive}&ASMCL_Id=${asmcL_Id}&AMC_Id=${amC_Id}&electivearray=${electivearray}&${urlParams}`;

    return await api.post<IPreadmissionClassDropdown[]>('admission', url);
}

export async function getStudentSearch(
    stuStatus: string,
    field: string,
    Operator: string,
    value: string,
    condition: string,
    searchParams?: ApiSearchparams
) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'amsT_RegistrationNo,amsT_FirstName,asmcL_ClassName');
    const url = `/StudentSearch/GetStudentSearchData?stuStatus=${stuStatus}&field=${field}&Operator=${Operator}&value=${value}&condition=${condition}&${urlParams}`;

    return await api.post<any[]>('admission', url);
}

export async function getAdmissionRegister(ASMAY_Id: number, AttendanceType: number, payload?: any, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'AMST_FirstName');
    const url = `/AdmissionRegister/GetAdmissionReport?ASMAY_Id=${ASMAY_Id}&AttendanceType=${AttendanceType}&${urlParams}`;

    return await api.post<any[]>('admission', url, payload);
}

export async function GetDateOfBirth(ASMAY_Id: number, ASMCL_Id: number, ASMS_Id: number, AMST_Id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'name,AMST_AdmNo,AMST_RegistrationNo,AMAY_RollNo,yearidname');
    const url = `/DOBcertificate/GetAdmDobCertificate?ASMAY_Id=${ASMAY_Id}&ASMCL_Id=${ASMCL_Id}&ASMS_Id=${ASMS_Id}&AMST_Id=${AMST_Id}&${urlParams}`;

    return await api.post<IPreadmissionClassDropdown[]>('admission', url);
}
