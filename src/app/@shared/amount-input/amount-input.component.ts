import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.scss'],
  standalone: false,
})
export class AmountInputComponent {
  @Input() control: FormControl;

  displayValue: string = '';

  formatValue(value: number | string): string {
    const number = parseFloat(value as string);
    if (isNaN(number)) return '';
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  onInput(event: any) {
    const raw = event.target.value.replace(/,/g, '');
    this.control.setValue(raw, { emitEvent: false });
  }

  onBlur() {
    const value = this.control.value;
    if (value !== null && value !== undefined && value !== '') {
      this.displayValue = this.formatValue(value);
    } else {
      this.displayValue = '';
    }
  }
}
