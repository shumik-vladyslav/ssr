import { IChannel } from './channel';

export interface IChannelInfo
{
  lineIdx: number;
  channel:IChannel
}
export class ChannelInfo
{
  lineIdx:number;
  channel:IChannel;

  constructor(lineIdx,channel)
  {
    this.channel=channel;
    this.lineIdx=lineIdx;
  }
}
