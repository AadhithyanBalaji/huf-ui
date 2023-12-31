import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockInwardComponent } from './stock-inward/stock-inward.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/ammr-grid/shared.module';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { AmrrPageHeaderComponent } from './shared/amrr-page-header/amrr-page-header.component';
import { AmrrItemGroupEditorComponent } from './master/amrr-item-group/amrr-item-group-editor/amrr-item-group-editor.component';
import { ApiBusinessService } from './shared/api-business.service';
import { AmrrModalComponent } from './shared/amrr-modal/amrr-modal.component';
import { AmrrItemComponent } from './master/amrr-item/amrr-item.component';
import { AmrrItemEditorComponent } from './master/amrr-item/amrr-item-editor/amrr-item-editor.component';
import { AmrrLoadingComponent } from './shared/amrr-loading/amrr-loading.component';
import { HttpLoadingInterceptor } from './shared/http-loading.interceptor';
import { AmrrLoadingDialogService } from './shared/amrr-loading/amrr-loading-dialog.service';
import { AmrrGodownComponent } from './master/amrr-godown/amrr-godown.component';
import { AmrrGodownEditorComponent } from './master/amrr-godown/amrr-godown-editor/amrr-godown-editor.component';
import { AmrrBayComponent } from './master/amrr-bay/amrr-bay.component';
import { AmrrBayEditorComponent } from './master/amrr-bay/amrr-bay-editor/amrr-bay-editor.component';
import { AmrrLoginComponent } from './auth/amrr-login/amrr-login.component';
import { AmrrHomeComponent } from './amrr-home/amrr-home.component';
import { AmrrUserComponent } from './master/amrr-user/amrr-user.component';
import { AmrrUserEditorComponent } from './master/amrr-user/amrr-user-editor/amrr-user-editor.component';
import { AmrrChangePasswordComponent } from './auth/amrr-change-password/amrr-change-password.component';
import { GlobalErrorHandler } from './shared/global-error-handler';
import { AmrrAccessLogComponent } from './master/amrr-access-log/amrr-access-log.component';
import { StockInwardEditorComponent } from './stock-inward/stock-inward-editor/stock-inward-editor.component';
import { InwardTransactionBatchComponent } from './stock-inward/inward-transaction-batch/inward-transaction-batch.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { StockOutwardComponent } from './stock-outward/stock-outward.component';
import { StockOutwardEditorComponent } from './stock-outward/stock-outward-editor/stock-outward-editor.component';
import { OutwardTransactionBatchComponent } from './stock-outward/outward-transaction-batch/outward-transaction-batch.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { StockAdjustmentEditorComponent } from './stock-adjustment/stock-adjustment-editor/stock-adjustment-editor.component';
import { StockAdjustmentTransactionBatchComponent } from './stock-adjustment/stock-adjustment-transaction-batch/stock-adjustment-transaction-batch.component';
import { ConsolidatedStockReportComponent } from './reports/consolidated-stock-report/consolidated-stock-report.component';
import { StockInfoComponent } from './reports/stock-info/stock-info.component';
import { AmrrReportFiltersComponent } from './shared/amrr-report-filters/amrr-report-filters.component';
import { BatchwiseStockComponent } from './reports/batchwise-stock/batchwise-stock.component';
import { ItemMovementReportComponent } from './reports/item-movement-report/item-movement-report.component';
import { StockQtyBagsCardComponent } from './reports/stock-qty-bags-card/stock-qty-bags-card.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  MatDialogConfig,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { AmrrSelectWithSearchComponent } from './shared/amrr-select-with-search/amrr-select-with-search.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AllTransactionsReportComponent } from './reports/all-transactions-report/all-transactions-report.component';
import { AmrrDownloadMenuComponent } from './shared/amrr-download-menu/amrr-download-menu.component';
import { AmrrActionRowComponent } from './shared/amrr-action-row/amrr-action-row.component';
import { AmrrMultiSelectWithSearchComponent } from './shared/amrr-multi-select-with-search/amrr-multi-select-with-search.component';
import { CsrItemGroupReportComponent } from './reports/csr-item-group-report/csr-item-group-report.component';

@NgModule({
  declarations: [
    AppComponent,
    StockInwardComponent,
    PageNotFoundComponent,
    AmrrItemGroupComponent,
    AmrrPageHeaderComponent,
    AmrrItemGroupEditorComponent,
    AmrrModalComponent,
    AmrrItemComponent,
    AmrrItemEditorComponent,
    AmrrLoadingComponent,
    AmrrGodownComponent,
    AmrrGodownEditorComponent,
    AmrrBayComponent,
    AmrrBayEditorComponent,
    AmrrLoginComponent,
    AmrrHomeComponent,
    AmrrUserComponent,
    AmrrUserEditorComponent,
    AmrrChangePasswordComponent,
    AmrrAccessLogComponent,
    StockInwardEditorComponent,
    InwardTransactionBatchComponent,
    StockOutwardComponent,
    StockOutwardEditorComponent,
    OutwardTransactionBatchComponent,
    StockAdjustmentComponent,
    StockAdjustmentEditorComponent,
    StockAdjustmentTransactionBatchComponent,
    ConsolidatedStockReportComponent,
    StockInfoComponent,
    AmrrReportFiltersComponent,
    BatchwiseStockComponent,
    ItemMovementReportComponent,
    StockQtyBagsCardComponent,
    AmrrSelectWithSearchComponent,
    AllTransactionsReportComponent,
    AmrrDownloadMenuComponent,
    AmrrActionRowComponent,
    AmrrMultiSelectWithSearchComponent,
    CsrItemGroupReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    ApiBusinessService,
    AmrrLoadingDialogService,
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandler,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        disableClose: true,
        autoFocus: false,
      } as MatDialogConfig,
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
