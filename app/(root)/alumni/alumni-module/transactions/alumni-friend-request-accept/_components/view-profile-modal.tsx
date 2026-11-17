'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { viewAlumniProfile } from '@/server/alumni/alumni-friend-request';
import type { IAlumniProfile } from '@/types/alumni/alumni-friend-request';
import { Calendar, Loader2, Mail, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ViewProfileModalProps {
    alumniId: number;
    alumniName: string;
    onClose: () => void;
}

export default function ViewProfileModal({ alumniId, alumniName, onClose }: ViewProfileModalProps) {
    const [profile, setProfile] = useState<IAlumniProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const res = await viewAlumniProfile({ almsT_Id: alumniId });
                const dataArray = res.data?.data || res.data?.almst_profile || (Array.isArray(res.data) ? res.data : null);

                if (res.success && dataArray && dataArray.length > 0) {
                    const item = dataArray[0] as any;
                    setProfile({
                        ALMST_Id: item.almsT_Id || item.ALMST_Id || alumniId,
                        alumniname: item.alumniname || item.studentname || item.ALMST_StudentName || alumniName,
                        ASMAY_Year: item.asmaY_Year || item.ASMAY_Year || item.asmaY_year,
                        ALMST_MobileNo: item.almsT_MobileNo || item.ALMST_MobileNo,
                        ALMST_emailId: item.almsT_emailId || item.ALMST_emailId,
                        ALMST_StudentPhoto: item.almsT_StudentPhoto || item.ALMST_StudentPhoto
                    });
                } else {
                    toast.error('Profile data not found');
                }
                // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [alumniId, alumniName]);

    return (
        <AdaptiveDialog isOpen={true} onClose={onClose} title={`Alumni Profile: ${alumniName}`} size='lg'>
            <AdaptiveBody>
                {isLoading ? (
                    <div className='flex h-64 items-center justify-center'>
                        <Loader2 className='h-8 w-8 animate-spin text-primary' />
                    </div>
                ) : profile ? (
                    <div className='flex flex-col items-start gap-8 p-2 md:flex-row'>
                        <div className='flex w-full flex-col items-center gap-4 md:w-1/3'>
                            <div className='group relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-primary/10 shadow-xl'>
                                {profile.ALMST_StudentPhoto && !imgError ? (
                                    <img
                                        src={profile.ALMST_StudentPhoto}
                                        alt={profile.alumniname}
                                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className='flex h-full w-full items-center justify-center bg-muted'>
                                        <User className='h-20 w-20 text-muted-foreground/30' />
                                    </div>
                                )}
                            </div>
                            <div className='text-center'>
                                <h3 className='font-bold text-primary text-xl'>{profile.alumniname}</h3>
                                <p className='font-medium text-muted-foreground text-sm'>Class of {profile.ASMAY_Year}</p>
                            </div>
                        </div>

                        <div className='w-full flex-1 space-y-4'>
                            <Card className='border-none bg-primary/5 shadow-none'>
                                <CardContent className='space-y-4 p-4'>
                                    <div className='group flex items-center gap-4'>
                                        <div className='rounded-xl bg-white p-3 shadow-sm ring-1 ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-white'>
                                            <Calendar className='h-5 w-5' />
                                        </div>
                                        <div>
                                            <p className='font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                                Passing Batch
                                            </p>
                                            <p className='font-semibold'>{profile.ASMAY_Year}</p>
                                        </div>
                                    </div>

                                    <div className='group flex items-center gap-4'>
                                        <div className='rounded-xl bg-white p-3 shadow-sm ring-1 ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-white'>
                                            <Phone className='h-5 w-5' />
                                        </div>
                                        <div>
                                            <p className='font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                                Mobile Number
                                            </p>
                                            <p className='font-semibold'>{profile.ALMST_MobileNo}</p>
                                        </div>
                                    </div>

                                    <div className='group flex items-center gap-4'>
                                        <div className='rounded-xl bg-white p-3 shadow-sm ring-1 ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-white'>
                                            <Mail className='h-5 w-5' />
                                        </div>
                                        <div>
                                            <p className='font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                                Email Address
                                            </p>
                                            <p className='break-all font-semibold'>{profile.ALMST_emailId}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className='rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-700 text-xs italic'>
                                This profile information is shared with friends to facilitate networking and professional connections.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex h-64 items-center justify-center text-muted-foreground'>Failed to load profile details.</div>
                )}
            </AdaptiveBody>
            <AdaptiveFooter className='border-t p-4'>
                <Button variant='outline' onClick={onClose} className='w-full'>
                    Close Profile
                </Button>
                <div />
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
