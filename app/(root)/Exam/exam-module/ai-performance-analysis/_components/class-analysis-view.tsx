'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ClassAnalysis } from '@/types/exam/exam-module/ai-analysis';

interface ClassAnalysisViewProps {
    analysis: ClassAnalysis;
}

export function ClassAnalysisView({ analysis }: ClassAnalysisViewProps) {
    return (
        <div className='fade-in-50 animate-in space-y-6'>
            {/* Overview */}
            <Card className='border-blue-200 bg-blue-50/50'>
                <CardHeader>
                    <CardTitle className='text-blue-900'>📝 Class Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-blue-800 leading-relaxed'>{analysis.classOverview}</p>
                </CardContent>
            </Card>

            <div className='grid gap-6 md:grid-cols-2'>
                {/* Top Performers */}
                <div className='space-y-4'>
                    <h3 className='flex items-center gap-2 font-semibold text-xl'>🏆 Top 5 Performers</h3>
                    <ScrollArea className='h-[600px] pr-4'>
                        <div className='space-y-4'>
                            {analysis.topPerformers.map((student, idx) => (
                                <Card key={idx} className='border-green-200 bg-green-50/50'>
                                    <CardHeader className='pb-2'>
                                        <div className='flex items-center justify-between'>
                                            <CardTitle className='text-green-900 text-lg'>
                                                #{idx + 1} {student.name}
                                            </CardTitle>
                                            <Badge variant='outline' className='border-green-200 bg-green-100 text-green-700'>
                                                Avg: {student.averageScore}%
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='space-y-3'>
                                        <p className='text-muted-foreground text-sm'>{student.analysis}</p>
                                        <div className='rounded-md bg-green-100/50 p-2 font-medium text-green-800 text-sm'>
                                            ✨ {student.praise}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Weak Performers */}
                <div className='space-y-4'>
                    <h3 className='flex items-center gap-2 font-semibold text-xl'>⚠️ Students Needing Support</h3>
                    <ScrollArea className='h-[600px] pr-4'>
                        <div className='space-y-4'>
                            {analysis.weakPerformers.map((student, idx) => (
                                <Card key={idx} className='border-red-200 bg-red-50/50'>
                                    <CardHeader className='pb-2'>
                                        <div className='flex items-center justify-between'>
                                            <CardTitle className='text-lg text-red-900'>
                                                #{idx + 1} {student.name}
                                            </CardTitle>
                                            <Badge variant='outline' className='border-red-200 bg-red-100 text-red-700'>
                                                Avg: {student.averageScore}%
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='space-y-3'>
                                        <p className='text-muted-foreground text-sm'>{student.analysis}</p>
                                        <div className='rounded-md bg-red-100/50 p-2 font-medium text-red-800 text-sm'>
                                            💡 {student.recommendations}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
