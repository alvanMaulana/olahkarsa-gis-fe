import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminRoutingModule } from './admin-routing-module';
import { TestGisComponent } from './test-gis/test-gis.component';
import { TestGisV1Component } from './test-gis-v1/test-gis-v1.component';
import { ListManagementAdminComponent } from './management-admin/components/list-management-admin/list-management-admin.component';
import { FormManagementAdminComponent } from './management-admin/components/form-management-admin/form-management-admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    TestGisComponent,
    TestGisV1Component,
    ListManagementAdminComponent,
    FormManagementAdminComponent,
    AdminDashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
