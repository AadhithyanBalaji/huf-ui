import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
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
import { IAmrrTypeahead } from '../shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../shared/api-business.service';
import Helper from '../shared/helper';
import { AmrrBatch } from '../shared/models/amrr-batch.model';
import { StockInward } from './stock-inward.model';

@Injectable()
export class StockInwardFormService {
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
  dataSource: MatTableDataSource<StockInward, MatPaginator>;
  columns: IAmmrGridColumn[];

  constructor(
    private readonly apiBusinessService: ApiBusinessService,
    private readonly router: Router,
    private readonly datePipe: DatePipe
  ) {}

  init() {
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
        this.columns = this.getColumns();
        this.setDataSource(data[5]);
      });
  }

  getData() {
    if (this.form.dirty && this.form.valid) {
      this.apiBusinessService
        .post('stock/transactions', {
          transactionTypeId: 1,
          fromDate: this.datePipe.transform(this.form.controls.fromDate.value),
          toDate: this.datePipe.transform(this.form.controls.toDate.value),
          godownId: this.form.controls.goDownId.value,
          bayId: this.form.controls.bayId.value,
          itemGroupId: this.form.controls.itemGroupId.value,
          itemId: this.form.controls.itemId.value,
          batchId: this.form.controls.batchId.value,
        })
        .pipe(take(1))
        .subscribe((data: any) => {
          this.setDataSource(data);
        });
    }
  }

  navigateToAddInward() {
    this.router.navigate(['stockInward', 'edit', 'new']);
  }

  private setDataSource(data: any) {
    const inwards = data.recordset as StockInward[];
    let count = 1;
    inwards.forEach((i) => (i.id = count++));
    this.dataSource = new MatTableDataSource(inwards);
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<StockInward>('id'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<StockInward>('inwardDate'),
        name: 'Inward Date',
        type: GridColumnType.Date,
      },
      {
        key: Helper.nameof<StockInward>('godown'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<StockInward>('invoiceDetails'),
        name: 'Invoice Detail',
      },
      {
        key: Helper.nameof<StockInward>('items'),
        name: 'Items',
      },
      {
        key: Helper.nameof<StockInward>('bags'),
        name: 'No. of Bags',
      },
      {
        key: Helper.nameof<StockInward>('qty'),
        name: 'Qty',
      },
      // {
      //   key: 'user',
      //   name: 'User',
      // },
    ];
  }
}