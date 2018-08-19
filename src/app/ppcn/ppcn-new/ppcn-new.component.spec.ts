import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnNewComponent } from './ppcn-new.component';

describe('PpcnNewComponent', () => {
  let component: PpcnNewComponent;
  let fixture: ComponentFixture<PpcnNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
