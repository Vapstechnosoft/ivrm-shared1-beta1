import { getFacilities } from '@/server/hostel/hostel-management/masters/hostel';
import { z } from 'zod';

export const masterRoomSchema = z.object({
    hrmrM_Id: z.any().optional(),
    hlmH_Id: z.string().min(1, 'Select Hostel'),
    hlmF_Id: z.string().min(1, 'Select Floor'),
    hlmrcA_Id: z.string().min(1, 'Select Room Category'),
    hrmrM_RoomNo: z.string().min(1, 'Enter Room No').max(50),
    hrmrM_BedCapacity: z
        .string()
        .min(1, 'Enter Bed Capacity')
        .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
    hrmrM_RoomDesc: z.string().optional(),
    hrmrM_ACFlg: z.boolean().default(false),
    hrmrM_SharingFlg: z.boolean().default(false),
    hrmrM_RoomForStudentFlg: z.boolean().default(false),
    hrmrM_RoomForStaffFlg: z.boolean().default(false),
    hrmrM_RoomForGuestFlg: z.boolean().default(false),
    // For UI handling of multi-select values (array of string IDs)
    selectedFacilityIds: z.array(z.string()).min(1, 'Select at least one facility'),
    facilities: z.array(z.object({ hlmftY_Id: z.string(), hlmftY_FacilityName: z.string() })).optional()
});

export type IMasterRoomForm = z.infer<typeof masterRoomSchema>;
