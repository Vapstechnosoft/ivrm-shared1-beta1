"use client";

import { Button } from "@/components/ui/button";
import { CustomMultiSelectBox } from "@/components/ui/custom-multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMasterCategoryClassMapping } from "@/hooks/exam/exammodule/usemasters";
import { useAcademicYearDropdown } from "@/hooks/fees/useMasters";
import { categoryClassMappingSchema } from "@/schemas/exam/exam-module/masters";
import {
  addOrUpdateCategoryClassMapping,
  getCategories,
  getCategoryMappedSections,
  getClassMappedSections,
  getClasses,
} from "@/server/exam/exam-module/masters/category-class-mapping";
import { getOpeningClassDropdownData } from "@/server/fees/trasactions/fee_opening_balance";
import type { ICategoryMapping } from "@/types/exam/exam-module/masters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, Trash2, X, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type FormFields = z.infer<typeof categoryClassMappingSchema.addOrUpdate>;

type AcademicYear = { asmaY_Id: number | string; asmaY_Year: string };
type Category = { emcA_Id: number; emcA_CategoryName: string };
type ClassItem = { asmcL_Id: number; asmcL_ClassName: string };
type SectionItem = { asmS_Id: number; asmC_SectionName: string };

interface Props {
  selectedRow: ICategoryMapping | null;
  onSuccess?: () => void;
}

