import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { User } from 'src/app/shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl: string;



  constructor(private http: HttpClient) {
  
    
   }

   public addUser(user: User){

     console.log(user);
     return this.http.post<User>('http://localhost:8080/auth/signup', user);
   }

}
