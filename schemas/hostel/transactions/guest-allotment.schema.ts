import { z } from 'zod';

export const guestAllotmentSchema = z.object({
  HLHGSTALT_Id: z.number().optional(),
  HLHGSTALT_GuestName: z.string().min(1, 'Guest Name is required'),
  HLHGSTALT_GuestPhoneNo: z.string().regex(/^[6-9]{1}[0-9]{9}$/, 'Invalid Mobile Number'),
  HLMH_Id: z.number().min(1, 'Hostel is required'),
  HRMRM_Id: z.number().min(1, 'Room is required'),
  HLHGSTALT_NoOfBeds: z.number().optional(),
  HLHGSTALT_AllotRemarks: z.string().min(1, 'Remarks is required'), // Legacy required remarks
  HLHGSTALT_AllotmentDate: z.date({ required_error: 'Date is required' }),
  HLHGSTALT_GuestEmailId: z.string().email('Invalid Email'),
  HLMRCA_Id: z.number().min(1, 'Room Category is required'),
  HLHGSTALT_AddressProof: z.string().min(1, 'Guest Proof is required'),
  HLHGSTALT_GuestAddress: z.string().min(6, 'Address must be at least 6 characters').max(350, 'Address too long'),
  HLHGSTALT_GuestPhoto: z.string().optional(), // Keeping it simple for now
});

export type GuestAllotmentSchema = z.infer<typeof guestAllotmentSchema>;
