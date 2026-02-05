import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY); // ✅ synchronisé avec ta clé
    if (!token) {
      console.warn('[JWT] Aucun token trouvé dans localStorage ! Requête non authentifiée.');
    }

    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }

      });
      return next.handle(cloned);
    }

    return next.handle(request);
  }
}
