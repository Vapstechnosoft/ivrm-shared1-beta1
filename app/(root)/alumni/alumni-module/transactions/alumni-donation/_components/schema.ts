import { z } from 'zod';

export const alumniDonationSchema = z
    .object({
        nriStatus: z.string().optional(),
        panNumber: z.string().optional(),
        donationId: z.string().min(1, 'Select Donation Category'),
        amount: z.coerce.number().min(1, 'Enter valid amount'),
        paymentGateway: z.string().min(1, 'Select Payment Gateway')
    })
    .refine(
        (data) => {
            if (data.nriStatus === '1' && (!data.panNumber || data.panNumber.trim() === '')) {
                return false;
            }
            return true;
        },
        {
            message: 'PAN Number is required for NRI status',
            path: ['panNumber']
        }
    );

export type AlumniDonationSchema = z.infer<typeof alumniDonationSchema>;
