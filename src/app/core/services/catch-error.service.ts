import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatchErrorService {
  /**
   * Extrae el mensaje de error de una respuesta de la API.
   * Si la API devuelve un string directo, o un error con mensaje de string válido, 
   * lo retorna, de lo contrario devuelve el mensaje por defecto.
   * 
   * @param error El objeto de error capturado (ej: desde catchError)
   * @param defaultMessage El mensaje por defecto cuando no se encuentra un string útil
   */
  getMessage(error: any, defaultMessage: string): string {
    if (error && typeof error.error === 'string') {
      return error.error;
    }
    if (error && typeof error.message === 'string' && error.error == null) {
      return error.message;
    }
    return defaultMessage;
  }
}
