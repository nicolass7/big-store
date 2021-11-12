import { Component, OnInit, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from '../../product/add-product/add-product.component';
import { Product } from '../../product/model/product';
import { ProductComponent } from '../../product/product.component';
import { AddUserComponent } from '../../user/add-user/add-user.component';
import { User } from '../../user/model/user';
import { UserComponent } from '../../user/user.component';
import { DetailAll } from '../model/detailAll';
import { Store } from '../model/Store';
import { StoreService } from '../service/store.service';
import { count, tap } from 'rxjs/operators';
import { Order } from '../model/order';
import { DetailService } from '../service/detail.service';
import { OrderService } from '../service/order.service';
import { Detail } from '../model/detail';
import { Router } from '@angular/router';
import { CustomDateParserFormatter } from '../../user/add-user/CustomDateParserFormatter ';
import { ProductService } from '../../product/service/product.service';


@Component({
  selector: 'app-add',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class AddOrderComponent implements OnInit {
  detailAlls:DetailAll[] = [];
  order!: Order;
  position = 0;
  igvValue = 0.18;
  stores: Store [] = [];
  product!:Product ;
  contractForm !: FormGroup;
  constructor(private router:Router,private ngModal:NgbModal, private orderService:OrderService, private storeService:StoreService, private serviceDetail:DetailService,
    private productService:ProductService) {
    this.contractForm = this.createGroup();
  }

  ngOnInit(): void {
    this.contractForm = this.createGroup();
    this.getStores();
  }

  createGroup(){
    return this.contractForm = new FormGroup({
      dateOrder:new FormControl(Date.now()),
      storeId :new FormControl(''),
      userId: new FormControl('',),
      userName: new FormControl(''),
      quantity: new FormControl('1'),
      subTotal: new FormControl('0.00'),
      igv: new FormControl('0.00'),
      totalDetail: new FormControl('0.00')
    });
  }

  addUser(){
    const opt = {
      size: 'lg'
    }
    this.ngModal.open(AddUserComponent,opt);
  }

  selectUser(){
    const opt = {
      size: 'xl'
    }
    const modalUserRefNgModal = this.ngModal.open(UserComponent, opt);
    modalUserRefNgModal.componentInstance.eventEmitter.subscribe((user: User) => 
    {
      this.contractForm.get('userId')?.setValue( user.id);
      this.contractForm.get('userName')?.setValue( user.lastName + ' ' + user.firstName); 
      modalUserRefNgModal.close();
    });
      
  }
  
  selectProduct(){
    const opt= {
      size: 'xl'
    }
    let ingreso:Boolean= true;

      const modalProductRefNgModal = this.ngModal.open(ProductComponent,opt);
      modalProductRefNgModal.componentInstance.eventEmitter.subscribe((product:Product) => {
        this.detailAlls.forEach(detailAllsFor=>{
          if(detailAllsFor.productId ===product.id)
            ingreso=false;
        });
        if(ingreso){
          this.detailAlls.push({
            "positionId":this.detailAlls.length,
            "productId":product.id,
            "name":product.name,
            "price":product.price,
            "quantity":1,
            "total": ((product.price)?product.price:1)* 1
          });
          this.calculationDetail();
        }
        else{
          alert("Este producto ya fue ingresado");
        }
        modalProductRefNgModal.close();
      });


  }
  addProduct(){
    const opt ={
      size:'lg'
    }
    const modalProductRefNgModal = this.ngModal.open(AddProductComponent,opt);
  }

  deleteRow(){
    alert("Eliminar registro de la orden");
  }

  detail:Detail={};
  save():void{
    //console.log(moment(this.contractForm.get("dateOrder")?.value  , "YYYY-MM-DD HH:mm:ss").format("DD-MMM-YYYY"));
    this.order ={
      dateOrder : this.contractForm.get("dateOrder")?.value.day + "-"+ this.contractForm.get("dateOrder")?.value.month + "-" + this.contractForm.get("dateOrder")?.value.year,
      storeId: Number(this.contractForm.get('storeId')?.value),
      userId :this.contractForm.get('userId')?.value,
      status: true
    };

    this.orderService.postOder(this.order)
    .subscribe( (x=>
    this.orderService.getOrders().subscribe(
      x=>
      {
        this.detailAlls.map(detailAll =>{
          this.detail.productId= detailAll.productId;
          this.detail.orderId= Number(x.length);
          this.detail.productId= detailAll.productId;
          this.detail.quantity= detailAll.quantity;
          this.detail.total=detailAll.total;         
          this.productService.getProductId(((this.detail.productId)?this.detail.productId:0))
          .subscribe(productSubscribe=>{
            productSubscribe.stock =  ((productSubscribe?.stock)?productSubscribe?.stock:0)-((detailAll?.quantity)?detailAll?.quantity:1);
            this.productService.postProduct(productSubscribe);
          });
          this.serviceDetail.postDetail(this.detail).subscribe(x=>{       
            alert("Se agrego con Exito...!");
            this.router.navigate(["/order"]);
          });
        });
      })  
    ));
  }

  onkey(event:any){
    this.calculationDetail();
  }

  calculationDetail(){
    var totalCalcular!:number;
    var totalCalcular2: void[];
    this.detailAlls[this.position].quantity = +this.contractForm.get('quantity')?.value;
    this.detailAlls[this.position].total = (this.detailAlls[this.position].quantity|| 0)*(this.detailAlls[this.position].price|| 0);
   
    totalCalcular = this.detailAlls
    .map(obj=>{
      if(obj && obj.price && obj.quantity)
         return obj.price*obj.quantity;
      else 
      return 0;})
    .reduce(((acc,num)=> (acc+num)),0);
    this.contractForm.patchValue({
      subTotal:totalCalcular,
      igv:totalCalcular*this.igvValue,
      totalDetail:(totalCalcular+(totalCalcular*this.igvValue))
    });

  }
  
  onUpdate(detailAll:DetailAll){
    this.position=(detailAll.positionId || 0);
  }
  
  private getStores(): void{
    this.storeService.getStores()
    .pipe(
      tap((stores:Store[]) => this.stores =stores))
      .subscribe();
  }

}
