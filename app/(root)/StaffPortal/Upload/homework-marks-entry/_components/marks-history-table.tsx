'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit } from 'lucide-react';

interface MarksHistory {
  AMST_Id: number;
  IHW_Id: number;
  studentname: string;
  ISMS_SubjectName: string;
  IHW_Topic: string;
  UpdatedDate: string;
  IHW_Assignment: string;
  IHWUPL_Marks: number;
}

interface MarksHistoryTableProps {
  marksHistory: MarksHistory[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (history: MarksHistory) => void;
}

export function MarksHistoryTable({ marksHistory, searchTerm, onSearchChange, onEdit }: MarksHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredHistory = marksHistory.filter(history =>
    history.studentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    history.ISMS_SubjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    history.IHW_Topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    history.IHW_Assignment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHistory = filteredHistory.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Homework Details</CardTitle>
            <CardDescription>View and edit previously entered homework marks</CardDescription>
          </div>
          <Badge variant="secondary">
            Total Records: {filteredHistory.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {/* Search Headers */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Student Name"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Subject Name"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Topic"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
                <TableHead className="p-2">
                  <Input
                    placeholder="Search Assignment"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-8"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SL NO</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead className="w-20">Marks</TableHead>
                <TableHead className="w-16">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentHistory.map((history, index) => (
                <TableRow key={`${history.AMST_Id}-${history.IHW_Id}`}>
                  <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                  <TableCell className="text-left">{history.studentname}</TableCell>
                  <TableCell className="text-left">{history.ISMS_SubjectName}</TableCell>
                  <TableCell className="text-left">{history.IHW_Topic}</TableCell>
                  <TableCell className="text-center">{formatDate(history.UpdatedDate)}</TableCell>
                  <TableCell className="text-center">{formatTime(history.UpdatedDate)}</TableCell>
                  <TableCell className="text-left max-w-xs truncate">{history.IHW_Assignment}</TableCell>
                  <TableCell className="text-center">{history.IHWUPL_Marks}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(history)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} entries
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
      </CardContent>
    </Card>
  );
}
