import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIcon, MatButton],
  template: `
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <mat-icon 
        class="mb-4 text-6xl text-neutral-400" 
        [svgIcon]="icon()" />
      
      @if (searchTerm()) {
        <h3 class="text-lg font-medium text-neutral-900 dark:text-white">
          No hay resultados para "<span class="text-primary-500">{{ searchTerm() }}</span>"
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Intenta con otros términos de búsqueda
        </p>
        <button 
          matButton="outlined" 
          class="mt-4"
          (click)="clearSearch.emit()">
          <mat-icon svgIcon="x" />
          Limpiar búsqueda
        </button>
      } @else {
        <h3 class="text-lg font-medium text-neutral-900 dark:text-white">
          {{ title() }}
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {{ description() }}
        </p>
        @if (showAction()) {
          <button 
            matButton="filled" 
            class="mt-4"
            (click)="action.emit()">
            <mat-icon [svgIcon]="actionIcon()" />
            {{ actionText() }}
          </button>
        }
      }
    </div>
  `,
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  title = input<string>('No hay datos');
  description = input<string>('');
  searchTerm = input<string>('');
  showAction = input<boolean>(true);
  actionText = input<string>('Crear nuevo');
  actionIcon = input<string>('plus');
  
  action = output<void>();
  clearSearch = output<void>();
}
