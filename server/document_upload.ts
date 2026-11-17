'use server';

import { api } from '@/lib/apiService';

export async function uploadDocument(data: any) {
    const url = '/document_upload/upload_document';
    return await api.postMultipart<string>('preadmission', url, data);
}

export async function deleteDocument(blobUrl: string) {
    const url = `/document_upload/delete_document?blob_url=${blobUrl}`;
    return await api.delete<boolean>('preadmission', url);
}
