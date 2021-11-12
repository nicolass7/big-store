import {  EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order !: Order[];
  $detailId = new EventEmitter<Order>();
  private apiURL = 'http://localhost:3000';
  
  constructor(private http:HttpClient) { }

  getOrders():Observable<Order[]>{
    console.log(`${this.apiURL}/order`);
    return this.http.get<Order[]>(`${this.apiURL}/order`);
  }
  postOder(order:Order){
    return this.http.post<Order>(`${this.apiURL}/order`,order);
  }
  setValueEmit(order:Order){
    this.$detailId.emit(order);
  }
  deleteOrder(order:Order){
    return this.http.put<Order>(`${this.apiURL}/order/`+ order.id, order);
  }
}
