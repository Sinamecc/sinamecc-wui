import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, Credentials, I18nService } from '@app/core';
import { finalize } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GenericDialogBoxComponent } from '../generic-dialog-box/generic-dialog-box.component';

@Component({
  selector: 'app-ppcn',
  templateUrl: './ppcn.component.html',
  styleUrls: ['./ppcn.component.scss']
})
export class PpcnComponent implements OnInit {

  ppcn: Ppcn;
  isLoading: boolean;
  id: string;

  @Input() edit = false;
  userImage: string | SafeUrl = 'assets/default_user_image.png';
  usernameComment:string = '';
  actualDate = new Date();

  modulesToComment = [
    {
      module:1,
      fields:['ID','info.name','general.legalCertificate',
      'specificLabel.representativeName','general.legalRepresentativeCertificate','info.phone','general.confidential',
    'info.postalCode','info.fax','info.address']
    },
    {
      module:2,
      fields:['info.contactName','info.contactPosition','info.contactPhone',
      'info.contactEmail']
    },
    {
      module:3,
      fields:['geographyLabel.geographicLevel','geographyLabel.requestLevel','geographyLabel.recognitionType',
      'geographyLabel.classificationAmountEmissions','geographyLabel.classificationNumberFacilities',
      'geographyLabel.ClassificationAmountInventoryData']
    },
    {
      module:4,
      fields:['geographyLabel.reductionProyect','geographyLabel.activityReduction','geographyLabel.detailReduction',
      'geographyLabel.reducedEmissions','geographyLabel.investmentReductions',
      'geographyLabel.totalInversion','geographyLabel.totalReducedEmissions']
    },
    {
      module:5,
      fields:['geographyLabel.compensationScheme','geographyLabel.projectLocation','geographyLabel.certificateNumber',
      'geographyLabel.totalCompensation','geographyLabel.compensationCost',
      'geographyLabel.period']
    },
    {
      module:6,
      fields:['OVV','Emission Date','specificLabel.reportYear',
      'specificLabel.baseYear']
    },
    {
      module:7,
      fields:['ppcn.costInventoryRemovals','ppcn.removalProjectDetail',
      'ppcn.totalRemovals']
    },
  ]

  comments:object[] = [];

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: PpcnService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

  ngOnInit() {
    this.isLoading = true;
    this.service.getPpcn(this.id, this.i18nService.language.split('-')[0])
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: Ppcn) => { this.ppcn = response;});
     this.getUserPhoto();

     
  }

  async download(file: string) {
    this.isLoading = true;
    const blob = await this.service.downloadResource(file);
    const url = window.URL.createObjectURL(blob.data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = blob.filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    this.isLoading = false;
  }

  getCurrentPhoto(photoList: any[]) {
    for (const photo of photoList) {
      if (photo.current) {
        return photo;
      }
    }
    return undefined;
  }

  get credential(): Credentials {
    return this.authenticationService.credentials;
  }

  getUserPhoto() {
    this.usernameComment = this.credential.fullName
    const userPhoto = this.getCurrentPhoto(this.credential.userPhoto);
    if (userPhoto) {
      this.authenticationService.getUserPhoto(userPhoto.image).subscribe((image: any) => {
        this.userImage = this.sanitizer.bypassSecurityTrustUrl(this.createImageFromBlob(image));
      });
    }
  }

  createImageFromBlob(image: Blob) {
    return URL.createObjectURL(image);
 }




}
