import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-groups-new',
  templateUrl: './admin-groups-new.component.html',
  styleUrls: ['./admin-groups-new.component.scss'],
})
export class AdminGroupsNewComponent implements OnInit {
  createGroupForm: FormGroup;
  isLoading = false;
  error: string;
  name: string;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
    this.name = '';
  }

  ngOnInit(): void {}

  private createForm() {
    this.createGroupForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }
}
