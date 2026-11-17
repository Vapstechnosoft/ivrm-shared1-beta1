import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function FeedbackModal({ open, onClose, onSubmit }: any) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-3xl'>
                <DialogHeader>
                    <DialogTitle>Feedback Required</DialogTitle>
                </DialogHeader>
                <div className='py-8 text-center'>
                    <p className='mb-6 text-lg'>Please provide feedback before proceeding.</p>
                </div>
                <div className='flex justify-center gap-4'>
                    <Button onClick={onSubmit}>Submit Feedback</Button>
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
