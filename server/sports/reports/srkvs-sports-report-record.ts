'use server';

import { type ApiResponse } from '@/lib/apiService';
import { ISRKVSReportData, SRKVSSportsReportRecordFormSchema } from '@/types/sports/reports/srkvs-sports-report-record';

export async function getSRKVSSportsReportRecordDropdowns() {
    const response: ApiResponse<{
        academicYear: { asmaY_Id: number; asmaY_Year: string }[];
        masterEvents: { spccmE_Id: number; spccmE_EventName: string }[];
        competitionLevels: { spccmcL_Id: number; spccmcL_CompitionLevel: string }[];
        categories: { spccmcC_Id: number; spccmcC_CompitionCategory: string }[];
        mainEvents: { spccmsccG_Id: number; spccmsccG_SportsCCGroupName: string }[];
        subEvents: { spccmscC_Id: number; spccmscC_SportsCCName: string }[];
        subSubEvents: { spccmsccG_Id: number; spccmsccG_SportsCCGroupName: string }[];
    }> = {
        success: true,
        message: 'Dropdowns fetched successfully',
        data: {
            academicYear: [
                { asmaY_Id: 1, asmaY_Year: '2023-2024' },
                { asmaY_Id: 2, asmaY_Year: '2024-2025' },
            ],
            masterEvents: [
                { spccmE_Id: 1, spccmE_EventName: 'Annual Sports Meet' },
                { spccmE_Id: 2, spccmE_EventName: 'Swimming Gala' },
                { spccmE_Id: 3, spccmE_EventName: 'Athletics Day' },
            ],
            competitionLevels: [
                { spccmcL_Id: 1, spccmcL_CompitionLevel: 'School Level' },
                { spccmcL_Id: 2, spccmcL_CompitionLevel: 'State Level' },
                { spccmcL_Id: 3, spccmcL_CompitionLevel: 'National Level' },
            ],
            categories: [
                { spccmcC_Id: 1, spccmcC_CompitionCategory: 'Juniors (U-14)' },
                { spccmcC_Id: 2, spccmcC_CompitionCategory: 'Seniors (U-17)' },
                { spccmcC_Id: 3, spccmcC_CompitionCategory: 'Super Seniors (U-19)' },
            ],
            mainEvents: [
                { spccmsccG_Id: 1, spccmsccG_SportsCCGroupName: 'Track Events' },
                { spccmsccG_Id: 2, spccmsccG_SportsCCGroupName: 'Field Events' },
            ],
            subEvents: [
                { spccmscC_Id: 1, spccmscC_SportsCCName: '100m Sprint' },
                { spccmscC_Id: 2, spccmscC_SportsCCName: 'Long Jump' },
                { spccmscC_Id: 3, spccmscC_SportsCCName: 'Shot Put' },
            ],
            subSubEvents: [ // Using same structure as Main Event/Group based on legacy which seems to reuse Group Name
                { spccmsccG_Id: 1, spccmsccG_SportsCCGroupName: 'Heat 1' },
                { spccmsccG_Id: 2, spccmsccG_SportsCCGroupName: 'Heat 2' },
                { spccmsccG_Id: 3, spccmsccG_SportsCCGroupName: 'Finals' },
            ]
        },
    };
    return response;
}

export async function getSRKVSSportsReportRecord(data: SRKVSSportsReportRecordFormSchema) {
    // Mock Data Generation
    const mockData: ISRKVSReportData[] = [];
    const count = 5; // Groups

    const strategies: Record<string, () => void> = {
        'Record': () => {
            // Group by Category
            for (let i = 0; i < 3; i++) {
                mockData.push({
                    SPCCMCC_Id: i + 1,
                    SPCCMCC_CompitionCategory: ['Juniors', 'Seniors', 'Super Seniors'][i],
                    SPCCMSCCG_SportsCCGroupName: 'Track Events',
                    RecordDetails: Array.from({ length: 4 }).map((_, j) => ({
                        AMST_Id: j,
                        AMAY_RollNo: `R-${100 + j}`,
                        AMST_FirstName: `Student ${String.fromCharCode(65 + j)}`,
                        AMST_AdmNo: `ADM-${2000 + j}`,
                        ASMCL_ClassName: `Class ${10 + j}`,
                        ASMC_SectionName: 'A',
                        SPCCESTR_Rank: `${j + 1}`,
                        SPCCESTR_Value: `${(10 + j * 0.5).toFixed(2)}`,
                        SPCCMUOM_UOMName: 'Sec',
                        SPCCME_EventName: 'Annual Sports',
                        SPCCMSCCG_SportsCCGroupName: '100m Dash'
                    }))
                });
            }
        },
        'Start': () => {
            // Group by student mostly in legacy but structure suggests grouping by category/event in outer loop
            for (let i = 0; i < 2; i++) {
                mockData.push({
                    SPCCMCC_Id: i + 1,
                    SPCCMCC_CompitionCategory: ['Juniors', 'Seniors'][i],
                    SPCCMSCCG_SportsCCGroupName: 'Heat 1',
                    RecordDetails: Array.from({ length: 6 }).map((_, j) => ({
                        AMST_Id: j,
                        AMAY_RollNo: `R-${j + 1}`,
                        AMST_FirstName: `Runner ${j + 1}`,
                        AMST_AdmNo: `ADM-${3000 + j}`,
                        ASMCL_ClassName: 'X',
                        ASMC_SectionName: 'B',
                        SPCCESTR_Rank: '',
                        SPCCESTR_Value: '',
                        SPCCMUOM_UOMName: 'Sec',
                        SPCCME_EventName: 'Running',
                        SPCCMSCCG_SportsCCGroupName: 'Final',
                        // Random Roman Checks
                        'I': j % 2 === 0 ? '12.5' : '13.0',
                        'II': '12.2',
                        'III': '12.8'
                    }))
                });
            }
        },
        // Valid for Finish, Consolidated, Indoor, Outdoor, Team, Externals
        'default': () => {
            for (let i = 0; i < count; i++) {
                mockData.push({
                    SPCCMCC_Id: i + 1,
                    SPCCMCC_CompitionCategory: `Category ${i + 1}`,
                    SPCCMSCCG_SportsCCGroupName: `Event Group ${i + 1}`,
                    SPCCMCL_Id: 1,
                    spccmcL_CompitionLevel: 'School Level',
                    RecordDetails: Array.from({ length: 3 }).map((_, j) => ({
                        AMST_Id: j,
                        AMAY_RollNo: `R-${j}`,
                        AMST_FirstName: `Winner ${j + 1}`,
                        AMST_AdmNo: `ADM-${4000 + j}`,
                        ASMCL_ClassName: 'XII',
                        ASMC_SectionName: 'A',
                        SPCCESTR_Rank: `${j + 1}`,
                        SPCCESTR_Value: '10.5',
                        SPCCMUOM_UOMName: 'Sec',
                        SPCCME_EventName: 'Finals',
                        SPCCMSCCG_SportsCCGroupName: '100m'
                    }))
                });
            }
        }
    };

    (strategies[data.Type] || strategies['default'])();

    const response: ApiResponse<ISRKVSReportData[]> = {
        success: true,
        message: 'Report generated successfully',
        data: mockData,
    };
    return response;
}
