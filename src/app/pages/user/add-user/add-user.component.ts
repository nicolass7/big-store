import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from '../model/country';
import { CountryService } from '../service/country.service';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './CustomDateParserFormatter ';

@Component({
  selector: 'app-add',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
 
})
export class AddUserComponent implements OnInit {

  now:Date = new Date();
  contractForm !: FormGroup;
  countries !: Country[];
  user:User = new User;
  
  constructor(private router:Router, private userService:UserService, private countryService: CountryService) {
    this.contractForm = this.createGroup();
  }

  ngOnInit(): void {
    this.getCountry();   
    this.contractForm.controls["dateBirth"].setValue({day: 20, month:4, year:1969}) ;//nice
    this.contractForm.valueChanges.subscribe(val => {
      console.log(val);
    })
    console.log(this.contractForm.value);

  }

  getCountry(): void {
    this.countryService.getCountries()
      .pipe(tap((countries: Country[]) => this.countries = countries))
      .subscribe();
  }

  createGroup() {
    return this.contractForm = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      countryCode: new FormControl('', [Validators.required]),
      dateBirth: new FormControl({year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()}, [Validators.required]),
      status: new FormControl(true,[Validators.required])
    });
  }

  public save(): void {
    if (this.contractForm.valid) { 
      this.contractForm.controls["countryCode"].setValue(this.contractForm.get('countryCode')?.value.trim());
      this.contractForm.controls["dateBirth"].setValue(      
      (this.contractForm.get('dateBirth')?.value.day.toString().length === 1 ? '0'+(this.contractForm.get('dateBirth')?.value.day):this.contractForm.get('dateBirth')?.value.day.toString())
      + "-" + (this.contractForm.get('dateBirth')?.value.month.toString().length === 1 ? '0'+(this.contractForm.get('dateBirth')?.value.month):this.contractForm.get('dateBirth')?.value.month)
      + "-" + this.contractForm.get('dateBirth')?.value.year);
      this.userService.postUser(this.contractForm.value)
        .subscribe(data => {
          alert("Se agrego con Exito...!")
          this.router.navigate(["/user"])
        });
    } else {
      console.log("Error");
    }
  }
}
