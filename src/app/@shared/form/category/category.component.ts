import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { OTHER } from '../constants';
import { IndicatorOption } from '../types/payload';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: false,
})
export class CategoryComponent {
  @Input() categoryGroup!: FormGroup;
  @Input() service!: MitigationActionsService | AdaptationActionService;
  @Input() item: AdaptationAction | MitigationAction;
  @Input() isOther: boolean;
  @Input() barrier: boolean;
  indicators: IndicatorOption[];
  other = OTHER;

  ngOnInit() {
    if (this.isAdaptationAction(this.item)) {
      this.indicators = this.mapAAIndicators();
    } else {
      this.indicators = this.mapMAIndicators();
    }
  }

  onOtherCategoryChange(event: any) {
    const value = event.value;
    if (value === this.other) {
      this.categoryGroup?.get('indicatorOther')?.setValidators([Validators.minLength(20), Validators.maxLength(200)]);
    } else {
      this.categoryGroup?.get('indicatorOther')?.setValidators([]);
    }
    this.categoryGroup?.get('indicatorOther')?.updateValueAndValidity();
  }

  isAdaptationAction(item: AdaptationAction | MitigationAction): item is AdaptationAction {
    return 'adaptation_action_information' in item;
  }

  private mapAAIndicators(): IndicatorOption[] {
    const adaptationAction = this.item as AdaptationAction;
    return this.mapIndicators(adaptationAction?.indicator_list ?? []);
  }

  private mapMAIndicators(): IndicatorOption[] {
    const mitigationAction = this.item as MitigationAction;
    return this.mapIndicators(mitigationAction?.monitoring_information?.indicator ?? []);
  }

  private mapIndicators(indicators: any[]): IndicatorOption[] {
    return indicators.map((indicator) => ({
      id: indicator.id,
      name: indicator.name,
    }));
  }
}
