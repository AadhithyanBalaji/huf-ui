import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PdfService } from 'src/app/shared/pdf.service';
import { ConsolidatedStockReportFormService } from './consolidated-stock-report-form.service';

@Component({
  selector: 'app-consolidated-stock-report',
  templateUrl: './consolidated-stock-report.component.html',
  styleUrls: ['./consolidated-stock-report.component.css'],
  providers: [ConsolidatedStockReportFormService, PdfService],
})
export class ConsolidatedStockReportComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  constructor(readonly formService: ConsolidatedStockReportFormService) {}

  ngAfterViewInit(): void {
    this.formService.init(this.sort);
  }
}
