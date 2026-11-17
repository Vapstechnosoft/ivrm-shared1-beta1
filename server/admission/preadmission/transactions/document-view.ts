'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IPreadmissionDocumentView } from '@/types/admission/preadmission/transactions';

export async function getDocumentView(asmay_id: number, asmcl_id: number, searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {});
    const url = `/document_view?asmay_id=${asmay_id}&asmcl_id=${asmcl_id}&${urlParams}`;
    return await api.get<IPreadmissionDocumentView[]>('preadmission', url);
}

export async function getDocumentpdf(pasr_id: number) {
    const url = `/document_view/generate_preadmission_report/${pasr_id}`;
    return await api.get<IPreadmissionDocumentView[]>('preadmission', url);
}
