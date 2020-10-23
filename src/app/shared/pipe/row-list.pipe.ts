import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rowList'
})
export class RowListPipe implements PipeTransform {

  transform(data: any): any {
    let newData = [];
    console.log(data, 'data rowList');
    

    let itemsPerRow = 5;
    let wrapPadding = 100;

    if (window.innerWidth < 400) {
      itemsPerRow = 1;
    } else if (window.innerWidth < 650) {
      wrapPadding = 20;
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
            console.log(1111111111);
            
            newData.push(dataItem);
            dataItem = [];
          } else if ((index + 1) % itemsPerRow !== 0 && index === data.length - 1){
            console.log(2222222222222222);
  
            newData.push(dataItem);
          } else if (index === data.length - 1 && !newData.length){
            console.log(3333333333333333);
  
            newData.push(dataItem);
          }
        }
       
      });

    }

    console.log(newData, 'newData rowList');
    

    return newData;
  }

}
