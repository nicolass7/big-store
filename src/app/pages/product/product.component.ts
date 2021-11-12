import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from './model/product';
import { ProductService } from './service/product.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Output() public eventEmitter = new EventEmitter<Product>();
  products !: Product[];
  constructor(private productService:ProductService, private router:Router) { }

  ngOnInit(): void {
    console.log("metodo para mostar la lista");
    this.list();
  }

  list():void{
    this.productService.getProducts()
    .pipe(tap((products : Product[])=> this.products =products))
      .subscribe( productsSub=>
        this.products=productsSub.filter(productsFilter=>productsFilter.status==true)
      );
  }
  edit(product:Product):void{
    localStorage.setItem("id",product.id.toString());
    this.router.navigate(["product/edit"]);
  }

  delete(product :Product){
    const dele = this.productService.deletePersona(product)
    .subscribe(product => {
      this.products = this.products.filter(p=>p!=product);
      alert("Usuario eliminado ...");
      this.list();
    });
  }
  onUpdate(product: Product){
    this.eventEmitter.emit(product);
  }
}
