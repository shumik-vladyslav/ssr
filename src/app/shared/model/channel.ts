import { IEpgCrossProgramData } from './epg-cross-program-data';

export interface IChannel {
  movId: number;
  SkinID: string;
  title: string;
  desc: string;
  thumbpic: string;
  thumbPicSmall: string;
  SkinType: string;
  tag: string;
  GenereOrderBy: number;
  channelID: number;
  movType: string;
  lang: string;
  ChannelTypeID: number;
  channelNumber: number;
  daysToShow: number;
  IsDefault: boolean;
  IsFree: boolean;
  programList: IEpgCrossProgramData[];
  isFavorite: boolean;
  viewCount: number;
  lastWatched: Date;
  displayType: number;
  ADV_Code: string;
  Notes: string
}

export class Channel  implements IChannel{

  movId = -1;
  SkinID = '';
  title = '';
  desc = '';
  thumbpic = '';
  thumbPicSmall = '';
  SkinType = '';
  tag = '';
  GenereOrderBy = 0;
  channelID = -1;
  movType = '';
  lang = '';
  ChannelTypeID = -1;
  channelNumber = 0;
  daysToShow = -1;
  IsDefault = false;
  IsFree = true;
  programList: IEpgCrossProgramData[]=[];
  isFavorite = false;
  viewCount = 0;
  lastWatched: Date = null;
  displayType: number;
  ADV_Code = '';
  Notes = '';

  constructor(channel:IChannel) {
    if (!channel) {
      return ;
    }

    this.movId = channel.movId;
    this.SkinID = channel.SkinID;
    this.title = channel.title;
    this.desc = channel.desc;
    this.thumbpic = channel.thumbpic;
    this.thumbPicSmall = channel.thumbPicSmall;
    this.SkinType = channel.SkinType;
    this.tag = channel.tag;
    this.GenereOrderBy = channel.GenereOrderBy;
    this.channelID = channel.channelID;
    this.movType = channel.movType;
    this.lang = channel.lang;
    this.channelNumber = channel.channelNumber;
    this.daysToShow = channel.daysToShow;
    this.IsDefault = channel.IsDefault;
    this.IsFree = channel.IsFree;
    this.programList = [];
    this.isFavorite = false;
    this.viewCount = 0;
    this.lastWatched = null;
    this.displayType = channel.displayType;
    this.ChannelTypeID = channel.ChannelTypeID;
    this.ADV_Code = channel.ADV_Code;
    this.Notes = channel.Notes;
  }

}
