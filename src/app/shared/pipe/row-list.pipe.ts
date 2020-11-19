import { Pipe, PipeTransform, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Pipe({
  name: 'rowList'
})
export class RowListPipe implements PipeTransform {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  transform(data: any, undater?: any): any {
    let newData = [];

    let itemsPerRow = 5;
    let wrapPadding = 100;

    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 650) {
        wrapPadding = 50;
        itemsPerRow = 2;
      } else if (window.innerWidth < 850) {
        itemsPerRow = 3;
        wrapPadding = 40;
      } else if (window.innerWidth < 1025) {
        itemsPerRow = 4;
        wrapPadding = 40;
      } else if (window.innerWidth < 1321) {
        itemsPerRow = 4;
        wrapPadding = 60;
      }
    }


    if (data) {
      let dataItem = [];

      data.forEach((element, index) => {
        element['itemsPerRow'] = itemsPerRow;
        element['wrapPadding'] = wrapPadding;
        dataItem.push(element);

        if (itemsPerRow === 1) {

          newData.push(dataItem);
          dataItem = [];

        } else {
          if ((index + 1) % itemsPerRow === 0 && index !== data.length - 1) {
            newData.push(dataItem);
            dataItem = [];
          } else if ((index + 1) % itemsPerRow === 0 && index === data.length - 1) {
            newData.push(dataItem);
          } else if ((index + 1) % itemsPerRow !== 0 && index === data.length - 1) {
            newData.push(dataItem);
          } else if (index === data.length - 1 && !newData.length) {
            newData.push(dataItem);
          }
        }

      });

    }
    return newData;
  }

}
