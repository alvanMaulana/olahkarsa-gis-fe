import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from '../layouts/components/main-layout/main-layout.component';
import { ListManagementAdminComponent } from './management-admin/components/list-management-admin/list-management-admin.component';
import { FormManagementAdminComponent } from './management-admin/components/form-management-admin/form-management-admin.component';
import { TestGisComponent } from './test-gis/test-gis.component';

const routes: Routes = [

  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   children: [
  //     {
  //       path: 'management-admin',
  //       component: ListManagementAdminComponent,
  //     },

  //     {
  //       path: '',
  //       component: HomeComponent,
  //     },
  //   ]
  // },


  {
    path: '',
    // component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: TestGisComponent,

      },
    ]
  },



  {
    path: 'management-admin',
    children: [
      {
        path: 'create',
        component: FormManagementAdminComponent,
      }

    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
