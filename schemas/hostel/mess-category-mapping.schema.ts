import { z } from 'zod';

// Schema for individual category selection in the array
export const messCategorySelectionSchema = z.object({
    hlmmC_Id: z.number()
});

export const masterMessCategoryMappingSchema = z.object({
    hlmmmC_Id: z.number().optional(),
    hlmM_Id: z.string().min(1, 'Mess Name is required'), // Form will likely use string for select value
    messCategories: z.array(z.number()).min(1, 'Select at least one category'),
    hlmmmC_ActiveFlag: z.boolean().optional().default(true)
});

export const masterMessCategoryMappingDeleteSchema = z.object({
    hlmmmC_Id: z.string().min(1, 'Mapping ID is required')
});

export type IMasterMessCategoryMapping = z.infer<typeof masterMessCategoryMappingSchema>;

// Type for the grid display (might differ slightly if we join data)
export interface IMasterMessCategoryMappingDisplay {
    hlmmmC_Id: number;
    hlmM_Id: number;
    hlmM_Name: string;
    hlmmC_Id: number;
    hlmmC_Name: string;
    hlmmmC_ActiveFlag: boolean;
}
