import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  standalone: false,
})
export class ProgressBarComponent implements OnChanges {
  @Input() completed: Record<string, boolean> = {
    generalRegister: false,
    report: false,
    financing: false,
    indicators: false,
    climateMonitoring: false,
    actionImpact: false,
  };

  weights: Record<keyof typeof this.completed, number> = {
    generalRegister: 10,
    report: 35,
    financing: 10,
    indicators: 20,
    climateMonitoring: 15,
    actionImpact: 10,
  };

  completion = 0;

  ngOnInit() {
    this.setCompletionPercentage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['completed']) {
      this.setCompletionPercentage();
    }
  }

  setCompletionPercentage(): void {
    this.completion = 0;

    for (const key in this.completed) {
      if (this.completed[key]) {
        this.completion += this.weights[key as keyof typeof this.completed] || 0;
      }
    }
  }
}
