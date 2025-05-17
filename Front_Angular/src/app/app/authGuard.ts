import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenkeyService } from '../../services/tokenkey.service';

export const authGuard = () => {
  const router = inject(Router);
  const tokenService = inject(TokenkeyService);
  const token = tokenService.getToken();
  console.log("token authGuard" + token);

  if (token) {
    // Usuário logado → redirecionar para /inicio
    router.navigate(['inicio']);
    return false;
  }

  // Usuário não logado permitir navegação
  return true;
};


