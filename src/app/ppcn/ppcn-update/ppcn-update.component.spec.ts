import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnUpdateComponent } from './ppcn-update.component';

describe('PpcnUpdateComponent', () => {
  let component: PpcnUpdateComponent;
  let fixture: ComponentFixture<PpcnUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
