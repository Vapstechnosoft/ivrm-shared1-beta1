'use client';

import { useState } from 'react';
import { useStaffDashboard } from '@/hooks/staff-portal/useStaffDashboard';
import { DashboardWidget } from '@/app/(root)/StudentPortal/student-dashboard/_components/dashboard-widget';
import {
    User,
    Bell,
    Calendar,
    Box,
    ShoppingCart,
    Clock,
    Users,
    Book,
    FileText,
    Camera
} from 'lucide-react';
import {
    ProfileModal,
    NoticeBoardModal,
    EventsModal,
    AssetListModal,
    PurchaseListModal,
    BookListModal,
    MedicalRecordModal,
    TimeTableModal,
    PhotoUploadModal
} from './_components/dashboard-modals';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function StaffDashboardPage() {
    const { data: dashboard, isLoading } = useStaffDashboard();
    const [modals, setModals] = useState({
        profile: false,
        notice: false,
        events: false,
        assets: false,
        purchase: false,
        books: false,
        medical: false,
        timetable: false,
        upload: false
    });

    const toggleModal = (key: keyof typeof modals, val: boolean) => {
        setModals(prev => ({ ...prev, [key]: val }));
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}
            </div>
        );
    }

    const basicDetails = dashboard?.filldepartment?.[0]!;
    const profileStatus = dashboard?.empProfile?.[0];
    const isTeaching = dashboard?.hrmE_TechNonTeachingFlg === 'Teaching';

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-8 text-primary uppercase tracking-tight">Staff Portal Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* 1. Employee Profile */}
                <DashboardWidget
                    title="Profile"
                    icon={<User />}
                    colorClass="bg-[#00c0ef]"
                    footerText="View Full Profile"
                    onViewClick={() => toggleModal('profile', true)}
                >
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{basicDetails?.hrmE_EmployeeFirstName}</span>
                        <span className="text-xs text-muted-foreground">{basicDetails?.hrmdeS_DesignationName}</span>
                        <Button
                            variant="ghost"
                            size="xs"
                            className="mt-2 h-7 px-2 text-[10px] gap-1 hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleModal('upload', true);
                            }}
                        >
                            <Camera className="h-3 w-3" /> Change Photo
                        </Button>
                    </div>
                </DashboardWidget>

                {/* 2. Notice Board */}
                <DashboardWidget
                    title="Notice Board"
                    icon={<Bell />}
                    colorClass="bg-[#605ca8]"
                    footerText="View Notices"
                    onViewClick={() => toggleModal('notice', true)}
                >
                    <div className="text-3xl font-bold">{dashboard?.noticeboard?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Notices</div>
                </DashboardWidget>

                {/* 3. Calendar of Events */}
                <DashboardWidget
                    title="Events"
                    icon={<Calendar />}
                    colorClass="bg-[#00a65a]"
                    footerText="View All Events"
                    onViewClick={() => toggleModal('events', true)}
                >
                    <div className="text-3xl font-bold">{dashboard?.calenderlist?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Upcoming Events</div>
                </DashboardWidget>

                {/* 4. Asset List */}
                <DashboardWidget
                    title="Asset List"
                    icon={<Box />}
                    colorClass="bg-[#f39c12]"
                    footerText="View Asset Details"
                    onViewClick={() => toggleModal('assets', true)}
                >
                    <div className="text-3xl font-bold">{dashboard?.assetcount || 0}</div>
                    <div className="text-xs text-muted-foreground">Assets Issued</div>
                </DashboardWidget>

                {/* 5. Purchase List */}
                <DashboardWidget
                    title="Purchase List"
                    icon={<ShoppingCart />}
                    colorClass="bg-[#ff851b]"
                    footerText="View Purchase History"
                    onViewClick={() => toggleModal('purchase', true)}
                >
                    <div className="text-3xl font-bold">{dashboard?.purchasecount || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Purchases</div>
                </DashboardWidget>

                {/* 6. Time Table */}
                <DashboardWidget
                    title="Time Table"
                    icon={<Clock />}
                    colorClass="bg-[#dd4b39]"
                    footerText="View Full Time Table"
                    onViewClick={() => toggleModal('timetable', true)}
                >
                    <div className="text-3xl font-bold">{dashboard?.tT_final_generation?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Classes Scheduled</div>
                </DashboardWidget>

                {/* 7. Student Count (Conditional) */}
                {isTeaching && (
                    <DashboardWidget
                        title="Student Count"
                        icon={<Users />}
                        colorClass="bg-[#00c0ef]"
                        footerText="View Student List"
                    >
                        <div className="text-3xl font-bold">{dashboard?.studentcount || 0}</div>
                        <div className="text-xs text-muted-foreground">Assigned Students</div>
                    </DashboardWidget>
                )}

                {/* 8. Book List */}
                <DashboardWidget
                    title="Book List"
                    icon={<Book />}
                    colorClass="bg-[#605ca8]"
                    footerText="View Library Books"
                    onViewClick={() => toggleModal('books', true)}
                >
                    <div className="text-3xl font-bold">{dashboard?.bookcount || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Books</div>
                </DashboardWidget>

                {/* 9. Medical PDF List */}
                <DashboardWidget
                    title="Medical Record"
                    icon={<FileText />}
                    colorClass="bg-[#001f3f]"
                    footerText="View Medical Records"
                    onViewClick={() => toggleModal('medical', true)}
                >
                    <div className="text-3xl font-bold">PDF</div>
                    <div className="text-xs text-muted-foreground">Click to View</div>
                </DashboardWidget>

            </div>

            {/* Modals */}
            <ProfileModal
                open={modals.profile}
                onOpenChange={(v) => toggleModal('profile', v)}
                empData={basicDetails}
                profileStatus={profileStatus}
            />

            <NoticeBoardModal
                open={modals.notice}
                onOpenChange={(v) => toggleModal('notice', v)}
                years={dashboard?.yearlist || []}
                initialYear={dashboard?.asmaY_Id || 0}
            />

            <EventsModal
                open={modals.events}
                onOpenChange={(v) => toggleModal('events', v)}
            />

            <AssetListModal
                open={modals.assets}
                onOpenChange={(v) => toggleModal('assets', v)}
            />

            <PurchaseListModal
                open={modals.purchase}
                onOpenChange={(v) => toggleModal('purchase', v)}
            />

            <BookListModal
                open={modals.books}
                onOpenChange={(v) => toggleModal('books', v)}
                books={dashboard?.booklist || []}
            />

            <MedicalRecordModal
                open={modals.medical}
                onOpenChange={(v) => toggleModal('medical', v)}
                empId={profileStatus?.hrmE_Id || basicDetails?.hrmE_Id || 0}
            />

            <TimeTableModal
                open={modals.timetable}
                onOpenChange={(v) => toggleModal('timetable', v)}
                timetable={dashboard?.tT_final_generation || []}
                days={dashboard?.allperiods || []}
            />

            <PhotoUploadModal
                open={modals.upload}
                onOpenChange={(v) => toggleModal('upload', v)}
                empId={profileStatus?.hrmE_Id || basicDetails?.hrmE_Id || 0}
            />

        </div>
    );
}
