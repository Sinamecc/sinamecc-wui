import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSearchBarComponent } from './custom-search-bar.component';

describe('CustomSearchBarComponent', () => {
  let component: CustomSearchBarComponent;
  let fixture: ComponentFixture<CustomSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
