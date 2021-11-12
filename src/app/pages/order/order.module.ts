import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OrderComponent,
    AddOrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class OrderModule { }
