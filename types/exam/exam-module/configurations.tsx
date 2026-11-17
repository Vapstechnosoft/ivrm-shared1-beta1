export interface IExamStandard {
    exmConfig_Id: number;
    mI_Id: number;

    exmConfig_RankingMethod?: string;
    exmConfig_PromotionFlag: boolean;
    exmConfig_PassFailRankFlag: boolean;
    exmConfig_Recordsearchtype?: string;
    exmConfig_Remarks: string;

    exmConfig_GraceAplFlg: boolean;
    exmConfig_BonusAplFlag: boolean;
    exmConfig_MinAttAplFlag: boolean;
    exmConfig_MarksMultiply: boolean;

    exmConfig_NoOfDecimal: number;
    exmConfig_GroupMarksToResultFlg: boolean;
    exmConfig_EnableFractionFlg: boolean;
    exmConfig_EntryDateRestFlg: boolean;

    exmConfig_AdmnoColumnDisplay: boolean;
    exmConfig_RegnoColumnDisplay: boolean;
    exmConfig_RollnoColumnDisplay: boolean;

    exmConfig_RoundoffFlag: boolean;
    exmConfig_NoOfDecimalValues: number;
    exmConfig_PerRoundoffFlag: boolean;

    exmConfig_HallTicketFlg: boolean;
    exmConfig_FailBoldFlg: boolean;
    exmConfig_FailItalicFlg: boolean;
    exmConfig_FailUnderscoreFlg: boolean;
    exmConfig_FailColorFlg?: string;

    exmConfig_AllSubjectAbsentFlg: boolean;
    exmConfig_FeeDefaulterDisplayFlg: boolean;
    exmConfig_AdmNoRegNoRollNo_DefaultFlag: string;

    exmConfig_ClassRankFlg: boolean;
    exmConfig_SecRankFlg: boolean;
    exmConfig_ClassPositionFlg: boolean;
    exmConfig_SectionPositionFlg: boolean;
    exmConfig_FailRankFlg: boolean;

    exmConfig_GroupwiseMarksFlg: boolean;
    exmConfig_PromSubjRoundoffFlag: boolean;
    exmConfig_SubjectwiseSecRankFlg: boolean;
    exmConfig_SubjectwiseClassRankFlg: boolean;
}
