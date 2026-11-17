'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
    getBirthdayData,
    getClasswiseStudent,
    getDashboardData,
    getGalleryData,
    getNoticeData,
    getYearwiseList,
    viewGalleryItem,
    viewNoticeItem
} from '@/server/alumni/alumni-dashboard';
import { getMasterCOEInitialData } from '@/server/alumni/master-coe';
import type {
    IAlumniBirthday,
    IClasswiseStudent,
    IDashboardData,
    IGallery,
    INotice,
    IYearwiseCount
} from '@/types/alumni/alumni-dashboard';
import { format } from 'date-fns';
import { Download, Eye, FileText, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BirthdayMarquee from './_components/birthday-marquee';
import CalendarSection from './_components/calendar-section';
import DashboardTabs from './_components/dashboard-tabs';
import QuickLinkCards from './_components/quick-link-cards';
import TotalAlumniList from './_components/total-alumni-list';

export default function AlumniDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IDashboardData | null>(null);
    const [birthdayData, setBirthdayData] = useState<IAlumniBirthday[]>([]);
    const [coeEvents, setCoeEvents] = useState<any[]>([]);

    // Modal States
    const [galleryModal, setGalleryModal] = useState<{ open: boolean; items: IGallery[] }>({ open: false, items: [] });
    const [noticeModal, setNoticeModal] = useState<{ open: boolean; items: INotice[] }>({ open: false, items: [] });
    const [yearwiseModal, setYearwiseModal] = useState<{ open: boolean; items: IYearwiseCount[] }>({ open: false, items: [] });
    const [classwiseModal, setClasswiseModal] = useState<{ open: boolean; items: IClasswiseStudent[] }>({ open: false, items: [] });

    // Detailed View States
    const [galleryDetail, setGalleryDetail] = useState<{ open: boolean; data: any[] }>({ open: false, data: [] });
    const [noticeDetail, setNoticeDetail] = useState<{ open: boolean; data: any[] }>({ open: false, data: [] });

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [dashboardRes, birthdayRes, coeRes] = await Promise.all([
                    getDashboardData(),
                    getBirthdayData(),
                    getMasterCOEInitialData()
                ]);

                if (dashboardRes.success) {
                    console.log('Dashboard Data:', dashboardRes.data);
                    console.log('Batch Data:', dashboardRes.data?.batch);
                    setData(dashboardRes.data!);

                    // Prioritize distinct birthday API data if available, else fall back to dashboard's list
                    if (birthdayRes.success && birthdayRes.data && birthdayRes.data.length > 0) {
                        setBirthdayData(birthdayRes.data);
                    } else {
                        setBirthdayData(dashboardRes.data!.alumnibirthday || []);
                    }
                } else {
                    toast.error(dashboardRes.message || 'Failed to fetch dashboard data');
                }

                // Set COE Events from mapped_eventlist
                if (coeRes?.success && coeRes?.data?.mapped_eventlist) {
                    console.log('COE Events Data:', coeRes.data.mapped_eventlist);
                    setCoeEvents(coeRes.data.mapped_eventlist);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error('An unexpected error occurred while loading dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleGallery = async () => {
        const res = await getGalleryData();
        if (res.success) {
            setGalleryModal({ open: true, items: res.data || [] });
        } else {
            toast.error(res.message);
        }
    };

    const handleNotice = async () => {
        const res = await getNoticeData();
        if (res.success) {
            setNoticeModal({ open: true, items: res.data || [] });
        } else {
            toast.error(res.message);
        }
    };

    const handleViewGallery = async (id: number) => {
        console.log('handleViewGallery called with id:', id);
        const res = await viewGalleryItem(id);
        console.log('viewGalleryItem response:', res);
        if (res.success) {
            setGalleryDetail({ open: true, data: res.data || [] });
        } else {
            toast.error(res.message || 'Failed to load gallery details');
        }
    };

    const handleViewNotice = async (id: number) => {
        const res = await viewNoticeItem(id);
        if (res.success) {
            setNoticeDetail({ open: true, data: res.data! });
        } else {
            toast.error(res.message);
        }
    };

    const handleViewYearwise = async (id: number) => {
        const res = await getYearwiseList(id);
        if (res.success) {
            setYearwiseModal({ open: true, items: res.data! });
        } else {
            toast.error(res.message);
        }
    };

    const handleViewClasswise = async (yearId: number, classId: number) => {
        const res = await getClasswiseStudent(yearId, classId);
        if (res.success) {
            setClasswiseModal({ open: true, items: res.data! });
        } else {
            toast.error(res.message);
        }
    };

    if (loading) {
        return (
            <div className='container space-y-6 p-6'>
                <Skeleton className='h-12 w-full' />
                <div className='grid grid-cols-4 gap-4'>
                    <Skeleton className='h-32' />
                    <Skeleton className='h-32' />
                    <Skeleton className='h-32' />
                    <Skeleton className='h-32' />
                </div>
                <div className='grid grid-cols-3 gap-4'>
                    <Skeleton className='col-span-2 h-96' />
                    <Skeleton className='h-96' />
                </div>
            </div>
        );
    }

    const isAdmin = data?.rolename !== 'Alumni';

    return (
        <div className='min-h-screen space-y-8 bg-[#f8fafc] p-6 pb-12 font-sans'>
            {/* Header Section with Premium Gradient */}
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 text-white shadow-2xl'>
                <div className='relative z-10 flex items-center justify-between'>
                    <div className='flex items-center space-x-5'>
                        <div className='rounded-2xl bg-white/20 p-4 backdrop-blur-md'>
                            <LayoutDashboard className='h-8 w-8 text-white' />
                        </div>
                        <div>
                            <h1 className='font-extrabold text-4xl tracking-tight'>Alumni Dashboard</h1>
                            <p className='mt-1 font-medium text-blue-100/80'>
                                Welcome to the {data?.rolename || 'Alumni'} Portal. Stay connected with your alma mater.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className='-right-16 -top-16 absolute h-64 w-64 rounded-full bg-white/10 blur-3xl' />
                <div className='-left-16 -bottom-16 absolute h-48 w-48 rounded-full bg-blue-400/20 blur-2xl' />
            </div>

            {/* Birthday Marquee */}
            <div className='-mx-6'>
                <BirthdayMarquee birthdays={data?.birthdaylist || []} />
            </div>

            {/* Quick Links */}
            <QuickLinkCards
                onProfile={() => router.push('/alumni/alumni-module/transactions/alumni-details')}
                onDonation={() => router.push('/alumni/alumni-module/transactions/alumni-donation')}
                onBirthday={() => router.push('/alumni/alumni-module/transactions/alumni-birthday')}
                onGallery={handleGallery}
                onNotice={handleNotice}
                onEvents={() => router.push('/alumni/alumni-module/transactions/coe-events')}
                onFriendRequest={() => router.push('/alumni/alumni-module/transactions/alumni-friend-request-accept')}
                onDirectory={() => router.push('/alumni/alumni-module/transactions/alumni-details')}
                totalCount={data?.friendrequestlist?.length}
                donationAmount={data?.totaldonation?.[0]?.ALDON_Amount}
            />

            {/* Main Content Areas */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                {/* Reports & Lists Tabs */}
                <div className='lg:col-span-2'>
                    <DashboardTabs
                        batchData={data?.batch || []}
                        birthdayData={birthdayData.length > 0 ? birthdayData : data?.alumnibirthday || []}
                        onViewYearwise={handleViewYearwise}
                        showAdminDetails={isAdmin}
                    />
                </div>

                {/* Event Calendar */}
                <div className='lg:col-span-1'>
                    <CalendarSection events={coeEvents.length > 0 ? coeEvents : data?.calenderlist || []} />
                </div>
            </div>

            {/* Total Alumni List (Always at bottom for visibility) */}
            {isAdmin && data?.alumnilist && <TotalAlumniList alumni={data.alumnilist} totalCount={data.alumnilist.length} />}

            {/* --- MODALS --- */}

            {/* Gallery Modal */}
            <Dialog open={galleryModal.open} onOpenChange={(v) => setGalleryModal({ ...galleryModal, open: v })}>
                <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                        <DialogTitle>Alumni Gallery</DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
                        {galleryModal.items.map((item) => (
                            <Card
                                key={item.algA_Id}
                                className='cursor-pointer hover:bg-muted'
                                onClick={() => handleViewGallery(item.algA_Id)}>
                                <CardContent className='p-4'>
                                    <h4 className='font-bold'>{item.algA_GalleryName}</h4>
                                    <p className='text-muted-foreground text-xs'>{format(new Date(item.algA_Date), 'dd MMM yyyy')}</p>
                                    <div className='mt-2 flex items-center text-primary text-xs'>
                                        <Eye className='mr-1 h-3 w-3' /> View Media
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notice Modal */}
            <Dialog open={noticeModal.open} onOpenChange={(v) => setNoticeModal({ ...noticeModal, open: v })}>
                <DialogContent className='max-w-5xl'>
                    <DialogHeader>
                        <DialogTitle>Notice Board</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className='h-[60vh]'>
                        <div className='w-full'>
                            <table className='w-full border-collapse text-sm'>
                                <thead>
                                    <tr className='border-b bg-muted/50'>
                                        <th className='p-3 text-left'>Title</th>
                                        <th className='p-3 text-left'>Description</th>
                                        <th className='p-3 text-center'>Start Date</th>
                                        <th className='p-3 text-center'>End Date</th>
                                        <th className='p-3 text-center'>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {noticeModal.items.map((item) => (
                                        <tr key={item.alntb_id} className='border-b'>
                                            <td className='p-3 font-medium'>{item.alntb_title}</td>
                                            <td className='max-w-xs truncate p-3'>{item.alntb_description}</td>
                                            <td className='p-3 text-center'>
                                                {item.alntb_startdate ? format(new Date(item.alntb_startdate), 'dd-MM-yyyy') : '-'}
                                            </td>
                                            <td className='p-3 text-center'>
                                                {item.alntb_enddate ? format(new Date(item.alntb_enddate), 'dd-MM-yyyy') : '-'}
                                            </td>
                                            <td className='p-3 text-center'>
                                                {item.filecount > 0 && (
                                                    <button onClick={() => handleViewNotice(item.alntb_id)} className='text-primary'>
                                                        <Eye className='h-4 w-4' />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Yearwise Modal */}
            <Dialog open={yearwiseModal.open} onOpenChange={(v) => setYearwiseModal({ ...yearwiseModal, open: v })}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>Yearwise Alumni Count</DialogTitle>
                    </DialogHeader>
                    <table className='w-full border-collapse text-sm'>
                        <thead>
                            <tr className='border-b bg-muted/50'>
                                <th className='p-3 text-center'>Batch</th>
                                <th className='p-3 text-center'>Class</th>
                                <th className='p-3 text-center'>Total</th>
                                <th className='p-3 text-center'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearwiseModal.items.map((item, idx) => (
                                <tr key={idx} className='border-b'>
                                    <td className='p-3 text-center'>{item.BATCHES}</td>
                                    <td className='p-3 text-center'>{item.classname}</td>
                                    <td className='p-3 text-center'>{item.NOofstudents}</td>
                                    <td className='p-3 text-center'>
                                        <button
                                            onClick={() => {
                                                const yearId = item.ASMAY_Id || (item as any).asmay_id;
                                                const classId = item.ASMCL_Id || (item as any).asmcL_Id || (item as any).asmcl_id;
                                                handleViewClasswise(yearId, classId);
                                            }}
                                            className='font-medium text-primary hover:underline'>
                                            View Students
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {yearwiseModal.items.length > 0 && (
                            <tfoot>
                                <tr className='bg-muted/20 font-bold'>
                                    <td className='p-3 text-center' colSpan={2}>
                                        Grand Total
                                    </td>
                                    <td className='p-3 text-center'>
                                        {yearwiseModal.items.reduce((acc, item) => acc + (Number(item.NOofstudents) || 0), 0)}
                                    </td>
                                    <td className='p-3 text-center'>-</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </DialogContent>
            </Dialog>

            {/* Classwise Modal */}
            <Dialog open={classwiseModal.open} onOpenChange={(v) => setClasswiseModal({ ...classwiseModal, open: v })}>
                <DialogContent className='max-w-5xl'>
                    <DialogHeader>
                        <DialogTitle>Student List</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className='h-[70vh]'>
                        <div className='w-full'>
                            <table className='w-full border-collapse text-sm'>
                                <thead>
                                    <tr className='border-b bg-muted/50 font-bold'>
                                        <th className='p-3 text-left'>Name</th>
                                        <th className='p-3 text-left'>Year</th>
                                        <th className='p-3 text-left'>Adm No</th>
                                        <th className='p-3 text-left'>Class</th>
                                        <th className='p-3 text-left'>Mobile</th>
                                        <th className='p-3 text-left'>Email</th>
                                        <th className='p-3 text-left'>DOB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classwiseModal.items.map((item, idx) => (
                                        <tr key={idx} className='border-b'>
                                            <td className='p-3'>{item.studentname}</td>
                                            <td className='p-3 text-center'>{item.asmay_year}</td>
                                            <td className='p-3'>{item.almst_admno || '-'}</td>
                                            <td className='p-3'>{item.classname}</td>
                                            <td className='p-3'>{item.almst_mobileno}</td>
                                            <td className='p-3'>{item.almst_emailid}</td>
                                            <td className='p-3'>{item.almst_dob ? format(new Date(item.almst_dob), 'dd-MM-yyyy') : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Notice Detail Modal (Attachments) */}
            <Dialog open={noticeDetail.open} onOpenChange={(v) => setNoticeDetail({ ...noticeDetail, open: v })}>
                <DialogContent className='max-w-3xl'>
                    <DialogHeader>
                        <DialogTitle>Notice Attachments</DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        {noticeDetail.data.map((file, idx) => (
                            <Card key={idx} className='flex items-center space-x-4 p-4'>
                                <FileText className='h-8 w-8 text-primary' />
                                <div className='flex-1 overflow-hidden'>
                                    <p className='truncate font-medium text-sm'>{file.alntbfL_FileName}</p>
                                    <a
                                        href={file.alntbfL_FilePath}
                                        download={file.alntbfL_FileName}
                                        className='flex items-center text-primary text-xs hover:underline'>
                                        <Download className='mr-1 h-3 w-3' />
                                        Download
                                    </a>
                                </div>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Gallery Detail Modal (Photos/Videos) */}
            <Dialog open={galleryDetail.open} onOpenChange={(v) => setGalleryDetail({ ...galleryDetail, open: v })}>
                <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                        <DialogTitle>Gallery Media</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className='h-[60vh]'>
                        <div className='w-full'>
                            <table className='w-full border-collapse text-sm'>
                                <thead>
                                    <tr className='border-b bg-muted/50'>
                                        <th className='p-3 text-left'>Sl.No</th>
                                        <th className='p-3 text-left'>Gallery Name</th>
                                        <th className='p-3 text-center'>Date</th>
                                        <th className='p-3 text-center'>Time</th>
                                        <th className='p-3 text-center'>Status</th>
                                        <th className='p-3 text-center'>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {galleryDetail.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className='p-4 text-center text-muted-foreground'>
                                                No media files found in this gallery.
                                            </td>
                                        </tr>
                                    ) : (
                                        galleryDetail.data.map((item, idx) => (
                                            <tr key={idx} className='border-b hover:bg-muted/30'>
                                                <td className='p-3'>{idx + 1}</td>
                                                <td className='p-3 font-medium'>{item.alga_galleryname}</td>
                                                <td className='p-3 text-center'>
                                                    {item.alga_date
                                                        ? (() => {
                                                              try {
                                                                  return format(new Date(item.alga_date), 'dd-MM-yyyy');
                                                              } catch {
                                                                  return item.alga_date;
                                                              }
                                                          })()
                                                        : '-'}
                                                </td>
                                                <td className='p-3 text-center'>
                                                    {item.alga_time
                                                        ? (() => {
                                                              try {
                                                                  // Try to extract time from datetime string like "2026-01-16 07:15:42"
                                                                  const timeStr = item.alga_time.toString();
                                                                  const timePart = timeStr.includes(' ') ? timeStr.split(' ')[1] : timeStr;
                                                                  return timePart?.substring(0, 5) || item.alga_time;
                                                              } catch {
                                                                  return item.alga_time;
                                                              }
                                                          })()
                                                        : '-'}
                                                </td>
                                                <td className='p-3 text-center'>
                                                    <span
                                                        className={`rounded px-2 py-1 font-semibold text-xs ${item.alga_activeflag ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {item.alga_activeflag ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className='p-3 text-center'>
                                                    {item.algap_photos || item.algav_videos ? (
                                                        <a
                                                            href={item.algap_photos || item.algav_videos}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                            className='inline-flex items-center text-primary hover:underline'>
                                                            <Eye className='mr-1 h-4 w-4' />
                                                            {item.algav_videos ? 'Video' : 'Photo'}
                                                        </a>
                                                    ) : (
                                                        <span className='text-muted-foreground'>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
