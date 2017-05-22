import { Component, Renderer } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

declare var window: any;

declare var cordova: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  list:any = 5;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    renderer: Renderer,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      this.getPermission();
      this.startWatch();
      this.backgroundMode.enable();
      cordova.plugins.backgroundMode.on('enable', (e)=>{
        document.addEventListener('onSMSArrive', this.getSMSList);
      });
      //for testing
      //this.getSMSList();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  startWatch() {
    if (window.SMS) window.SMS.startWatch(function () {
      console.log('watching started');
    }, function () {
      console.log('failed to start watching');
    });
  }

  getPermission() {
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.READ_SMS, checkPermissionCallback, null);
    function checkPermissionCallback(status) {
      if (!status.hasPermission) {
        var errorCallback = function () {
          alert('READ_SMS permission is not turned on');
        }

        permissions.requestPermission(
          permissions.READ_SMS,
          function (status) {
            if (!status.hasPermission) {
              errorCallback();
            }
          },
          errorCallback);
      }
    }
  }

  getSMSList() {
    var filter = {
      box: 'inbox',
      read: 0,
      maxcount: 1000
    }
    var notificationsList = [];
    setTimeout(() => {
      if (window.SMS) window.SMS.listSMS(filter, (data) => {
        data.forEach(element => {
          notificationsList.push({
            id: element.date,
            text: element.body,
            data: element
          });
        });
        console.log(this.list);
        //this.localNotifications.schedule(notificationsList);
      }, error => {
        console.log(error);
      });
    }, 10000);

  }
}
