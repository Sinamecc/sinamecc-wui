import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnListComponent } from './ppcn-list.component';

describe('PpcnListComponent', () => {
  let component: PpcnListComponent;
  let fixture: ComponentFixture<PpcnListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
