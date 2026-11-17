'use client';

export default function QuestionGeneratorPage() {
    return (
        <div className='container mx-auto space-y-6 p-4'>
            <div className='w-full'>
                <iframe
                    src={process.env.NEXT_PUBLIC_QUESTION_GENERATOR_URL ?? 'https://52.140.80.51:3001/'}
                    width='100%'
                    height='800'
                    style={{ border: 'none' }}
                    allowFullScreen
                    loading='lazy'
                    title='Question Generator Dashboard'
                />
            </div>
        </div>
    );
}
