import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IAmrrTypeahead } from 'src/app/shared/amrr-typeahead/amrr-typeahead.interface';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { TransactionBatch } from 'src/app/shared/models/transaction-batch.model';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Injectable()
export class StockOutwardEditorFormService {
  transactionId: number;
  batchData: TransactionBatch[];
  batches: TransactionBatch[];
  form: FormGroup<{
    outwardDate: FormControl<Date | null>;
    outwardNo: FormControl<string | null>;
    vehicleName: FormControl<string | null>;
    party: FormControl<string | null>;
    vehicleRegNo: FormControl<string | null>;
    remarks: FormControl<any>;
    verifiedBy: FormControl<any>;
  }>;

  weightMeasures: IAmrrTypeahead[] = [
    {
      id: 1,
      name: 'Godown',
    },
    {
      id: 2,
      name: 'Weighbridge',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService
  ) {}

  init() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      if (!isNaN(params['id'])) {
        this.transactionId = +params['id'];
        combineLatest([
          this.apiBusinessService.post('stock/transaction', {
            transactionTypeId: 2,
            transactionId: this.transactionId,
          }),
          this.apiBusinessService.get(
            `transactionBatch/transaction/${this.transactionId}`
          ),
        ])
          .pipe(take(1))
          .subscribe((data: any) => {
            this.buildForm(data[0].recordset[0]);
            this.batches = data[1].recordset as TransactionBatch[];
          });
      } else {
        this.buildForm(new Transaction());
      }
    });
  }

  onBatchUpdate(event: TransactionBatch[]) {
    this.batchData = event;
  }

  addTransaction(stayOnPage = false) {
    if (
      (this.form.dirty ||
        this.batchData?.length > 0 ||
        this.batches.length > 0) &&
      this.form.valid
    ) {
      const transaction = this.buildTransactionData();
      this.apiBusinessService
        .post('stock', transaction)
        .pipe(take(1))
        .subscribe((_) => {
          this.displaySuccessToast();
          stayOnPage
            ? this.router.navigate([])
            : this.router.navigate(['stockOutward']);
        });
    }
  }

  addTransactionAndClose() {
    this.addTransaction(true);
  }

  cancel() {
    this.router.navigate(['stockOutward']);
  }

  private buildForm(transaction: Transaction) {
    this.form = new FormGroup({
      outwardDate: new FormControl(new Date(transaction.transactionDate)),
      outwardNo: new FormControl(),
      vehicleName: new FormControl(transaction.vehicleName),
      party: new FormControl(transaction.partyName ?? '', [
        Validators.required,
      ]),
      vehicleRegNo: new FormControl(transaction.vehicleRegNo ?? '', [
        Validators.required,
      ]),
      remarks: new FormControl(transaction.remarks),
      verifiedBy: new FormControl(transaction.verifiedBy),
    });
  }

  private buildTransactionData() {
    const transaction = new Transaction();
    transaction.transactionId = this.transactionId;
    transaction.batches = this.batchData ?? this.batches;
    transaction.transactionTypeId = 2;
    transaction.transactionDate = this.form.controls.outwardDate.value!;
    transaction.vehicleRegNo = this.form.controls.vehicleRegNo.value!;
    transaction.partyName = this.form.controls.party.value!;
    transaction.vehicleName = this.form.controls.vehicleName.value!;
    transaction.remarks = this.form.controls.remarks.value!;
    transaction.verifiedBy = this.form.controls.verifiedBy.value!;
    if (this.transactionId == null) {
      transaction.createdByUserId = this.authService.getUserId();
    } else {
      transaction.updatedByUserId = this.authService.getUserId();
    }
    return transaction;
  }

  private displaySuccessToast() {
    this.snackBar.open(
      Helper.isTruthy(this.transactionId) &&
        !isNaN(this.transactionId) &&
        this.transactionId > 0
        ? 'Updated Transaction'
        : 'Created Transaction',
      '',
      { duration: 2000 }
    );
  }
}