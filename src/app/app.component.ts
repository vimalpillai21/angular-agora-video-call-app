import { Component } from '@angular/core';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angagora';
  localStream: Stream;
  
  constructor( private agoraService: AngularAgoraRtcService){
    this.agoraService.createClient();
  }

    // Add
    startCall() {
      this.agoraService.client.join(null, '1000', null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });
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
    }
}
