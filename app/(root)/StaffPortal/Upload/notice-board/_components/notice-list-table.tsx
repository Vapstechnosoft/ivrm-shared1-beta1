'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Search, Eye, Edit, Trash2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notice {
  intB_Id: number;
  intB_Title: string;
  intB_Description: string;
  intB_StartDate: string;
  intB_EndDate: string;
  intB_DisplayDate?: string;
  intB_ActiveFlag: boolean;
  intB_ToStudentFlg: boolean;
  intB_ToStaffFlg: boolean;
  ntB_TTSylabusFlg: string;
  intB_Attachment?: string;
}

interface NoticeListTableProps {
  notices: Notice[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStartDate: Date | undefined;
  filterEndDate: Date | undefined;
  onFilterStartDateChange: (date: Date | undefined) => void;
  onFilterEndDateChange: (date: Date | undefined) => void;
  onViewAttachments: (notice: Notice) => void;
}

export function NoticeListTable({
  notices,
  searchTerm,
  onSearchChange,
  filterStartDate,
  filterEndDate,
  onFilterStartDateChange,
  onFilterEndDateChange,
  onViewAttachments
}: NoticeListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredNotices = notices.filter(notice =>
    notice.intB_Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.intB_Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getNoticeTypeLabel = (type: string) => {
    switch (type) {
      case 'TT': return 'TimeTable';
      case 'S': return 'Syllabus';
      case 'P': return 'Portion';
      case 'O': return 'Other';
      default: return type;
    }
  };

  const handleEdit = (notice: Notice) => {
    // Mock edit functionality - replace with actual implementation
    console.log('Editing notice:', notice);
  };

  const handleDelete = (notice: Notice) => {
    // Mock delete functionality - replace with actual implementation
    if (confirm(`Are you sure you want to delete "${notice.intB_Title}"?`)) {
      console.log('Deleting notice:', notice);
    }
  };

  const toggleActiveStatus = (notice: Notice) => {
    // Mock toggle active status - replace with actual implementation
    console.log('Toggling active status for notice:', notice);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notice Board Details List</CardTitle>
            <CardDescription>View and manage published notices</CardDescription>
          </div>
          <Badge variant="secondary">
            Total Records: {filteredNotices.length}
          </Badge>
        </div>
        
        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterStartDate ? format(filterStartDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterStartDate}
                  onSelect={onFilterStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterEndDate ? format(filterEndDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filterEndDate}
                  onSelect={onFilterEndDateChange}
                  disabled={(date) => filterStartDate ? date < filterStartDate : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <Badge variant="outline">
              Searched: {filteredNotices.length}
            </Badge>
          )}
        </div>

        {/* Notice Table */}
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SL.NO</TableHead>
                <TableHead>Notice Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Display Date</TableHead>
                <TableHead>View Attachment</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNotices.map((notice, index) => (
                <TableRow key={notice.intB_Id}>
                  <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                  <TableCell className="text-left font-medium">{notice.intB_Title}</TableCell>
                  <TableCell className="text-left max-w-xs">
                    <div className="truncate" title={notice.intB_Description}>
                      {notice.intB_Description}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{formatDate(notice.intB_StartDate)}</TableCell>
                  <TableCell className="text-center">{formatDate(notice.intB_EndDate)}</TableCell>
                  <TableCell className="text-center">
                    {notice.intB_DisplayDate ? formatDate(notice.intB_DisplayDate) : '--'}
                  </TableCell>
                  <TableCell className="text-center">
                    {notice.intB_Attachment ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewAttachments(notice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(notice)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notice)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActiveStatus(notice)}
                        title={notice.intB_ActiveFlag ? 'Deactivate' : 'Activate'}
                        className={notice.intB_ActiveFlag ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}
                      >
                        <div className={`w-4 h-4 rounded-full ${notice.intB_ActiveFlag ? 'bg-green-600' : 'bg-gray-400'}`} />
                      </Button>
                    </div>
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredNotices.length)} of {filteredNotices.length} entries
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

        {currentNotices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No notices found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
