import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-impact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styleUrl: './impact-evaluation.component.scss',
  standalone: false,
})
export class ImpactEvaluationComponent {
  form: UntypedFormGroup;
}
