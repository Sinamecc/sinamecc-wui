import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Indicator } from '@app/mitigation-actions/mitigation-action';

@Component({
  selector: 'app-indicator-search',
  templateUrl: './indicator-search.component.html',
  styleUrl: './indicator-search.component.scss',
  standalone: false,
})
export class IndicatorSearchComponent {
  @Input() indicators: Indicator[];
  @Output() indicatorResults = new EventEmitter<Indicator[]>();

  search: string;

  onChange(event: any) {
    this.applySearch(event);
  }

  applySearch(word: string) {
    let search = this.cleanWord(word);
    let indicatorResults = this.indicators.filter(
      (indicator) => this.cleanWord(indicator.id).includes(search) || this.cleanWord(indicator.name).includes(search),
    );
    this.indicatorResults.emit(indicatorResults);
  }

  cleanWord(word: string | number) {
    return word.toString().trim().toLocaleLowerCase();
  }
}
