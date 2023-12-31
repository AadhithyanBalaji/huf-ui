import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StockOutwardFormService } from './stock-outward-form.service';

@Component({
  selector: 'app-stock-outward',
  templateUrl: './stock-outward.component.html',
  styleUrls: ['./stock-outward.component.css'],
  providers: [StockOutwardFormService],
})
export class StockOutwardComponent implements OnInit {
  @ViewChild('partyNameTemplate', { static: true })
  partyNameTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true })
  dateTemplate: TemplateRef<any>;
  @ViewChild('userTemplate', { static: true })
  userTemplate: TemplateRef<any>;

  constructor(readonly formService: StockOutwardFormService) {}

  ngOnInit(): void {
    this.formService.init(this.partyNameTemplate, this.dateTemplate, this.userTemplate);
  }
}
