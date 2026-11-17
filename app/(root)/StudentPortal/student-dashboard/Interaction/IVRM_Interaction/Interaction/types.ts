export interface InteractionMessage {
    ISMINT_Id: number;
    ISTINT_Id: number;
    ISMINT_InteractionId: number;
    ISMINT_Subject: string;
    ISMINT_Interaction: string;
    ISMINT_GroupOrIndFlg: string; // 'Group' | 'Individual'
    ISMINT_ComposedByFlg: string;
    Sender: string;
    Receiver: string;
    ISMINT_DateTime: string;
    ISTINT_Attachment: string | null;
    ISMINT_Attachment: string | null;
    ISMINT_ComposedById: number;
    ISTINT_ReadFlg: number | null;
    filetype2?: string;
}

export interface InteractionReply {
    ISTINT_Id: number;
    ISTINT_Interaction: string;
    Sender: string;
    ISTINT_DateTime: string;
    ISTINT_Attachment: string | null;
    filetype?: string;
    filetype2?: string;
    ISTINT_ComposedById: number;
}
