import { z } from 'zod';

export const alumniInteractionSchema = z.object({
    alsminT_Subject: z.string().min(1, 'Enter Message Subject'),
    alsminT_Interaction: z.string().min(1, 'Enter Message'),
    userflag: z.enum(['SameBatch', 'AllBatch']),
    ALMST_Id1: z.string().optional(), // For Individual
    alumni_list: z.array(z.number()).optional(), // For Group (mapped from fields)
    images_paths: z
        .array(
            z.object({
                path: z.string(),
                name: z.string()
            })
        )
        .optional()
});

export type AlumniInteractionSchema = z.infer<typeof alumniInteractionSchema>;

export const interactionReplySchema = z.object({
    istinT_Interaction: z.string().min(1, 'Enter Reply'),
    images_paths: z
        .array(
            z.object({
                path: z.string(),
                name: z.string()
            })
        )
        .optional()
});

export type InteractionReplySchema = z.infer<typeof interactionReplySchema>;
