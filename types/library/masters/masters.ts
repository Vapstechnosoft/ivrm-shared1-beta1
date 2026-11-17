//used master category
export interface IMasterLibraryList {
    lmaL_Id: number;
    mI_Id: string;
    lmaL_LibraryName: string;
    lmaL_ActiveFlag: boolean;
}

export interface IMasterVendorList {
    lmV_Id: number;
    mI_Id: number;
    lmV_MobileNo: string;
    lmV_VendorName: string;
    lmV_Address: string;
    lmV_EMailId: string;
    lmV_PhoneNo: string;
    lmV_ActiveFlg: boolean;
    lmV_CreatedBy: number;
    lmV_UpdatedBy: number;
}

export interface IMasterCategoryList {
    lmC_Id: number;
    lmC_CategoryName: string;
    lmC_BNBFlg: string;
    lmC_ActiveFlag: boolean;
    lmC_CategoryCode: string;
}

export interface IMasterPublisherList {
    lmP_Id: number;
    mI_Id: number;
    lmP_PublisherName: string;
    lmP_MobileNo: string;
    lmP_Address: string;
    lmP_EMailId: string;
    lmP_PhoneNo?: string;
    lmP_ActiveFlg: boolean;
}

export interface IMasterAuthorList {
    lmaU_Id: number;
    mI_Id: number;
    lmaU_AuthorFirstName: string;
    lmaU_AuthorMiddleName: string;
    lmaU_AuthorLastName: string;
    lmaU_MobileNo: string;
    lmaU_PhoneNo: string;
    lmaU_EmailId: string;
    lmaU_Address: string;
    lmaU_ActiveFlg: boolean;
}

export interface IMasterLanguageList {
    lmL_Id: number;
    mI_Id: number;
    lmL_LanguageName: string;
    lmL_ActiveFlg: boolean;
}

export interface IMasterSubjectList {
    lmS_Id: number;
    lmS_SubjectName: string;
    lmS_ParentId: number;
    ismS_SubjectName: string;
    lmS_ActiveFlg: boolean;
    lmS_Level: string;
    lmS_SubjectNo: string;
    lmS_ClassNo: string;
}

export interface IParentSubjectDropdownList {
    ismS_Id: number;
    ismS_SubjectName: string;
}
