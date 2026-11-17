import { z } from 'zod';

export const invMasterMainGroupSchema = z.object({
    invmG_Id: z.number(),
    invmG_GroupName: z.string().min(1, 'Main Group Name is required'),
    invmG_AliasName: z.string().optional(),
    invmG_GroupPrefix: z.string().optional(),
    invmG_GroupSuffix: z.string().optional(),
    invmG_GroupStartingNo: z.string().optional(),
    invmG_ActiveFlg: z.boolean(),
});

export type InvMasterMainGroupType = z.infer<typeof invMasterMainGroupSchema>;

export const invMasterUserGroupSchema = z.object({
    invmG_Id: z.number(),
    invmG_GroupName: z.string().min(1, 'User Group Name is required'),
    invmG_AliasName: z.string().optional(),
    invmG_ParentId: z.number().min(1, 'Main Group is required'),
    invmG_ActiveFlg: z.boolean(),
});

export type InvMasterUserGroupType = z.infer<typeof invMasterUserGroupSchema>;

export const invMasterItemGroupSchema = z.object({
    invmG_Id: z.number(),
    invmG_GroupName: z.string().min(1, 'Item Group Name is required'),
    invmG_AliasName: z.string().optional(),
    invmG_ParentId: z.number().min(1, 'User Group is required'),
    invmG_ActiveFlg: z.boolean(),
});

export type InvMasterItemGroupType = z.infer<typeof invMasterItemGroupSchema>;
