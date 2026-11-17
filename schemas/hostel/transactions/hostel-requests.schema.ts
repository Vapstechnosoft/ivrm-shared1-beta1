import { z } from 'zod';

export const studentRequestSchema = z.object({
    HLHSREQ_Id: z.number().default(0),
    HLHSREQ_RequestDate: z.date({
        required_error: "Request date is required",
    }),
    HLMH_Id: z.string({
        required_error: "Hostel is required",
    }),
    HLMRCA_Id: z.string({
        required_error: "Room category is required",
    }),
    AMST_Id: z.number().optional(), // Often fixed for logged-in student
    HLHSREQ_ACRoomFlg: z.boolean().default(false),
    HLHSREQ_SingleRoomFlg: z.boolean().default(false),
    HLHSREQ_VegMessFlg: z.boolean().default(false),
    HLHSREQ_NonVegMessFlg: z.boolean().default(false),
    HLHSREQ_Remarks: z.string().optional(),
});

export const staffRequestSchema = z.object({
    HLHSTREQ_Id: z.number().default(0),
    HLHSTREQ_RequestDate: z.date({
        required_error: "Request date is required",
    }),
    HLMH_Id: z.string({
        required_error: "Hostel is required",
    }),
    HLMRCA_Id: z.string({
        required_error: "Room category is required",
    }),
    HLHSTREQ_ACRoomFlg: z.boolean().default(false),
    HLHSTREQ_SingleRoomFlg: z.boolean().default(false),
    HLHSTREQ_VegMessFlg: z.boolean().default(false),
    HLHSTREQ_NonVegMessFlg: z.boolean().default(false),
    HLHSTREQ_Remarks: z.string().optional(),
});

export type StudentRequestValues = z.infer<typeof studentRequestSchema>;
export type StaffRequestValues = z.infer<typeof staffRequestSchema>;
