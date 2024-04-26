import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { UsersService } from './services/users.service';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public inputPassword = '';
  
  private isShownMenu = false;
  
  constructor(
    private readonly renderer2: Renderer2,
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly usersService: UsersService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    // ページ遷移時はサイドメニューを閉じ、ページトップに遷移させる
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.toggleMenu(false);
        window.scrollTo(0, 0);
      }
    });
    
    // LocalStorage にパスワードが見つかったら自動的にログインする
    const localStoragePassword = window.localStorage.getItem('password');
    if(localStoragePassword) {
      this.inputPassword = localStoragePassword;
      this.onLogin();
    }
  }
  
  public toggleMenu(isShown?: boolean): void {
    this.isShownMenu = isShown != null ? isShown : !this.isShownMenu;
    this.renderer2[this.isShownMenu ? 'addClass' : 'removeClass'](this.document.body, 'show-menu');
  }
  
  public async onLogin(): Promise<void> {
    this.isLoggedIn = window.btoa(this.inputPassword) === 'MjAyMzA0MTg=';  // `window.btoa()` で生成しておいたパスワードと突合する
    if(!this.isLoggedIn) return window.alert('パスワードが違います');
    window.localStorage.setItem('password', this.inputPassword);  // 入力したパスワードを控えておく
    
    // ログインできたらユーザ一覧を取得する・同様に `this.isLoggedIn` が `true` になることで各種コンポーネントが動作する
    try {
      await this.usersService.fetchUsers();
    }
    catch(error) {
      console.error('AppComponent#onLogin()', error);
    }
  }
}
