'use client';
import { Button } from '@/components/ui/button';
import { FileDown, Printer, RefreshCw } from 'lucide-react';
export function RelievingLetterFilters() {
    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            {/* Add report filter fields here */}
            <div className='flex items-end gap-2 md:col-span-4'>
                <Button type='button'>
                    <RefreshCw className='mr-2 h-4 w-4' /> Generate Report
                </Button>
                <Button variant='outline' type='button'>
                    <FileDown className='mr-2 h-4 w-4' /> Export to Excel
                </Button>
                <Button variant='outline' type='button' onClick={() => window.print()}>
                    <Printer className='mr-2 h-4 w-4' /> Print
                </Button>
            </div>
        </div>
    );
}
