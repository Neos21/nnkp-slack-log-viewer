import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsersService {
  public users: Array<any> = [];
  
  public async fetchUsers(): Promise<Array<any>> {
    if(this.users.length !== 0) return this.users;
    
    const usersResponse = await fetch('./assets/users.json');
    const rawUsers: Array<any> = await usersResponse.json();
    const users = rawUsers.filter(user => !user.is_bot && user.id !== 'USLACKBOT');
    this.users = users;
    return users;
  }
}
