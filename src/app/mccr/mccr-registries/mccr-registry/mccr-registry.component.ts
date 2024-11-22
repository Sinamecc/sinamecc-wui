import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-registry',
  templateUrl: './mccr-registry.component.html',
  styleUrls: ['./mccr-registry.component.scss'],
})
export class MccrRegistryComponent implements OnInit {
  mccrRegistry: MccrRegistry;
  isLoading: boolean;
  id: string;

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private route: ActivatedRoute,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.service
      .getMccrRegistry(this.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((response: MccrRegistry) => {
        this.mccrRegistry = response;
      });
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
    a.remove(); // remove the element
    this.isLoading = false;
  }

  addReview(uuid: string) {
    const status = this.mccrRegistry.fsm_state;
    this.router.navigate([`mccr/registries/${uuid}/reviews/new`], { replaceUrl: true });
  }
}
