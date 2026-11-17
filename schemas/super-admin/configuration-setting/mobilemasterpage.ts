import { z } from 'zod';

export const mobileMasterPageSchema = z.object({
    ivrmmaP_AppPageName: z.string().min(1, 'Page Name is required'),
    ivrmmaP_Displayname: z.string().min(1, 'Display Name is required'),
    ivrmmaP_AppPageDesc: z.string().min(1, 'Page Icon/Description is required'),
    ivrmmaP_AppPageURL: z.string().min(1, 'Page Keyword/URL is required')
});

export type MobileMasterPageFormData = z.infer<typeof mobileMasterPageSchema>;
