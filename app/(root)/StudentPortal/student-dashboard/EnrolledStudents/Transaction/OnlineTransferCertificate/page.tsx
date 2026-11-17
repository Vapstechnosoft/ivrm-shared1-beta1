'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import TransferCertificateForm from './_components/transfer-certificate-form';
import TransferCertificateList from './_components/transfer-certificate-list';
import TransferCertificateApproval from './_components/transfer-certificate-approval';
import {
    getTransferCertificateDetails,
    deactivateTransferCertificate,
    approveTransferCertificate,
    rejectTransferCertificate
} from './actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function OnlineTransferCertificatePage() {
    const { data: session, status } = useSession();
    const [view, setView] = useState<'list' | 'form'>('list');
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = session?.role?.toUpperCase() === 'ADMIN';

    const loadData = async () => {
        setIsLoading(true);
        try {
            const result = await getTransferCertificateDetails({});
            if (result && result.transferCertificateData) {
                setData(result.transferCertificateData as any[]);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load transfer certificates");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status !== 'loading') {
            loadData();
        }
    }, [status]);

    const handleApplyClick = () => {
        setView('form');
    };

    const handleFormClose = () => {
        setView('list');
    };

    const handleFormSuccess = () => {
        setView('list');
        loadData();
    };

    // Student Actions
    const handleEdit = (id: number) => {
        console.log("Edit", id);
        toast.info("Edit functionality not yet fully implemented");
    };

    const handleDeactivate = async (id: number) => {
        if (confirm("Are you sure you want to delete/deactivate this application?")) {
            try {
                const result = await deactivateTransferCertificate({ ASTC_Id: id });
                if (result && result.returnval === true) {
                    toast.success("Application deactivated successfully");
                    loadData();
                } else {
                    toast.error(result?.message || "Failed to deactivate");
                }
            } catch (error) {
                toast.error("An unexpected error occurred");
            }
        }
    };

    // Admin Actions
    const handleApprove = async (id: number) => {
        if (confirm("Are you sure you want to approve this application?")) {
            try {
                const result = await approveTransferCertificate({ ASTC_Id: id });
                if (result && result.returnval === true) {
                    toast.success("Approved successfully");
                    loadData();
                } else {
                    toast.error(result?.message || "Failed to approve");
                }
            } catch (error) {
                toast.error("An unexpected error occurred");
            }
        }
    };

    const handleReject = async (id: number) => {
        if (confirm("Are you sure you want to reject this application?")) {
            try {
                const result = await rejectTransferCertificate({ ASTC_Id: id });
                if (result && result.returnval === true) {
                    toast.success("Rejected successfully");
                    loadData();
                } else {
                    toast.error(result?.message || "Failed to reject");
                }
            } catch (error) {
                toast.error("An unexpected error occurred");
            }
        }
    };

    if (status === 'loading' || isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (isAdmin) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transfer Certificate Approvals</h2>
                    <p className="text-muted-foreground">Manage student TC requests.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransferCertificateApproval
                            data={data}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Student View
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Online Transfer Certificate</h2>
                    <p className="text-muted-foreground">Manage your transfer certificate applications.</p>
                </div>
                {view === 'list' && (
                    <Button onClick={handleApplyClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Apply for TC
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{view === 'list' ? 'Application History' : 'New Application'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {view === 'list' ? (
                        <TransferCertificateList
                            data={data}
                            onEdit={handleEdit}
                            onDeactivate={handleDeactivate}
                        />
                    ) : (
                        <TransferCertificateForm
                            onClose={handleFormClose}
                            onSuccess={handleFormSuccess}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