export default function UpdateCategoryClassForm({
  selectedRow,
  onSuccess,
}: Props) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(categoryClassMappingSchema.addOrUpdate),
    defaultValues: {
      ecaC_Id: selectedRow?.ecaC_Id ?? 0,
      asmaY_Id: selectedRow?.asmaY_Id ?? undefined,
      emcA_Id: selectedRow?.emcA_Id ?? 0,
      asmcL_Id: 409,
      section_list: [],
    } as any,
  });

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [initialSections, setIntialSections] = useState<SectionItem[]>([]);
  const [initialSelectedSections, setInitialSelectedSections] = useState<
    SectionItem[]
  >([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const { refetchAll } = useMasterCategoryClassMapping();

  const [isLoading, setIsLoading] = useState(false);

  // Local mapping list (table) and edit state
  const [mappingList, setMappingList] = useState<
    {
      asmaY_Id: number;
      emcA_Id: number;
      asmcL_Id: number;
      section_list: SectionItem[];
    }[]
  >([]);
  const [initialMappingList, setInitialMappingList] = useState<
    {
      asmaY_Id: number;
      emcA_Id: number;
      asmcL_Id: number;
      section_list: SectionItem[];
    }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (mappingList.length > 0) {
      tableRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(scrollToBottom, 50);
    }
  }, [mappingList]);

  const watchedYear = watch("asmaY_Id");
  const watchedCategory = watch("emcA_Id");
  const watchedClass = watch("asmcL_Id");

  //Initialize the form with selectedrowValues
  useEffect(() => {
    setValue("asmaY_Id", selectedRow?.asmaY_Id ?? 0);
    setValue("emcA_Id", selectedRow?.emcA_Id ?? 0);
  }, [selectedRow, classes.length, categories.length, academicYears.length]);

  // Academic years hook
  const {
    data: academicYear,
    isLoading: academicYearLoading,
    error: academicYearError,
  } = useAcademicYearDropdown();

  // Load categories & classes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: cats } = await getCategories();
        const { data: cls } = await getOpeningClassDropdownData();
        if (!mounted) return;
        setCategories(Array.isArray(cats) ? cats : []);
        setClasses(Array.isArray(cls) ? cls : []);
        if (Array.isArray(cls) && cls.length === 0)
          toast.info("No classes found");
      } catch (err: any) {
        toast.error(err?.message || "Failed to load categories/classes");
        setCategories([]);
        setClasses([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Helper to fetch class mapped sections
  const fetchClassSections = async (
    asmaY_Id: number | string,
    asmcL_Id: number,
  ) => {
    try {
      const res = await getClassMappedSections(
        Number(asmaY_Id),
        Number(asmcL_Id),
      );
      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      return data.map((s: any) => ({
        asmS_Id: Number(s.asmS_Id),
        asmC_SectionName: s.asmC_SectionName ?? String(s.asmS_Id),
      })) as SectionItem[];
    } catch {
      return [] as SectionItem[];
    }
  };

  // Initialize from selectedRow (only when it changes) - fetch both class sections & category mapped sections
  useEffect(() => {
    let mounted = true;
    const loadInitialRow = async () => {
      setIsLoading(true);
      if (!selectedRow) {
        setMappingList([]);
        setIsLoading(false);
        return;
      }

      try {
        // Prefill basic fields (these fields will be disabled in UI)
        setValue("asmaY_Id", selectedRow.asmaY_Id);
        setValue("emcA_Id", selectedRow.emcA_Id);
        setValue("asmcL_Id", selectedRow.asmcL_Id);

        // fetch all class sections (options)
        const classSectionsRes = await getClassMappedSections(
          selectedRow.asmaY_Id,
          selectedRow.asmcL_Id,
        );
        const classSections = Array.isArray(classSectionsRes)
          ? classSectionsRes
          : Array.isArray(classSectionsRes?.data)
            ? classSectionsRes.data
            : [];

        // fetch category mapped sections (the server mapping for the given year+category+class)
        const catMappedRes = await getCategoryMappedSections(
          selectedRow.asmaY_Id,
          selectedRow.emcA_Id,
          selectedRow.asmcL_Id,
        );
        const catMapped = Array.isArray(catMappedRes)
          ? catMappedRes
          : Array.isArray(catMappedRes?.data)
            ? catMappedRes.data
            : [];

        // build section objects for form and mappingList rows
        const sectionOptions: SectionItem[] = classSections.map((s: any) => ({
          asmS_Id: Number(s.asmS_Id),
          asmC_SectionName: s.asmC_SectionName ?? String(s.asmS_Id),
        }));

        // selected sections based on categoryMapped list (by asmS_Id)
        const selectedSections: SectionItem[] =
          Array.isArray(catMapped) && catMapped.length
            ? sectionOptions.filter((s) =>
                catMapped.some(
                  (cm: any) => Number(cm.asmS_Id) === Number(s.asmS_Id),
                ),
              )
            : [];

        if (!mounted) return;

        setSections(sectionOptions);
        if (sectionOptions.length === 0)
          toast.info("No sections are mapped to this class");
        setValue("section_list", selectedSections);
        setIntialSections(sectionOptions);
        setInitialSelectedSections(selectedSections);

        // mappingList initial row (use selectedSections)
        setMappingList([
          {
            asmaY_Id: selectedRow.asmaY_Id,
            emcA_Id: selectedRow.emcA_Id,
            asmcL_Id: selectedRow.asmcL_Id,
            section_list: selectedSections,
          },
        ]);
        setInitialMappingList([
          {
            asmaY_Id: selectedRow.asmaY_Id,
            emcA_Id: selectedRow.emcA_Id,
            asmcL_Id: selectedRow.asmcL_Id,
            section_list: selectedSections,
          },
        ]);

        // mark initial editing row
        setEditIndex(0);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load mapping details");
        setMappingList([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadInitialRow();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow]);

  // When class selection changes, load sections for that class (for multi-select options)
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!watchedYear || !watchedClass) {
        setSections([]);
        setValue("section_list", []);
        return;
      }

      setLoadingSections(true);
      try {
        const sec = await fetchClassSections(watchedYear, Number(watchedClass));
        if (!active) return;
        setSections(sec);

        // keep only selected secs that still exist in options
        const current = watch("section_list") ?? [];
        const currentIds = Array.isArray(current)
          ? current.map((c: any) => Number(c.asmS_Id))
          : [];
        const keep = sec.filter((s) => currentIds.includes(Number(s.asmS_Id)));
        if (keep.length) {
          setValue("section_list", keep);
        } else {
          // do not auto-clear if user wants empty selection — but for safety we set to []
          setValue("section_list", []);
        }
        if (watchedClass === selectedRow?.asmcL_Id) {
          const classSectionsRes = await getClassMappedSections(
            selectedRow.asmaY_Id,
            selectedRow.asmcL_Id,
          );
          const classSections = Array.isArray(classSectionsRes)
            ? classSectionsRes
            : Array.isArray(classSectionsRes?.data)
              ? classSectionsRes.data
              : [];

          // build section objects for form and mappingList rows
          const sectionOptions: SectionItem[] = classSections.map((s: any) => ({
            asmS_Id: Number(s.asmS_Id),
            asmC_SectionName: s.asmC_SectionName ?? String(s.asmS_Id),
          }));
        }
      } catch {
        setSections([]);
        setValue("section_list", []);
        //setValue('asmcL_Id', selectedRow?.asmcL_Id ?? 0);
      } finally {
        if (active) setLoadingSections(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [watchedYear, watchedClass, setValue, watch]);

  // When classes array becomes available, ensure we keep selectedRow class preselected (if valid)
  useEffect(() => {
    if (!Array.isArray(classes) || classes.length === 0) return;

    // If selectedRow exists and its class is present in classes, set it in form (this ensures preselect after classes load)
    if (selectedRow?.asmcL_Id) {
      const exists = classes.some(
        (c) => Number(c.asmcL_Id) === Number(selectedRow.asmcL_Id),
      );
      if (exists) {
        setValue("asmcL_Id", Number(selectedRow.asmcL_Id));
      }
    }

    // Ensure current form value corresponds to an available class — otherwise reset to 0 to show placeholder
    const current = watch("asmcL_Id");
    const hasCurrent = classes.some(
      (c) => Number(c.asmcL_Id) === Number(current),
    );
    if (!hasCurrent) {
      setValue("asmcL_Id", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);
  useEffect(() => {
    if (!watchedYear || !watchedCategory || !watchedClass) {
      return;
    }

    // find mapping in local list
    const found = mappingList.find(
      (m) =>
        Number(m.asmaY_Id) === Number(watchedYear) &&
        Number(m.emcA_Id) === Number(watchedCategory) &&
        Number(m.asmcL_Id) === Number(watchedClass),
    );

    if (found) {
      // convert to actual section objects available in `sections` so CustomMultiSelectBox value mapping works
      const selected = sections.filter((s) =>
        found.section_list.some((sel) => sel.asmS_Id === s.asmS_Id),
      );
      setValue(
        "section_list",
        selected.map((s) => ({
          asmS_Id: s.asmS_Id,
          asmC_SectionName: s.asmC_SectionName,
        })),
      );
    } else {
      // No saved mapping in local list: clear selected sections (keeps sections options)
      setValue("section_list", []);
    }
  }, [
    watchedYear,
    watchedCategory,
    watchedClass,
    mappingList,
    sections,
    setValue,
  ]);

  // Add or update mapping row
  const handleAddOrUpdate = () => {
    const year = Number(watch("asmaY_Id") || 0);
    const cat = Number(watch("emcA_Id") || 0);
    const cls = Number(watch("asmcL_Id") || 0);
    const secs = (watch("section_list") || []) as {
      asmS_Id: number;
      asmC_SectionName: string;
    }[];

    if (!year || !cat || !cls || secs.length === 0) {
      toast.error("All fields are required to add/update a mapping");
      return;
    }

    const newEntry = {
      asmaY_Id: year,
      emcA_Id: cat,
      asmcL_Id: cls,
      section_list: secs.map((s) => ({
        asmS_Id: Number(s.asmS_Id),
        asmC_SectionName: s.asmC_SectionName,
      })),
    };

    if (editIndex !== null) {
      // ✔ UPDATE existing row inside update modal
      setMappingList((prev) => {
        const updated = [...prev];
        updated[editIndex] = newEntry;
        return updated;
      });

      toast.info("Mapping updated");
    } else {
      // ✔ ADD or replace if combination already exists
      const existingIndex = mappingList.findIndex(
        (m) =>
          Number(m.asmaY_Id) === year &&
          Number(m.emcA_Id) === cat &&
          Number(m.asmcL_Id) === cls,
      );

      if (existingIndex !== -1) {
        setMappingList((prev) => {
          const updated = [...prev];
          updated[existingIndex] = newEntry;
          return updated;
        });
        toast.info("Existing mapping updated");
      } else {
        setMappingList((prev) => [...prev, newEntry]);
        toast.success("Mapping added");
      }
    }

    // ❌ DO NOT reset class in update form
    // In update page: keep user’s selected class & sections stable

    setEditIndex(null);
    setTimeout(scrollToBottom, 50);
    setValue("section_list", []);
    setValue("asmcL_Id", 0);
    setSections([]);
  };

  const handleEdit = (index: number) => {
    const row = mappingList[index];
    if (!row) return;
    setEditIndex(index);

    // set the form values so user can edit class & sections
    setValue("asmaY_Id", Number(row.asmaY_Id));
    setValue("emcA_Id", Number(row.emcA_Id));
    setValue("asmcL_Id", Number(row.asmcL_Id));
    setValue(
      "section_list",
      Array.isArray(row.section_list) ? row.section_list : [],
    );
  };

  const handleDelete = (index: number) => {
    setMappingList((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) setEditIndex(null);
    toast.success("Mapping removed");
  };

  // Final submit: build payload exactly as you showed
  const onSubmit: SubmitHandler<FormFields> = async () => {
    if (!Array.isArray(mappingList) || mappingList.length === 0) {
      toast.error("Add at least one mapping before saving");
      return;
    }

    const payload: any = {
      ECAC_Id: selectedRow?.ecaC_Id ?? 0,
      YearClassCategory: mappingList.map((m) => ({
        ASMAY_Id: Number(m.asmaY_Id),
        ASMCL_Id: Number(m.asmcL_Id),
        EMCA_Id: Number(m.emcA_Id),
        sections: (Array.isArray(m.section_list) ? m.section_list : []).map(
          (s) => ({ ASMS_Id: Number(s.asmS_Id) }),
        ),
      })),
    };

    try {
      const res = await addOrUpdateCategoryClassMapping(payload);
      if (res?.success) {
        toast.success(res.message ?? "Updated successfully");
        onSuccess?.();
        refetchAll();
      } else {
        toast.error(res?.message ?? "Failed to save mappings");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save mappings");
    }
  };

  // Safe arrays to avoid undefined.map errors
  const safeAcademicYears = Array.isArray(academicYear?.data)
    ? academicYear.data
    : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeClasses = Array.isArray(classes) ? classes : [];
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeMappingList = Array.isArray(mappingList) ? mappingList : [];

  if (isLoading || safeMappingList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-secondary" />
        <p className="text-muted-foreground text-sm">Loading data...</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {/* LEFT */}
      <div className="space-y-4">
        {/* Academic Year */}
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            Academic Year <span className="text-red-600">*</span>
          </span>
          <Controller
            control={control}
            name="asmaY_Id"
            render={({ field }) => (
              <Select value={String(field.value ?? "")} disabled>
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
            )}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            Category <span className="text-red-600">*</span>
          </span>
          <Controller
            control={control}
            name="emcA_Id"
            render={({ field }) => (
              <Select value={String(field.value ?? "")} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {safeCategories.map((c) => (
                    <SelectItem key={c.emcA_Id} value={String(c.emcA_Id)}>
                      {c.emcA_CategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Class */}
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            Class <span className="text-red-600">*</span>
          </span>

          <Controller
            control={control}
            name="asmcL_Id"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : undefined}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>

                <SelectContent>
                  {safeClasses.map((cls) => (
                    <SelectItem key={cls.asmcL_Id} value={String(cls.asmcL_Id)}>
                      {cls.asmcL_ClassName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="space-y-2">
        <span className="font-medium">
          Sections <span className="text-red-600">*</span>
        </span>

        <Controller
          control={control}
          name="section_list"
          render={({ field }) =>
            sections.length === 0 ? (
              <p>Loading sections...</p>
            ) : safeSections.length ? (
              <CustomMultiSelectBox
                options={safeSections.map((s) => ({
                  label: s.asmC_SectionName,
                  value: String(s.asmS_Id),
                }))}
                value={(field.value ?? []).map((s: any) => String(s.asmS_Id))}
                onChange={(vals: string[]) => {
                  const selected = safeSections
                    .filter((s) => vals.includes(String(s.asmS_Id)))
                    .map((s) => ({
                      asmS_Id: s.asmS_Id,
                      asmC_SectionName: s.asmC_SectionName,
                    }));
                  field.onChange(selected);
                }}
                isSearchRequired
              />
            ) : (
              <p className="text-gray-500">Select Class</p>
            )
          }
        />
      </div>

      {/* ADD / CLEAR */}
      <div className="flex w-fit justify-center gap-3 md:col-span-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setValue("asmcL_Id", 0);
            setValue("section_list", []);
            setEditIndex(null);
          }}
        >
          <X className="h-4 w-4 text-destructive" /> CLEAR
        </Button>

        <Button type="button" onClick={handleAddOrUpdate}>
          {editIndex !== null ? "Update" : "+ Add Mapping"}
        </Button>
      </div>

      {/* TABLE */}
      {safeMappingList.length > 0 && (
        <>
          <div className="col-span-2 mt-4 rounded border p-4" ref={tableRef}>
            <h3 className="mb-2 font-semibold text-lg">Details</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">SLNO</th>
                    <th className="border p-2">Academic Year</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Class</th>
                    <th className="border p-2">Sections</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {safeMappingList.map((m, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="border p-2 text-center">{i + 1}</td>

                      <td className="border p-2 text-center">
                        {safeAcademicYears.find(
                          (y) => Number(y.asmaY_Id) === Number(m.asmaY_Id),
                        )?.asmaY_Year ?? String(m.asmaY_Id)}
                      </td>

                      <td className="border p-2 text-center">
                        {safeCategories.find(
                          (c) => Number(c.emcA_Id) === Number(m.emcA_Id),
                        )?.emcA_CategoryName ?? String(m.emcA_Id)}
                      </td>

                      <td className="border p-2 text-center">
                        {safeClasses.find(
                          (c) => Number(c.asmcL_Id) === Number(m.asmcL_Id),
                        )?.asmcL_ClassName ?? String(m.asmcL_Id)}
                      </td>

                      <td className="border p-2">
                        {(m.section_list ?? [])
                          .map((s) => s.asmC_SectionName)
                          .join(", ")}
                      </td>

                      <td className="flex justify-center gap-2 border p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(i)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(i)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FINAL SAVE */}
          <div className="flex w-fit flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-start md:col-span-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setValue("asmcL_Id", selectedRow?.asmcL_Id || 0);
                setValue("section_list", initialSelectedSections || []);
                setSections(initialSections || []);
                setValue("asmaY_Id", selectedRow?.asmaY_Id || 0);
                setValue("emcA_Id", selectedRow?.emcA_Id || 0);
                setMappingList(initialMappingList || []);
                setEditIndex(null);
              }}
            >
              Reset
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Update Category Class Mapping
                {isSubmitting && (
                  <Loader2 className="h-6 w-6 animate-spin text-black" />
                )}
              </div>
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
