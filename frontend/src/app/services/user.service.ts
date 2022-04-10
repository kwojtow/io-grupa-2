import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentLoggedUser : User = {
    id: 0,
    nick: "user1",
    email: "user1@email.com",
    avatar: "../../../../assets/resources/images/riFill-bus-2-fill 2.svg"
  }

  constructor() { }

  getCurrentLoggedUser() : User{
    return this.currentLoggedUser;
  }

  getSomeUserMock() : User{
    return {
      id: 1,
      nick: "test",
      email: "test@emal.com",
      avatar: "../../../../assets/resources/images/riFill-bus-2-fill 2.svg"
    } as User;
  }

}
