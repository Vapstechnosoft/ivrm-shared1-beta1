import { z } from 'zod';

export const masterRoleTypeSchema = z.object({
    id: z.number().optional(),
    roleType: z.string() // "Role Name" in UI
        .min(1, 'Role Name is required')
        .max(50, 'Role Name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
    masterRoleIds: z.array(z.number()).min(1, 'Select at least one Role'),
    institutionType: z.string().optional(),
});

export type MasterRoleTypeSchema = z.infer<typeof masterRoleTypeSchema>;
