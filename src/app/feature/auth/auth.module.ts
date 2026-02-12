import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing';
import { LupaPasswordComponent } from './components/lupa-password/lupa-password.component';

@NgModule({
    declarations: [LoginComponent, LupaPasswordComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule
    ]
})
export class AuthModule { }
