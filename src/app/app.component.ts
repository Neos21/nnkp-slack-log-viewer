import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { UsersService } from './services/users.service';
import { MenuComponent } from './components/menu/menu.component';
import { DOCUMENT } from '@angular/common';

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
  private isShownMenu = false;
  
  constructor(
    private readonly renderer2: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly usersService: UsersService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      await this.usersService.fetchUsers();
    }
    catch(error) {
      console.error('AppComponent#ngOnInit()', error);
    }
  }
  
  public toggleMenu(isShown?: boolean): void {
    this.isShownMenu = isShown != null ? isShown : !this.isShownMenu;
    this.renderer2[this.isShownMenu ? 'addClass' : 'removeClass'](this.document.body, 'show-menu');
  }
}
