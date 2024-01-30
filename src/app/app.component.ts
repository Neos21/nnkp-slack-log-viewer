import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UsersService } from './services/users.service';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private readonly usersService: UsersService) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      await this.usersService.fetchUsers();
    }
    catch(error) {
      console.error('AppComponent#ngOnInit()', error);
    }
  }
}
