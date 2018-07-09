import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptualIntegrationComponent } from './conceptual-integration.component';

describe('ConceptualIntegrationComponent', () => {
  let component: ConceptualIntegrationComponent;
  let fixture: ComponentFixture<ConceptualIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptualIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptualIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
