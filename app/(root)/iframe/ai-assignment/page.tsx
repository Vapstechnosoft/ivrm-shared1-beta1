'use client';

export default function AIAssignmentPage() {
    return (
        <div className='container mx-auto space-y-6 p-4'>
            <div className='w-full'>
                <iframe
                    src={process.env.NEXT_PUBLIC_AI_ASSIGNMENT_URL ?? 'https://52.140.80.51:8091/'}
                    width='100%'
                    height='800'
                    style={{ border: 'none' }}
                    allowFullScreen
                    loading='lazy'
                    title='AI Assignment Dashboard'
                />
            </div>
        </div>
    );
}
