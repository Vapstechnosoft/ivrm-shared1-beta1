'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, ToggleLeft, ToggleRight, Search } from 'lucide-react';

interface Homework {
  ihW_Id: number;
  ismS_SubjectName: string;
  asmcL_ClassName: string;
  asmC_SectionName: string;
  ihW_Topic: string;
  createdDate: string;
  createdTime: string;
  ihW_Assignment: string;
  ihW_Date: string;
  FilesCount: number;
  ihW_ActiveFlag: boolean;
}

interface HomeworkTableProps {
  homeworkList: Homework[];
}

export function HomeworkTable({ homeworkList }: HomeworkTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredHomework = homeworkList.filter(homework =>
    homework.ismS_SubjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homework.asmcL_ClassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homework.asmC_SectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homework.ihW_Topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHomework.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHomework = filteredHomework.slice(startIndex, endIndex);

  const handleToggleStatus = (homework: Homework) => {
    // Mock toggle - replace with actual API call
    console.log('Toggle status for homework:', homework.ihW_Id);
  };

  const handleViewFiles = (homework: Homework) => {
    // Mock view files - replace with actual implementation
    console.log('View files for homework:', homework.ihW_Id);
  };

  const handleEdit = (homework: Homework) => {
    // Mock edit - replace with actual implementation
    console.log('Edit homework:', homework.ihW_Id);
  };

  if (homeworkList.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Homework Details</CardTitle>
            <CardDescription>View and manage uploaded homework</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              Total Records: {homeworkList.length}
            </Badge>
            {searchTerm && (
              <Badge variant="outline">
                Searched: {filteredHomework.length}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">SLNO</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Update Date / Time</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Homework Date</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentHomework.map((homework, index) => (
                <TableRow key={homework.ihW_Id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{homework.ismS_SubjectName}</TableCell>
                  <TableCell>{homework.asmcL_ClassName}</TableCell>
                  <TableCell>{homework.asmC_SectionName}</TableCell>
                  <TableCell className="text-left max-w-xs truncate">{homework.ihW_Topic}</TableCell>
                  <TableCell>
                    <div>
                      <div>{homework.createdDate}</div>
                      <div className="text-sm text-gray-500">{homework.createdTime}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left max-w-xs truncate">{homework.ihW_Assignment}</TableCell>
                  <TableCell>{homework.ihW_Date}</TableCell>
                  <TableCell>
                    {homework.FilesCount === 0 ? (
                      <span className="text-gray-400">---</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewFiles(homework)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(homework)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(homework)}
                        className={homework.ihW_ActiveFlag ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"}
                      >
                        {homework.ihW_ActiveFlag ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredHomework.length)} of {filteredHomework.length} entries
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
