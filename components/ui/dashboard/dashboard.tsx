import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// Mock data for charts
const studentPerformanceData = [
    { subject: 'Math', score: 85, fullMark: 100 },
    { subject: 'Science', score: 78, fullMark: 100 },
    { subject: 'History', score: 92, fullMark: 100 },
    { subject: 'English', score: 88, fullMark: 100 },
    { subject: 'Art', score: 95, fullMark: 100 }
];

const enrollmentData = [
    { month: 'Jan', students: 400 },
    { month: 'Feb', students: 600 },
    { month: 'Mar', students: 800 },
    { month: 'Apr', students: 1000 },
    { month: 'May', students: 1200 },
    { month: 'Jun', students: 1400 }
];

const gradeDistributionData = [
    { name: 'A', value: 35 },
    { name: 'B', value: 25 },
    { name: 'C', value: 20 },
    { name: 'D', value: 15 },
    { name: 'F', value: 5 }
];

const COLORS = ['#9810FA', '#f26522', '#FFBB28', '#FF8042', '#8884D8'];

const courseProgressData = [
    { course: 'Mathematics', progress: 90 },
    { course: 'Physics', progress: 75 },
    { course: 'Chemistry', progress: 60 },
    { course: 'Biology', progress: 85 }
];

const statsData = [
    { title: 'Total Students', value: '2,453', change: '+12%', icon: '👨‍🎓' },
    { title: 'Average Score', value: '86%', change: '+3.2%', icon: '📊' },
    { title: 'Courses Completed', value: '384', change: '+8%', icon: '✅' },
    { title: 'Satisfaction Rate', value: '94%', change: '+2.1%', icon: '😊' }
];

