"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { Printer, Download } from "lucide-react";

interface ReportListProps {
  data: any;
}

export const ReportList = ({ data }: ReportListProps) => {
  const tableRef = useRef<HTMLTableElement>(null);
  // Transformation logic removed as we are rendering a flat list directly.

  // Check if data exists
  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    (data.sectionlist && data.sectionlist.length === 0)
  ) {
    return null;
  }

  // For "display all dummy data", we will render a flat list of items
  // This ignores grouping by section and just lists every subject entry as a row.

  const handlePrint = () => {
    const printContent = tableRef.current?.outerHTML;
    if (printContent) {
      const printWindow = window.open("", "", "height=600,width=800");
      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Marks Entry Report</title>",
        );
        printWindow.document.write(
          "<style>table { width: 100%; border-collapse: collapse; text-align: center; } th, td { border: 1px solid black; padding: 8px; } th { background-color: #f2f2f2; }</style>",
        );
        printWindow.document.write("</head><body>");
        printWindow.document.write(
          '<div style="text-align: center; margin-bottom: 20px;">',
        );
        printWindow.document.write("<h3>Marks Entered Report</h3>");
        printWindow.document.write("</div>");
        printWindow.document.write(printContent);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleExport = () => {
    if (tableRef.current) {
      const wb = XLSX.utils.table_to_book(tableRef.current);
      XLSX.writeFile(wb, "Marks_Entry_Report.xlsx");
    }
  };

  // Use the raw array for the flat list
  const reportList = Array.isArray(data) ? data : [];

  // Extract metadata from first item if available
  const firstItem = reportList[0] || {};
  const yearname = firstItem.asmaY_Year || "2023-2024";
  const examname = firstItem.emE_ExamName || "Exam";

  return (
    <div className="space-y-4  bg-gray-200">
      
      <div className="space-y-2 text-center flex flex-col justify-center items-center">
        <h3 className="font-bold text-xl pt-3">Marks Entered Report</h3>
        <div className="flex space-x-8 text-sm">
          <span>
            <strong>ACADEMIC YEAR:</strong> {yearname}
          </span>
          <span>
            <strong>EXAM:</strong> {examname}
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-800 text-white flex w-fit"
        >
          <Printer className="h-4 w-4" />
          <span>PRINT</span>
        </Button>

        <Button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-800 text-white w-fit"
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className=" rounded-md ">
        <Table ref={tableRef}>
          <TableHeader >
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="w-[80px] text-center text-base font-bold text-white border border-blue-800">
                Sl No
              </TableHead>
              <TableHead className="text-center text-base font-bold text-white border border-blue-800">Class</TableHead>
              <TableHead className="text-center text-base font-bold text-white border border-blue-800">Section</TableHead>
              <TableHead className="text-center text-base font-bold text-white border border-blue-800">Subject</TableHead>
              <TableHead className="text-center text-base font-bold text-white border border-blue-800">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportList.map((item: any, index: number) => {
              const className = item.asmcL_ClassName || item.ASMCL_ClassName;
              const sectionName =
                item.asmC_SectionName || item.ASMC_SectionName;
              const subjectName =
                item.ismS_SubjectName || item.ISMS_SubjectName;
              const status = item.sourceMarksEntry || item.SourceMarksEntry;
              const color =
                item.sourceMarksColorFlag ||
                item.SourceMarksColorFlag ||
                "black";

              return (
                <TableRow key={index}>
                  <TableCell className="text-center border border-gray-400">{index + 1}</TableCell>
                  <TableCell className="text-center border border-gray-400">{className}</TableCell>
                  <TableCell className="text-center border border-gray-400">{sectionName}</TableCell>
                  <TableCell className="text-center border border-gray-400">{subjectName}</TableCell>
                  <TableCell
                    className="text-center border border-gray-400"
                    style={{ color: color, fontWeight: "bold" }}
                  >
                    {status}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
