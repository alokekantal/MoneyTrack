import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Toast } from 'ionic-native';

import { TransactionPage } from '../transaction/transaction'
import { IncomeService } from './income.service'

@Component({
  selector: 'page-income',
  templateUrl: 'income.html'
})
export class IncomePage {
  yearMonth: any;
  incomes: any;
  totalIncome: any = 0;
  constructor(public navCtrl: NavController,
    public navParam: NavParams,
    public alertCtrl: AlertController,
    public incomeService: IncomeService) {
    this.yearMonth = this.navParam.get("yearMonth");
    this.init();
  }

  init(): any {
    var latestTransaction = new Promise<any>((resolve, reject) => {
      this.incomeService.getIncomes(this.yearMonth).then((response) => {
        resolve(response);
      });
    });

    Promise.all([latestTransaction]).then(response => {
      this.incomes = response[0];
      this.incomes.forEach(transaction => {
        this.totalIncome += transaction.Amount;
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

  deleteIncome(item) {    
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Do you agree to delete this income?',
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
            this.incomeService.deleteIncome(item).then(response => {
              this.incomes.splice(this.incomes.indexOf(item), 1);
              this.totalIncome -= item.Amount;
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

  popView(){
     this.navCtrl.pop();
   }

}

