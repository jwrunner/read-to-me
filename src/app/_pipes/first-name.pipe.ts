import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'firstName'
})
export class FirstNamePipe implements PipeTransform {
    transform(name: string): string {
        return name.split(' ')[0];
    }
}
