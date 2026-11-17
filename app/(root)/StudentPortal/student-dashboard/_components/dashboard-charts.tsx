"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const feesData = [
    { name: 'Total', amount: 50000, fill: '#3b82f6' },
    { name: 'Paid', amount: 35000, fill: '#10b981' },
    { name: 'Balance', amount: 15000, fill: '#ef4444' },
];

const attendanceData = [
    { month: 'Jun', present: 22, total: 24 },
    { month: 'Jul', present: 20, total: 24 },
    { month: 'Aug', present: 23, total: 24 },
    { month: 'Sep', present: 21, total: 23 },
    { month: 'Oct', present: 18, total: 20 },
];

export function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Academic Year Fees Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={feesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Academic Year Attendance Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="total" name="Total Classes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
