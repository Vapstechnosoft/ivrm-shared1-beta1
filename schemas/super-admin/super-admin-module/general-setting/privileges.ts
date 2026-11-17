import { z } from 'zod';

export const privilegeSearchSchema = z.object({
    roleId: z.number({ required_error: 'Role is required' }).min(1, 'Role is required'),
    moduleIds: z.array(z.number()).min(1, 'Select at least one Module'),
});

export type PrivilegeSearchSchema = z.infer<typeof privilegeSearchSchema>;
