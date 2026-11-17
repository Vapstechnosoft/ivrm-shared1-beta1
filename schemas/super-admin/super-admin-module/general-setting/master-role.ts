import { z } from 'zod';

export const masterRoleSchema = z.object({
    id: z.number().optional(),
    name: z.string()
        .min(1, 'Role Name is required')
        .max(40, 'Role Name cannot exceed 40 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
    normalizedName: z.string()
        .min(1, 'Description is required')
        .max(100, 'Description cannot exceed 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
});

export type MasterRoleSchema = z.infer<typeof masterRoleSchema>;
