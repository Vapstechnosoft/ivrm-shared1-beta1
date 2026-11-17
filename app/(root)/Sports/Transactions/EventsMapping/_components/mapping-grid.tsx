'use client';

import { IEventsMappingData } from "@/types/sports/events-mapping";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";

interface MappingGridProps {
    data: IEventsMappingData[];
    onEdit: (data: IEventsMappingData) => void;
    onDeactivate: (id: number, activeFlag: boolean) => void;
}

export const MappingGrid = ({ data, onEdit, onDeactivate }: MappingGridProps) => {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">SL.NO.</TableHead>
                            <TableHead className="text-center">Year</TableHead>
                            <TableHead className="text-center">Event</TableHead>
                            <TableHead className="text-center">Venue</TableHead>
                            <TableHead className="text-center">Start Date</TableHead>
                            <TableHead className="text-center">Start Time</TableHead>
                            <TableHead className="text-center">End Date</TableHead>
                            <TableHead className="text-center">End Time</TableHead>
                            <TableHead className="text-center">Sponsor</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={row.spccE_Id}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="text-center">{row.asmaY_Year}</TableCell>
                                <TableCell className="text-center">{row.spccmE_EventName}</TableCell>
                                <TableCell className="text-center">{row.spccmeV_EventVenue}</TableCell>
                                <TableCell className="text-center">{new Date(row.spccE_StartDate).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">{row.spccE_StartTime}</TableCell>
                                <TableCell className="text-center">{new Date(row.spccE_EndDate).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">{row.spccE_EndTime}</TableCell>
                                <TableCell className="text-center">
                                    {row.spccE_SponsorFlag && (
                                        <Button variant="ghost" size="sm" className="text-primary">
                                            <Eye className="h-4 w-4 mr-1" /> View Sponsor
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(row)}
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4 text-primary" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={row.spccE_ActiveFlag ? "text-destructive" : "text-green-600"}
                                            onClick={() => onDeactivate(row.spccE_Id, row.spccE_ActiveFlag)}
                                        >
                                            {row.spccE_ActiveFlag ? "De-Activate" : "Activate"}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
