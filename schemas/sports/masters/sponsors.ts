import { z } from 'zod';
import { createCustomStringSchema, deleteIdSchema, createStringOnlySchema } from '../../validationSchemas';

export const masterSponsorSchema = {
    addOrUpdate: z.object({
        spccmsP_Id: z.number().optional(),
        mI_Id: z.number().optional(),
        spccmsP_SponsorName: createStringOnlySchema('Sponsor Name', 1, 100),
        spccmsP_ContactPerson: createStringOnlySchema('Contact Person', 1, 100),
        spccmsP_ContactNo: z.string({ required_error: 'Contact No is required' })
            .regex(/^[6-9][0-9]{9}$/, 'Enter valid Contact Number'),
        spccmsP_SponsorDetails: createCustomStringSchema('Sponsor Details', 1, 250),
        spccmsP_ActiveFlag: z.boolean().default(true)
    }),
    delete: z.object({
        spccmsP_Id: deleteIdSchema('spccmsP_Id')
    })
};
