'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Download, Printer, FileSpreadsheet } from 'lucide-react';

interface HomeworkReport {
  IHW_Id: number;
  IHW_Topic: string;
  ASMCL_ClassName: string;
  ASMC_SectionName: string;
  ISMS_SubjectName: string;
  IHWUPL_FileName: string;
  IHWUPL_Date: string;
  employeename?: string;
  UserName?: string;
  IHW_Attachment?: string;
  asmaY_Id: number;
}

interface HomeworkReportTableProps {
  reportData: HomeworkReport[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewAttachments: (report: HomeworkReport) => void;
  onExportToExcel: () => void;
  onPrint: () => void;
}

export function HomeworkReportTable({
  reportData,
  searchTerm,
  onSearchChange,
  onViewAttachments,
  onExportToExcel,
  onPrint
}: HomeworkReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = reportData.filter(report =>
    report.IHW_Topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.ASMCL_ClassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.ASMC_SectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.ISMS_SubjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.IHWUPL_FileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.employeename?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (report.UserName?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Homework Upload Report</CardTitle>
            <CardDescription>View and manage homework upload records</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Total Records: {filteredData.length}
            </Badge>
            {searchTerm && (
              <Badge variant="outline">
                Searched: {filteredData.length}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SL.NO</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Upload By</TableHead>
                <TableHead className="w-16">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((report, index) => (
                <TableRow key={report.IHW_Id}>
                  <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                  <TableCell className="text-center">{report.IHW_Topic}</TableCell>
                  <TableCell className="text-center">{report.ASMCL_ClassName}</TableCell>
                  <TableCell className="text-center">{report.ASMC_SectionName}</TableCell>
                  <TableCell className="text-center">{report.ISMS_SubjectName}</TableCell>
                  <TableCell className="text-center">{report.IHWUPL_FileName}</TableCell>
                  <TableCell className="text-center">{formatDate(report.IHWUPL_Date)}</TableCell>
                  <TableCell>
                    {report.employeename || report.UserName || '--'}
                  </TableCell>
                  <TableCell className="text-center">
                    {report.IHW_Attachment && report.IHW_Attachment !== '' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewAttachments(report)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4 border-t">
          <Button onClick={onExportToExcel} className="flex items-center space-x-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export to Excel</span>
          </Button>
          <Button variant="outline" onClick={onPrint} className="flex items-center space-x-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
