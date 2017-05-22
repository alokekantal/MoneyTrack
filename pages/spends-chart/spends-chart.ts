import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';

import { CategorySpendChart } from '../category-spend-chart/category-spend-chart';
import { SpendsChartService } from './spends-chart.service';

@Component({
  selector: 'spends-chart',
  templateUrl: 'spends-chart.html'
})
export class SpendChartPage {
  yearMonth: any;
  topSpends: any;
  budgetOverview: any;
  totalSpendsValue: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public spendsChartService: SpendsChartService) {
    this.yearMonth = navParams.get("yearMonth");
    this.init();
  }

  init(): any {
    var getBudgetOverview = new Promise<any>((resolve, reject) => {
      this.spendsChartService.getBudgetOverview(this.yearMonth).then((response) => {
        resolve(response);
      });
    });

    var topSpends = new Promise<any>((resolve, reject) => {
      this.spendsChartService.getTopSpends(this.yearMonth).then((response) => {
        resolve(response);
      });
    });


    Promise.all([getBudgetOverview, topSpends]).then(response => {
      this.budgetOverview = response[0];
      this.topSpends = response[1];
      this.totalSpendsValue = this.budgetOverview[1].Value;
      this.loadSpendProgress();
    });
  }

  gotoSpendsCategoryChart(categoryId) {
    this.navCtrl.push(CategorySpendChart, { categoryId: categoryId, yearMonth: this.yearMonth });
  }

  loadSpendProgress() {
    this.topSpends.forEach(element => {
      element.backgroundcolor = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
        + Math.floor(Math.random() * 255) + ")";
      element.Parcent = ((element.Total * 100) / this.budgetOverview[1].Value).toFixed(2).toString() + '%';
    });
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
