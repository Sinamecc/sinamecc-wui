import { Component, OnInit, Input } from '@angular/core';
import { I18nService } from '@app/i18n';
import { Router } from '@angular/router';

@Component({
  selector: 'app-download-proposal',
  templateUrl: './download-proposal.component.html',
  styleUrls: ['./download-proposal.component.scss'],
})
export class DownloadProposalComponent implements OnInit {
  @Input() title: string;
  @Input() code: string;
  @Input() fileName: string;
  @Input() nextRoute: string;
  @Input() isButton: boolean;
  @Input() formSubmitRoute: string;

  constructor(private router: Router, private i18nService: I18nService) {}

  ngOnInit(): void {}

  next() {
    this.router.navigate([this.nextRoute], { replaceUrl: true });
  }
}
