import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Order } from './model/order';
import { OrderService } from './service/order.service';
import { tap } from 'rxjs/operators';
import { User } from '../user/model/user';
import { UserService } from '../user/service/user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { DetailAll } from './model/detailAll';
import { StoreService } from './service/store.service';
import { Store } from './model/Store';
import { DetailService } from './service/detail.service';
import { Detail } from './model/detail';
import { Product } from '../product/model/product';
import { ProductService } from '../product/service/product.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orders !: Order[];
  users !:User[];
  stores!:Store[];
  contractForm !:FormGroup;
  details !:Detail[];
  detailAlls: DetailAll[]=[];
  products:Product[]=[];
  constructor(private productService:ProductService, private detailService:DetailService, private storeSerice:StoreService, private ngModal:NgbModal, private router: Router, private userService: UserService,private orderService:OrderService) { }

  ngOnInit(): void {
    this.contractForm = this.createGroup();
    this.list();
  }

  createGroup(){
    return this.contractForm = new FormGroup({
      dateOrder: new FormControl(''),
      storeId:new FormControl(''),
      userId: new FormControl(''),
      userName: new FormControl(''),
      storeName: new FormControl(''),
      subTotal: new FormControl(''),
      igv: new FormControl(''),
      totalDetail:new FormControl('')
    });
  }

  list():void{  
    this.orders = [];
    this.users = [];
    this.stores = [];
    this.orderService.getOrders()
    //.pipe(tap((orders:Order[])=> this.orders=orders))
    .subscribe(ordersSub=>{
      this.orders = ordersSub.filter(orderFilter => orderFilter.status!=false);
      this.userService.getUsers()
      //.pipe(tap((users: User[]) => this.users = users))
      .subscribe(usersSub=>{
        this.users = usersSub;
        this.storeSerice.getStores()
        //.pipe(tap((stores: Store[]) => this.stores = stores))
        .subscribe(storesSub=>{
          this.stores=storesSub;
          this.listOrder();
        });
      });
    }); 
  }

  listOrder(){
    this.orders.forEach(y=>{
      this.users.forEach(user2 => {
        if(user2.id === y.userId){
          y.userName =user2.lastName+ " " + user2.firstName;
        }
      });
      this.stores.forEach(store2 =>{
        if(store2.id === y.storeId){
          y.storeName = store2.name;
        }
      })
    }); 
  }

  getDetail( order:Order){
    let subTotal =0;
    let igv=0;
    let totalDetail=0;
    this.detailAlls=[];
    this.contractForm.get('dateOrder')?.setValue(order.dateOrder);
    this.contractForm.get('userName')?.setValue(order.userName);
    this.contractForm.get('storeName')?.setValue(order.storeName);
    this.detailService.getDetailByorderId(order.id)
    .subscribe(detailsSub=>{
      this.productService.getProducts()
       .subscribe(
        productsSub=>{
          let inc=0;         
          detailsSub.forEach(detailSub=>{
            let name:string| undefined;
            let price:number| undefined;
            productsSub.map(elemento =>{
              console.log("elemento.id=" + elemento.id + "detailSub.id" + detailSub.id);
              if(elemento.id === detailSub.productId)
              {  
                name= elemento.name; 
                price = elemento.price; 
                return;           
              }
            });
            this.detailAlls.push({
              "positionId":(inc+1),
              "productId" : detailSub.productId,
              "name": name as unknown as string,
              "price": price,
              "quantity": Number(detailSub.quantity),
              "total": ((price?price:1) * Number(detailSub.quantity))
            });
            subTotal = ((price?price:1) * Number(detailSub.quantity))+subTotal;
            igv=subTotal * 0.18;
            totalDetail=subTotal+igv;
            this.contractForm.patchValue({
              "subTotal":subTotal,
              "igv":igv,
              "totalDetail":totalDetail
            });
            inc++;  
          })
        }
       );
    });   
  }

  delete(order:Order){
    order.status = false;
    this.orderService.deleteOrder(order)
    .subscribe(orderSub =>{
      this.orders= this.orders.filter( orderFilter =>orderFilter != order);
    });

  }
}
