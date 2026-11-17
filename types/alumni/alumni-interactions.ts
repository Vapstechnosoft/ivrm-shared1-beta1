export interface IAlumniInteraction {
    ALSMINT_Id: number;
    ALSTINT_Id: number;
    ALSMINT_InteractionId: string;
    ALSMINT_Subject: string;
    ALSMINT_Interaction: string;
    ALSMINT_ComposedByFlg: string;
    Sender: string;
    Receiver: string;
    ALSMINT_DateTime: string;
    ALSTINT_Attachment: string;
    ALSMINT_ComposedById: number;
    ALSMINT_GroupOrIndFlg: 'Group' | 'Individual';
    filetype2?: string;
}

export interface IAlumniInteractionReply {
    ALSTINT_Id: number;
    ALSTINT_Interaction: string;
    ALSTINT_Attachment: string;
    ALSTINT_DateTime: string;
    Sender: string;
    Receiver: string;
    filetype?: string;
    ALSTINT_ComposedById: number;
}

export interface IAlumniInteractionAlumni {
    ALMST_Id: number;
    alumniname: string;
    tck?: boolean;
}

export interface IAlumniInteractionLoadResponse {
    roletype: { ivrmrT_Role: string; ivrmrT_Id: number }[];
    userhrmE_Id: number;
    asmaY_Id: number;
    almsT_Id: number;
    mI_Id: number;
    getinboxmsg: IAlumniInteraction[];
    total?: number;
    page?: number;
    page_size?: number;
}

export interface IAlumniDetailsResponse {
    getdetails: IAlumniInteractionAlumni[];
    viewmessage: IAlumniInteractionReply[];
}
