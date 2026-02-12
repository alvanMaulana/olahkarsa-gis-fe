import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LupaPasswordComponent } from './lupa-password.component';

describe('LupaPasswordComponent', () => {
  let component: LupaPasswordComponent;
  let fixture: ComponentFixture<LupaPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LupaPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LupaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
