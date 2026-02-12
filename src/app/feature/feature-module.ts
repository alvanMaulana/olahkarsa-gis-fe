import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing-module';
import { HomeComponent } from './home/home.component';
import { ListManagementAdminComponent } from './management-admin/components/list-management-admin/list-management-admin.component';


import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormManagementAdminComponent } from './management-admin/components/form-management-admin/form-management-admin.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestGisComponent } from './test-gis/test-gis.component';
import { TestGisV1Component } from './test-gis-v1/test-gis-v1.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListManagementAdminComponent,
    FormManagementAdminComponent,
    TestGisComponent,
    TestGisV1Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    NgSelectModule,
    FeatureRoutingModule,
    NgbDropdownModule,
    NgbModule,
  ]
})
export class FeatureModule { }

// ng g c test-gis-v1 --module=feature/feature-module
