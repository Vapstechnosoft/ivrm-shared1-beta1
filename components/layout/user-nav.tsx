'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { Session } from 'next-auth';
import SignOut from './sign-out';

export function UserNav({ session }: { session: Session | null }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='px-0 md:px-2'>
                    <Avatar className='size-9'>
                        <AvatarImage src={session?.user_image ?? ''} alt={session?.name ?? ''} />
                        <AvatarFallback>{session?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <p className='hidden font-medium text-sm leading-none md:block'>{session?.name}</p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='font-medium text-sm leading-none'>Name: {session?.name}</p>
                        {session?.designation && (
                            <p className='text-muted-foreground text-xs leading-none'>Designation: {session?.designation}</p>
                        )}
                        <p className='text-muted-foreground text-xs leading-none'>Email: {session?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
