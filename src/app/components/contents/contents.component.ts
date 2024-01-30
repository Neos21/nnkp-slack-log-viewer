import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-contents',
  standalone: true,
  imports: [CommonModule, ErrorComponent],
  templateUrl: './contents.component.html',
  styleUrl: './contents.component.css'
})
export class ContentsComponent implements OnInit {
  public headline: string = '-';
  public contents: Array<any> = [];
  public error: any | null = null;
  
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly usersService: UsersService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParamMap.subscribe(async (params: ParamMap) => {
      try {
        this.error = null;
        
        const channelName   = params.get('channel_name');
        const directoryName = params.get('directory_name');
        const fileName      = params.get('file_name');
        
        // パラメータ不足の場合は何も表示しない
        if(channelName == null || directoryName == null || fileName == null) {
          this.headline = '-';
          this.contents = [];
          window.scrollTo(0, 0);
          return;
        }
        
        const contentsResponse = await fetch(`./assets/${directoryName}/${fileName}.json`);
        const contents = await contentsResponse.json();
        
        this.headline = `${channelName} : ${fileName}`;
        this.contents = contents;
        window.scrollTo(0, 0);
      }
      catch(error) {
        console.error('ContentsComponent#ngOnInit()', error);
        this.headline = 'Error';
        this.error = error;
      }
    });
  }
  
  public getImageUrl(userId: string): string {
    const user = this.usersService.users.find(user => user.id === userId);
    return user?.profile?.image_24 || '';
  }
  
  public getUserName(userId: string): string {
    const user = this.usersService.users.find(user => user.id === userId);
    return user?.profile?.display_name || user?.real_name || '-';
  }
  
  public convertTsToJst(ts: string): string {
    const date = new Date(Number(ts) * 1000);
    const jst = new Date(date.getTime() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const jstString = jst.getFullYear()
      + '-' + String(jst.getMonth() + 1).padStart(2, '0')
      + '-' + String(jst.getDate()     ).padStart(2, '0')
      + ' ' + String(jst.getHours()    ).padStart(2, '0')
      + ':' + String(jst.getMinutes()  ).padStart(2, '0')
      + ':' + String(jst.getSeconds()  ).padStart(2, '0');
    return jstString;
  }
  
  public replaceUserNames(text: string): string {
    return text.replace((/<@(U.*?)>/gu), (_match, userId) => {
      const user = this.usersService.users.find(user => user.id === userId);
      return `@${user?.profile?.display_name || user?.real_name || '-'}`;
    });
  }
}
