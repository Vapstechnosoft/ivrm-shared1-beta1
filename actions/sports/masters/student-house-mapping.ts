'use server';

import { StudentHouseMappingDTO, MasterDataDTO } from "@/types/sports/masters/student-house-mapping";

// Static Data Store (Mocking Database)
let MOCK_DATA: StudentHouseMappingDTO[] = [
    // Initial populate can be empty or have some dummy records if needed, 
    // but usually for "Add static sample data" tasks we want the *Grid* to show data.
    // The user prompt says "Start with...". 
    // Let's create a few records based on the user's provided list to populate the grid initially.
    {
        spccsH_Id: 1,
        asmaY_Id: 2024,
        asmaY_Year: '2024-2025',
        spccmH_Id: 1,
        spccmH_HouseName: 'Red House',
        studentname: 'AAHANA MURMU',
        amsT_AdmNo: '20143',
        asmcL_Id: 10,
        asmcL_ClassName: 'X',
        asmS_Id: 1,
        asmC_SectionName: 'A',
        spccsH_Date: new Date('2024-06-01'),
        spccsH_Remarks: 'Good performance',
        spccmH_ActiveFlag: true,
    },
    {
        spccsH_Id: 2,
        asmaY_Id: 2024,
        asmaY_Year: '2024-2025',
        spccmH_Id: 2,
        spccmH_HouseName: 'Blue House',
        studentname: 'AAYAN HAZRA',
        amsT_AdmNo: '20511',
        asmcL_Id: 10,
        asmcL_ClassName: 'X',
        asmS_Id: 1,
        asmC_SectionName: 'B',
        spccsH_Date: new Date('2024-06-02'),
        spccsH_Remarks: 'Selected for specialized training',
        spccmH_ActiveFlag: true,
    }
];

// Master Data
const MOCK_YEARS = [
    { asmaY_Id: 2024, asmaY_Year: '2024-2025', Selected: true },
    { asmaY_Id: 2023, asmaY_Year: '2023-2024' }
];

const MOCK_HOUSES = [
    { spccmH_Id: 1, spccmH_HouseName: 'Red House' },
    { spccmH_Id: 2, spccmH_HouseName: 'Blue House' },
    { spccmH_Id: 3, spccmH_HouseName: 'Green House' },
    { spccmH_Id: 4, spccmH_HouseName: 'Yellow House' }
];

const MOCK_CLASSES = [
    { asmcL_Id: 1, asmcL_ClassName: 'I' },
    { asmcL_Id: 2, asmcL_ClassName: 'II' },
    { asmcL_Id: 3, asmcL_ClassName: 'III' },
    { asmcL_Id: 4, asmcL_ClassName: 'IV' },
    { asmcL_Id: 5, asmcL_ClassName: 'V' },
    { asmcL_Id: 6, asmcL_ClassName: 'VI' },
    { asmcL_Id: 7, asmcL_ClassName: 'VII' },
    { asmcL_Id: 8, asmcL_ClassName: 'VIII' },
    { asmcL_Id: 9, asmcL_ClassName: 'IX' },
    { asmcL_Id: 10, asmcL_ClassName: 'X' },
    { asmcL_Id: 11, asmcL_ClassName: 'XI' },
    { asmcL_Id: 12, asmcL_ClassName: 'XII' }
];

const MOCK_SECTIONS = [
    { asmS_Id: 1, asmC_SectionName: 'A' },
    { asmS_Id: 2, asmC_SectionName: 'B' },
    { asmS_Id: 3, asmC_SectionName: 'C' }
];

