import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Toast } from 'ionic-native';

import { SearchCategoryModalPage } from './searchCategoryModal';

import { TransactionService } from './transaction.service';
import { TransactionModel } from '../../models/transaction';

@Component({
  selector: 'transaction',
  templateUrl: 'transaction.html'
})
export class TransactionPage {
  transactionType: any;
  transactionTitle: any;
  isDirty: boolean = false;
  category: any;
  transaction: any = new TransactionModel();
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public transactionService: TransactionService) {
    this.transactionType = navParams.get("transactionType");
    this.transactionTitle = navParams.get("transactionTitle");
    if (typeof navParams.get("teansactionData") !== "undefined") {      
      this.transaction = navParams.get("teansactionData");
      console.log(this.transaction);
    } else {
      this.transaction.Date = this.getDate();
    }
    this.transactionService.getCategory(this.transactionType).then((response) => {
      this.category = response;
    });
  }

  getCategory() {
    let modal = this.modalCtrl.create(SearchCategoryModalPage, { transactionType: this.transactionType });
    modal.onDidDismiss(data => {
      this.transaction.CategoryId = data.category.CategoryId;
      this.transaction.CategoryName = data.category.CategoryName;
    })
    modal.present();
  }

  saveSpend() {
    if (this.transaction.RecordId === null) {
      this.transactionService.saveSpend(this.transaction).then((response) => {
        this.isDirty = false;
        this.transaction.RecordId = response.RecordId;
        Toast.show("Save successfully", "short", "center").subscribe(
          toast => {
            console.log(toast);
          });
      });
    } else {
      this.transactionService.updateSpend(this.transaction).then((response) => {
        this.isDirty = false;
        Toast.show("Update successfully", "short", "center").subscribe(
          toast => {
            console.log(toast);
          });
      });
    }
  }

  saveIncome() {
    if (this.transaction.RecordId === null) {
      this.transactionService.saveIncome(this.transaction).then((response) => {
        this.transaction.RecordId = response.RecordId;
        this.isDirty = false;
        Toast.show("Save successfully", "short", "center").subscribe(
          toast => {
            console.log(toast);
          });
      });
    } else {
      this.transactionService.updateIncome(this.transaction).then((response) => {
        this.isDirty = false;
        Toast.show("Update successfully", "short", "center").subscribe(
          toast => {
            console.log(toast);
          });
      });
    }
  }

  addNewCategory() {
    let prompt = this.alertCtrl.create({
      title: 'Add new category',
      inputs: [
        {
          name: 'CategoryName',
          placeholder: 'Type category name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.transactionService.saveCategory(data, this.transactionType).then((response) => {
              Toast.show("save successfully", "short", "center").subscribe(
                toast => {
                  console.log(toast);
                });
            });
          }
        }
      ]
    });
    prompt.present();
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

  makeDirty() {
    this.isDirty = true;
  }
}
