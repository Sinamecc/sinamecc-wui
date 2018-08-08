import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnFlowComponent } from './ppcn-flow.component';

describe('PpcnFlowComponent', () => {
  let component: PpcnFlowComponent;
  let fixture: ComponentFixture<PpcnFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
