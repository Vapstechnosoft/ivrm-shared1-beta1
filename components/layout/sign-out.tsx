'use client ';

import { AUTH_ROUTES } from '@/constants/routes';
import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export default function SignOut() {
    const handleSignOut = async () => {
        try {
            await signOut({ redirect: true, redirectTo: AUTH_ROUTES.SIGN_IN });
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error(`Error signing out :${error}`);
        }
    };

    return (
        <DropdownMenuItem onClick={handleSignOut}>
            Sign out <LogOutIcon className='ml-2 h-4 w-4' />
        </DropdownMenuItem>
    );
}
