'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IFeeAnalysisData } from '@/types/student-portal/masters/cumulative-fee-analysis';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface CumulativeFeeAnalysisChartsProps {
    data: IFeeAnalysisData[];
}

const COLORS = ['#3498DB', '#76D7C4', '#808B96', '#80DEEA', '#C5E1A5'];
const METRICS = [
    { key: 'receivable', label: 'RECEIVABLE' },
    { key: 'concession', label: 'CONCESSION' },
    { key: 'collection', label: 'COLLECTION' },
    { key: 'adjusted', label: 'ADJUSTMENT' },
    { key: 'balance', label: 'BALANCE' }
];

export function CumulativeFeeAnalysisCharts({ data }: CumulativeFeeAnalysisChartsProps) {
    if (!data || data.length === 0) return null;

    // Transform data for Bar Chart
    // Legacy logic: Show one bar per metric for each year.
    // Recharts data format: array of objects.
    // If we have multiple years, we can flatten them or group.
    // Let's assume we flatten them: [{metric: 'RECEIVABLE-YEAR', value: 100}, ...]
    // But better to stick to standard categorical:
    // [{ name: 'RECEIVABLE', Year1: 100, Year2: 200 }] -> Complex to dynamic key
    // Simplest approach matching legacy:
    // Single array where each item is { name: 'Metric', value: num, fill: color }
    // If multiple years, we map each year's metrics.

    const chartData: any[] = [];
    data.forEach((yearData) => {
        METRICS.forEach((metric, index) => {
            chartData.push({
                name: metric.label, // Or `${metric.label} - ${yearData.asmaY_Year}` if multiple years
                value: (yearData as any)[metric.key],
                fill: COLORS[index % COLORS.length]
            });
        });
    });

    // For Doughnut Chart, same data essentially.

    return (
        <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
                <CardHeader>
                    <CardTitle className='font-bold text-sm uppercase'>Graphical Analysis of Fees for Different Academic Year</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[350px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='name' fontSize={12} interval={0} angle={-45} textAnchor='end' height={60} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                {/* <Legend /> Legend not strictly needed if labels are on XAxis, but legacy had it hidden? No, legacy chart 1 had showInLegend: false */}
                                <Bar dataKey='value' fill='#8884d8'>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='font-bold text-sm uppercase'>Graphical Analysis of Fees for Different Academic Year</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[350px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <PieChart>
                                <Pie data={chartData} cx='50%' cy='50%' innerRadius={90} outerRadius={120} paddingAngle={2} dataKey='value'>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
