export interface IDashboardData {
    friendrequestlist: any[];
    calenderlist: ICalendarEvent[];
    rolename: string;
    batch: IBatch[];
    alumnilist: IAlumniList[];
    alumnibirthday: IAlumniBirthday[];
    birthdaylist: IBirthdayMarquee[];
    totaldonation: IDonation[];
}

export interface ICalendarEvent {
    coemE_EventName: string;
    coeE_EStartDate: string;
    coeE_EEndDate: string;
}

export interface IBatch {
    BATCHES: string;
    ASMAY_From_Date: string;
    ASMAY_To_Date: string;
    NOofstudents: number;
    ASMAY_Id: number;
}

export interface IAlumniBirthday {
    studentname: string;
    ALMST_DOB: string;
    ALMST_AdmNo: string;
    ASMAY_Year: string;
    classname: string;
    ALMST_emailId: string;
    ALMST_MobileNo: string;
}

export interface IAlumniList {
    Name: string;
    ALMST_AdmNo: string;
    ASMAY_Year: string;
    classname: string;
    ALMST_MobileNo: string;
}

export interface IBirthdayMarquee {
    almsT_FirstName: string;
    almsT_MiddleName: string;
    almsT_LastName: string;
}

export interface IDonation {
    ALDON_Amount: number;
}

export interface IGallery {
    algA_GalleryName: string;
    algA_Date: string;
    algA_Time: string;
    algA_Id: number;
}

export interface INotice {
    alntb_title: string;
    alntb_description: string;
    alntb_startdate: string;
    alntb_enddate: string;
    filecount: number;
    alntb_id: number;
}

export interface IYearwiseCount {
    BATCHES: string;
    classname: string;
    NOofstudents: number;
    ASMAY_Id: number;
    ASMCL_Id: number;
}

export interface IClasswiseStudent {
    studentname: string;
    asmay_year: string;
    almst_admno: string | null;
    classname: string;
    almst_mobileno: number | string;
    almst_emailid: string;
    almst_dob: string;
}
export interface IAlumniGalleryDetail {
    algA_Id: number;
    algaP_Id?: number;
    algaV_Id?: number;
    algA_GalleryName: string;
    algA_Date: string | Date;
    algA_Time: string;
    algA_ActiveFlag: boolean;
    algaP_Photos?: string;
    algaV_Videos?: string;
}
