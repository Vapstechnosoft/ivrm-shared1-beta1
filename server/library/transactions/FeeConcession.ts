'use server';

import { api } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IFeeConcessionAcademicyearDropDownList, IFeeConcessionStudentConcessionGrid } from '@/types/fees/transactions/transactions';

export async function getConcessionStudentConcessionGrid(
    mi_Id: number,
    asmaY_Id: number,
    asmcL_Id: number,
    searchParams?: ApiSearchparams
) {
    const url = `FeeConcessionFacade/getstudentconcessions?AsmayId=${asmaY_Id || 0}&AsmclId=${asmcL_Id || 0}`;
    return await api.get<IFeeConcessionStudentConcessionGrid[]>('fees', url);
}

export async function getConcessionAcademicDropdownData(mi_Id: number) {
    const url = 'FeeConcessionFacade/getacademicyears';
    return await api.get<IFeeConcessionAcademicyearDropDownList[]>('fees', url);
}
