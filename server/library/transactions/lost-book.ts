// app/services/library/lostBookService.ts
'use server';

import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { AuthorOption, BookOption } from '@/types/library/transactions/transactions';

// Get lost books list with search params
export async function getLostBookList(searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'lmB_BookTitle');
    const url = `/LostBook/lost-book-list?${urlParams}`;
    return await api.get<any>('library', url);
}

// Get book dropdown list for lost book form
export async function getBookListDropdown(bookcat_type: string, booktype: string) {
    const url = `/LostBook/book-list-dropdown/${bookcat_type}/${booktype}`;
    return await api.getArray<BookOption>('library', url);
}

// Get author dropdown by book ID
export async function getAuthorNameDropdown(lmbanO_Id: number) {
    const url = `/LostBook/author-name-list-dropdown/${lmbanO_Id}`;
    return await api.getArray<AuthorOption>('library', url);
}

// Save lost book record
export async function saveLostBookRecord(data: any) {
    const url = '/LostBook/saverecord';
    return await api.post<any>('library', url, data);
}

// Toggle lost book record active status
export async function toggleLostBookRecord(id: number) {
    const url = `/LostBook/deactiveY/${id}`;
    return await api.post('library', url);
}

// Delete lost book record
export async function deleteLostBookRecord(id: number) {
    const url = `/LostBook/delete/${id}`;
    return await api.delete('library', url);
}
