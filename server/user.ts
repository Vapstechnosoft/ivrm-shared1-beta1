'use server';

import { api } from '@/lib/apiService';
import { signIn } from '@/lib/auth';
import type { loginSchema } from '@/schemas/admission/preadmission/masters';
import type { UserResponseData } from '@/types';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';

export async function getUserByEmail(username: string, password: string) {
    const url = `/configuration/login?username=${username}&password=${password}`;

    //Send payload to login API to validate login and get user details & token
    return await api.post<UserResponseData>('preadmission', url);
}

interface LoginSceham {
    values: z.infer<typeof loginSchema>;
    callbackUrl?: string | null;
}

export async function login({ values, callbackUrl }: LoginSceham) {
    try {
        const { email, password } = values;
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || '/',
            redirect: true
        });
        revalidatePath('/');
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: error.message || 'Invalid credentials!' };
                default:
                    return { error: error.message || 'Something went wrong!' };
            }
        }

        throw error;
    }
}
