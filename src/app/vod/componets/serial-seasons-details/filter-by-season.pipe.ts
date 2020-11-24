import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySeason'
})
export class FilterBySeasonPipe implements PipeTransform {

  transform(value: any, season: any): any {
    let newValue;
    if (value && season) {
      newValue = value.filter(episode => {
        return episode.Serial_seasone === season
      });
    }
    console.log(newValue);
    
    return newValue;
  }

}
