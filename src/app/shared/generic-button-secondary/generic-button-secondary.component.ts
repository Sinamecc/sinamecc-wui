import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-button-secondary',
  templateUrl: './generic-button-secondary.component.html',
  styleUrls: ['./generic-button-secondary.component.scss']
})
export class GenericButtonSecondaryComponent implements OnInit {

  @Input() name: string = 'SINAMECC Button';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';
  constructor() { }

  ngOnInit() {
  }

}
