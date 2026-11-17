import { z } from 'zod';
import { masterModuleSchema } from '@/schemas/super-admin/super-admin-module/general-setting/module';

export interface IMasterModule extends z.infer<typeof masterModuleSchema> {
    id: number; // For UI mapping if needed
    userid?: number;
    createdDate?: string;
    updatedDate?: string;
}