// User provided student list
const MOCK_STUDENTS = [
    { studentname: "AAHANA MURMU", amsT_AdmNo: "20143", amsT_Id: 101, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "AAROHI DAS", amsT_AdmNo: "20554", amsT_Id: 102, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "AARUSH SINGH", amsT_AdmNo: "20670", amsT_Id: 103, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "AAYAN HAZRA", amsT_AdmNo: "20511", amsT_Id: 104, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "abc", amsT_AdmNo: "ADM/0002/24-25", amsT_Id: 105, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "ABDUL HAMID HASSAN", amsT_AdmNo: "19852", amsT_Id: 106, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "ABRAQ AYAZ", amsT_AdmNo: "19854", amsT_Id: 107, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "ADHYAN SHAW", amsT_AdmNo: "20517", amsT_Id: 108, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "ADITYA SHAW", amsT_AdmNo: "20613", amsT_Id: 109, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "ADRIJA DAS", amsT_AdmNo: "19858", amsT_Id: 110, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "ADRITO DAS", amsT_AdmNo: "19866", amsT_Id: 111, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "ALIZA PARVEEN", amsT_AdmNo: "20094", amsT_Id: 112, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "ANABIA SAYAM", amsT_AdmNo: "20508", amsT_Id: 113, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "AYESHA", amsT_AdmNo: "ADM/0008/24-25", amsT_Id: 114, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "AYUSH SHAW", amsT_AdmNo: "20715", amsT_Id: 115, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "BIYAS MONDAL", amsT_AdmNo: "21290", amsT_Id: 116, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "DARPAK NAG", amsT_AdmNo: "20261", amsT_Id: 117, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "DIVYANSH JAISWAL", amsT_AdmNo: "20371", amsT_Id: 118, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "FAZAL HUSSAIN", amsT_AdmNo: "19874", amsT_Id: 119, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "fsddfdKUMARY", amsT_AdmNo: "ADM/0075/24-25", amsT_Id: 120, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "ganeshpaa", amsT_AdmNo: "ADM/0058/24-25", amsT_Id: 121, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "gani", amsT_AdmNo: "ADM/0066/24-25", amsT_Id: 122, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "HAMMAD RAZA", amsT_AdmNo: "20516", amsT_Id: 123, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "HUZAIFA ALI", amsT_AdmNo: "20518", amsT_Id: 124, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "ISHAN BANERJEE", amsT_AdmNo: "19870", amsT_Id: 125, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "JOYABRATA PAUL", amsT_AdmNo: "19861", amsT_Id: 126, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "KRISHNENDU BASU", amsT_AdmNo: "19869", amsT_Id: 127, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "LAIBA AMIR", amsT_AdmNo: "20625", amsT_Id: 128, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "MD ZAYAN ZAFAR", amsT_AdmNo: "20020", amsT_Id: 129, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "MITAKSHI PAUL", amsT_AdmNo: "20110", amsT_Id: 130, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "MOHAMMADSADAQATSABIR", amsT_AdmNo: "20038", amsT_Id: 131, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "MRITTIJO NANDY", amsT_AdmNo: "19851", amsT_Id: 132, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "NISTHA GHOSH", amsT_AdmNo: "20037", amsT_Id: 133, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "PARAM HAZRA", amsT_AdmNo: "20049", amsT_Id: 134, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "PIYUSH DATTATRAYSHINDE", amsT_AdmNo: "20666", amsT_Id: 135, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "RAJDEEP KOLEY", amsT_AdmNo: "19863", amsT_Id: 136, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "RAJVEERYADAV", amsT_AdmNo: "21268", amsT_Id: 137, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "RISHIT ROY", amsT_AdmNo: "20395", amsT_Id: 138, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "RITAM BANERJEE", amsT_AdmNo: "20504", amsT_Id: 139, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "RITIKA JHA", amsT_AdmNo: "20506", amsT_Id: 140, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "RITURAJ PAUL", amsT_AdmNo: "19859", amsT_Id: 141, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "SAATVIK BOTHRA", amsT_AdmNo: "20013", amsT_Id: 142, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "SAKSHAM PRAJAPATI", amsT_AdmNo: "19891", amsT_Id: 143, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "SAKSHI SHAW", amsT_AdmNo: "20556", amsT_Id: 144, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "SHAFIRA SHAKIR", amsT_AdmNo: "19877", amsT_Id: 145, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "SHEA LENKA", amsT_AdmNo: "20521", amsT_Id: 146, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "SHIVAAY JAISWAL", amsT_AdmNo: "19855", amsT_Id: 147, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "SHIVAM SHAW", amsT_AdmNo: "19865", amsT_Id: 148, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "SHIZA ALI", amsT_AdmNo: "20520", amsT_Id: 149, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "SHOURYA SHAILESHGAIKWAD", amsT_AdmNo: "20616", amsT_Id: 150, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "SHRISTI SHAW", amsT_AdmNo: "21043", amsT_Id: 151, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "SOUMILI BASU", amsT_AdmNo: "20027", amsT_Id: 152, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "SOUMYARAJ", amsT_AdmNo: "21259", amsT_Id: 153, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "TAHA AFSAR KHAN", amsT_AdmNo: "19559", amsT_Id: 154, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "TANISHQ DEY", amsT_AdmNo: "19876", amsT_Id: 155, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "TANISTHA CHATTERJEE", amsT_AdmNo: "19846", amsT_Id: 156, asmcL_Id: 10, asmS_Id: 2 },
    { studentname: "TANNISH MUKHERJEE", amsT_AdmNo: "20503", amsT_Id: 157, asmcL_Id: 10, asmS_Id: 3 },
    { studentname: "testqq", amsT_AdmNo: "ADM/0047/24-25", amsT_Id: 158, asmcL_Id: 11, asmS_Id: 1 },
    { studentname: "testtttttKUMARY", amsT_AdmNo: "ADM/0049/24-25", amsT_Id: 159, asmcL_Id: 11, asmS_Id: 2 },
    { studentname: "TRIJAL SONKAR", amsT_AdmNo: "19850", amsT_Id: 160, asmcL_Id: 11, asmS_Id: 3 },
    { studentname: "UPASANA DAS", amsT_AdmNo: "21300", amsT_Id: 161, asmcL_Id: 12, asmS_Id: 1 },
    { studentname: "VAIBHAV JAISWAL", amsT_AdmNo: "19853", amsT_Id: 162, asmcL_Id: 12, asmS_Id: 2 },
    { studentname: "VISHALB", amsT_AdmNo: "469/24/25", amsT_Id: 163, asmcL_Id: 12, asmS_Id: 3 },
    { studentname: "VYAS JAISWAL", amsT_AdmNo: "20368", amsT_Id: 164, asmcL_Id: 10, asmS_Id: 1 },
    { studentname: "YASH SINGH", amsT_AdmNo: "19871", amsT_Id: 165, asmcL_Id: 10, asmS_Id: 2 }
];

