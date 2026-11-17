'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceRecord {
    CLASS_HELD: number;
    TOTAL_PRESENT: number;
    MONTH_NAME: string;
}

interface AttendanceDetailsChartsProps {
    data: AttendanceRecord[];
}

export default function AttendanceDetailsCharts({ data }: AttendanceDetailsChartsProps) {
    if (!data || data.length === 0) return null;

    // Transform data for charts if needed, but the structure matches nicely
    // We want unique months. If there are multiple entries per month, we should probably aggregate or just show them all?
    // Legacy implementation pushes ALL entries to chart:
    // angular.forEach($scope.attlst, function (ag) { $scope.attgraph.push({ label: ag.MONTH_NAME, "y": ag.TOTAL_PRESENT }); ... });
    // So if there are duplicates, they appear as multiple bars. Recharts handles this by just plotting points in order.

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Attendance Analysis (Bar Chart)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="MONTH_NAME" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="TOTAL_PRESENT" name="Total Present" fill="#3498DB" />
                                <Bar dataKey="CLASS_HELD" name="Class Held" fill="#76D7C4" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Attendance Analysis (Area Chart)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="MONTH_NAME" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="TOTAL_PRESENT" name="Total Present" stackId="1" stroke="#3498DB" fill="#3498DB" />
                                <Area type="monotone" dataKey="CLASS_HELD" name="Class Held" stackId="0" stroke="#76D7C4" fill="#76D7C4" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
