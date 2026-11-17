import { z } from "zod";

export const pageMappingSchema = z.object({
    ivrmM_Id: z.number().min(1, 'Module is required'),
    pages: z.array(z.object({
        ivrmP_Id: z.number(),
        ivrmP_PageName: z.string(),
        ivrmP_PageDisplayName: z.string(),
        ivrmP_PageURL: z.string().optional(),
    })).min(1, 'At least one page must be selected')
});

export type PageMappingSchema = z.infer<typeof pageMappingSchema>;