export async function getStudentHouseMappings(): Promise<StudentHouseMappingDTO[]> {
    return MOCK_DATA;
}

export async function getMasterData(): Promise<MasterDataDTO> {
    return {
        yearlist: MOCK_YEARS,
        houseList: MOCK_HOUSES,
        classList: MOCK_CLASSES,
        sectionDropdown: MOCK_SECTIONS,
        studentList: MOCK_STUDENTS
    };
}

export async function saveStudentHouseMapping(data: StudentHouseMappingDTO): Promise<{ success: boolean; message: string }> {
    // Simulate Save
    console.log('Saving Data:', data);

    // In a real scenario we would iterate over studList1 and create records
    // For this mock, we'll just push one representative record per student to the Grid MOCK_DATA
    if (data.studList1 && data.studList1.length > 0) {
        data.studList1.forEach(student => {
            const studentDetails = MOCK_STUDENTS.find(s => s.amsT_Id === student.amsT_Id);
            const houseDetails = MOCK_HOUSES.find(h => h.spccmH_Id === data.spccmH_Id);
            const yearDetails = MOCK_YEARS.find(y => y.asmaY_Id === data.asmaY_Id);
            const classDetails = MOCK_CLASSES.find(c => c.asmcL_Id === data.asmcL_Id);
            const sectionDetails = MOCK_SECTIONS.find(s => s.asmS_Id === data.asmS_Id);

            const newRecord: StudentHouseMappingDTO = {
                spccsH_Id: Math.floor(Math.random() * 10000), // Random ID
                asmaY_Id: data.asmaY_Id,
                asmaY_Year: yearDetails?.asmaY_Year,
                spccmH_Id: data.spccmH_Id,
                spccmH_HouseName: houseDetails?.spccmH_HouseName,
                asmcL_Id: data.asmcL_Id,
                asmcL_ClassName: classDetails?.asmcL_ClassName,
                asmS_Id: data.asmS_Id,
                asmC_SectionName: sectionDetails?.asmC_SectionName,
                spccsH_Date: data.spccsH_Date,
                spccsH_Remarks: data.spccsH_Remarks,
                spccmH_ActiveFlag: true,
                studentname: studentDetails?.studentname,
                amsT_AdmNo: studentDetails?.amsT_AdmNo
            };
            MOCK_DATA.push(newRecord);
        });
        return { success: true, message: 'Record Saved Successfully!' };
    }

    return { success: false, message: 'No students selected' };
}

export async function deleteStudentHouseMapping(id: number, activeFlag: boolean): Promise<{ success: boolean; message: string }> {
    const index = MOCK_DATA.findIndex(item => item.spccsH_Id === id);
    if (index !== -1) {
        MOCK_DATA[index].spccmH_ActiveFlag = !activeFlag; // Toggle
        return { success: true, message: activeFlag ? 'Record Deactivated Successfully!' : 'Record Activated Successfully!' };
    }
    return { success: false, message: 'Record not found' };
}

// Need a specific get_class, get_section, get_student to mimic the angular behavior if we want to be precise,
// but for static data `getMasterData` providing everything is usually enough for the UI to just filter client-side or we can separate them.
// The Plan said "getMasterData" returns static lists.
// The UI can filter `studentList` based on Class/Section if we want to be fancy, or just show all.
// Given the requirements "Add static sample data so it look like real working page", displaying the full list or a filtered list is fine.
