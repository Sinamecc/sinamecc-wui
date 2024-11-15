import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { PpcnLevelComponent } from '@app/ppcn/ppcn-level/ppcn-level.component';
import { PpcnNewComponent } from '@app/ppcn/ppcn-new/ppcn-new.component';
import { DownloadProposalComponent } from '@shared/download-proposal/download-proposal.component';
import { PpcnUploadComponent } from '@app/ppcn/ppcn-upload/ppcn-upload.component';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PpcnService } from '@app/ppcn/ppcn.service';

@Component({
  selector: 'app-ppcn-flow',
  templateUrl: './ppcn-flow.component.html',
  styleUrls: ['./ppcn-flow.component.scss'],
})
export class PpcnFlowComponent implements OnInit {
  @ViewChild('PpcnLevelComponent') geographicLvl: PpcnLevelComponent;
  @ViewChild('PpcnNewComponent') ppcnForm: PpcnNewComponent;
  @ViewChild('DownloadProposalComponent') downloadProposal: DownloadProposalComponent;
  @ViewChild('PpcnUploadComponent') uploadFiles: PpcnUploadComponent;

  mainGroup: UntypedFormGroup;

  get formArray(): AbstractControl | null {
    return this.mainGroup.get('formArray');
  }
  isLinear = true;
  formData: FormData;
  isLoading = false;
  generalFormData: FormData;
  levelId = '1';

  constructor(private _formBuilder: UntypedFormBuilder, private service: PpcnService) {
    this.formData = new FormData();
    this.createForm();
  }

  ngOnInit(): void {
    this.service.currentLevelId.subscribe((levelId: string) => (this.levelId = levelId));
  }

  createForm() {
    this.mainGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([this.frmGeographic, this.frmPpcn]),
    });
  }

  get frmGeographic() {
    return this.geographicLvl ? this.geographicLvl.form : null;
  }

  get frmPpcn() {
    return this.ppcnForm ? this.ppcnForm.formGroup : null;
  }

  get frmDownload() {
    return this.downloadProposal ? this.downloadProposal.fileName : null;
  }

  get frmUpload() {
    return this.uploadFiles ? this.uploadFiles.form : null;
  }
}
