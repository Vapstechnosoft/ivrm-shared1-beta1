"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError, Label } from "@/components/ui/extension/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeDropdownList } from "@/hooks/exam/exammodule/exam-mapping";
import { useAcademicYearDropdown } from "@/hooks/fees/useMasters";
import {
  type ExamLoginPrivilegesSchema,
  examLoginPrivilegesReportSchema,
} from "@/schemas/exam/exam-module/reports";
import { getCategoryDropDownByAcademicYearlist } from "@/server/exam/exam-module/exam-mapping/exam-subject-group-mapping";
import { getExamLoginPrivilagesReport } from "@/server/exam/exam-module/reports/exam-login-privileges-report";
import { getSectionsDropDownByAcademicYearandClasslist } from "@/server/exam/exam-module/reports/tbs-report-school";
import { getClassDropDownByYearCategoryList } from "@/server/exam/exam-module/reports/vvehpc_exam-report-card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  ZodEffects,
  ZodObject,
  ZodString,
  ZodEnum,
  ZodOptional,
  ZodDefault,
  ZodBoolean,
  ZodTypeAny,
} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ReportFormProps {
  onReportGenerated: (data: any) => void;
  onReset: () => void;
}

export const ReportForm = ({ onReportGenerated, onReset }: ReportFormProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);

  const methods = useForm<ExamLoginPrivilegesSchema>({
    resolver: zodResolver(examLoginPrivilegesReportSchema),
    defaultValues: {
      type: "all",
      employeeChecked: false,
      selectAllEmployees: false,
    },
  });

  const { control, handleSubmit, setValue, reset, formState } = methods;
  const {
    data: academicYear,
    isLoading: academicYearLoading,
    error: academicYearError,
  } = useAcademicYearDropdown();
  const {
    data: employeeData,
    isLoading: employeeDataLoading,
    error: employeeDataError,
  } = useEmployeeDropdownList();
  const { isSubmitting } = formState;

  const watchYear = useWatch({ control, name: "ASMAY_Id" });
  const watchCategory = useWatch({ control, name: "EMCA_Id" });
  const watchType = useWatch({ control, name: "type" });
  const watchClass = useWatch({ control, name: "ASMCL_Id" });
  const watchEmployeeChecked = useWatch({ control, name: "employeeChecked" });

  // Clear employee selection when checkbox is unchecked
  useEffect(() => {
    if (!watchEmployeeChecked) {
      setValue("HRME_Id", undefined);
    }
  }, [watchEmployeeChecked, setValue]);

  // Load Categories on Year Change
  useEffect(() => {
    if (!watchYear) {
      setCategories([]);
      setValue("EMCA_Id", "0");
      return;
    }

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data: cats } = await getCategoryDropDownByAcademicYearlist(
          Number(watchYear),
        );
        const categoryList = Array.isArray(cats) ? cats : [];
        setCategories(categoryList);

        if (categoryList.length === 0) {
          toast.info("No categories found for selected academic year");
        }
        setValue("EMCA_Id", "0");
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to load categories");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [watchYear, setValue]);

  // Load Classes on Category Change
  useEffect(() => {
    if (watchYear && watchCategory) {
      const fetchClasses = async () => {
        setLoadingClasses(true);
        try {
          const res = await getClassDropDownByYearCategoryList(
            Number(watchYear),
            Number(watchCategory),
          );
          const safeClasses = Array.isArray(res) ? res : [];

          if (safeClasses.length === 0) {
            toast.info("No Classes found");
          }

          setClasses(safeClasses);
          setValue("ASMCL_Id", undefined);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load classes");
          setClasses([]);
        } finally {
          setLoadingClasses(false);
        }
      };

      fetchClasses();
    } else {
      setClasses([]);
      setValue("ASMCL_Id", undefined);
    }
  }, [watchYear, watchCategory, setValue]);

  // Load Sections on Class Change
  useEffect(() => {
    if (!watchYear || !watchClass) {
      setSections([]);
      setValue("ASMS_Id", undefined);
      return;
    }

    const fetchSections = async () => {
      try {
        setLoadingSections(true);
        const { data } = await getSectionsDropDownByAcademicYearandClasslist(
          Number(watchYear),
          Number(watchClass),
        );

        const sectionList = Array.isArray(data) ? data : [];
        setSections(sectionList);

        if (sectionList.length === 0) {
          toast.info("No Sections found");
        }

        setValue("ASMS_Id", undefined);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load sections");
      } finally {
        setLoadingSections(false);
      }
    };

    fetchSections();
  }, [watchYear, watchClass, setValue]);

  const onSubmit = async (formData: ExamLoginPrivilegesSchema) => {
    try {
      const payload = {
        ASMAY_Id: Number(formData.ASMAY_Id),
        EMCA_Id: Number(formData.EMCA_Id),
        ASMCL_Id: formData.ASMCL_Id ? Number(formData.ASMCL_Id) : null,
        ASMS_Id: formData.ASMS_Id ? Number(formData.ASMS_Id) : null,
        HRME_Id:
          formData.employeeChecked && formData.HRME_Id
            ? Number(formData.HRME_Id)
            : null,
        report_type: formData.type,
        check_type: formData.employeeChecked ? "individual" : "all",
      };

      const response = await getExamLoginPrivilagesReport(payload);

      if (response.success) {
        console.log("response", response);
        // asmcL_ClassName , hrmE_EmployeeName, asmC_SectionName

        const groupedData = Object.values(
          response.data.reduce((acc: any, item: any) => {
            const key = `${item.asmcL_ClassName}-${item.asmC_SectionName}-${item.hrmE_EmployeeName}`;

            if (!acc[key]) {
              acc[key] = {
                asmcL_ClassName: item.asmcL_ClassName,
                asmC_SectionName: item.asmC_SectionName,
                hrmE_EmployeeName: item.hrmE_EmployeeName,
                subjectlist: [],
              };
            }

            acc[key].subjectlist.push({ ismS_SubjectName: item.ismS_SubjectName });

            return acc;
          }, {}),
        );
        console.log("groupedData", groupedData);
        onReportGenerated(groupedData);
      } else {
        toast.error(response.message ?? "Failed to generate report");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating report");
    }
  };

  const handleClear = () => {
    reset({
      type: "all",
      employeeChecked: false,
      selectAllEmployees: false,
    });
    setCategories([]);
    setClasses([]);
    setSections([]);
    onReset();
  };

  return (
    <div className="mx-auto w-full rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border p-4 shadow-sm">
            {/* Type Selection */}
            <div className="mb-4 flex justify-center rounded-md bg-gray-50 p-3">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2 space-y-0">
                      <RadioGroupItem value="all" id="all" />
                      <Label
                        htmlFor="all"
                        className="cursor-pointer font-normal"
                      >
                        All
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-y-0">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label
                        htmlFor="individual"
                        className="cursor-pointer font-normal"
                      >
                        Individual
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Academic Year */}
              <div className="space-y-2">
                <Label>
                  Academic Year <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="ASMAY_Id"
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Academic Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYearLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading Academic Year...
                            </SelectItem>
                          ) : academicYearError ? (
                            <SelectItem value="error" disabled>
                              Error loading Academic Year
                            </SelectItem>
                          ) : (
                            academicYear?.data?.map((item) => (
                              <SelectItem
                                key={item.asmaY_Id}
                                value={item.asmaY_Id.toString()}
                              >
                                {item.asmaY_Year}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FormError>{fieldState.error.message}</FormError>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="EMCA_Id"
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCategories ? (
                            <SelectItem value="0" disabled>
                              Categories are loading...
                            </SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value="0" disabled>
                              No Categories found
                            </SelectItem>
                          ) : (
                            categories.map((cat) => (
                              <SelectItem
                                key={cat.emcA_Id}
                                value={String(cat.emcA_Id)}
                              >
                                {cat.emcA_CategoryName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FormError>{fieldState.error.message}</FormError>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label>
                  Class <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="ASMCL_Id"
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={watchType !== "individual"}
                      >
                        <SelectTrigger
                          className={
                            watchType !== "individual" ? "bg-gray-100" : ""
                          }
                        >
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
                            classes.map((cls) => (
                              <SelectItem
                                key={cls.asmcL_Id}
                                value={String(cls.asmcL_Id)}
                              >
                                {cls.asmcL_ClassName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FormError>{fieldState.error.message}</FormError>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Section */}
              <div className="space-y-2">
                <Label>
                  Section <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="ASMS_Id"
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={watchType !== "individual"}
                      >
                        <SelectTrigger
                          className={
                            watchType !== "individual" ? "bg-gray-100" : ""
                          }
                        >
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
                            sections.map((sec) => (
                              <SelectItem
                                key={sec.asmS_Id}
                                value={String(sec.asmS_Id)}
                              >
                                {sec.asmC_SectionName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FormError>{fieldState.error.message}</FormError>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center space-x-2 rounded border p-3">
                <Controller
                  control={control}
                  name="employeeChecked"
                  render={({ field }) => (
                    <Checkbox
                      id="empCheck"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="empCheck">Filter by Individual Employee</Label>
              </div>

              <div className="space-y-2">
                <Label>Employee Name</Label>
                <Controller
                  control={control}
                  name="HRME_Id"
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchEmployeeChecked}
                      >
                        <SelectTrigger
                          className={!watchEmployeeChecked ? "bg-gray-100" : ""}
                        >
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeDataLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading Employees...
                            </SelectItem>
                          ) : employeeDataError ? (
                            <SelectItem value="error" disabled>
                              Error loading Employees
                            </SelectItem>
                          ) : (
                            employeeData?.data?.map((item: any) => (
                              <SelectItem
                                key={item.hrmE_Id}
                                value={item.hrmE_Id.toString()}
                              >
                                {item.hrmE_EmployeeName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FormError>{fieldState.error.message}</FormError>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Report
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isSubmitting}
              >
                Clear
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
// function zodResolver(examLoginPrivilegesReportSchema: ZodEffects<ZodEffects<ZodObject<{ ASMAY_Id: ZodString; EMCA_Id: ZodString; type: ZodEnum<["all", "individual"]>; ASMCL_Id: ZodOptional<ZodString>; ASMS_Id: ZodOptional<ZodString>; HRME_Id: ZodOptional<ZodString>; employeeChecked: ZodDefault<ZodBoolean>; selectAllEmployees: ZodDefault<ZodBoolean>; }, "strip", ZodTypeAny, { ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; employeeChecked: boolean; selectAllEmployees: boolean; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; }, { ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; employeeChecked?: boolean | undefined; selectAllEmployees?: boolean | undefined; }>, { ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; employeeChecked: boolean; selectAllEmployees: boolean; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; }, { ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; employeeChecked?: boolean | undefined; selectAllEmployees?: boolean | undefined; }>, { ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; employeeChecked: boolean; selectAllEmployees: boolean; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; }, { ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; employeeChecked?: boolean | undefined; selectAllEmployees?: boolean | undefined; }>): import("react-hook-form").Resolver<{ ASMAY_Id: string; EMCA_Id: string; type: "all" | "individual"; employeeChecked: boolean; selectAllEmployees: boolean; ASMCL_Id?: string | undefined; ASMS_Id?: string | undefined; HRME_Id?: string | undefined; }, any> | undefined {
//     throw new Error('Function not implemented.');
// }
