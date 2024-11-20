/*
 * This module imports and re-exports all Angular Material modules for convenience,
 * so only 1 module import is needed in your feature modules.
 * See https://material.angular.io/guide/getting-started#step-3-import-the-component-modules.
 *
 * To optimize your production builds, you should only import the components used in your app.
 */

import { NgModule } from '@angular/core';
import {
  MatCommonModule,
  MatLineModule,
  MatNativeDateModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    MatProgressSpinnerModule,
    MatPseudoCheckboxModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatStepperModule,
    MatCommonModule,
    MatRippleModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatRadioModule,
    MatChipsModule,
    MatInputModule,
    MatTabsModule,
    MatLineModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatTreeModule,
  ],
})
export class MaterialModule {}
