'use client';

import { CollapsibleSection } from "@/components/ui/form/collapsible-section";
import { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/extension/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import SearchCriteriaBuilder from "./_components/search-criteria-builder";
import SearchResultsTable from "./_components/search-results-table";
import {
    getAcademicYear,
    getBranchesByCourse,
    getClgAlumniStudentSearchData,
    getClgAlumniStudentSemData,
    getCoursesByYear,
    getSemestersByBranch
} from "@/server/alumni/clg-alumni-student-search";
import {
    IAcademicYear,
    ICourse,
    IBranch,
    ISemester,
    ICourseCategory,
    IAlumniSearchCriteriaRow,
    IAlumniSearchResult,
    IClgAlumniStudentSearchPayload
} from "@/types/alumni/clg-alumni-student-search";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

export default function ClgAlumniStudentSearchPage() {
    // Dropdown Data
    const [years, setYears] = useState<IAcademicYear[]>([]);
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [semesters, setSemesters] = useState<ISemester[]>([]);

    const [categories, setCategories] = useState<ICourseCategory[]>([]);

    // Selected Values
    const [asmaY_Id, setAsmaY_Id] = useState<string>("");
    const [amcoC_Id, setAmcoC_Id] = useState<string>("UG");
    const [acayC_Id, setAcayC_Id] = useState<string>(""); // Course ID (Unique)
    const [acaycB_Id, setAcaycB_Id] = useState<string>(""); // Branch ID (Unique)
    const [amsE_Id, setAmsE_Id] = useState<string>("");

    // Results and UI State
    const [results, setResults] = useState<IAlumniSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getAcademicYear();
            if (res.success && res.data) {
                if (res.data.fillyear) setYears(res.data.fillyear);
                if (res.data.studentCategory) {
                    setCategories(res.data.studentCategory);
                    // Sync amcoC_Id if UG is not in categories but others are
                    const hasUG = res.data.studentCategory.some((c: any) => c.amcoC_Name === "UG");
                    if (!hasUG && res.data.studentCategory.length > 0) {
                        setAmcoC_Id(res.data.studentCategory[0].amcoC_Name);
                    }
                }
            } else {
                toast.error("Failed to load academic years");
            }

        } catch (error) {
            toast.error("Failed to load search page data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCategoryChange = (val: string) => {
        setAmcoC_Id(val);
        setAcayC_Id("");
        setAcaycB_Id("");
        setAmsE_Id("");
        setCourses([]);
        setBranches([]);
        setSemesters([]);
        if (asmaY_Id) {
            handleYearChange(asmaY_Id, val);
        }
    };

    const handleYearChange = async (yearId: string, statusType?: string) => {
        const currentAsmaY_Id = yearId;
        const currentStatusType = statusType || amcoC_Id;

        setAsmaY_Id(currentAsmaY_Id);
        setAcayC_Id("");
        setAcaycB_Id("");
        setAmsE_Id("");
        setCourses([]);
        setBranches([]);
        setSemesters([]);
        try {
            const res = await getCoursesByYear({ ASMAY_Id: Number(currentAsmaY_Id), status_type: currentStatusType });
            if (res.success && res.data && Array.isArray(res.data)) {
                setCourses(res.data.map((c: any) => ({
                    amcO_Id: c.amcO_Id,
                    courseName: c.courseName,
                    acayC_Id: c.acayC_Id // Added unique ID
                })));
            }
        } catch (error) {
            toast.error("Failed to fetch courses");
        }
    };

    const handleCourseChange = async (val: string) => {
        setAcayC_Id(val);
        setAcaycB_Id("");
        setAmsE_Id("");
        setBranches([]);
        setSemesters([]);

        const courseItem = courses.find(c => String(c.acayC_Id) === val);
        if (!courseItem) return;

        try {
            const res = await getBranchesByCourse({ AMCO_Id: courseItem.amcO_Id, ASMAY_Id: Number(asmaY_Id) });
            if (res.success && res.data) {
                if (res.data.branch && Array.isArray(res.data.branch)) {
                    setBranches(res.data.branch.map((b: any) => ({
                        amB_Id: b.amB_Id,
                        branchName: b.branchName,
                        acaycB_Id: b.acaycB_Id
                    })));
                }
                if (res.data.studentCategory && Array.isArray(res.data.studentCategory)) {
                    setCategories(res.data.studentCategory);
                }
            }
        } catch (error) {
            toast.error("Failed to fetch branches");
        }
    };

    const handleBranchChange = async (val: string) => {
        setAcaycB_Id(val);
        setAmsE_Id("");
        setSemesters([]);
        const branchItem = branches.find(b => String(b.acaycB_Id) === val);
        if (branchItem) {
            try {
                const res = await getSemestersByBranch({
                    AMB_Id: branchItem.amB_Id,
                    ASMAY_Id: Number(asmaY_Id),
                    ACAYCB_Id: branchItem.acaycB_Id || 0
                });
                if (res.success && res.data && res.data.semester && Array.isArray(res.data.semester)) {
                    setSemesters(res.data.semester.map((s: any) => ({
                        amsE_Id: s.amsE_Id,
                        semesterName: s.semesterName,
                        acaycbS_Id: s.acaycbS_Id
                    })));
                }
            } catch (error) {
                toast.error("Failed to fetch semesters");
            }
        }
    };

    const handleSearch = async (criteria: IAlumniSearchCriteriaRow[]) => {
        if (!asmaY_Id || !acayC_Id || !acaycB_Id || !amsE_Id) {
            toast.warning("Please select Year, Course, Branch, and Semester first.");
            return;
        }

        const courseItem = courses.find(c => String(c.acayC_Id) === acayC_Id);
        const branchItem = branches.find(b => String(b.acaycB_Id) === acaycB_Id);

        if (!courseItem || !branchItem) return;

        setIsSearching(true);
        try {
            // Use getClgAlumniStudentSearchData if criteria exist, otherwise use getClgAlumniStudentSemData
            let res;
            if (criteria.length > 0) {
                const payload: IClgAlumniStudentSearchPayload = {
                    condition: criteria.map(c => c.condition || "And"),
                    field: criteria.map(c => c.field),
                    operator: criteria.map(c => c.operator),
                    value: criteria.map(c => c.value),
                    asmaY_Id: Number(asmaY_Id),
                    amcO_Id: courseItem.amcO_Id,
                    amB_Id: branchItem.amB_Id,
                    amsE_Id: Number(amsE_Id)
                };
                res = await getClgAlumniStudentSearchData(payload);
            } else {
                res = await getClgAlumniStudentSemData({
                    ASMAY_Id: Number(asmaY_Id),
                    AMCO_Id: courseItem.amcO_Id,
                    AMB_Id: branchItem.amB_Id,
                    AMSE_Id: Number(amsE_Id),
                    ACAYCB_Id: branchItem.acaycB_Id || 0
                });
            }

            if (res.success && res.data) {
                setResults(res.data || []);
                if ((res.data || []).length === 0) {
                    toast.info("No records match your criteria.");
                }
            } else {
                toast.error(res.message || "Search failed");
            }
        } catch (error) {
            toast.error("An error occurred during search");
        } finally {
            setIsSearching(false);
        }
    };

    const handleExportToExcel = (selectedData: IAlumniSearchResult[]) => {
        const worksheet = XLSX.utils.json_to_sheet(selectedData.map((item, index) => ({
            "SLNO": index + 1,
            "Student Name": `${item.firstname} ${item.middlename || ""} ${item.lastname || ""}`,
            "Adm No": item.admno,
            "Course": item.coursename,
            "Branch": item.branchname,
            "Sem": item.semname,
            "DOB": item.dob ? format(new Date(item.dob), 'dd-MM-yyyy') : 'N/A',
            "Sex": item.sex,
            "Mother Name": item.mothername,
            "Father Name": item.fathername,
            "Email": item.emailid,
            "Mobile No": item.mobileno
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "AlumniSearch");
        XLSX.writeFile(workbook, "Alumni_Search_Results.xlsx");
    };

    const handleClear = () => {
        setResults([]);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse text-sm">Loading search preferences...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container space-y-8 p-6 min-h-screen max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-inner">
                        <SearchIcon className="h-7 w-7" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Alumni Student Search
                    </h2>
                </div>
                <p className="text-muted-foreground text-sm ml-14">
                    Query your alumni database with flexible, multi-dimensional filters.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <CollapsibleSection title="Primary Identification" defaultOpen={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course Category <span className="text-destructive">*</span></Label>
                            <Select value={amcoC_Id} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20 transition-shadow">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length > 0 ? (
                                        categories.map(c => (
                                            <SelectItem key={c.amcoC_Id} value={c.amcoC_Name}>{c.amcoC_Name}</SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="UG">UG</SelectItem>
                                            <SelectItem value="PG">PG</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Year <span className="text-destructive">*</span></Label>
                            <Select value={asmaY_Id} onValueChange={handleYearChange}>
                                <SelectTrigger className="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20 transition-shadow">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(y => (
                                        <SelectItem key={y.asmaY_Id} value={String(y.asmaY_Id)}>{y.asmaY_Year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course <span className="text-destructive">*</span></Label>
                            <Select value={acayC_Id} onValueChange={handleCourseChange} disabled={!asmaY_Id}>
                                <SelectTrigger className="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20 transition-shadow">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => (
                                        <SelectItem key={c.acayC_Id} value={String(c.acayC_Id)}>{c.courseName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch <span className="text-destructive">*</span></Label>
                            <Select value={acaycB_Id} onValueChange={handleBranchChange} disabled={!acayC_Id}>
                                <SelectTrigger className="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20 transition-shadow">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map(b => (
                                        <SelectItem key={b.acaycB_Id} value={String(b.acaycB_Id)}>{b.branchName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Semester <span className="text-destructive">*</span></Label>
                            <Select value={amsE_Id} onValueChange={setAmsE_Id} disabled={!acaycB_Id}>
                                <SelectTrigger className="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20 transition-shadow">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesters.map(s => (
                                        <SelectItem key={s.amsE_Id} value={String(s.amsE_Id)}>{s.semesterName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Advanced Search Criteria" defaultOpen={true} variant="outline">
                    <div className="p-2">
                        <SearchCriteriaBuilder onSearch={handleSearch} onClear={handleClear} />
                    </div>
                </CollapsibleSection>

                {(isSearching || results.length > 0) && (
                    <CollapsibleSection title="Discovery Results" defaultOpen={true} variant="outline">
                        {isSearching ? (
                            <div className="flex flex-col items-center justify-center p-20 space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                    <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                                </div>
                                <p className="text-muted-foreground font-medium animate-pulse tracking-wide">Crunching database records...</p>
                            </div>
                        ) : (
                            <SearchResultsTable data={results} onExport={handleExportToExcel} />
                        )}
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
