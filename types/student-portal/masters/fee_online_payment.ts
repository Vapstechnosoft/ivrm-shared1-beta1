

export interface IOnlinePaymentStudenyInformationList {
    amst_Id: number;
    
    amsT_FirstName: string;
    amsT_MiddleName: string;
    amsT_LastName: string;
    amsT_RegistrationNo: string;
    amsT_AdmNo: string;
    classname: string;
   sectionname: string;
   amst_email_id:string;
   asmcL_ID:Number;
   amst_mobile:number;
   asmaY_Id:Number;
   amaY_RollNo:string;

}
export interface FeeStructure
{
fmH_FeeName:string;
ftI_Name:string;
fsS_OBArrearAmount:number;
fsS_NetAmount:number;
fsS_TotalToBePaid:number;
fsS_ConcessionAmount:number;
fsS_FineAmount:number;
fsS_ToBePaid:number;
}

export interface GroupTermMapping {

 grp: {
        checkedgrplst: boolean;
        grpdisable: boolean;
        fmgG_GroupName: string;
        fmgG_Id: string;
    };
    trm_list: {
        checkedheadlst: boolean;
        termdisablechk: boolean;
        fmT_Name: string;
        fmT_Id: string;
    }[];
  
}
 
   