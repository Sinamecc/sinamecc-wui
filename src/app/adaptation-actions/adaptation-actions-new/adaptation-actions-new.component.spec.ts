import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsNewComponent } from './adaptation-actions-new.component';

describe('AdaptationActionsNewComponent', () => {
  let component: AdaptationActionsNewComponent;
  let fixture: ComponentFixture<AdaptationActionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptationActionsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
