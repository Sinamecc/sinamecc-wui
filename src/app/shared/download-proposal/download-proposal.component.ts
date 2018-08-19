import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Logger, I18nService } from '@app/core';


@Component({
  selector: 'app-download-proposal',
  templateUrl: './download-proposal.component.html',
  styleUrls: ['./download-proposal.component.scss']
})
export class DownloadProposalComponent implements OnInit {

  @Input() title: string;
  @Input() code: string;
  @Input() fileName: string;
  @Input() nextRoute: string;

  constructor(private router: Router,
              private i18nService: I18nService,) { }

  ngOnInit() {
  }

  next() {
    this.router.navigate([this.nextRoute], { replaceUrl: true });
  }

}
