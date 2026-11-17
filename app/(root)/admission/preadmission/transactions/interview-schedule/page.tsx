import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterviewSchedulePage() {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-3xl tracking-tight'>Interview Schedule</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-center justify-center py-10 text-center'>
                        <p className='text-muted-foreground'>Interview scheduling module is currently under development.</p>
                        <p className='mt-2 text-muted-foreground text-sm'>Please check back later for updates.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
