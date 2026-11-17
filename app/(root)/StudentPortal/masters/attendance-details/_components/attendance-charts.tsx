'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IAttendanceGraphData } from '@/types/student-portal/masters/attendance-details';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AttendanceChartsProps {
    barData: IAttendanceGraphData[];
    areaData: IAttendanceGraphData[];
    classHeldData: IAttendanceGraphData[];
}

export function AttendanceCharts({ barData, areaData, classHeldData }: AttendanceChartsProps) {
    // Merge data for charts
    const chartData = barData.map((item, index) => ({
        name: item.label,
        totalPresent: item.y,
        classHeld: classHeldData[index]?.y || 0
    }));

    return (
        <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
                <CardHeader>
                    <CardTitle className='font-medium text-sm'>GRAPHICAL ANALYSIS OF ATTENDANCE FOR DIFFERENT ACADEMIC YEAR</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[350px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='name' fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey='totalPresent' name='TOTAL PRESENT' fill='#3498DB' />
                                <Bar dataKey='classHeld' name='CLASS HELD' fill='#76D7C4' />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='font-medium text-sm'>GRAPHICAL ANALYSIS OF ATTENDANCE FOR DIFFERENT ACADEMIC YEAR</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[350px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='name' fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type='monotone'
                                    dataKey='totalPresent'
                                    name='TOTAL PRESENT'
                                    fill='#808B96'
                                    stroke='#808B96'
                                    fillOpacity={0.6}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='classHeld'
                                    name='CLASS HELD'
                                    fill='#80DEEA'
                                    stroke='#80DEEA'
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
