import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  isLoading = false;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    
  }

  get frmGeographic() {
    return this.geographicLvl ? this.geographicLvl.form : null;
  }

  get frmPpcn() {
    return this.ppcnForm ? this.ppcnForm.form : null;
  }

  ngOnInit() {
    
  }

  onSubmit(context:any){
  }

}
