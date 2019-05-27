import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';

const agoraConfig: AgoraConfig = {
  AppID: '6c6194096bc34f5197f811c83c3c1422',
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularAgoraRtcModule.forRoot(agoraConfig) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
