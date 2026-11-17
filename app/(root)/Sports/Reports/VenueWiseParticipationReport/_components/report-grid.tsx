'use client';

import type { IVenueWiseReportData } from "@/types/sports/reports/venue-wise-participation-report";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ReportGridProps {
    data: IVenueWiseReportData[];
}

export const ReportGrid = ({ data }: ReportGridProps) => {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => window.print()}>
                    <i className="fa fa-print mr-2" aria-hidden="true"></i> Print
                </Button>
                <Button variant="outline">
                    <i className="fa fa-file-excel-o mr-2" aria-hidden="true"></i> Excel
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">SL. No.</TableHead>
                            <TableHead className="text-center">House Name</TableHead>
                            <TableHead className="text-center">Venue</TableHead>
                            <TableHead className="text-center">Student Name</TableHead>
                            <TableHead className="text-center">Adm. No.</TableHead>
                            <TableHead className="text-center">Class</TableHead>
                            <TableHead className="text-center">Section</TableHead>
                            <TableHead className="text-center">Event</TableHead>
                            <TableHead className="text-center">Sports Name</TableHead>
                            <TableHead className="text-center">Event Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="text-center">{row.SPCCMH_HouseName}</TableCell>
                                <TableCell className="text-center">{row.SPCCMEV_EventVenue}</TableCell>
                                <TableCell className="text-center">{row.AMST_Name}</TableCell>
                                <TableCell className="text-center">{row.AMST_AdmNo}</TableCell>
                                <TableCell className="text-center">{row.ASMCL_ClassName}</TableCell>
                                <TableCell className="text-center">{row.ASMC_SectionName}</TableCell>
                                <TableCell className="text-center">{row.SPCCME_EventName}</TableCell>
                                <TableCell className="text-center">{row.SPCCMSCC_SportsCCName}</TableCell>
                                <TableCell className="text-center">{new Date(row.SPCCE_StartDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
