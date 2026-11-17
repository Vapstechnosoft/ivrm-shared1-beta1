'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type React from 'react';

interface ReportListProps {
    data: any[];
    institution: any;
    criteria: any;
}

export const ReportList: React.FC<ReportListProps> = ({ data, institution, criteria }) => {
    if (!data || data.length === 0) return null;

    // Grouping logic based on the original Angular code
    const groupedData: any[] = [];

    // Get unique classes
    const classes = Array.from(new Set(data.map((item) => item.asmcL_Id))).map((id) => {
        const item = data.find((i) => i.asmcL_Id === id);
        return { id, name: item?.asmcL_ClassName };
    });

    classes.forEach((cls) => {
        // Get sections for this class
        const classItems = data.filter((item) => item.asmcL_Id === cls.id);
        const sections = Array.from(new Set(classItems.map((item) => item.asmS_Id))).map((id) => {
            const item = classItems.find((i) => i.asmS_Id === id);
            return { id, name: item?.asmC_SectionName };
        });

        sections.forEach((sec) => {
            const sectionItems = classItems.filter((item) => item.asmS_Id === sec.id);
            groupedData.push({
                className: cls.name,
                sectionName: sec.name,
                items: sectionItems
            });
        });
    });

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Percentagewise Student Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div id='report-print-section' className='bg-white p-4'>
                    {/* Header for Print - Visible only in Print usually, but here shown for preview */}
                    <div className='mb-4 text-center'>
                        {institution?.[0] && (
                            <>
                                <h2 className='font-bold text-xl'>{institution[0].mI_Name}</h2>
                                <p>{institution[0].MI_Address1}</p>
                            </>
                        )}
                        <h3 className='mt-2 font-semibold text-lg'>Percentage Wise Report</h3>
                        <p>{criteria}</p>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse border border-gray-300'>
                            <thead>
                                <tr className='bg-gray-100'>
                                    <th className='border border-gray-300 p-2'>Sl No.</th>
                                    <th className='border border-gray-300 p-2'>Class</th>
                                    <th className='border border-gray-300 p-2'>Section</th>
                                    <th className='border border-gray-300 p-2'>Student</th>
                                    <th className='border border-gray-300 p-2'>Obtained Marks</th>
                                    <th className='border border-gray-300 p-2'>Max Marks</th>
                                    <th className='border border-gray-300 p-2'>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedData.map((group, groupIndex) =>
                                    group.items.map((item: any, itemIndex: number) => (
                                        <tr key={`${groupIndex}-${itemIndex}`} className='text-center'>
                                            {itemIndex === 0 && (
                                                <td className='border border-gray-300 p-2 align-middle' rowSpan={group.items.length}>
                                                    {groupIndex + 1}
                                                </td>
                                            )}
                                            {itemIndex === 0 && (
                                                <td className='border border-gray-300 p-2 align-middle' rowSpan={group.items.length}>
                                                    {group.className}
                                                </td>
                                            )}
                                            {itemIndex === 0 && (
                                                <td className='border border-gray-300 p-2 align-middle' rowSpan={group.items.length}>
                                                    {group.sectionName}
                                                </td>
                                            )}
                                            <td className='border border-gray-300 p-2 text-left'>{item.studentname}</td>
                                            <td className='border border-gray-300 p-2'>{item.estmP_TotalObtMarks}</td>
                                            <td className='border border-gray-300 p-2'>{item.estmP_TotalMaxMarks}</td>
                                            <td className='border border-gray-300 p-2'>{item.estmP_Percentage}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
