import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByList'
})
export class SortByListPipe implements PipeTransform {

  transform(value: any, args: any): any {
    let newValue = [];
    let keys = Object.keys(args).sort((a: any, b: any) => {
      if (args[a] < args[b]) {
        return -1;
      } else if (args[a] > args[b]) {
        return 1;
      } else {
        return 0;
      }
    });

    // 0: "Gospel"
    // 1: "Live cams"
    // 2: "Education"
    // 3: "Religion"
    // 4: "Science"
    // 5: "Indian"
    // 6: "News"
    // 7: "Sports"
    // 8: "Live M3U8"
    // 9: "Entertainment"
    // 10: "Kids"
    // 11: "Fun"
    // 12: "Youth"
    // 13: "Movies"

    keys.map(key => {
      value.map(item => {
        if (item.key === key) {
          newValue.push(item)
        }
      })
    })


    return newValue;
  }

}
