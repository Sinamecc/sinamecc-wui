import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';

describe('PpcnLevelComponent', () => {
  let component: PpcnLevelComponent;
  let fixture: ComponentFixture<PpcnLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
