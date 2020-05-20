import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss']
})
export class GenericButtonComponent implements OnInit {

  @Input() name = 'SINAMECC Button';
  @Input() disabled = false;
  @Input() type = 'button';

  constructor() { }

  ngOnInit() {
  }

}
