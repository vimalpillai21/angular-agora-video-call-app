import { Component, OnInit } from '@angular/core';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'angagora';
  localStream: Stream;
  remoteCalls:any = [];
  
  constructor( private agoraService: AngularAgoraRtcService){
    this.agoraService.createClient();
  }
  

    // Add
    startCall() {
      this.agoraService.client.join(null, '1000', null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_6');
        this.subscribeToStreams();
      });
    }
    // Leave the channel
    endCall(){
      this.agoraService.client.leave(() => {
        console.log('Called ended successfully');
        this.localStream.stop();
        this.localStream.close();
      },
      (err) => {
        console.log('error ending call');
      }
      )
    }

  
    // Add
    private subscribeToStreams() {
      this.localStream.on("accessAllowed", () => {
        console.log("accessAllowed");
      });
      // The user has denied access to the camera and mic.
      this.localStream.on("accessDenied", () => {
        console.log("accessDenied");
      });
  
      this.localStream.init(() => {
        console.log("getUserMedia successfully");
        this.localStream.play('agora_local');
        this.agoraService.client.publish(this.localStream, function (err) {
          console.log("Publish local stream error: " + err);
        });
        this.agoraService.client.on('stream-published', function (evt) {
          console.log("Publish local stream successfully");
        });
      }, function (err) {
        console.log("getUserMedia failed", err);
      });
  
      // Add
      this.agoraService.client.on('error', (err) => {
        console.log("Got error msg:", err.reason);
        if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
          this.agoraService.client.renewChannelKey("", () => {
            console.log("Renew channel key successfully");
          }, (err) => {
            console.log("Renew channel key failed: ", err);
          });
        }
      });
  
      // Add
      this.agoraService.client.on('stream-added', (evt) => {
        const stream = evt.stream;
        this.agoraService.client.subscribe(stream, (err) => {
          console.log("Subscribe stream failed", err);
        });
      });
  
      // Add
      this.agoraService.client.on('stream-subscribed', (evt) => {
        const stream = evt.stream;
        if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
        setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 20);
      });
  
      // Add
      this.agoraService.client.on('stream-removed', (evt) => {
        const stream = evt.stream;
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
        console.log(`Remote stream is removed ${stream.getId()}`);
      });
  
      // Add
      this.agoraService.client.on('peer-leave', (evt) => {
        const stream = evt.stream;
        if (stream) {
          stream.stop();
          this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
          console.log(`${evt.uid} left from this channel`);
        }
      });
    }
}
