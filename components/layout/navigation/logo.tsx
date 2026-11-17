import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    size?: 'icon' | 'text' | 'full';
    herf?: string | null;
}

export default function Logo({ className = '', herf = '', size = 'text' }: LogoProps) {
    const logoContent = (
        <div className={cn('mr-4 flex items-center gap-4 lg:mr-6', className)}>
            <Image
                src='/assets/logo1.png'
                alt='VAPS Logo'
                width={size === 'icon' ? 48 : 80} // Adjust width based on size prop
                height={size === 'icon' ? 48 : 80} // Adjust height based on size prop
            />
            {size === 'text' && <span className='hidden font-bold lg:inline-block lg:text-3xl'> VAPS</span>}
        </div>
    );

    return herf ? <Link href={herf}>{logoContent}</Link> : logoContent;
}
