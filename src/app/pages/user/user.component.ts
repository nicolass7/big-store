import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tap, filter } from 'rxjs/operators';
import { Country } from './model/country';
import { User } from './model/user';
import { CountryService } from './service/country.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Output() public eventEmitter = new EventEmitter<User>();
  users !: User[];
  countries !:Country[];
  
  constructor(private userService: UserService, private router: Router, private countryService:CountryService) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.users= [];
    this.userService.getUsers()
      .pipe(tap((users: User[]) => this.users = users),)
      .subscribe(userSub =>{
        this.users = userSub.filter(usersFilter=>usersFilter.status==true);
        this.listCountries();
      });
  }
  
  listCountries():void{
    this.countries=[];
    this.countryService.getCountries()
    .pipe(tap((countries:Country[])=> this.countries =countries))
    .subscribe(countiresSub=>{
      this.users
        .forEach(valUsuario=> {
          this.countries.forEach(count=>{
            if (valUsuario.countryCode.trim()==count.code.trim()){
              valUsuario.countryName =count.name;
            }         
          });
        })
    });    
  }

  edit(user: User): void {
    user.status = true;
    localStorage.setItem("id", (user && user.id?user.id.toString():""));
    this.router.navigate(["user/edit"]);
    this.list();
    this.listCountries();

  }

  delete(user: User) {
    user.status = false;
    this.userService.deleteUser(user)
      .subscribe(user => {
        this.users = this.users.filter(u => u != user);
        alert("Usuario eliminado ...");
        this.list();
        this.listCountries();
      });
  }

  onUpdate(user: User){
    this.eventEmitter.emit(user);
  }

}
