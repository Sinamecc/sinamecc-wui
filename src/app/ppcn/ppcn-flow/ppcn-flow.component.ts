import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PpcnLevelComponent } from 'app/ppcn/ppcn-level/ppcn-level.component';
import { PpcnNewComponent } from 'app/ppcn/ppcn-new/ppcn-new.component';


@Component({
  selector: 'app-ppcn-flow',
  templateUrl: './ppcn-flow.component.html',
  styleUrls: ['./ppcn-flow.component.scss']
})
export class PpcnFlowComponent implements OnInit {
  @ViewChild('PpcnLevelComponent') geographicLvl:PpcnLevelComponent;
  @ViewChild('PpcnNewComponent') ppcnForm:PpcnNewComponent;

  mainGroup: FormGroup;

  get formArray(): AbstractControl | null { return this.mainGroup.get('formArray'); }
  
  formData: FormData;
  isLoading = false;
  generalFormData: FormData;

  constructor(private _formBuilder: FormBuilder) {
    this.formData = new FormData();
    this.createForm();
  }

  ngOnInit() {
    
  }

  createForm(){
    this.mainGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([this.frmGeographic,this.frmPpcn])
    })
  }
  onSubmit(context:any){
  }

  onSaving(){
    this.formArray[0];
    console.log(this.geographicLvl.formData);
  }

  get frmGeographic() {
    return this.geographicLvl ? this.geographicLvl.form : null;
  }

  get frmPpcn() {
    return this.ppcnForm ? this.ppcnForm.formGroup : null;
  }

}
