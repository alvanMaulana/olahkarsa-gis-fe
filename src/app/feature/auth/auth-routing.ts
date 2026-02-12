import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { LupaPasswordComponent } from './components/lupa-password/lupa-password.component';

const routes: Routes = [
    { path: 'login',component: LoginComponent},
    { path: 'lupa-password',component: LupaPasswordComponent},
    { path: 'lupa-password/:email',component: LupaPasswordComponent},
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
