import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UccVerifyDataComponent } from './ucc-verify-data.component';

describe('UccVerifyDataComponent', () => {
  let component: UccVerifyDataComponent;
  let fixture: ComponentFixture<UccVerifyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UccVerifyDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UccVerifyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
