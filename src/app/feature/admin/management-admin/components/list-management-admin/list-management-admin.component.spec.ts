import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListManagementAdminComponent } from './list-management-admin.component';

describe('ListManagementAdminComponent', () => {
  let component: ListManagementAdminComponent;
  let fixture: ComponentFixture<ListManagementAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListManagementAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListManagementAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
