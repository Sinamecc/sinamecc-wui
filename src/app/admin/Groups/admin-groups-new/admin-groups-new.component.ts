import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-groups-new',
  templateUrl: './admin-groups-new.component.html',
  styleUrls: ['./admin-groups-new.component.scss'],
  standalone: false,
})
export class AdminGroupsNewComponent implements OnInit {
  createGroupForm: UntypedFormGroup;
  isLoading = false;
  error: string;
  name: string;

  constructor(private formBuilder: UntypedFormBuilder) {
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
