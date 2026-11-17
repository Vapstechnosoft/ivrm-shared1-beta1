import { z } from 'zod';

export const invItemStoreMappingSchema = z.object({
    invmsT_Id: z.number().min(1, 'Select Store'),
    invmG_Id: z.number().optional(), // Main Group Filter
    userGroup_Id: z.number().optional(), // User Group Filter
    itemGroup_Id: z.number().optional(), // Item Group Filter
    mappedItems: z.array(z.object({
        invmI_Id: z.number(),
        invmisM_Id: z.number().default(0),
        checked: z.boolean().default(false)
    })).min(1, 'Select at least one item to map')
});

export type InvItemStoreMappingSchema = z.infer<typeof invItemStoreMappingSchema>;
