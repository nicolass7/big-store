import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../model/country';
import { User } from '../model/user';
import { CountryService } from '../service/country.service';
import { UserService } from '../service/user.service';
import { tap } from 'rxjs/operators';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from '../add-user/CustomDateParserFormatter ';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditUserComponent implements OnInit {
  countries !: Country[];
  user !: User;
  contractForm !:FormGroup;
  constructor(private router:Router, private userService:UserService
    ,private countryService:CountryService) { }

  ngOnInit(): void {
   this.contractForm = this.createGroup();
   this.edit();
   this.getCounties();  
  }

  createGroup(){
    return this.contractForm = new FormGroup({
      lastName : new FormControl('',[ Validators.required]),
      firstName : new FormControl('',[Validators.required]),
      countryCode : new FormControl('',[Validators.required]),
      dateBirth : new FormControl('',[Validators.required])
    });
  }  

  edit(){  
    let id = localStorage.getItem("id") as any;
    this.userService.getUserId(+id)
    .subscribe(next => {
      this.user = next; 
      this.contractForm.patchValue({
        lastName: this.user.lastName,
        firstName : this.user.firstName,
        countryCode : this.user.countryCode,
        dateBirth :{year: parseInt(this.user.dateBirth.split('-')[0]), month: parseInt(this.user.dateBirth.split('-')[1]), day: parseInt(this.user.dateBirth.split('-')[2])}
       });
       this.contractForm.controls["dateBirth"].setValue({day: parseInt(this.user.dateBirth.split('-')[2]),month: parseInt(this.user.dateBirth.split('-')[1]), year:parseInt(this.user.dateBirth.split('-')[0])}) ;//nice
       });
  }

  update(){
    this.user.lastName= this.contractForm.get('lastName')?.value;
    this.user.firstName=this.contractForm.get('firstName')?.value;
    this.user.countryCode= this.contractForm.get('countryCode')?.value;
    this.user.dateBirth = this.contractForm.get('dateBirth')?.value.year
    + "-" + (this.contractForm.get('dateBirth')?.value.month.toString().length === 1 ? '0'+(this.contractForm.get('dateBirth')?.value.month):this.contractForm.get('dateBirth')?.value.month)
    + "-" + (this.contractForm.get('dateBirth')?.value.day.toString().length === 1 ? '0'+(this.contractForm.get('dateBirth')?.value.day):this.contractForm.get('dateBirth')?.value.day.toString());
    this.userService.putUser(this.user)
    .subscribe(user =>{

      this.user =user;
      alert("Se actulizo con exito !!!");
      this.router.navigate(["user"]);
    });
  } 

  getCounties(){
      this.countryService.getCountries()
      .pipe(tap((countries:Country[]) => this.countries = countries))
      .subscribe();
  }

}
