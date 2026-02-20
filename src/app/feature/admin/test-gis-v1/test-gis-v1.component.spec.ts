import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGisV1Component } from './test-gis-v1.component';

describe('TestGisV1Component', () => {
  let component: TestGisV1Component;
  let fixture: ComponentFixture<TestGisV1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestGisV1Component]
    });
    fixture = TestBed.createComponent(TestGisV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
