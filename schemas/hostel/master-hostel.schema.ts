import { z } from 'zod';

export const hostelFileSchema = z.object({
  hlmhP_FileName: z.string(),
  hlmhP_FilePath: z.string(),
  filetype: z.string().optional(),
});

export const masterHostelSchema = z.object({
  hlmH_Id: z.number().optional(),
  hlmH_Name: z.string().min(1, 'Hostel Name is required').max(50),
  hlmH_ContactNo: z
    .string()
    .min(10, 'Contact Number must be 10 digits')
    .max(10, 'Contact Number must be 10 digits')
    .regex(/^[6-9]{1}[0-9]{9}$/, 'Enter valid Contact Number'),
  hlmH_TotalCapacity: z.string().or(z.number()),
  
  // API expects these specific names for multi-selects
  selectedFacilityIds: z.array(z.number()).min(1, 'Please Select Facility'),
  selectedWardenIds: z.array(z.number()).min(1, 'Please Select Warden'),
  selectedMessIds: z.array(z.number()).min(1, 'Please Select Mess'),
  
  hlmhW_WardenType: z.string().optional(),
  
  hlmH_BoysGirlsFlg: z.enum(['Boys', 'Girls', 'Both'], {
    required_error: 'Please Select Any One Category',
  }).or(z.string()), // Allow string from API if needed
  
  hlmH_Address: z.string().min(1, 'Enter the Address'),
  ivrmmC_Id: z.number().or(z.string().transform(Number)),
  ivrmmS_Id: z.number().or(z.string().transform(Number)),
  hlmH_City: z.string().min(1, 'Enter City Name').max(50),
  hlmH_Pincode: z.string().or(z.number()),
  
  hlmH_TotalFloor: z.string().or(z.number()),
  hlmH_TotalRoom: z.string().or(z.number()),
  
  hlmH_Desc: z.string().max(250).optional(),
  
  hostelPhotos: z.array(hostelFileSchema).optional(),
  
  hlmH_ActiveFlag: z.boolean().optional().default(true),
});

export type IMasterHostelForm = z.infer<typeof masterHostelSchema>;
