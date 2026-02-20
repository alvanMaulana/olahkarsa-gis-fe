import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/components/main-layout/main-layout.component';
import { TestGisComponent } from './test-gis/test-gis.component';
import { ListManagementAdminComponent } from './management-admin/components/list-management-admin/list-management-admin.component';
import { FormManagementAdminComponent } from './management-admin/components/form-management-admin/form-management-admin.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'test-gis',
        component: TestGisComponent,
      },
      {
        path: 'management-admin',
        component: ListManagementAdminComponent,
      },
      {
        path: 'management-admin/create',
        component: FormManagementAdminComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
