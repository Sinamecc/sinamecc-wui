import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { IndicatorOption } from '../interface';
import { OTHER } from '../constants';

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
  indicators: IndicatorOption[];
  other = OTHER;

  ngOnInit() {
    if (this.isAdaptationAction(this.item)) {
      this.indicators = this.mapAAIndicators();
    } else {
      console.log('mitigation');
    }
  }

  onOtherCategoryChange(event: any) {
    const value = event.value;
    if (value === this.other) {
      this.categoryGroup?.get('indicatorOther')?.setValidators([Validators.minLength(1), Validators.maxLength(100)]);
    } else {
      this.categoryGroup?.get('indicatorOther')?.setValidators([]);
    }
    this.categoryGroup?.get('indicatorOther')?.updateValueAndValidity();
  }

  isAdaptationAction(item: AdaptationAction | MitigationAction): item is AdaptationAction {
    return 'adaptation_action_information' in item;
  }

  private mapAAIndicators(): IndicatorOption[] {
    const adaptationAction: AdaptationAction = this.item as AdaptationAction;
    return (
      adaptationAction.indicator_list &&
      adaptationAction.indicator_list.map((indicator) => ({
        name: indicator.name,
        id: indicator.id,
      }))
    );
  }
}
