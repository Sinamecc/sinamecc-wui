import { Component, OnInit } from '@angular/core';
import { MccrPoc } from '@app/mccr/mccr-poc/mccr-poc';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mccr-poc-list',
  templateUrl: './mccr-poc-list.component.html',
  styleUrls: ['./mccr-poc-list.component.scss'],
})
export class MccrPocListComponent implements OnInit {
  mccr_poc: MccrPoc;
  isLoading: boolean;
  id: string;

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MccrPocService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.service
      .getMccrPoc(this.id, this.i18nService.language.split('-')[0])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((response: MccrPoc) => {
        this.mccr_poc = response;
      });
  }

  ngOnInit(): void {}

  openAddBuyer(uuid: string) {
    this.router.navigate([`/mccr/poc/${uuid}/add-Buyer-Transfer`], { replaceUrl: true });
  }

  openAddDeveloper(uuid: string) {
    this.router.navigate([`/mccr/poc/${uuid}/add-Developer-Transfer`], { replaceUrl: true });
  }
}
