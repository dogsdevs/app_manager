import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { isEqual } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class FormChangesDetectorService {
  
  /**
   * Retorna un Observable que emite `true` si el valor actual del formulario
   * es diferente a los datos originales.
   * Ideal para habilitar/deshabilitar el botón de "Guardar".
   * 
   * @param form Control del formulario (ej: FormGroup)
   * @param originalData Datos originales contra los cuales comparar
   */
  observeChanges<T>(form: AbstractControl, originalData: T): Observable<boolean> {
    return form.valueChanges.pipe(
      startWith(form.value), // Emite el valor inicial al suscribirse
      map((currentValue) => this.hasChanges(originalData, currentValue))
    );
  }

  /**
   * Verifica sincrónicamente si dos objetos tienen diferencias usando lodash (`isEqual`).
   * Hace una comparación profunda que soporta objetos anidados, arrays y fechas.
   * 
   * @param originalValue Objeto original
   * @param currentValue Objeto actual (ej: valor del formulario o de otro lugar)
   */
  hasChanges(originalValue: any, currentValue: any): boolean {
    return !isEqual(originalValue, currentValue);
  }
}
