import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LayoutsModule } from './layouts/layouts-module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { HttpConfigInterceptor } from './core/interceptors/http-config.interceptor';
import { AuthService } from './feature/auth/services/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSpinnerModule,
    HttpClientModule,


    LayoutsModule
  ],
  providers: [
    AsyncPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID, useValue: "id-ID"
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private authService: AuthService) {
    if (this.authService.getToken() !== '') {
      this.authService.saveUserLogin();
    }
  }
}

