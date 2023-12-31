import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AmrrBay } from 'src/app/master/amrr-bay/amrr-bay-editor/amrr-bay.model';
import { AmrrGodown } from 'src/app/master/amrr-godown/amrr-godown-editor/amrr-godown.model';
import { AmrrItem } from 'src/app/master/amrr-item/amrr-item-editor/amrr-item.model';
import {
  GridColumnType,
  IAmmrGridColumn,
} from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { DataHelperService } from 'src/app/shared/data-helper.service';
import Helper from 'src/app/shared/helper';
import { AmrrBatch } from 'src/app/shared/models/amrr-batch.model';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { TransactionBatchFormHelperService } from 'src/app/shared/transaction-batch-form-helper.service';
import { TransactionBatchService } from 'src/app/shared/transaction-batch.service';

@Injectable()
export class OutwardTransactionBatchFormService {
  batchForm: FormGroup<{
    godown: FormControl<any>;
    bay: FormControl<any>;
    item: FormControl<any>;
    batch: FormControl<any>;
    bags: FormControl<any>;
    qty: FormControl<any>;
  }>;

  godowns: AmrrGodown[] = [];
  items: AmrrItem[] = [];
  bays: AmrrBay[] = [];
  batches: AmrrBatch[] = [];
  columns: IAmmrGridColumn[] = [];
  data: TransactionBatch[] = [];

  constructor(
    readonly transactionBatchService: TransactionBatchService,
    private readonly dataHelperService: DataHelperService,
    private readonly formHelperService: TransactionBatchFormHelperService
  ) {}

  init() {
    this.dataHelperService.batches$.subscribe((batches) => {
      this.batches = batches;
      this.batchForm.controls.batch.setValue(
        batches.length === 1 ? batches[0] : null
      );
    });
    this.dataHelperService.bays$.subscribe((bays) => {
      this.bays = bays;
      this.batchForm.patchValue({
        bay: bays.length === 1 ? bays[0] : null,
      });
    });
    this.dataHelperService.items$.subscribe((items) => {
      this.items = items;
      this.batchForm.controls.item.setValue(
        items.length === 1 ? items[0] : null
      );
    });
    this.dataHelperService.godownsItems$.subscribe((res) => {
      this.godowns = res.godowns;
      this.buildForm();
    });

    this.dataHelperService.getGodownAndItems(true);
  }

  addBatch() {
    if (this.checkIfBatchIsValid()) {
      const batch = this.buildTransactionBatchData();
      this.transactionBatchService.addToGrid(batch);
      this.formHelperService.resetForm(this.batchForm);
    }
  }

  removeBatch(event: TransactionBatch) {
    this.transactionBatchService.removeFromGrid(event);
    this.formHelperService.resetForm(this.batchForm);
  }

  private buildForm() {
    this.batchForm = new FormGroup({
      godown: new FormControl(null, [Validators.required]),
      bay: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      item: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      batch: new FormControl(null, [Validators.required]),
      qty: new FormControl(null, [Validators.required, Validators.min(0.0001)]),
      bags: new FormControl(null),
    });
    this.setupFormListeners();
    this.columns = this.getColumns();
  }

  private setupFormListeners() {
    this.batchForm.controls['godown'].valueChanges.subscribe((godown) => {
      if (Helper.isTruthy(godown) && +godown.id > 0) {
        this.dataHelperService.updateBays(godown.id, true);
        this.batchForm.get('bay')!.enable();
      } else {
        this.batchForm.get('bay')!.disable();
      }
      this.batchForm.updateValueAndValidity();
    });

    this.batchForm.controls['bay'].valueChanges.subscribe((bay) => {
      if (Helper.isTruthy(bay) && +bay.id > 0) {
        this.dataHelperService.updateItems(
          this.batchForm.controls.godown.value?.id,
          bay?.id
        );
        this.batchForm.get('item')!.enable();
      } else {
        this.batchForm.get('item')!.disable();
      }
      this.batchForm.updateValueAndValidity();
    });

    this.batchForm.controls['item'].valueChanges.subscribe((item) =>
      this.dataHelperService.updateBatches(
        2,
        this.batchForm.controls['godown'].value?.id,
        item?.id,
        this.batchForm.controls['bay'].value?.id
      )
    );

    this.batchForm.controls['batch'].valueChanges
      .pipe(debounceTime(300))
      .subscribe((batch: AmrrBatch) => {
        const qtyCtrl = this.batchForm.controls['qty'];
        const bagsCtrl = this.batchForm.controls['bags'];
        if (Helper.isTruthy(batch) && !isNaN(batch.bags) && !isNaN(batch.qty)) {
          this.formHelperService.setMaxValueForControl(qtyCtrl, batch.qty);
          this.formHelperService.setMaxValueForControl(bagsCtrl, batch.bags);
        }
      });
  }

  private checkIfBatchIsValid() {
    return (
      this.batchForm.valid &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('godown'),
        this.batchForm.get('godown')?.value?.id
      ) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('bay'),
        this.batchForm.get('bay')?.value?.id
      ) &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('item'),
        this.batchForm.get('item')?.value?.id
      ) &&
      this.validateBatchValue() &&
      this.formHelperService.validateNumberControlValue(
        this.batchForm.get('qty'),
        this.batchForm.get('qty')?.value
      )
    );
  }

  private validateBatchValue() {
    const ctrl = this.batchForm.controls.batch;
    if (!Helper.isTruthy(ctrl.value?.id) || isNaN(+ctrl.value?.id)) {
      ctrl.setErrors({ InvalidValue: true });
      return false;
    } else {
      ctrl.setErrors(null);
      return true;
    }
  }

  private buildTransactionBatchData() {
    const batch = new TransactionBatch();
    batch.sno = this.transactionBatchService.getNextRowSno();
    batch.id = null;
    batch.godownId = this.batchForm.controls.godown.value.id;
    batch.godown = this.batchForm.controls.godown.value.name;
    batch.bayId = this.batchForm.controls.bay.value.id;
    batch.bay = this.batchForm.controls.bay.value.name;
    batch.itemId = this.batchForm.controls.item.value.id;
    batch.itemName = this.batchForm.controls.item.value.name;
    batch.batchId = this.batchForm.controls.batch.value.id;
    batch.batchName = this.batchForm.controls.batch.value.name;
    batch.bags = this.batchForm.controls.bags.value ?? 0;
    batch.qty = this.batchForm.controls.qty.value;
    return batch;
  }

  private getColumns() {
    return [
      {
        key: Helper.nameof<TransactionBatch>('sno'),
        name: 'S.No.',
        type: GridColumnType.Sno,
      },
      {
        key: Helper.nameof<TransactionBatch>('godown'),
        name: 'Destination',
      },
      {
        key: Helper.nameof<TransactionBatch>('bay'),
        name: 'Bay',
      },
      {
        key: Helper.nameof<TransactionBatch>('itemName'),
        name: 'Item Name',
      },
      {
        key: Helper.nameof<TransactionBatch>('batchName'),
        name: 'Batch No',
      },
      {
        key: Helper.nameof<TransactionBatch>('bags'),
        name: 'No. of Bags',
      },
      {
        key: Helper.nameof<TransactionBatch>('qty'),
        name: 'Qty',
      },
    ];
  }
}
