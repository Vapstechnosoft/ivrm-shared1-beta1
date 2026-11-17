import { z } from 'zod';

export const roomTransferSchema = z.object({
    type: z.enum(['stud', 'staff', 'guest']),
    AMCST_Id: z.number().optional(),
    HRME_Id: z.number().optional(),
    HLHGSTALT_Id: z.number().optional(),
    HLHSALTC_TransferDate: z.date({
        required_error: "Transfer date is required",
    }),
    ToHLMH_Id: z.number({
        required_error: "Target hostel is required",
    }),
    HLMRCA_Id: z.number({
        required_error: "Room category is required",
    }),
    hlmF_Id: z.number({
        required_error: "Floor is required",
    }),
    HRMRM_Id: z.number({
        required_error: "Room is required",
    }),
    HLHSTRSC_NewRoomFee: z.number().min(0, "Room fee must be positive"),
    HLHSTRSC_EntireRoomReqdFlg: z.number().optional(),
    HLHSTRSC_VacateRemarks: z.string().optional(),
    // Display only fields (for form context)
    currentHostel: z.string().optional(),
    currentRoom: z.string().optional(),
    currentCategory: z.string().optional(),
    joiningDate: z.string().optional(),
});

export type RoomTransferValues = z.infer<typeof roomTransferSchema>;
