import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../model/category';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-add',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  categories !: Category[];
  contractForm !: FormGroup;
  constructor(private router:Router, private productService:ProductService, private categoryService:CategoryService) {
    this.contractForm = this.createGroup();
  }

  ngOnInit(): void {
    this.listCategories();
  }

  createGroup(){
    return this.contractForm = new FormGroup({
      name : new FormControl('',[Validators.required]),
      price : new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required]),
      categoryId : new FormControl(),
      stock : new FormControl('',[Validators.required]),
      status: new FormControl(true,[Validators.required])
    });
   }

  listCategories(){
    this.categoryService.getCategories()
    .pipe(tap((categories:Category[]) => this.categories = categories))
    .subscribe();
  }
   
  public save ():void{
    if(this.contractForm.valid){
      this.productService.postProduct(this.contractForm.value )
      .subscribe(data =>{
        alert("Se agrego con Exito...!")
        this.router.navigate(["product"]);
      });
    }else{
      console.log("Error");
    }
  }

}