export default function Dashboard() {
    return (
        <div className='min-h-screen bg-background text-foreground transition-colors duration-300'>
            <main className='container mx-auto px-4 py-8'>
                <div className='mb-8'>
                    <h2 className='mb-2 font-bold text-3xl'>Education Dashboard</h2>
                    <p className='text-muted-foreground'>Track and analyze educational performance metrics</p>
                </div>

                <Tabs defaultValue='dashboard' className='w-full'>
                    <TabsList className='mb-8 grid w-full max-w-md grid-cols-2'>
                        <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
                        <TabsTrigger value='static'>Static Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value='dashboard' className='space-y-8'>
                        {/* Stats Overview */}
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                            {statsData.map((stat, index) => (
                                <Card key={index} className='overflow-hidden transition-all duration-300 hover:shadow-lg'>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='font-medium text-sm'>{stat.title}</CardTitle>
                                        <span className='text-2xl'>{stat.icon}</span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='font-bold text-2xl'>{stat.value}</div>
                                        <p className='text-muted-foreground text-xs'>
                                            <span className='text-green-500'>{stat.change}</span> from last month
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                            {/* Student Performance Chart */}
                            <Card className='bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-950/30 dark:to-orange-950/30'>
                                <CardHeader>
                                    <CardTitle>Student Performance</CardTitle>
                                    <CardDescription>Average scores by subject</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='h-80'>
                                        <ResponsiveContainer width='100%' height='100%'>
                                            <BarChart data={studentPerformanceData}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis dataKey='subject' />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey='score' fill='url(#colorUv)' radius={[4, 4, 0, 0]} />
                                                <defs>
                                                    <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                                                        <stop offset='0%' stopColor='hsl(var(--gradient-start))' />
                                                        <stop offset='100%' stopColor='hsl(var(--gradient-end))' />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enrollment Trend Chart */}
                            <Card className='bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/30 dark:to-purple-950/30'>
                                <CardHeader>
                                    <CardTitle>Enrollment Trends</CardTitle>
                                    <CardDescription>Monthly student enrollment</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='h-80'>
                                        <ResponsiveContainer width='100%' height='100%'>
                                            <LineChart data={enrollmentData}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis dataKey='month' />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type='monotone'
                                                    dataKey='students'
                                                    stroke='url(#colorPv)'
                                                    strokeWidth={2}
                                                    activeDot={{ r: 8 }}
                                                />
                                                <defs>
                                                    <linearGradient id='colorPv' x1='0' y1='0' x2='1' y2='0'>
                                                        <stop offset='0%' stopColor='hsl(var(--gradient-end))' />
                                                        <stop offset='100%' stopColor='hsl(var(--gradient-start))' />
                                                    </linearGradient>
                                                </defs>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progress Section */}
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                            {/* Grade Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Grade Distribution</CardTitle>
                                    <CardDescription>Overall class performance</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='h-80'>
                                        <ResponsiveContainer width='100%' height='100%'>
                                            <PieChart>
                                                <Pie
                                                    data={gradeDistributionData}
                                                    cx='50%'
                                                    cy='50%'
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill='#8884d8'
                                                    dataKey='value'
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                    {gradeDistributionData.map((_entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Course Progress */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Completion Progress</CardTitle>
                                    <CardDescription>Current student progress by subject</CardDescription>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    {courseProgressData.map((course, index) => (
                                        <div key={index} className='space-y-2'>
                                            <div className='flex-between'>
                                                <span className='font-medium text-sm'>{course.course}</span>
                                                <span className='text-muted-foreground text-sm'>{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className='h-2' />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value='static' className='space-y-8'>
                        <div className='grid grid-cols-1 gap-6'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Annual Performance Report</CardTitle>
                                    <CardDescription>Comprehensive analysis of educational metrics</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-6'>
                                        <div className='rounded-lg bg-muted p-6'>
                                            <h3 className='mb-4 font-semibold text-xl'>Key Findings</h3>
                                            <ul className='list-inside list-disc space-y-2'>
                                                <li>Overall student performance improved by 12% compared to last year</li>
                                                <li>Mathematics scores showed the highest growth at 18%</li>
                                                <li>Student enrollment increased by 22% year-over-year</li>
                                                <li>Course completion rates reached a record high of 89%</li>
                                            </ul>
                                        </div>

                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                            <div className='rounded-lg bg-gradient-blue-purple-indigo p-4 text-center text-white'>
                                                <h4 className='font-semibold'>Attendance Rate</h4>
                                                <p className='mt-2 font-bold text-3xl'>94%</p>
                                            </div>
                                            <div className='rounded-lg bg-gradient-blue-purple-indigo p-4 text-center text-white'>
                                                <h4 className='font-semibold'>Pass Rate</h4>
                                                <p className='mt-2 font-bold text-3xl'>87%</p>
                                            </div>
                                            <div className='rounded-lg bg-gradient-radial from-purple-500 to-orange-500 p-4 text-center text-white'>
                                                <h4 className='font-semibold'>Satisfaction</h4>
                                                <p className='mt-2 font-bold text-3xl'>92%</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className='mb-4 font-semibold text-xl'>Recommendations</h3>
                                            <div className='space-y-3'>
                                                <div className='flex items-start space-x-3'>
                                                    <Badge className='mt-1 bg-primary'>1</Badge>
                                                    <p>Increase focus on science curriculum based on slightly lower performance metrics</p>
                                                </div>
                                                <div className='flex items-start space-x-3'>
                                                    <Badge className='mt-1 bg-secondary'>2</Badge>
                                                    <p>Implement additional teacher training for digital instruction methods</p>
                                                </div>
                                                <div className='flex items-start space-x-3'>
                                                    <Badge className='mt-1 bg-primary'>3</Badge>
                                                    <p>Expand scholarship programs to maintain enrollment growth trajectory</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Demographic Analysis</CardTitle>
                                    <CardDescription>Student population breakdown</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='h-96'>
                                        <ResponsiveContainer width='100%' height='100%'>
                                            <BarChart
                                                layout='vertical'
                                                data={[
                                                    { name: 'Freshmen', value: 650 },
                                                    { name: 'Sophomores', value: 580 },
                                                    { name: 'Juniors', value: 620 },
                                                    { name: 'Seniors', value: 590 }
                                                ]}>
                                                <CartesianGrid strokeDasharray='3 3' />
                                                <XAxis type='number' />
                                                <YAxis dataKey='name' type='category' scale='band' />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey='value' fill='url(#colorUv)' radius={[0, 4, 4, 0]} />
                                                <defs>
                                                    <linearGradient id='colorUv' x1='0' y1='0' x2='1' y2='0'>
                                                        <stop offset='0%' stopColor='hsl(var(--gradient-start))' />
                                                        <stop offset='100%' stopColor='hsl(var(--gradient-end))' />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
