import { Injectable } from '@angular/core';
import { GeneralAppService } from '../general.service';

@Injectable({
  providedIn:'root'
})
export class TimeDateUtilsService {

  constructor(private _generalAppService:GeneralAppService) { }

  weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  getDayName(dayNum) {
    return this.weekday[dayNum];
  }

  getDaysDifferce(first:Date, second:Date):number
  {
    let span = (first.getTime() - second.getTime()) / (1000 * 60 * 50 * 24);
    return span;
  }

  convertJsonDateToDateObj(str:string):Date
  {
    let str1 = str.replace('/', '');
    str1 = str1.replace('Date', '');
    str1 = str1.replace('\/', '');
    str1 = str1.replace('(', '');
    str1 = str1.replace(')', '');
    const int1 = parseInt(str1, 10);
    const ret = new Date(int1);

    return ret;
  }

  getMonthName(monthNum:number):string
  {
    return this.monthName[monthNum];
  }


  convertDateToSlashedDate  (date:any):string {
    let month = date.getMonth() + 1;
    return date.getDate() + "/" + month + "/" + date.getFullYear();
  }

  convertDateToDateStringFull (date:Date):string {
    if (!date) date = new Date();
    let day:any = date.getDate();
    if (day < 10) day = "0" + day;
    let month:any= date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let hour:any = date.getHours();
    if (hour < 10) hour = "0" + hour;
    let minute:any = date.getMinutes();
    if (minute < 10) minute = "0" + minute;
    let seconds:any = date.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;
    let retDate = day + "/" + month + "/" + date.getFullYear() + " " + hour + ":" + minute + ":" + seconds;
    return retDate;
  }

  convertDateToFullDateString  (date:Date):string {
    return date.toString()
  }

  ConvertDateToTimeString (date:any):string {

    let minutes:any = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return date.getHours() + ":" + minutes;
  }

  addMinutes (date:Date, minutes:number) {
    let t = date.getTime();
    return new Date(t + (minutes * 60000));

  }

  addSeconds  (date:Date, secs:number):Date {
    const t = date.getTime();
    return new Date(t + (secs * 1000));

  }

  addDays  (date:Date, days):Date {
    const t = date.getTime();
    return new Date(t + (days * 1000 * 24 * 3600));

  }

  removeSeconds  (timeStr:string):string {
    const spl = timeStr.split(':');
    return spl[0] + ":" + spl[1];
  }

  converTimeStringToSeconds  (timeStr:string):number {
    try {
      let spl = timeStr.split(':');
      if (spl.length == 3)
        return parseInt(spl[2], 10) + parseInt(spl[1], 10) * 60 + parseInt(spl[0], 10) * 60 * 60;

      return parseInt(spl[1], 10) * 60 + parseInt(spl[0], 10) * 60 * 60;
    }
    catch (e) {

    }
  }

  fixDurationRounding(duration:string):string
  {
    const spl:any[] = duration.split(':');

    let ret = spl[0] +":"+ spl[1] +":"+ Math.round(spl[2])
    return ret;
  }

  convertDateAndTimewholeStringToDateObj (dateTimeStr):Date
  {
    if (!dateTimeStr) return null;
    try
    {
      const dateTimeStrSpl = dateTimeStr.split(' ');
      if (dateTimeStrSpl.length==2)
        return this.convertDateAndTimeStringToDateObj(dateTimeStrSpl[0], dateTimeStrSpl[1])
    }
    catch(e)
    {
      //  reportsHandler.ReportErrorLogging("TimeDateUtils  convertDateAndTimewholeStringToDateObj error ", e, "");
    }
    return null;
  }

