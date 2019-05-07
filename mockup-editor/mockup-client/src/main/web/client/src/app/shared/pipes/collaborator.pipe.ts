import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
  name: 'collaborator'
})
export class CollaboratorPipe implements PipeTransform {

  transform(value: User[] | undefined | null, args?: any): string {
    return (!!value) ? value.map(user => user.username).join(', ') : 'No collaborators.';
  }

}
