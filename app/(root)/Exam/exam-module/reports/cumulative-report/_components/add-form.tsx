"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { CustomMultiSelectBox } from "@/components/ui/custom-multiselect";
import { FormError, Label } from "@/components/ui/extension/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAcademicYearDropdown } from "@/hooks/fees/useMasters";
import { cumulativereportSchema } from "@/schemas/exam/exam-module/reports";
import {
    getClassDropDownByAcademicYearlist,
    getExamsDropDownByAcademicYearandClassandSectionlist,
    getSectionsDropDownByAcademicYearandClasslist,
    getStudentsDropDownByAcademicYearandClassandSectionlist,
} from "@/server/exam/exam-module/reports/cumulative-report";
import type { ApiSearchparams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";


type FormFields = z.infer<typeof cumulativereportSchema.addOrUpdate> & {
    Left_Flag: boolean;
    Deactive_Flag: boolean;
    classrank: boolean;
    sectionrank: boolean;
    attendancedispaly: boolean;
    page_size: number;
};

export default function CumulativeReportForm({
    onSuccess,
    apiSearchParams,
    isGenerating = false,
}: {
    onSuccess?: (payload: any, apiSearchParams?: ApiSearchparams) => void;
    apiSearchParams: ApiSearchparams;
    isGenerating?: boolean;
}) {
    const methods = useForm<FormFields>({
        resolver: zodResolver(cumulativereportSchema.addOrUpdate),
        mode: "all",
        defaultValues: {
            // mI_Id: 30,
            asmaY_Id: 0,
            asmcL_Id: 0,
            asmS_Id: 0,
            emE_Id: 0,
            studentList: [],
            Left_Flag: false,
            Deactive_Flag: false,
            applicableFlag: true,
            nonApplicableFlag: false,
            classrank: false,
            sectionrank: false,
            attendancedispaly: false,
            page_size: 10,
        },
    });

    const { control, handleSubmit, reset, setValue, formState } = methods;
    const { isSubmitting } = formState;

    // Dropdown states
    const [academicYears, setAcademicYears] = useState<
        { asmaY_Id: number; asmaY_Year: string }[]
    >([]);
    const [classes, setClasses] = useState<
        { asmcL_Id: number; asmcL_ClassName: string }[]
    >([]);
    const [sections, setSections] = useState<
        { asmS_Id: number; asmC_SectionName: string }[]
    >([]);
    const [exams, setExams] = useState<
        { emE_Id: number; emE_ExamName: string }[]
    >([]);
    const [students, setStudents] = useState<
        { amsT_AdmNo: string; amsT_Id: number; studentName?: string | null }[]
    >([]);
    const [allStudentsSelected, setAllStudentsSelected] = useState(false);

    const [loadingClasses, setLoadingClasses] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const {
        data: academicData,
        error: academicError,
        isLoading: academicYearLoading,
    } = useAcademicYearDropdown();

    const selectedYear = useWatch({ control, name: "asmaY_Id" });
    const selectedClass = useWatch({ control, name: "asmcL_Id" });
    const selectedSection = useWatch({ control, name: "asmS_Id" });
    const studentList = useWatch({ control, name: "studentList" });

    const hasStudentsSelected =
        Array.isArray(studentList) && studentList.length > 0;

    // ---------- Load Academic Years ----------
    useEffect(() => {
        if (academicError) {
            toast.error(academicError.message || "Error loading academic years");
            setAcademicYears([]);
        } else if (academicData?.data) {
            const formatted = academicData.data.map((i: any) => ({
                asmaY_Id: i.asmaY_Id ?? 0,
                asmaY_Year: i.asmaY_Year ?? "",
            }));
            setAcademicYears(formatted);
        }
    }, [academicData, academicError]);

    // ---------- Load Classes ----------
    useEffect(() => {
        if (!selectedYear) return;
        (async () => {
            try {
                setLoadingClasses(true);
                const { data } = await getClassDropDownByAcademicYearlist(selectedYear);
                setClasses(Array.isArray(data) ? data : []);
                setValue("asmcL_Id", 0);
                setValue("asmS_Id", 0);
                setValue("emE_Id", 0);
                setValue("studentList", []);
                setAllStudentsSelected(false);
            } catch {
                toast.error("Failed to load classes");
            } finally {
                setLoadingClasses(false);
            }
        })();
    }, [selectedYear, setValue]);

    // ---------- Load Sections ----------
    useEffect(() => {
        if (!selectedYear || !selectedClass) return;
        (async () => {
            try {
                setLoadingSections(true);
                const { data } = await getSectionsDropDownByAcademicYearandClasslist(
                    selectedYear,
                    selectedClass,
                );
                setSections(Array.isArray(data) ? data : []);
                setValue("asmS_Id", 0);
                setValue("emE_Id", 0);
                setValue("studentList", []);
                setAllStudentsSelected(false);
            } catch {
                toast.error("Failed to load sections");
            } finally {
                setLoadingSections(false);
            }
        })();
    }, [selectedYear, selectedClass, setValue]);

    // ---------- Load Exams ----------
    useEffect(() => {
        if (!selectedYear || !selectedClass || !selectedSection) return;
        (async () => {
            try {
                setLoadingExams(true);
                const { data } =
                    await getExamsDropDownByAcademicYearandClassandSectionlist(
                        selectedYear,
                        selectedClass,
                        selectedSection,
                    );
                setExams(Array.isArray(data) ? data : []);
                setValue("emE_Id", 0);
            } catch {
                toast.error("Failed to load exams");
            } finally {
                setLoadingExams(false);
            }
        })();
    }, [selectedYear, selectedClass, selectedSection, setValue]);

    // ---------- Load Students ----------
    useEffect(() => {
        if (!selectedYear || !selectedClass || !selectedSection) return;
        (async () => {
            try {
                setLoadingStudents(true);
                const { data } =
                    await getStudentsDropDownByAcademicYearandClassandSectionlist(
                        selectedYear,
                        selectedClass,
                        selectedSection,
                    );
                const valid = Array.isArray(data)
                    ? data
                        .filter((s) => !!s?.amsT_Id)
                        .map((s: any) => ({
                            amsT_Id: s.amsT_Id,
                            studentName: s.studentName || s.amsT_FirstName || "Unknown",
                            amsT_AdmNo: String(s.amsT_AdmNo || "N/A"),
                        }))
                    : [];
                setStudents(valid);
                setValue("studentList", []);
                setAllStudentsSelected(false);
            } catch {
                toast.error("Failed to load students");
            } finally {
                setLoadingStudents(false);
            }
        })();
    }, [selectedYear, selectedClass, selectedSection, setValue]);

    // ---------- Submit ----------
    const onSubmit = async (data: FormFields) => {
        if (!hasStudentsSelected) {
            toast.error("Please select at least one student");
            return;
        }

        const payload = {
            // mI_Id: 30, // <-- hard-coded as required
            asmaY_Id: data.asmaY_Id,
            asmcL_Id: data.asmcL_Id,
            asmS_Id: data.asmS_Id,
            emE_Id: data.emE_Id,
            amsT_Ids: data.studentList.map((s) => s.amsT_Id).join(","),
            Left_Flag: data.Left_Flag,
            Deactive_Flag: data.Deactive_Flag,
            applicableFlag: data.applicableFlag === true ? "1" : "0",
            nonApplicableFlag: data.nonApplicableFlag === true ? "1" : "0",
            classrank: data.classrank,
            sectionrank: data.sectionrank,
            attendancedispaly: data.attendancedispaly,
            //page_size: data.page_size
        };
        console.log("cumulative_report_payload", payload);
        onSuccess?.(payload, apiSearchParams || { page: 1, page_size: 10 });
        //
    };

    // ---------- Student helpers ----------
    const handleAllStudents = (checked: boolean) => {
        if (checked && students.length) {
            setValue("studentList", [...students], { shouldValidate: true });
            setAllStudentsSelected(true);
        } else {
            setValue("studentList", [], { shouldValidate: true });
            setAllStudentsSelected(false);
        }
    };

    const handleStudentChange = (selectedValues: string[]) => {
        const selected = students.filter((s) =>
            selectedValues.includes(s.amsT_Id.toString()),
        );
        setValue("studentList", selected, { shouldValidate: true });
        setAllStudentsSelected(
            selected.length === students.length && students.length > 0,
        );
    };

    // ---------- UI ----------
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <CollapsibleContent className="p-6">
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                        noValidate
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* LEFT – Dropdowns */}
                            <div className="space-y-6">
                                {/* Academic Year */}
                                <Controller
                                    control={control}
                                    name="asmaY_Id"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Label className="font-medium text-sm sm:w-32">
                                                Academic Year <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex-1">
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Academic Year" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicYearLoading ? (
                                                            <SelectItem value="0" disabled>
                                                                Academic Years are loading...
                                                            </SelectItem>
                                                        ) : academicYears.length === 0 ? (
                                                            <SelectItem value="0" disabled>
                                                                No Academic Years found
                                                            </SelectItem>
                                                        ) : (
                                                            academicYears.map((y) => (
                                                                <SelectItem
                                                                    key={y.asmaY_Id}
                                                                    value={String(y.asmaY_Id)}
                                                                >
                                                                    {y.asmaY_Year}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && (
                                                    <FormError>{fieldState.error.message}</FormError>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Class */}
                                <Controller
                                    control={control}
                                    name="asmcL_Id"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Label className="font-medium text-sm sm:w-32">
                                                Class <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex-1">
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingClasses ? (
                                                            <SelectItem value="0" disabled>
                                                                Classes are loading...
                                                            </SelectItem>
                                                        ) : classes.length === 0 ? (
                                                            <SelectItem value="0" disabled>
                                                                No Classes found
                                                            </SelectItem>
                                                        ) : (
                                                            classes.map((c) => (
                                                                <SelectItem
                                                                    key={c.asmcL_Id}
                                                                    value={String(c.asmcL_Id)}
                                                                >
                                                                    {c.asmcL_ClassName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && (
                                                    <FormError>{fieldState.error.message}</FormError>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Section */}
                                <Controller
                                    control={control}
                                    name="asmS_Id"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Label className="font-medium text-sm sm:w-32">
                                                Section <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex-1">
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Section" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingSections ? (
                                                            <SelectItem value="0" disabled>
                                                                Sections are loading...
                                                            </SelectItem>
                                                        ) : sections.length === 0 ? (
                                                            <SelectItem value="0" disabled>
                                                                No Sections found
                                                            </SelectItem>
                                                        ) : (
                                                            sections.map((s) => (
                                                                <SelectItem
                                                                    key={s.asmS_Id}
                                                                    value={String(s.asmS_Id)}
                                                                >
                                                                    {s.asmC_SectionName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && (
                                                    <FormError>{fieldState.error.message}</FormError>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />

                                {/* Exam */}
                                <Controller
                                    control={control}
                                    name="emE_Id"
                                    render={({ field, fieldState }) => (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Label className="font-medium text-sm sm:w-32">
                                                Exam Name <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex-1">
                                                <Select
                                                    key={field.value}
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Exam" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingExams ? (
                                                            <SelectItem value="0" disabled>
                                                                Exams are loading...
                                                            </SelectItem>
                                                        ) : exams.length === 0 ? (
                                                            <SelectItem value="0" disabled>
                                                                No Exams found
                                                            </SelectItem>
                                                        ) : (
                                                            exams.map((e) => (
                                                                <SelectItem
                                                                    key={e.emE_Id}
                                                                    value={String(e.emE_Id)}
                                                                >
                                                                    {e.emE_ExamName}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && (
                                                    <FormError>{fieldState.error.message}</FormError>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* RIGHT – Student Multi-Select */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                                    <Label className="flex items-center gap-2 font-medium text-sm sm:w-32">
                                        <Checkbox
                                            checked={allStudentsSelected}
                                            onCheckedChange={handleAllStudents}
                                        />
                                        Student <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex-1">
                                        <Controller
                                            control={control}
                                            name="studentList"
                                            render={({ field, fieldState }) => (
                                                <CustomMultiSelectBox
                                                    options={students.map((s) => ({
                                                        label:
                                                            `${s.studentName?.trim() || "Unknown"} - ${s.amsT_AdmNo || "N/A"}`.trim(),
                                                        value: s.amsT_Id.toString(),
                                                    }))}
                                                    onChange={handleStudentChange}
                                                    value={
                                                        field.value?.map((s: any) =>
                                                            s.amsT_Id.toString(),
                                                        ) ?? []
                                                    }
                                                    placeholder="Select Students"
                                                    height="200px"
                                                    isSearchRequired
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flags */}
                        {/* ALL CHECKBOXES FROM ORIGINAL HTML */}
                        <div className="mt-8 space-y-4">
                            <div className="flex flex-wrap items-center gap-6">
                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="Left_Flag"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span>Include Left Students</span>
                                </Label>

                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="Deactive_Flag"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span>Include Deactive Students</span>
                                </Label>

                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="applicableFlag"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span className="text-sm">Display Only Applicable</span>
                                </Label>

                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="nonApplicableFlag"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span className="text-sm">Display Only Non-Applicable</span>
                                </Label>

                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="classrank"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span>Display Class Rank</span>
                                </Label>

                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="sectionrank"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span>Display Section Rank</span>
                                </Label>

                                <Label className="flex cursor-pointer items-center gap-2">
                                    <Controller
                                        control={control}
                                        name="attendancedispaly"
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <span>Not Display Attendance</span>
                                </Label>
                            </div>
                        </div>

                        <hr className="my-6 border-gray-300" />

                        {/* Buttons */}
                        <div className="flex justify-center gap-3">
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting || isGenerating || !hasStudentsSelected
                                }
                                className="min-w-[140px]"
                            >
                                {isSubmitting || isGenerating ? "Generating..." : "Report"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                className="min-w-[100px]"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CollapsibleContent>
        </div>
    );
}
