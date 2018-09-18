import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ppcn-download',
  templateUrl: './ppcn-download.component.html',
  styleUrls: ['./ppcn-download.component.scss']
})
export class PpcnDownloadComponent implements OnInit {

  isLoading: boolean;
  title: string;
  id: string;
  fileName: string;
  nextRoute: string;
  levelId : string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: PpcnService) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.levelId = this.route.snapshot.paramMap.get('geographic');
      this.title = (this.levelId == '2') ? "PPCN-National" : "PPCN-Cantonal";
      this.fileName = (this.levelId == '2') ? "PPCN_Nacional.xlsx" : "PPCN_CANTONAL.xlsx";
      this.nextRoute = `ppcn/${this.id}/upload/new`;
     }

  ngOnInit() {
  }

}
