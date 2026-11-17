'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';

interface TimeTableGenerationGridProps {
    data: any[];
}

export default function TimeTableGenerationGrid({ data }: TimeTableGenerationGridProps) {
    // Mock data if none provided for visualization (although parent will control visibility)
    // But strict requirement says "data should display only on click on generate button"
    // So if data is empty array, we show "No records found" or empty table.

    return (
        <div className='mx-auto max-w-7xl space-y-4'>
            <div className='overflow-hidden rounded-xl border border-purple-100 bg-white shadow-md'>
                <div className='bg-purple-700 px-6 py-3'>
                    <h3 className='font-bold text-sm text-white uppercase tracking-wide'>Time Table Details</h3>
                </div>

                <div className='overflow-x-auto p-4'>
                    <table className='w-full text-left text-sm'>
                        <thead className='bg-purple-50 text-gray-700 text-xs uppercase'>
                            <tr>
                                <th scope='col' className='border-b px-4 py-3'>
                                    Sl No
                                </th>
                                <th scope='col' className='border-b px-4 py-3'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Institution Name</span>
                                        <Input placeholder='Search...' className='h-8 bg-white text-xs' />
                                    </div>
                                </th>
                                <th scope='col' className='border-b px-4 py-3'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Academic Year</span>
                                        <Input placeholder='Search...' className='h-8 bg-white text-xs' />
                                    </div>
                                </th>
                                <th scope='col' className='border-b px-4 py-3'>
                                    <div className='flex flex-col gap-2'>
                                        <span>Category Name</span>
                                        <Input placeholder='Search...' className='h-8 bg-white text-xs' />
                                    </div>
                                </th>
                                <th scope='col' className='border-b px-4 py-3 text-center'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} className='border-b bg-white hover:bg-gray-50'>
                                        <td className='px-4 py-3 font-medium'>{index + 1}</td>
                                        <td className='px-4 py-3'>{item.institutionName || 'N/A'}</td>
                                        <td className='px-4 py-3'>{item.academicYear || 'N/A'}</td>
                                        <td className='px-4 py-3'>{item.categoryName || 'N/A'}</td>
                                        <td className='px-4 py-3 text-center'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    className='h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-800'>
                                                    <Edit className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    className='h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-800'>
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className='px-4 py-8 text-center text-gray-500 italic'>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer with Pagination Controls */}
                <div className='flex items-center justify-between border-purple-100 border-t bg-purple-50 px-6 py-3'>
                    <Button variant='outline' size='icon' className='h-8 w-8 border-purple-200 text-purple-700 hover:bg-purple-100'>
                        <ChevronLeft className='h-4 w-4' />
                    </Button>

                    <div className='flex items-center gap-2 rounded border border-purple-200 bg-white px-3 py-1.5 font-semibold text-purple-900 text-xs shadow-sm'>
                        <span>Total Records:</span>
                        <span className='font-bold text-orange-600'>{data?.length || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
