import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineLatest, from, take } from 'rxjs';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItemGroup } from 'src/app/master/amrr-item-group/amrr-item-group-editor/amrr-item-group.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import { IAmrrTypeahead } from '../amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from '../api-business.service';
import Helper from '../helper';
import { AmrrBatch } from '../models/amrr-batch.model';
import { AmrrReportFilters } from './amrr-report-filters.model';

@Injectable()
export class AmrrReportFiltersFormService {
  godowns: AmrrGodown[] = [];
  bays: AmrrBay[] = [];
  itemGroups: AmrrItemGroup[] = [];
  items: AmrrItem[] = [];
  batches: IAmrrTypeahead[];

  onViewClicked: EventEmitter<AmrrReportFilters>;
  form: FormGroup<{
    fromDate: FormControl<any>;
    toDate: FormControl<any>;
    goDownId: FormControl<any>;
    bayId: FormControl<any>;
    itemGroupId: FormControl<any>;
    itemId: FormControl<any>;
    batchId: FormControl<any>;
  }>;

  constructor(private readonly apiBusinessService: ApiBusinessService) {}

  init(onViewClicked: EventEmitter<AmrrReportFilters>, enableAllOptions: boolean) {
    this.onViewClicked = onViewClicked;
    const today = new Date();
    combineLatest([
      this.apiBusinessService.get('godown'),
      this.apiBusinessService.get('bay'),
      this.apiBusinessService.get('itemGroup'),
      this.apiBusinessService.get('item'),
      this.apiBusinessService.get('batch'),
    ])
      .pipe(take(1))
      .subscribe((data: any) => {
        for (let i = 0; i < 5 && enableAllOptions; i++) {
          data[i] = this.addAllOption(data[i]);
        }
        this.godowns = data[0] as AmrrGodown[];
        this.bays = data[1] as AmrrBay[];
        this.itemGroups = data[2] as AmrrItemGroup[];
        this.items = data[3] as AmrrItem[];
        this.batches = data[4] as AmrrBatch[];
        this.form = new FormGroup({
          fromDate: new FormControl(today, [Validators.required]),
          toDate: new FormControl(today, [Validators.required]),
          goDownId: new FormControl(),
          bayId: new FormControl(),
          itemGroupId: new FormControl(),
          itemId: new FormControl(),
          batchId: new FormControl(),
        });
        this.getData();
      });
  }

  getData() {
    const filters = new AmrrReportFilters();
    if (this.form.valid) {
      filters.fromDate = this.form.controls.fromDate.value!;
      filters.toDate = this.form.controls.toDate.value!;
      filters.godownId = this.checkForAllOption(this.form.controls.goDownId);
      filters.bayId = this.checkForAllOption(this.form.controls.bayId);
      filters.itemGroupId = this.checkForAllOption(
        this.form.controls.itemGroupId
      );
      filters.itemId = this.checkForAllOption(this.form.controls.itemId);
      filters.batchId = this.checkForAllOption(this.form.controls.batchId);
    }
    return this.onViewClicked.emit(filters);
  }

  checkForAllOption(ctrl: any) {
    return Helper.isValidNumber(ctrl.value) && ctrl.value > 0
      ? +ctrl.value
      : undefined;
  }

  private addAllOption(options: any) {
    if (!Helper.isTruthy(options) || options.length <= 0) return options;
    options.unshift({
      id: 0,
      name: 'All',
    });
    return options;
  }
}