import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastediteddate'
})
export class LastediteddatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return (!!value) ? value : new Date();
  }

}
