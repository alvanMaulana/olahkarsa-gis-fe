import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGisComponent } from './test-gis.component';

describe('TestGisComponent', () => {
  let component: TestGisComponent;
  let fixture: ComponentFixture<TestGisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestGisComponent]
    });
    fixture = TestBed.createComponent(TestGisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
