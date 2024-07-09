import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideClientHydration(),
    provideHttpClient(withFetch(),withInterceptors([AuthInterceptor])),
  ]
};


// ,withInterceptors()

