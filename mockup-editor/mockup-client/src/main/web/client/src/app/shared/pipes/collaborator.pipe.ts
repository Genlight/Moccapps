import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collaborator'
})
export class CollaboratorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.map(collaborator => collaborator.username).join(', ');
  }

}
