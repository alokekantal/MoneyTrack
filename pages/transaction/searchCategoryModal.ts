import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Toast } from 'ionic-native';
import { TransactionService } from './transaction.service';
import { TransactionModel } from '../../models/transaction';

@Component({
  templateUrl: 'searchCategoryModal.html'
})
export class SearchCategoryModalPage {
  categorys: any;
  searchCategory: any;
  transactionType: any;
  transactionCategory: any = new TransactionModel();
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public transactionService: TransactionService) {
    this.transactionType = this.params.get('transactionType');
    this.transactionService.getCategory(this.transactionType).then((response) => {      
      this.categorys = response;
      this.searchCategory = response;
    });
  }

  search(searchEvent) {
    let term = searchEvent.target.value.toLowerCase().trim();
    if (term === '') {
      this.categorys = this.searchCategory;
    } else {
      this.categorys = this.searchCategory.filter(category => category.CategoryName.toLowerCase().indexOf(term) >= 0);
    }
  }

  getCategory(category) {
    this.transactionCategory = category;
    this.dismiss();
  }

  deleteCategory(category) {
    let prompt = this.alertCtrl.create({
      title: 'Add new category',
      message: 'Do you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.transactionService.deleteCategory(category).then((response) => {
              console.log(response);
              // this.categorys.splice(this.categorys.indexOf(category), 1);
              // this.searchCategory = this.categorys;
              Toast.show("Delete successfully", "short", "center").subscribe(
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

  editCategory(category) {
    let prompt = this.alertCtrl.create({
      title: 'Update category',
      inputs: [
        {
          name: 'CategoryName',
          placeholder: 'Type category name',
          value: category.CategoryName
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
          text: 'Update',
          handler: data => {
            this.transactionService.editCategory(data, category).then((response) => {
              category.CategoryName = data.CategoryName;
              var index = this.categorys.indexOf(category);
              this.categorys[index] = category;
              Toast.show("Update successfully", "short", "center").subscribe(
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
  dismiss() {
    this.viewCtrl.dismiss({ category: this.transactionCategory });
  }
}