import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ValidacaoService } from '../../services/validacao.service';
import { TokenkeyService } from '../../services/tokenkey.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const guardValidation = () => {
  const router = inject(Router);
  const authService = inject(ValidacaoService);
  const tokenService = inject(TokenkeyService);

  const token = tokenService.getToken();
  console.log("token authGuardteste" + token);

  if (!token) {
    console.log('Token não encontrado no guard.');
    return of(router.createUrlTree(['login']));
  }

  return authService.validar(token).pipe(
    map((response) => {
      console.log(response.status);
      if (response && response.status === 200) {
        return true;
      } else {
        console.warn('Token inválido - status diferente de 200:', response?.status);
        tokenService.deleteToken();
        router.navigate(['login']);  
        return false;
      }
    }),
    catchError((err) => {
      console.error('Erro ao validar token:', err);
      tokenService.deleteToken();
      router.navigate(['login']);  
      return of(false);
    })
  );
};