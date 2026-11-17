'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IndividualAnalysis, StudentPerformance } from '@/types/exam/exam-module/ai-analysis';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface StudentAnalysisViewProps {
    student: StudentPerformance;
    analysis: IndividualAnalysis;
}

export function StudentAnalysisView({ student, analysis }: StudentAnalysisViewProps) {
    const chartData = student.subjects.map((s) => ({
        subject: s.subject,
        score: s.percentage
    }));

    return (
        <div className='fade-in-50 animate-in space-y-6'>
            <div className='flex items-center justify-between rounded-lg bg-muted/50 p-4'>
                <div>
                    <h2 className='font-bold text-2xl'>{student.name}</h2>
                    <p className='text-muted-foreground'>Index: {student.index}</p>
                </div>
                <div className='text-right'>
                    <div className='font-bold text-2xl text-primary'>{student.averageScore}%</div>
                    <div className='text-muted-foreground text-sm'>Average Score</div>
                </div>
            </div>

            <Tabs defaultValue='weakest' className='w-full'>
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='weakest'>📉 Weakest</TabsTrigger>
                    <TabsTrigger value='improvement'>⚠️ Improve</TabsTrigger>
                    <TabsTrigger value='strong'>✅ Strong</TabsTrigger>
                    <TabsTrigger value='overall'>📊 Overall</TabsTrigger>
                </TabsList>

                <TabsContent value='weakest' className='mt-4'>
                    <Card className='border-red-200 bg-red-50/50'>
                        <CardContent className='pt-6'>
                            <h3 className='mb-2 font-bold text-red-700 text-xl'>
                                {analysis.weakestSubject.name} (Score: {analysis.weakestSubject.score})
                            </h3>
                            <p className='text-red-900 leading-relaxed'>{analysis.weakestSubject.analysis}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='improvement' className='mt-4'>
                    <div className='space-y-4'>
                        {analysis.needsImprovement.map((subject, i) => (
                            <Card key={i}>
                                <CardContent className='pt-6'>
                                    <h4 className='mb-2 font-semibold text-lg'>
                                        {subject.name} (Score: {subject.score})
                                    </h4>
                                    <div className='rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-900'>
                                        💡 {subject.recommendation}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value='strong' className='mt-4'>
                    <div className='grid gap-4 md:grid-cols-3'>
                        {analysis.strongSubjects.map((subject, i) => (
                            <Card key={i} className='border-green-200 bg-green-50/50'>
                                <CardContent className='pt-6'>
                                    <h4 className='mb-1 font-semibold text-green-900'>{subject.name}</h4>
                                    <p className='mb-2 font-medium text-green-700 text-sm'>Score: {subject.score}</p>
                                    <p className='text-green-800 text-sm'>{subject.praise}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value='overall' className='mt-4'>
                    <div className='grid gap-6 md:grid-cols-2'>
                        <Card className='border-blue-200 bg-blue-50/50'>
                            <CardContent className='pt-6'>
                                <h3 className='mb-2 font-semibold text-blue-900'>📝 Assessment</h3>
                                <p className='text-blue-800 leading-relaxed'>{analysis.overallAssessment}</p>
                            </CardContent>
                        </Card>
                        <Card className='border-purple-200 bg-purple-50/50'>
                            <CardContent className='pt-6'>
                                <h3 className='mb-2 font-semibold text-purple-900'>🎯 Strategy</h3>
                                <p className='whitespace-pre-line text-purple-800 leading-relaxed'>{analysis.improvementStrategy}</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Chart */}
            <Card>
                <CardContent className='pt-6'>
                    <h3 className='mb-6 font-semibold text-lg'>Subject Performance</h3>
                    <div className='h-[300px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                                <XAxis dataKey='subject' tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor='end' height={80} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey='score' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
