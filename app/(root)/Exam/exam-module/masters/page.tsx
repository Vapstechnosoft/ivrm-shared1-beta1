import { ROUTES } from '@/constants/routes';
import { redirect } from 'next/navigation';

export default function page() {
    redirect(`${ROUTES.ADMISSION}${ROUTES.ADMISSION.ADMISSION_SUB_MENUS}`);
}
