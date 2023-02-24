import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmrrGodownComponent } from './master/amrr-godown/amrr-godown.component';
import { AmrrItemGroupComponent } from './master/amrr-item-group/amrr-item-group.component';
import { AmrrItemComponent } from './master/amrr-item/amrr-item.component';
import { StockInwardComponent } from './stock-inward/stock-inward.component';

const routes: Routes = [
  { path: 'stockInward', component: StockInwardComponent },
  { path: 'itemGroup', component: AmrrItemGroupComponent },
  { path: 'item', component: AmrrItemComponent },
  { path: 'godown', component: AmrrGodownComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
