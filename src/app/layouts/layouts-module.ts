import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarPengaturanComponent } from './components/sidebar-pengaturan/sidebar-pengaturan.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { AdminMainLayoutComponent } from './components/admin-main-layout/admin-main-layout.component';



@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarMenuComponent,
    SidebarPengaturanComponent,
    AdminMainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbModule
  ]
})
export class LayoutsModule { }
