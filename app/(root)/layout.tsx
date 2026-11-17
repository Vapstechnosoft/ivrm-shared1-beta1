import Navbar from '@/components/layout/navigation/navbar';
import { PageNavigation } from '@/components/layout/navigation/page-navigation';
import type React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <PageNavigation />
            {children}
        </>
    );
}
