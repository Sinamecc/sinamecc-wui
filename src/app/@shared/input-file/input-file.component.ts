import { Subject } from 'rxjs';
import { Component, OnInit, Input, ElementRef, OnDestroy, HostBinding, Renderer2, HostListener } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FileInput } from '@shared/input-file/file-input.model';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: InputFileComponent }],
  standalone: false,
})
export class InputFileComponent implements MatFormFieldControl<FileInput>, ControlValueAccessor, OnInit, OnDestroy {
  @Input() get value(): FileInput | null {
    return this.empty ? null : new FileInput(this._elementRef.nativeElement.value || []);
  }
  set value(fileInput: FileInput | null) {
    this.writeValue(fileInput.files);
    this.stateChanges.next();
  }

  @Input() get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh: string) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    return !this._elementRef.nativeElement.value || this._elementRef.nativeElement.value.length === 0;
  }

  @HostBinding('class.mat-form-field-should-float') get shouldPlaceholderFloat() {
    return this.focused || !this.empty || this.valuePlaceholder !== undefined;
  }

  @Input() get required() {
    return this._required;
  }
  set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @HostBinding('class.file-input-disabled') get isDisabled() {
    return this.disabled;
  }
  @Input() get disabled() {
    return this._elementRef.nativeElement.disabled;
  }
  set disabled(dis: boolean) {
    this.setDisabledState(coerceBooleanProperty(dis));
    this.stateChanges.next();
  }

  @Input() get errorState() {
    return this.ngControl.errors !== null && this.ngControl.touched;
  }

  /**
   * @see https://angular.io/api/forms/ControlValueAccessor
   */
  constructor(
    public ngControl: NgControl,
    private fm: FocusMonitor,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    fm.monitor(_elementRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  get fileNames() {
    return this.value ? this.value.fileNames : this.valuePlaceholder;
  }

  static nextId = 0;

  stateChanges = new Subject<void>();
  focused = false;
  controlType = 'file-input';

  private _placeholder: string;
  private _required = false;

  @Input() valuePlaceholder: string;
  @Input() multiple: boolean;

  @HostBinding() id = `app-input-file-${InputFileComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';

  readonly autofilled: boolean;
  readonly shouldLabelFloat: boolean;

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input' && !this.disabled) {
      this._elementRef.nativeElement.querySelector('input').focus();
      this.focused = true;
      this.open();
    }
  }

  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', obj);
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  @HostListener('change', ['$event']) change(event: any) {
    const fileList = event.target.files;
    const fileArray = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        fileArray.push(fileList[i]);
      }
    }
    this.value = new FileInput(fileArray);
    this._onChange(this.value);
  }

  @HostListener('focusout') blur() {
    this.focused = false;
    this._onTouched();
  }

  setDisabledState?(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  ngOnInit() {
    this.multiple = coerceBooleanProperty(this.multiple);
  }

  open() {
    if (!this.disabled) {
      this._elementRef.nativeElement.querySelector('input').click();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this._elementRef.nativeElement);
  }
}
