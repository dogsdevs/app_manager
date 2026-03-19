import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse">
      @for (row of rowsArray(); track $index) {
        <div class="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <div class="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
      }
    </div>
  `,
})
export class TableSkeletonComponent {
  rows = input(5);
  rowsArray = computed(() => Array.from({ length: this.rows() }));
}
