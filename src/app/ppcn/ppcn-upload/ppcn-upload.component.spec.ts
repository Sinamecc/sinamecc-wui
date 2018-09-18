import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnUploadComponent } from './ppcn-upload.component';

describe('PpcnUploadComponent', () => {
  let component: PpcnUploadComponent;
  let fixture: ComponentFixture<PpcnUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
