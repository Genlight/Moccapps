import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'usercircle'
})
export class UsercirclePipe implements PipeTransform {

  transform(value: string, args?: any): string {
      return value.substr(0,2);
  }

}
