import { z } from 'zod';

export const alumniGallerySchema = z.object({
    algA_Id: z.number().optional(),
    ALGA_GalleryName: z.string().min(1, 'Gallery Name is required'),
    ALGA_Date: z.date({ required_error: 'Date is required' }),
    mediatype: z.enum(['I', 'V']).default('I'),
    images_list: z
        .array(
            z.object({
                filePath: z.string().min(1, 'File is required'),
                fileName: z.string().min(1, 'File name is required')
            })
        )
        .min(1, 'At least one file is required')
});

export type AlumniGallerySchema = z.infer<typeof alumniGallerySchema>;
