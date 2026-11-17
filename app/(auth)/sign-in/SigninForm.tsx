'use client';

import PreadmissionRegistration from '@/app/(root)/admission/preadmission/transactions/preadmission-registration/page';
import Logo from '@/components/layout/navigation/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputPassword } from '@/components/ui/extension/input-password';
import { InputText } from '@/components/ui/extension/input-text';
import { Label } from '@/components/ui/label';
import { useCheckPreadmissionLive } from '@/hooks/admission/preadmission/useConfigurations';
import { loginSchema } from '@/schemas/admission/preadmission/masters';
import { login } from '@/server/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, LogIn, Mail, Phone, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';

type FormFields = z.infer<typeof loginSchema>;

export default function SigninForm() {
    const searchParams = useSearchParams();
    const { sub_domain } = useParams();

    const { data: preadmissionLive } = useCheckPreadmissionLive(sub_domain?.toString() || '');

    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [error, setError] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            if (isDarkMode) {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            }
        }
    }, [isDarkMode, mounted]);

    const {
        reset,
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm<FormFields>({
        mode: 'onChange',
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FormFields> = (values) => {
        setError('');

        startTransition(() => {
            login({ values, callbackUrl }).then(async (data) => {
                if (data?.error) {
                    reset({ password: '' });
                    setError(data.error);
                }
            });
        });
    };

    return (
        <div className='flex min-h-screen'>
            {/* Left Side - Background Image */}
            <div className='relative hidden overflow-hidden lg:flex lg:w-1/2'>
                <div className='absolute inset-0 z-10 bg-gradient-to-br from-blue-600/20 to-purple-700/20' />
                <Image src='/assets/Login_BG.png' alt='VAPS Campus' fill className='object-fill' priority />
                <div className='absolute inset-0 z-10 flex flex-col justify-center p-[150px]'>
                    <div className='space-y-4 text-white'>
                        <div className='mb-6 flex items-center gap-3'>
                            <GraduationCap className='h-8 w-8' />
                            <span className='font-bold text-2xl'>VAPS</span>
                        </div>
                        <h1 className='font-bold text-4xl leading-tight'>
                            Track progress
                            <br />
                            anytime, anywhere.
                        </h1>
                        <p className='max-w-md text-lg text-white/90'>
                            Empowering education through technology. Join our community of learners and educators.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className='flex w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white lg:w-1/2'>
                <div className='w-full max-w-md'>
                    {/* Mobile Logo */}
                    <div className='flex justify-center lg:hidden'>
                        <Logo size='full' />
                    </div>

                    <Card className='border-0 bg-white/80 shadow-xl backdrop-blur-sm'>
                        <CardHeader className='flex items-center gap-2'>
                            <div className='hidden justify-center lg:flex'>
                                <Logo size='full' />
                            </div>
                            <div className='text-center'>
                                <CardTitle className='font-bold text-2xl text-black'>Sign In</CardTitle>
                                <CardDescription className='text-gray-600'>Sign in to access your dashboard</CardDescription>
                            </div>
                            {preadmissionLive?.data === true && (
                                <CardTitle className='select-none'>
                                    <div className='inline-flex items-center rounded-full border border-green-400 bg-green-50 px-4 py-2 text-lg'>
                                        <span className='mr-2 h-3 w-3 rounded-full bg-green-500' />
                                        <span className='font-medium text-green-700'>
                                            Preadmission is <span className='font-bold text-green-600 text-xl'>LIVE !</span>
                                        </span>
                                    </div>
                                </CardTitle>
                            )}
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                                <div className='space-y-2'>
                                    <InputText label='Username' placeholder='Enter your username' {...register('email')} />

                                    <div className='space-y-2'>
                                        <Label htmlFor='password' className='font-medium text-sm'>
                                            Password
                                        </Label>
                                        <InputPassword
                                            id='password'
                                            type='password'
                                            placeholder='Enter your password'
                                            {...register('password')}
                                            value={watch('password')}
                                        />
                                    </div>
                                </div>
                                {(errors.email?.message || errors.password?.message || error) && (
                                    <div className='flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4'>
                                        <TriangleAlert className='h-5 w-5 flex-shrink-0 text-red-600' />
                                        <p className='font-medium text-red-700 text-sm'>
                                            {errors.email?.message || errors.password?.message || error}
                                        </p>
                                    </div>
                                )}
                                {/* Forgot Password */}
                                {/* <div className='flex items-center justify-end'>
                                    <Link
                                        href='/forgot-password'
                                        className='font-medium text-primary text-sm transition-colors hover:underline'>
                                        Forgot password?
                                    </Link>
                                </div> */}
                                {/* Action Buttons */}
                                <div className='space-y-1'>
                                    <Button
                                        type='submit'
                                        isLoading={isPending}
                                        loadingText='Signing in...'
                                        className='h-12 w-full rounded-lg bg-gradient-blue-purple-indigo font-semibold text-white'
                                        disabled={isPending}
                                        suffix={<LogIn className='size-4 transition-all ease-linear group-hover:translate-x-2' />}>
                                        Sign In
                                    </Button>

                                    <div className='relative'>
                                        <div className='absolute inset-0 flex items-center'>
                                            <div className='w-full border-gray-300 border-t' />
                                        </div>
                                        <div className='relative flex justify-center text-sm'>
                                            <span className='bg-white px-4 text-gray-500'>or</span>
                                        </div>
                                    </div>

                                    <PreadmissionRegistration />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                {/* Footer */}
                <div className='fixed bottom-0 hidden h-7 w-[50%] items-center justify-between border border-1 bg-secondary px-2 lg:flex'>
                    {/* Center section */}
                    <div className='flex flex-1 items-center justify-center gap-2'>
                        <Phone className='h-3 w-3 text-white' />
                        <p className='text-white text-xs'>+91 33 2641 2138, +91 33 2641 3590</p>
                        <Mail className='h-3 w-3 text-white' />
                        <p className='text-white text-xs'>stcsh1860@gmail.com</p>
                    </div>

                    {/* Version aligned to end */}
                    <p className='ml-auto pr-2 text-white text-xs'>v1.3</p>
                </div>
            </div>
        </div>
    );
}
