import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
}
