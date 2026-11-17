'use client';

import { useState } from "react";
import { ReportForm } from "./_components/report-form";
import { ReportGrid } from "./_components/report-grid";
import { useVenueWiseParticipationReport } from "@/hooks/sports/useVenueWiseParticipationReport";
import type { IVenueWiseReportData } from "@/types/sports/reports/venue-wise-participation-report";
import { Loader2 } from "lucide-react";

export default function VenueWiseParticipationReportPage() {
    const { dropdowns } = useVenueWiseParticipationReport();
    const [reportData, setReportData] = useState<IVenueWiseReportData[]>([]);
    const [showNoRecords, setShowNoRecords] = useState(false);

    if (dropdowns.isLoading || dropdowns.isFetching) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (dropdowns.isError) {
        return (
            <div className="flex h-full items-center justify-center text-red-500">
                Failed to load initial data. Please try again.
            </div>
        );
    }

    const handleReportGenerated = (data: IVenueWiseReportData[]) => {
        setReportData(data);
        setShowNoRecords(data.length === 0);
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Venue Wise Participation Report</h1>
                <p className="text-muted-foreground">
                    Generate reports based on House or Class/Section participation per venue.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Report Selection</h2>
                </div>

                <ReportForm
                    dropdowns={dropdowns.data!}
                    onReportGenerated={handleReportGenerated}
                    onReset={() => {
                        setReportData([]);
                        setShowNoRecords(false);
                    }}
                />
            </div>

            {reportData.length > 0 ? (
                <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Venue Wise Participation Report</h2>
                    </div>
                    <ReportGrid data={reportData} />
                </div>
            ) : showNoRecords && (
                <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm text-center py-10">
                    <p className="text-muted-foreground font-medium">No records found for the selected criteria.</p>
                </div>
            )}
        </div>
    );
}
