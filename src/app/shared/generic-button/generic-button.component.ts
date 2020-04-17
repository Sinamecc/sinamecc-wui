import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss']
})
export class GenericButtonComponent implements OnInit {

  @Input() name: string = 'SINAMECC Button';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';
  
  constructor() { }

  ngOnInit() {
  }

}
