import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefixChapterNumber'
})
export class PrefixChapterNumberPipe implements PipeTransform {

  transform(chapterId: any) {
    if (isNaN(chapterId)) {
      return chapterId;
    } else {
      return `Chapter ${chapterId}`;
    }
  }

}
