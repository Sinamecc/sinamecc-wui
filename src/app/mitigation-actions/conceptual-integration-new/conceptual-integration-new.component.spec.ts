import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptualIntegrationNewComponent } from '@app/mitigation-actions/conceptual-integration-new/conceptual-integration-new.component';

describe('ConceptualIntegrationNewComponent', () => {
  let component: ConceptualIntegrationNewComponent;
  let fixture: ComponentFixture<ConceptualIntegrationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptualIntegrationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptualIntegrationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
