'use client';

import { EditIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface PolygonBannerProps {
    title?: string;
    description?: string;
    breadcrumb?: ReactNode;
}

export function PolygonBanner({ title = 'Welcome Back', description = 'Access your dashboard', breadcrumb }: PolygonBannerProps) {
    return (
        <div className='relative w-full overflow-hidden bg-primary py-4'>
            {/* Background Image */}
            <div className='absolute inset-0'>
                <img src='/assets/Polygon_Mask.png' alt='Polygon' className='h-full w-full object-cover' />
            </div>

            {/* Content */}
            <div className='container relative z-10 mx-auto flex items-start justify-between gap-4 px-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                        <EditIcon className='text-white' />
                        <p className='font-bold text-3xl text-white'>{title}</p>
                    </div>
                    {description && <p className='mt-1 text-sm text-white/90'>{description}</p>}
                </div>

                {breadcrumb && <div>{breadcrumb}</div>}
            </div>
        </div>
    );
}
