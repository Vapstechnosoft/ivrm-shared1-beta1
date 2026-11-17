'use client';

import { CollapsibleSection } from "@/components/ui/form/collapsible-section";
import { useEffect, useState, useCallback } from "react";
import AlumniList from "./_components/alumni-list";
import StudentMatchList from "./_components/student-match-list";
import { approveClgAlumniData, checkStudentAlumni, getAcademicYear, searchFilterClgAlumni } from "@/server/alumni/clg-alumni-approval";
import { IClgAlumniApprovalDetails, IStudentMatchDetails } from "@/types/alumni/clg-alumni-approval";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ClgAlumniApprovalPage() {
    const [alumniData, setAlumniData] = useState<IClgAlumniApprovalDetails[]>([]);
    const [matchingStudents, setMatchingStudents] = useState<IStudentMatchDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAlumniId, setSelectedAlumniId] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAcademicYear();
            if (res.success && res.data) {
                const records = Array.isArray(res.data) ? res.data : (res.data.retObject || res.data.data || []);
                setAlumniData(records);
            } else {
                toast.error(res.message || "Failed to load alumni details");
            }
        } catch (error) {
            toast.error("An error occurred while loading data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilter = async (query: string) => {
        setSearchQuery(query);
        if (!query) {
            loadData();
            return;
        }
        setIsFiltering(true);
        try {
            const res = await searchFilterClgAlumni({ searchfilter: query, ASMAY_Id: 0 });
            if (res.success && res.data) {
                const records = Array.isArray(res.data) ? res.data : (res.data.retObject || res.data.data || []);
                setAlumniData(records);
            } else {
                toast.error(res.message || "Filter failed");
            }
        } catch (error) {
            toast.error("An error occurred while filtering");
        } finally {
            setIsFiltering(false);
        }
    };

    const handleSearch = async (alcsregId: number, membername: string) => {
        setIsSearching(true);
        setSelectedAlumniId(alcsregId);
        setMatchingStudents([]); // Clear previous results
        try {
            const res = await checkStudentAlumni({ ALCSREG_Id: alcsregId, membername });
            if (res.success && res.data) {
                const results = Array.isArray(res.data) ? res.data : (res.data.studentDetails || []);
                if (results.length > 0) {
                    setMatchingStudents(results);
                } else {
                    toast.info("No matching student records found.");
                }
            } else {
                toast.error(res.message || "Failed to search students");
            }
        } catch (error) {
            toast.error("An error occurred while searching");
        } finally {
            setIsSearching(false);
        }
    };

    const handleApprove = async (alcmstId: number) => {
        if (!selectedAlumniId) {
            toast.error("No alumni member selected for approval.");
            return;
        }
        try {
            const res = await approveClgAlumniData({ ALCSREG_Id: selectedAlumniId, ALCMST_Id: alcmstId });
            if (res.success || (res.data && (res.data.success || res.data.returnval === "True" || res.data.message?.includes("successfully")))) {
                toast.success(res.data?.message || res.message || "Alumni member successfully approved!");
                setMatchingStudents([]);
                loadData();
            } else {
                toast.error(res.message || "Failed to approve alumni");
            }
        } catch (error: any) {
            console.error("Approval Exception:", error);
            const msg = error?.message || (typeof error === 'string' ? error : "An error occurred during approval");
            toast.error(msg);
        }
    };

    const handleCancel = () => {
        window.location.reload();
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container space-y-6 p-4 min-h-screen">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">College Alumni Approval</h2>
            </div>

            <CollapsibleSection title="Pending Alumni Verification" defaultOpen={true} variant="default">
                <AlumniList
                    data={alumniData}
                    onSearch={handleSearch}
                    onCancel={handleCancel}
                    onFilter={handleFilter}
                    isFiltering={isFiltering}
                />
            </CollapsibleSection>

            {(isSearching || matchingStudents.length > 0) && (
                <CollapsibleSection title="Student Match Results" defaultOpen={true} variant="outline">
                    {isSearching ? (
                        <div className="flex flex-col items-center justify-center p-12 space-y-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-muted-foreground animate-pulse">Searching for matching student records...</p>
                        </div>
                    ) : (
                        <StudentMatchList
                            data={matchingStudents}
                            onApprove={handleApprove}
                            onCancel={handleCancel}
                        />
                    )}
                </CollapsibleSection>
            )}
        </div>
    );
}
