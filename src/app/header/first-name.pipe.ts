import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'firstname'
})
export class FirstNamePipe implements PipeTransform {

    transform(name: string): string {
        return name.split(' ')[0];
    }
}
