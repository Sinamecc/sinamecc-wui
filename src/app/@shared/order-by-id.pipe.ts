import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderById',
  standalone: true, // Pipe standalone
})
export class OrderByIdPipe implements PipeTransform {
  transform(array: any[], ...args: unknown[]): any[] {
    return array ? array.sort((a, b) => a.id - b.id) : array;
  }
}
