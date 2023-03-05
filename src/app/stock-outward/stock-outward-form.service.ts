import { DatePipe } from '@angular/common';
import { Injectable, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AmrrBay } from '../master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from '../master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from '../master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from '../master/amrr-item/amrr-item-editor/amrr-item.model';
import {
  GridColumnType,
  IAmmrGridColumn,
} from '../shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from '../shared/amrr-modal/amrr-modal.component';
import { IAmrrTypeahead } from '../shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../shared/api-business.service';
import Helper from '../shared/helper';
import { AmrrBatch } from '../shared/models/amrr-batch.model';
import { Transaction } from '../shared/models/transaction.model';
import { StockOutward } from './stock-outward.model';

@Injectable()
export class StockOutwardFormService {
  godowns: AmrrGodown[] = [];
  bays: AmrrBay[] = [];
  itemGroups: AmrrItemGroup[] = [];
  items: AmrrItem[] = [];
  batches: IAmrrTypeahead[];
  form: FormGroup<{
    fromDate: FormControl<any>;
    toDate: FormControl<any>;
    goDownId: FormControl<any>;
    bayId: FormControl<any>;
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
  }>;
  dataSource: MatTableDataSource<StockOutward, MatPaginator>;
  columns: IAmmrGridColumn[];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  init(partyNameTemplate: TemplateRef<any>) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('bay'),
      this.apiBusinessService.get('itemGroup'),
      this.apiBusinessService.get('item'),
      this.apiBusinessService.get('batch'),
      this.apiBusinessService.post('stock/transactions', {
        transactionTypeId: 1,
        fromDate: this.datePipe.transform(today),
        toDate: this.datePipe.transform(tomorrow),
      }),
    ])
      .pipe(take(1))
      .subscribe((data: any) => {
        this.godowns = data[0] as AmrrGodown[];
        this.bays = data[1] as AmrrBay[];
        this.itemGroups = data[2] as AmrrItemGroup[];
        this.items = data[3] as AmrrItem[];
        this.batches = data[4] as AmrrBatch[];
        this.form = new FormGroup({
          fromDate: new FormControl(today),
          toDate: new FormControl(tomorrow),
          goDownId: new FormControl(null),
          bayId: new FormControl(''),
          itemGroupId: new FormControl(''),
          itemId: new FormControl(''),
          batchId: new FormControl(''),
        });
        this.columns = this.getColumns(partyNameTemplate);
        this.setDataSource(data[5]);
      });
  }

  getData() {
    if (this.form.dirty && this.form.valid) {
      this.apiBusinessService
        .post('stock/transactions', {
          transactionTypeId: 2,
          fromDate: this.datePipe.transform(this.form.controls.fromDate.value),
          toDate: this.datePipe.transform(this.form.controls.toDate.value),
          godownId: this.form.controls.goDownId.value,
          bayId: this.form.controls.bayId.value,
          itemGroupId: this.form.controls.itemGroupId.value,
          itemId: this.form.controls.itemId.value,
          batchId: this.form.controls.batchId.value,
        })
        .pipe(take(1))
        .subscribe((data: any) => this.setDataSource(data));
    }
  }

  navigateToAddOutward() {
    this.router.navigate(['stockOutward', 'edit', 'new']);
  }

  edit(transaction: Transaction) {
    this.router.navigate(['stockOutward', 'edit', +transaction.transactionId]);
  }

  delete(transaction: Transaction) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the transaction with invoice - ${transaction.invoiceNo} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        result ? this.deleteTransaction(transaction.transactionId) : null;
      });
  }

  private setDataSource(data: any) {
    this.dataSource = new MatTableDataSource(data.recordset as StockOutward[]);
  }

  private getColumns(partyNameTemplate: TemplateRef<any>): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockOutward>('transactionId'),
        name: 'TRID',
        hidden: true,
      },
      {
        key: Helper.nameof<StockOutward>('sno'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<StockOutward>('inwardDate'),
        name: 'Outward Date',
        type: GridColumnType.Date,
      },
      {
        key: Helper.nameof<StockOutward>('godown'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<StockOutward>('partyName'),
        name: 'Party Name',
        type: GridColumnType.Template,
        template: partyNameTemplate
      },
      {
        key: Helper.nameof<StockOutward>('items'),
        name: 'Items',
      },
      {
        key: Helper.nameof<StockOutward>('bags'),
        name: 'No. of Bags',
      },
      {
        key: Helper.nameof<StockOutward>('qty'),
        name: 'Qty',
      },
      {
        key: Helper.nameof<StockOutward>('createdBy'),
        name: 'Created By',
      },
      {
        key: Helper.nameof<StockOutward>('updatedBy'),
        name: 'Updated By',
      },
    ];
  }

  private deleteTransaction(transactionId: number) {
    this.apiBusinessService
      .delete('stock', transactionId)
      .pipe(take(1))
      .subscribe((_) => {
        this.snackBar.open('Deleted Transaction', '', { duration: 2000 });
        this.getData();
      });
  }
}