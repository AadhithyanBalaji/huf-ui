import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AmrrUserEditorFormService } from './amrr-user-editor-form.service';
import { AmrrUser } from './amrr-user.model';

@Component({
  selector: 'app-amrr-user-editor',
  templateUrl: './amrr-user-editor.component.html',
  styleUrls: ['./amrr-user-editor.component.css'],
  providers: [AmrrUserEditorFormService],
})
export class AmrrUserEditorComponent implements OnInit {

  constructor(
    readonly formService: AmrrUserEditorFormService,
    @Inject(MAT_DIALOG_DATA) public data: AmrrUser,
    private readonly dialogRef: MatDialogRef<AmrrUserEditorComponent>
  ) {}

  ngOnInit(): void {
    this.formService.init(this.dialogRef, this.data);
  }
}
