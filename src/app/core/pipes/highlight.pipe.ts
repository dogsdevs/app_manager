import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string, search: string): SafeHtml {
    if (!search || !value) {
      return value;
    }

    const searchLower = search.toLowerCase();
    const valueLower = value.toLowerCase();
    const index = valueLower.indexOf(searchLower);

    if (index === -1) {
      return value;
    }

    const original = value.substring(index, index + search.length);
    const highlighted = value.replace(
      new RegExp(original, 'gi'),
      (match) => `<mark class="bg-primary-500/50 dark:bg-primary-400 dark:text-neutral-900">${match}</mark>`
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
