import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
import { Toast } from 'ionic-native';

import { TransactionPage } from '../transaction/transaction'
import { SpendsService } from './spends.service'

@Component({
  selector: 'page-spends',
  templateUrl: 'spends.html'
})
export class SpendsPage {
  yearMonth: any;
  Transactions: any;
  totalSpend: any = 0;
  constructor(public navCtrl: NavController,
    public navParam: NavParams,
    public alertCtrl: AlertController,
    public spendsService: SpendsService) {
    this.yearMonth = this.navParam.get("yearMonth");
    this.init();
  }

  init(): any {
    var latestTransaction = new Promise<any>((resolve, reject) => {
      this.spendsService.getLatestTransaction(this.yearMonth).then((response) => {
        resolve(response);
      });
    });

    Promise.all([latestTransaction]).then(response => {
      this.Transactions = response[0];
      this.Transactions.forEach(transaction => {
        this.totalSpend += transaction.Amount;
      });
    });
  }

  doTransaction(transactionType, transactionTitle, teansactionData) {
    this.navCtrl.push(TransactionPage, {
      transactionType: transactionType,
      transactionTitle: transactionTitle,
      teansactionData: teansactionData
    });
  }

  deleteSpend(item) {    
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Do you agree to delete this transaction?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.spendsService.deleteTransaction(item).then(response => {
              this.Transactions.splice(this.Transactions.indexOf(item), 1);
              this.totalSpend -= item.Amount;
              Toast.show("Delete successfully", "short", "center").subscribe(
                toast => {
                  console.log(toast);
                });;
            }, function (error) {
              Toast.show("Delete fail", "short", "center").subscribe(
                toast => {
                  console.log(toast);
                });;
            });
          }
        }
      ]
    });
    confirm.present();
  }

  getDate(): any {
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if (day < 10 && month < 10) {
      return (year + "-0" + month + "-0" + day);
    } else if (day < 10) {
      return (year + "-" + month + "-0" + day);
    } else if (month < 10) {
      return (year + "-0" + month + "-" + day);
    } else {
      return (year + "-" + month + "-" + day);
    }
  }
  
}