  convertDateStringToDateObj(dateStr):Date
  {
    const dateSplit = dateStr.split('/');
    return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0],0,0,0);
  }

  convertDateAndTimeStringToDateObj(dateStr, timeStr):Date {
    try {
      const dateSplit = dateStr.split('/');
      const timeSplit = timeStr.split(':');

      if (dateSplit.length >= 2 && timeSplit.length >= 2) {
        const date = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0], timeSplit[0], timeSplit[1], timeSplit[2]);
        return date;
      }
    }
    catch (e) {
      throw e;
      //reportsHandler.ReportErrorLogging("TimeDateUtils  convertDateAndTimeStringToDateObj error ", e, "");
    }
  }

  convertTimeStrToHourAndMinutesObj =function(rawStr)
  {
    try
    {
      if (!rawStr) return null;

      const spl = rawStr.split(':');
      let retObj:any = new Object();
      retObj.hour =parseInt(spl[0]);
      retObj.minute = parseInt(spl[1]);
      retObj.second = parseInt(spl[2]);

      return retObj;
    }
    catch(e)
    {
      console.error('TimeDateUtils convertTimeStrToHourAndMinutesObj error' + e);
    }

  }

  isTimeMinAndHourEqual(oldTime, newTime)
  {
    if (!oldTime || !newTime) return false;
    if (oldTime.getMinutes() == newTime.getMinutes() && oldTime.getHours() == newTime.getHours())
      return true;
    return false;
  }

  convertCSharpDateToDateObj(str)
  {
    const re = /-?\d+/;
    const m = re.exec(str);
    const d = new Date(parseInt(m[0]));
    //  str = str.replace("/Date(", "");
    //  str = str.replace(")/", "");

    return d;
  }
  convertSecondsToTime  (secs)
  {
    let minutes = Math.floor((secs / 60) % 60);
    let MinutesStr=minutes.toString(10);
    if (minutes < 10) MinutesStr = '0' + minutes;
    let hours = Math.floor(secs / 3600);
    return hours + ':' + minutes;
  }

  convertSecondsToTimeWithSeconds  (secs)
  {
      // let seconds=Math.floor(secs%60)
      // let secondsStr=seconds.toString(10);
      // if (seconds < 10) secondsStr = '0' + seconds;
      // let minutes = Math.floor((secs / 60) % 60);
      // let MinutesStr=minutes.toString(10);
      // if (minutes < 10) MinutesStr = '0' + minutes;
      // let hours = Math.floor(secs / 3600);
      // if (hours==0)
      // return MinutesStr+":"+secondsStr;
      // return hours + ':' + MinutesStr+":"+secondsStr;
       // Hours, minutes and seconds
    var hrs = ~~(secs / 3600);
    var mins = ~~((secs % 3600) / 60);
    var s = ~~secs % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    // if (hrs > 0) {
    //     ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    // }

    ret += "" + mins + ":" + (s < 10 ? "0" : "");
    ret += "" + s;
    return ret;
  }
  now():Date
  {
    let userDate:Date;
      if (this._generalAppService.generalParams && this._generalAppService.generalParams.forceEpgShiftHours=="true")
      {
          var now = new Date();
          var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
           userDate = new Date(now_utc.getTime() + 1000 * 60 * 60 * ( parseInt(this._generalAppService.generalParams.EpgShiftHours)));
      }
      else {
          var now = new Date();
          userDate = now;
      }
      return userDate;
  }
  getUtcTime(date:Date):Date
  {
      var newDate;
      if (this._generalAppService.generalParams && this._generalAppService.generalParams.forceEpgShiftHours=="true")
      {
          newDate = new Date(date.getTime() - 1000 * 60 * 60 * parseInt(this._generalAppService.generalParams.EpgShiftHours));
      }
      else
      {
          newDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

      }
      return newDate;
  }
  getNowUtcTimeLocal()
  {
      var now = new Date();
      var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      return now_utc;
  }
  offset ()
  {
    let offset:number;
      if (this._generalAppService.generalParams && this._generalAppService.generalParams.forceEpgShiftHours=="true")
      {
          offset = -60 * parseInt(this._generalAppService.generalParams.EpgShiftHours);
      }
      else
      {
          var date = new Date();
          offset = date.getTimezoneOffset()
      }

      return offset;
  }

}
