import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss'],
  standalone: false,
})
export class GenericButtonComponent implements OnInit {
  @Input() name = 'SINAMECC Button';
  @Input() disabled = false;
  @Input() type = 'button';

  constructor() {}

  ngOnInit() {}
}
