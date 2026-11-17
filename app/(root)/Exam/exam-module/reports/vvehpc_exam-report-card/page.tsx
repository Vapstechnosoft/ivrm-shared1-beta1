'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getExamReportCard, getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import type { IExamReportCard, IMasterInstitution, Institution, ISubject } from '@/types/exam/exam-module/report';
import { Printer } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import ProgressCardReportForm from './_components/add-form';
import ProgressCardReport from './_components/progress-card-report';

export default function ProgressCardReportPage() {
    const [reportData, setReportData] = useState<IExamReportCard[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [headerInfo, setHeaderInfo] = useState<any>({});
    const [examName, setExamName] = useState<string>('');
    const [examCode] = useState<string>('FA1');
    const [year, setYear] = useState<string>('');
    const [isReportVisible, setIsReportVisible] = useState(false);
    const [institution, setInstitution] = useState<IMasterInstitution | Institution | null>();
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isReportVisible && printRef.current) {
            printRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    })

    const handleReportSuccess = async (payload: any) => {
        try {
            console.log('Progress Card Report payload:', payload);
            const res = await getExamReportCard(payload);
            if (!res?.success || !Array.isArray(res?.data) || res.data.length === 0) {
                //toast.error('No records found');
                setIsReportVisible(false);
                //return;
            }
            console.log('progress card report api response', res);

            const flatRows: any[] = res.data;

            //const flatRows: any[] = generateStaticData();
            console.log('progress card report response Data', flatRows);

            const studentMap = new Map<number, IExamReportCard>();
            const subjectMap = new Map<number, ISubject>();

            flatRows.forEach((row) => {
                const studentId = row.amsT_Id;

                // Build unique subjects
                if (row.ismS_Id && !subjectMap.has(row.ismS_Id)) {
                    subjectMap.set(row.ismS_Id, {
                        ismS_Id: row.ismS_Id,
                        ismS_SubjectName: row.ismS_SubjectName,
                        eyceS_AplResultFlg: row.eyceS_AplResultFlg ?? true,
                        eyceS_MarksDisplayFlg: row.eyceS_MarksDisplayFlg ?? true,
                        eyceS_GradeDisplayFlg: row.eyceS_GradeDisplayFlg ?? true,
                        eyceS_SubjectOrder: row.eyceS_SubjectOrder ?? 999,
                        type: row.eyceS_GradeDisplayFlg ? 'Grade' : 'Marks'
                    });
                }

                // Initialize student
                if (!studentMap.has(studentId)) {
                    studentMap.set(studentId, {
                        amsT_Id: studentId,
                        amsT_FirstName: row.amsT_FirstName.trim(),
                        amsT_FatherName: row.amsT_FatherName || 'N/A',
                        amsT_DOB: row.amsT_DOB,
                        amaY_RollNo: row.amaY_RollNo,
                        amsT_AdmNo: row.amsT_AdmNo,
                        amsT_RegistrationNo: row.amsT_RegistrationNo,
                        sub_list: [],
                        estmP_TotalMaxMarks: row.estmP_TotalMaxMarks,
                        estmP_TotalObtMarks: row.estmP_TotalObtMarks,
                        estmP_Percentage: row.estmP_Percentage,
                        estmP_TotalGrade: row.estmP_TotalGrade,
                        estmP_Result: row.estmP_Result,
                        estmP_ClassRank: row.estmP_ClassRank,
                        estmP_SectionRank: row.estmP_SectionRank,
                        classheld: row.asA_ClassHeld,
                        classatt: row.asA_Class_Attended,
                        estmP_TotalGradeRemark: row.emgD_Remarks || row.estmP_TotalGradeRemark || 'Good'
                    });
                }

                // Only add subjects with actual marks
                if (row.ismS_Id && row.estmpS_MaxMarks > 0) {
                    studentMap.get(studentId)!.sub_list.push({
                        ismS_Id: row.ismS_Id,
                        estmpS_MaxMarks: row.estmpS_MaxMarks,
                        estmpS_ObtainedMarks: row.estmpS_ObtainedMarks ?? null,
                        estmpS_ObtainedGrade: row.estmpS_ObtainedGrade || '-',
                        estmpS_PassFailFlg: row.estmpS_PassFailFlg
                    });
                }
            });

            // Filter subjects that actually have marks
            const validSubjectIds = new Set(Array.from(studentMap.values()).flatMap((s) => s.sub_list.map((m) => m.ismS_Id)));

            const filteredSubjects = Array.from(subjectMap.values())
                .filter((s) => validSubjectIds.has(s.ismS_Id))
                .sort((a, b) => (a.eyceS_SubjectOrder ?? 999) - (b.eyceS_SubjectOrder ?? 999));

            const firstRow = flatRows[0];

            setSubjects(filteredSubjects);
            setReportData(Array.from(studentMap.values()));
            const safeReportData = Array.from(studentMap.values());
            console.log('reportData', safeReportData);
            console.log(reportData);
            setHeaderInfo({
                cla: firstRow.asmcL_ClassName,
                sec: firstRow.asmC_SectionName
            });
            setExamName(firstRow.emE_ExamName || 'Progress Card');
            setYear(firstRow.asmaY_Year || new Date().getFullYear().toString());
            setIsReportVisible(true);
            toast.success(`${studentMap.size} progress card(s) generated successfully!`);
        } catch (e: any) {
            console.error(e);
            toast.error(e?.message || 'Error generating report');
            setIsReportVisible(false);
        }
    };

    // 🔥 STATIC MOCK DATA (100 Students × 5 Subjects)
    const generateStaticData = () => {
        const subjects = [
            { id: 101, name: "Mathematics", order: 1 },
            { id: 102, name: "Science", order: 2 },
            { id: 103, name: "English", order: 3 },
            { id: 104, name: "Social", order: 4 },
            { id: 105, name: "Computer", order: 5 }
        ];

        const rows: any[] = [];

        for (let i = 1; i <= 100; i++) {
            const totalMax = subjects.length * 100;
            let totalObt = 0;

            subjects.forEach((sub) => {
                const marks = Math.floor(Math.random() * 60) + 40; // 40–100
                totalObt += marks;

                rows.push({
                    // Student Info
                    amsT_Id: 15000 + i,
                    amsT_FirstName: `Student ${i}`,
                    amsT_FatherName: `Father ${i}`,
                    amsT_DOB: "2016-01-01T00:00:00",
                    amaY_RollNo: i,
                    amsT_AdmNo: `ADM${i}`,
                    amsT_RegistrationNo: `REG${i}`,

                    // Class Info
                    asmcL_ClassName: "ClassnRhd",
                    asmC_SectionName: "AAAA",
                    emE_ExamName: "Vaps Exam1(Raju)",
                    asmaY_Year: "2025",

                    // Subject Info
                    ismS_Id: sub.id,
                    ismS_SubjectName: sub.name,
                    eyceS_AplResultFlg: true,
                    eyceS_MarksDisplayFlg: true,
                    eyceS_GradeDisplayFlg: false,
                    eyceS_SubjectOrder: sub.order,

                    // Marks
                    estmpS_MaxMarks: 100,
                    estmpS_ObtainedMarks: marks,
                    estmpS_ObtainedGrade: "",
                    estmpS_PassFailFlg: marks >= 35,

                    // Totals
                    estmP_TotalMaxMarks: totalMax,
                    estmP_TotalObtMarks: 0, // temp
                    estmP_Percentage: 0,
                    estmP_TotalGrade: "",
                    estmP_Result: "",
                    estmP_ClassRank: i,
                    estmP_SectionRank: i,
                    asA_ClassHeld: 46,
                    asA_Class_Attended: 44,
                    emgD_Remarks: "Good"
                });
            });

            // Update totals for this student
            const percentage = Math.round((totalObt / totalMax) * 100);
            const grade =
                percentage >= 90 ? "A+" :
                    percentage >= 75 ? "A" :
                        percentage >= 60 ? "B" :
                            percentage >= 50 ? "C" : "D";

            rows
                .filter(r => r.amsT_Id === 15000 + i)
                .forEach(r => {
                    r.estmP_TotalObtMarks = totalObt;
                    r.estmP_Percentage = percentage;
                    r.estmP_TotalGrade = grade;
                    r.estmP_Result = percentage >= 35 ? "Pass" : "Fail";
                });
        }

        return rows;
    };

    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const institution_res = await getMasterInstitution();
                const { data: institution_data } = institution_res;
                setInstitution(institution_data);
            } catch (error) {
                console.error("Error fetching institution:", error);
            }
        };

        fetchInstitution();
    }, []);




    const handlePrint = () => window.print();

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <CollapsibleSection title='Progress Card Report' defaultOpen>
                <ProgressCardReportForm onSuccess={handleReportSuccess} />
            </CollapsibleSection>

            {isReportVisible && (
                <CollapsibleSection title='Progress Cards Report' defaultOpen>
                    <ProgressCardReport
                        reportData={reportData}
                        institution={institution}
                        subjects={subjects}
                        headerInfo={headerInfo}
                        examName={examName}
                        examCode={examCode}
                        year={year}
                        onPrint={handlePrint}
                    />
                </CollapsibleSection>
            )}
        </div>
    );
}
