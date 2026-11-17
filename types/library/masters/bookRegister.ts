export interface BookRegister {
    lmB_Id: number;
    mI_Id: number;
    lmB_BookTitle: string;
    mB_Subtitle?: string;
    lmC_Id: number;
    lmB_BookType: string;
    lmS_Id: number;
    lmD_Id: number;
    binding_Type?: string;
    lmB_Edition?: string;
    lmB_PublishedYear: string;
    lmB_EntryDate: Date;
    mB_Call_No?: string;
    lmB_ISBNNo: string;
    lmB_ClassNo?: string;
    lmB_VolNo?: string;
    mB_Pages?: number;
    invoice_No?: string;
    lmBkf_KeyFactor?: string;
    lmBkf_PageNo?: number;
    lmB_BookNo?: string;
    lmAL_Id: number;

    purchase_Date: Date;
    lmL_Id: number;
    lmB_BillNo?: string;
    voucher_No?: string;
    lmB_PurOrDonated: string;
    donor_Id?: string;
    lmB_DonorAddress?: string;
    currencyType?: string;
    source_Type?: string;
    lmV_Id?: number;
    mB_Keywords?: string;
    lmP_Id?: number;
    mB_Remarks?: string;
    bibliography_Page?: string;
    index_Page?: string;

    lmAU_Id?: number;
    lmB_AuthorFirstName?: string;
    lmB_AuthorMiddleName?: string;
    lmB_AuthorLastName?: string;

    lmbanO_AvialableStatus: string;
    lRM_Id: number;
    lSM_Id: number;
    lRAM_Id: number;
    lmrA_Id: number;

    lmB_Price?: number;
    mB_Disc_Type?: string;
    mB_Discountper?: number;
    mB_Discount?: number;
    lmB_NetPrice?: number;

    with_Accessories?: boolean;
    lmaC_Id?: number;
    mB_ActiveFlag?: boolean;
    lmB_StudentPhoto?: string;

    // For List Display join fields
    lmC_CategoryName?: string;
    lmS_SubjectName?: string;
    lmD_DepartmentName?: string;
    lmP_PublisherName?: string;
    lmL_LanguageName?: string;
    lmV_VendorName?: string;
    lmrA_RackName?: string;
    AUTHOR_FullName?: string;
    lmbanO_AccessionNo?: string;
}

export interface AccessionDTO {
    lmbanO_Id?: number;
    lmbanO_No: string;
    lmbanO_AvialableStatus?: string;
}

export interface AttachmentDTO {
    lmbA_Id?: number;
    lmbA_FileName: string;
    lmbA_FilePath: string;
}

export interface BookRegisterPayload {
    lmB_Id?: number;
    mI_Id?: number;
    lmB_BookTitle: string;
    mB_Subtitle?: string;
    lmC_Id: number;
    lmB_BookType: string;
    lmS_Id: number;
    lmD_Id: number;
    binding_Type?: string;
    lmB_Edition?: string;
    lmB_PublishedYear: string | number;
    lmB_EntryDate: Date | string;
    mB_Call_No?: string;
    lmB_ISBNNo: string;
    lmB_ClassNo?: string;
    lmB_VolNo?: string;
    mB_Pages?: number;
    invoice_No?: string;
    lmBkf_KeyFactor?: string;
    lmBkf_PageNo?: number;
    lmB_BookNo?: string;
    lmAL_Id: number;

    purchase_Date: Date | string;
    lmL_Id: number;
    lmB_BillNo?: string;
    voucher_No?: string;
    lmB_PurOrDonated: string;
    donor_Id?: string;
    lmB_DonorAddress?: string;
    currencyType?: string;
    source_Type?: string;
    lmV_Id?: number;
    mB_Keywords?: string;
    lmP_Id?: number;
    mB_Remarks?: string;
    bibliography_Page?: string;
    index_Page?: string;

    lmAU_Id?: number;
    lmB_AuthorFirstName?: string;
    lmB_AuthorMiddleName?: string;
    lmB_AuthorLastName?: string;

    lmbanO_AvialableStatus: string;
    lRM_Id: number;
    lSM_Id: number;
    lRAM_Id: number;
    lmrA_Id: number;

    lmB_Price?: number;
    mB_Disc_Type?: string;
    mB_Discountper?: number;
    mB_Discount?: number;
    lmB_NetPrice?: number;

    with_Accessories?: boolean;
    lmaC_Id?: number;

    accessionList?: AccessionDTO[];
    attachementList?: AttachmentDTO[];
    mB_ActiveFlag?: boolean;
    lmB_StudentPhoto?: string;
    lmB_FirstSummary?: string;
    lmB_SecondSummary?: string;
    lmB_ThirdSummary?: string | number;
}
