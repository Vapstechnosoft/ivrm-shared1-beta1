'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBookRegister, useBookRegisterInitialData } from '@/hooks/library/useBookRegister';
import { bookRegisterSchema } from '@/schemas/library/bookRegister';
import type { BookRegisterPayload } from '@/types/library/masters/bookRegister';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import TabAuthorDetails from './TabAuthorDetails';
import TabBookDetails from './TabBookDetails';
import TabPurchaseDetails from './TabPurchaseDetails';

export default function BookRegisterForm({ initialData, onSuccess }: { initialData?: BookRegisterPayload; onSuccess: () => void }) {
    const { saveMutation } = useBookRegister();
    const { data: dropdownData, isLoading: isLoadingDropdowns } = useBookRegisterInitialData();
    const [activeTab, setActiveTab] = useState('bookDetails');

    const form = useForm<BookRegisterPayload>({
        resolver: zodResolver(bookRegisterSchema.addOrUpdate),
        defaultValues: initialData || {
            LMB_BookTitle: '',
            LMB_BookType: '',
            LMB_EntryDate: new Date(),
            Purchase_Date: new Date()
        }
    });

    const onSubmit = (data: BookRegisterPayload) => {
        saveMutation.mutate(data, {
            onSuccess: (res) => {
                if (res.success) {
                    toast.success(res.message);
                    onSuccess();
                } else {
                    toast.error(res.message);
                }
            }
        });
    };

    if (isLoadingDropdowns) {
        return (
            <div className='flex justify-center p-4'>
                <Loader2 className='h-6 w-6 animate-spin' />
            </div>
        );
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='bookDetails'>Book Info</TabsTrigger>
                        <TabsTrigger value='purchaseDetails'>Purchase Info</TabsTrigger>
                        <TabsTrigger value='authorDetails'>Author & Accession</TabsTrigger>
                    </TabsList>

                    <div className='mt-2 min-h-[300px] rounded-md border p-4'>
                        <TabsContent value='bookDetails'>
                            <TabBookDetails dropdownData={dropdownData} />
                        </TabsContent>
                        <TabsContent value='purchaseDetails'>
                            <TabPurchaseDetails dropdownData={dropdownData} />
                        </TabsContent>
                        <TabsContent value='authorDetails'>
                            <TabAuthorDetails dropdownData={dropdownData} />
                        </TabsContent>
                    </div>
                </Tabs>

                <div className='mt-4 flex justify-end gap-2'>
                    <Button type='button' variant='outline' onClick={() => onSuccess()}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={saveMutation.isPending}>
                        {saveMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Save
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
