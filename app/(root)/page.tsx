'use client';
import ParentsDashboard from '@/components/ui/dashboard/parents-dashboard';
import { ROLES } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.data?.role === undefined) {
            window.location.reload();
        }
    }, [session?.data?.role]);

    // Move router.push to useEffect
    useEffect(() => {
        if (session?.data?.role?.toUpperCase() === ROLES.ADMIN) {
            router.push(
                `${ROUTES.ADMISSION.ADMISSION}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION_SUB_MENUS.TRANSACTIONS}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS.PREADMISSION_SUB_MENUS.TRANSACTIONS_SUB_MENUS.APPLICATION_FORM}`
            );
        }
    }, [session?.data?.role, router]);

    return (
        <main className='container px-0 py-2'>
            {session?.data?.role !== undefined && session?.data?.role.toUpperCase() !== ROLES.ADMIN && <ParentsDashboard />}
        </main>
    );
}
