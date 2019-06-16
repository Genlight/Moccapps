import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'usercircle'
})
export class UsercirclePipe implements PipeTransform {

  transform(value: User, args?: any): string {
    return value.username.substr(0,2);
  }

}
