import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainLayoutComponent } from './admin-main-layout.component';

describe('AdminMainLayoutComponent', () => {
  let component: AdminMainLayoutComponent;
  let fixture: ComponentFixture<AdminMainLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMainLayoutComponent]
    });
    fixture = TestBed.createComponent(AdminMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
