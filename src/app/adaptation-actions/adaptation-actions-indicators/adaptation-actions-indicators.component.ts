import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction, Indicator } from '../interfaces/adaptationAction';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdaptationActionIndicatorFormComponent } from './adaptation-action-indicator-form/adaptation-action-indicator-form.component';

@Component({
  selector: 'app-adaptation-actions-indicators',
  templateUrl: './adaptation-actions-indicators.component.html',
  styleUrls: ['./adaptation-actions-indicators.component.scss'],
  standalone: false,
})
export class AdaptationActionsIndicatorsComponent implements OnInit {
  @Output() onComplete = new EventEmitter<boolean>();
  @Input() mainStepper: any;
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() edit: boolean;
  readonly dialog = inject(MatDialog);
  adaptationAction: AdaptationAction;
  indicatorsToShow: Indicator[] = [];

  constructor(
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
      if (
        this.adaptationAction &&
        this.adaptationAction.indicator_list &&
        this.adaptationAction.indicator_list.length
      ) {
        this.indicatorsToShow = this.adaptationAction.indicator_list;
        this.onComplete.emit(true);
      }
    });
  }

  ngOnInit(): void {}

  openDialog(indicator?: string): void {
    const dialogRef = this.dialog.open(AdaptationActionIndicatorFormComponent, {
      data: {
        adaptationAction: this.adaptationAction,
        indicator: indicator,
        edit: !!indicator,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        console.log('Dialog result:', result);
      }
    });
  }

  next() {
    this.mainStepper.next();
  }
}
