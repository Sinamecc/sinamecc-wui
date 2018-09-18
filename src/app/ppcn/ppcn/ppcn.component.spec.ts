import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnComponent } from './ppcn.component';

describe('PpcnComponent', () => {
  let component: PpcnComponent;
  let fixture: ComponentFixture<PpcnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
