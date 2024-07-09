



import { HttpInterceptorFn } from "@angular/common/http";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log(token);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
  }

  return next(req);
};