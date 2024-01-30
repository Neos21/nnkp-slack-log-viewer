import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, ErrorComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  public channels: Array<any> = [];
  public users   : Array<any> = [];
  public error: any | null = null;
  
  constructor(private readonly usersService: UsersService) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      const channelsResponse = await fetch('./assets/channels.json');
      const channels: Array<any> = await channelsResponse.json();
      this.channels = channels;
      
      this.users = await this.usersService.fetchUsers();
    }
    catch(error) {
      console.error('MenuComponent#ngOnInit()', error);
      this.error = error;
    }
  }
}
