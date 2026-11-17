import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    emptyStringAsUndefined: true,
    server: {
        NODE_ENV: z.union([z.literal('development'), z.literal('test'), z.literal('production')]),
        AUTH_SECRET: z.string(),
        AUTH_URL: z.string(),
        AUTH_TRUST_HOST: z.string(),
        API_BASE_URL: z.string(),
        PREADMISSION_API_BASE_URL: z.string(),
        ADMISSION_API_BASE_URL: z.string(),
        FEES_API_BASE_URL: z.string(),
        EXAM_API_BASE_URL: z.string(),
        HRMS_API_BASE_URL: z.string(),
        HRMS_FRONTOFFICE_BASE_URL: z.string(),
        HRMS_LMS_BASE_URL: z.string(),
        TIMETABLE_API_BASE_URL: z.string()
    },
    experimental__runtimeEnv: process.env
});

export const clientEnv = createEnv({
    emptyStringAsUndefined: true,
    client: {
        NEXT_PUBLIC_APP_NODE_ENV: z.union([z.literal('development'), z.literal('qa'), z.literal('production')]),
        NEXT_PUBLIC_API_BASE_URL: z.string(),
        NEXT_PUBLIC_PREADMISSION_API_BASE_URL: z.string(),
        NEXT_PUBLIC_ADMISSION_API_BASE_URL: z.string(),
        NEXT_PUBLIC_FEES_API_BASE_URL: z.string(),
        NEXT_PUBLIC_EXAM_API_BASE_URL: z.string(),
        NEXT_PUBLIC_HRMS_API_BASE_URL: z.string(),
        NEXT_PUBLIC_HRMS_FRONTOFFICE_BASE_URL: z.string(),
        NEXT_PUBLIC_HRMS_LMS_BASE_URL: z.string(),
        NEXT_PUBLIC_TIMETABLE_API_BASE_URL: z.string()
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_APP_NODE_ENV: process.env.NEXT_PUBLIC_APP_NODE_ENV,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_PREADMISSION_API_BASE_URL: process.env.NEXT_PUBLIC_PREADMISSION_API_BASE_URL,
        NEXT_PUBLIC_ADMISSION_API_BASE_URL: process.env.NEXT_PUBLIC_ADMISSION_API_BASE_URL,
        NEXT_PUBLIC_FEES_API_BASE_URL: process.env.NEXT_PUBLIC_FEES_API_BASE_URL,
        NEXT_PUBLIC_EXAM_API_BASE_URL: process.env.NEXT_PUBLIC_EXAM_API_BASE_URL,
        NEXT_PUBLIC_HRMS_API_BASE_URL: process.env.NEXT_PUBLIC_HRMS_API_BASE_URL,
        NEXT_PUBLIC_HRMS_FRONTOFFICE_BASE_URL: process.env.NEXT_PUBLIC_HRMS_FRONTOFFICE_BASE_URL,
        NEXT_PUBLIC_HRMS_LMS_BASE_URL: process.env.NEXT_PUBLIC_HRMS_LMS_BASE_URL,
        NEXT_PUBLIC_TIMETABLE_API_BASE_URL: process.env.NEXT_PUBLIC_TIMETABLE_API_BASE_URL
    }
});
