import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPengaturanComponent } from './sidebar-pengaturan.component';

describe('SidebarPengaturanComponent', () => {
  let component: SidebarPengaturanComponent;
  let fixture: ComponentFixture<SidebarPengaturanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarPengaturanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPengaturanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
