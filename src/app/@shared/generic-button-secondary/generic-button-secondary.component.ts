import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-button-secondary',
  templateUrl: './generic-button-secondary.component.html',
  styleUrls: ['./generic-button-secondary.component.scss'],
})
export class GenericButtonSecondaryComponent implements OnInit {
  @Input() name = 'SINAMECC Button';
  @Input() disabled = false;
  @Input() type = 'button';
  constructor() {}

  ngOnInit() {}
}
