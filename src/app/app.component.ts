import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

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
    private readonly router: Router,
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
    // ページ遷移時はサイドメニューを閉じ、ページトップに遷移させる
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.toggleMenu(false);
        window.scrollTo(0, 0);
      }
    });
  }
  
  public toggleMenu(isShown?: boolean): void {
    this.isShownMenu = isShown != null ? isShown : !this.isShownMenu;
    this.renderer2[this.isShownMenu ? 'addClass' : 'removeClass'](this.document.body, 'show-menu');
  }
}
