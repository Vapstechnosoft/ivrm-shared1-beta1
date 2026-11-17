
import { useMutation, useQuery } from "@tanstack/react-query";
import { getVenueWiseParticipationDropdowns, getVenueWiseParticipationReport } from "@/server/sports/reports/venue-wise-participation-report";
import type { VenueWiseParticipationReportFormSchema } from "@/types/sports/reports/venue-wise-participation-report";

export const useVenueWiseParticipationReport = () => {
    const dropdowns = useQuery({
        queryKey: ['venueWiseParticipationDropdowns'],
        queryFn: () => getVenueWiseParticipationDropdowns(),
    });

    const generateReport = useMutation({
        mutationFn: (data: VenueWiseParticipationReportFormSchema) => getVenueWiseParticipationReport(data),
    });

    return {
        dropdowns,
        generateReport,
    };
};
