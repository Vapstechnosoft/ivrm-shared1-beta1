"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSubjectsData, getExamDetails } from "../actions"; // Import actions
import { AcademicYear, Subject, ExamGrade, CumulativeSubjectLoadData } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CumulativeSubjectClientProps {
    initialData: CumulativeSubjectLoadData;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function CumulativeSubjectClient({ initialData }: CumulativeSubjectClientProps) {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("");

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>("");

    const [currentClass, setCurrentClass] = useState<string>("");
    const [currentSection, setCurrentSection] = useState<string>("");

    const [examData, setExamData] = useState<ExamGrade[]>([]);
    const [isLoadingExams, setIsLoadingExams] = useState(false);
    const [showExamData, setShowExamData] = useState(false);

    // Sorting state
    const [sortConfig, setSortConfig] = useState<{ key: keyof ExamGrade | null; direction: "asc" | "desc" }>({
        key: null,
        direction: "asc",
    });

    useEffect(() => {
        if (initialData && initialData.stuyearlist) {
            setAcademicYears(initialData.stuyearlist);
            // Default Class/Section from first item if available
            if (initialData.stuyearlist.length > 0) {
                setCurrentClass(initialData.stuyearlist[0].asmcL_ClassName);
                setCurrentSection(initialData.stuyearlist[0].asmC_SectionName);
            }
        }
    }, [initialData]);

    const handleYearChange = async (yearId: string) => {
        setSelectedYear(yearId);
        setSelectedSubject(""); // Reset subject
        setExamData([]);
        setShowExamData(false);

        // Update Class/Section based on selected year
        const selectedYearData = academicYears.find((y: any) => y.asmaY_Id.toString() === yearId) as any;
        if (selectedYearData) {
            setCurrentClass(selectedYearData.asmcL_ClassName);
            setCurrentSection(selectedYearData.asmC_SectionName);
        }

        try {
            const response = await getSubjectsData({ ASMAY_Id: parseInt(yearId) });
            if (response && response.subjectlist) {
                setSubjects(response.subjectlist);
            } else {
                setSubjects([]);
                toast.info("No subjects found for this academic year.");
            }
        } catch (error) {
            console.error(error);
            setSubjects([]);
        }
    };

    const handleSubjectChange = async (subjectId: string) => {
        setSelectedSubject(subjectId);
        if (!selectedYear) {
            toast.error("Please select an Academic Year first.");
            return;
        }

        setIsLoadingExams(true);
        setShowExamData(false);

        try {
            const response = await getExamDetails({ ASMAY_Id: parseInt(selectedYear), ISMS_Id: parseInt(subjectId) });

            if (response && response.examgradelist && response.examgradelist.length > 0) {
                setExamData(response.examgradelist);
                setShowExamData(true);
            } else {
                setExamData([]);
                toast.info("No exam details found.", { description: "Try selecting a different subject." });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch exam details.");
        } finally {
            setIsLoadingExams(false);
        }
    };

    const handleSort = (key: keyof ExamGrade) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...examData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === undefined || bVal === undefined) return 0;

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Chart Data Preparation
    const barChartData = sortedData.map(item => ({
        name: item.emE_ExamName,
        Max: item.estmpS_MaxMarks,
        Obtained: item.estmpS_ObtainedMarks,
        Percentage: ((item.estmpS_ObtainedMarks / item.estmpS_MaxMarks) * 100).toFixed(1)
    }));

    const pieChartData = sortedData.map(item => ({
        name: item.emE_ExamName,
        value: item.estmpS_ObtainedMarks
    }));

    return (
        <div className="space-y-6">
            <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                    <CardTitle className="text-xl font-bold uppercase text-primary">Cumulative Subject</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <Label>Academic Year <span className="text-red-500">*</span></Label>
                            <Select value={selectedYear} onValueChange={handleYearChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year) => (
                                        <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject <span className="text-red-500">*</span></Label>
                            <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={!selectedYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((sub) => (
                                        <SelectItem key={sub.ismS_Id} value={sub.ismS_Id.toString()}>
                                            {sub.ismS_SubjectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Class</Label>
                            <div className="font-semibold p-2 bg-slate-100 rounded-md border min-h-[40px] flex items-center">
                                {currentClass || "-"}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground">Section</Label>
                            <div className="font-semibold p-2 bg-slate-100 rounded-md border min-h-[40px] flex items-center">
                                {currentSection || "-"}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoadingExams && (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {showExamData && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Data Table */}
                    <Card>
                        <CardHeader className="bg-primary/5 py-3 border-b">
                            <CardTitle className="text-lg font-semibold text-slate-800">Exam Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => handleSort("emE_ExamName")}>Exam Name</TableHead>
                                        <TableHead className="cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort("estmpS_MaxMarks")}>Max Marks</TableHead>
                                        <TableHead className="cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort("estmpS_ObtainedMarks")}>Obtained Marks</TableHead>
                                        <TableHead className="cursor-pointer hover:bg-slate-100 text-center" onClick={() => handleSort("estmpS_ObtainedGrade")}>Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedData.map((row) => (
                                        <TableRow key={row.emE_Id} className="hover:bg-slate-50">
                                            <TableCell className="font-medium">{row.emE_ExamName}</TableCell>
                                            <TableCell className="text-center">{row.estmpS_MaxMarks}</TableCell>
                                            <TableCell className="text-center font-bold text-blue-600">{row.estmpS_ObtainedMarks}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-bold",
                                                    row.estmpS_ObtainedGrade.startsWith('A') || row.estmpS_ObtainedGrade === 'O' ? "bg-green-100 text-green-700" :
                                                        row.estmpS_ObtainedGrade.startsWith('F') ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {row.estmpS_ObtainedGrade}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <Card className="shadow-md">
                            <CardHeader className="border-b bg-red-50/50">
                                <CardTitle className="text-base text-red-800">Cumulative Subject Bar Graph</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="Max" fill="#8884d8" name="Max Marks" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Obtained" fill="#82ca9d" name="Obtained Marks" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Percentage" fill="#ffc658" name="Percentage (%)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Pie Chart (Simulating Line/Doughnut from legacy) */}
                        <Card className="shadow-md">
                            <CardHeader className="border-b bg-blue-50/50">
                                <CardTitle className="text-base text-blue-800">Subject Performance Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
