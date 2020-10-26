import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'currentDate'
})
export class CurrentDatePipe implements PipeTransform {

  transform(value: any, format: any): any {
    let newValue;
    
    let timeZone = moment().parseZone().utcOffset() / 60;

    newValue = moment(value).add(timeZone, 'hours').format(format);

    return newValue;
  }

}
