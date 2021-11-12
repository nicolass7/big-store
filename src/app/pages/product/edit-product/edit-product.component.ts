 import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { Category } from '../model/category';
import { Product } from '../model/product';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product! : Product;
  categories !: Category[];
  contractForm !: FormGroup;
  constructor(private router:Router, private productService:ProductService
    , private categoryService: CategoryService) {
      this.contractForm = this.createGroup();
     }

  ngOnInit(): void {
    this.getCategories();
    this.edit();    
  }
  
  createGroup(){
    return this.contractForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      price: new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required]),
      categoryId: new FormControl('',[Validators.required]),
      stock: new FormControl('',[Validators.required])
    });
  }
  
  edit(){
    let id = localStorage.getItem("id") as any;
    this.productService.getProductId(+id) 
    .subscribe(next =>{
      this.product = next;
      this.contractForm.patchValue({
        name: this.product.name,
        price: this.product.price,
        description : this.product.description,
        categoryId: this.product.categoryId,
        stock: this.product.stock        
      })
    } );
  }

  update(){
    this.product.name= this.contractForm.get('name')?.value;
    this.product.price= this.contractForm.get('price')?.value;
    this.product.description=this.contractForm.get('description')?.value;
    this.product.categoryId=this.contractForm.get('categoryId')?.value;
    this.product.stock=this.contractForm.get('stock')?.value;
    console.log(this.product);
    this.productService.putProduct(this.product)
    .subscribe(product => {
      this.product = product;
      alert("Se actualizo con exito !!!");
      this.router.navigate(["product"]);
    });
  }
  getCategories(){
    this.categoryService.getCategories()
    .pipe(tap((categories:Category[]) => this.categories = categories))
    .subscribe(X =>
      console.log(this.categories));

  }

}
