import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManagementAdminComponent } from './form-management-admin.component';

describe('FormManagementAdminComponent', () => {
  let component: FormManagementAdminComponent;
  let fixture: ComponentFixture<FormManagementAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormManagementAdminComponent]
    });
    fixture = TestBed.createComponent(FormManagementAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
