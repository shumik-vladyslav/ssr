export class Config{
    severUriSecond: string;
    serverUri: string;
}

export class Tab {
    ChannelType: number;
    FieldID: number;
    FieldIcon: string;
    FieldType: number;
    LanguageID: number;
    MainFieldID: number;
    NameInSystem: string;
    Notes: string;
    RegDate: string;
    ShowOrder: number;
    ShowType: number;
    ShownName: string;
    dele: number;
}

export class Chenel{
    ADV_Code: string;
    BigPicture: string;
    ChannelDesc: string;
    ChannelID: number;
    ChannelName: string;
    ChannelNotes: string;
    ChannelNumber: number;
    ChannelTypeID: number;
    CrmLanguageId: number;
    CrmLanguageName: string;
    DisplayType: number;
    Genere_ID: number;
    Genere_Name: string;
    GenreOrderBy: number;
    IsDefaulte: false
    IsFree: true
    Logo: string;
    Show: number;
    SourceType: number;
    programLists: []
}