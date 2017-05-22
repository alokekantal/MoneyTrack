import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { TransactionPage } from '../transaction/transaction';
import { SpendsPage } from '../spends/spends';
import { SpendChartPage } from '../spends-chart/spends-chart';
import { IncomePage } from '../income/income';
import { HomeService } from './home.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  yearMonth: any = this.getDate();
  budgetOverview: any;
  latestTransaction: any;
  topSpend: any;
  incomes: any;
  constructor(public navCtrl: NavController,
    public homeService: HomeService,
    public platform: Platform) {    
    this.init();
  }

  init(): any {
    var getBudgetOverview = new Promise<any>((resolve, reject) => {
      this.homeService.getBudgetOverview(this.yearMonth).then((response) => {
        resolve(response);
      });
    });

    var latestTransaction = new Promise<any>((resolve, reject) => {
      this.homeService.getLatestTransaction(this.yearMonth).then((response) => {
        resolve(response);
      });
    });

    var topSpend = new Promise<any>((resolve, reject) => {
      this.homeService.getTopSpend(this.yearMonth).then((response) => {
        resolve(response);
      });
    });

    var income = new Promise<any>((resolve, reject) => {
      this.homeService.getIncome(this.yearMonth).then((response) => {
        resolve(response);
      });
    });


    Promise.all([getBudgetOverview, latestTransaction, topSpend, income]).then(response => {
      this.budgetOverview = response[0];
      this.latestTransaction = response[1];
      this.topSpend = response[2];
      this.incomes = response[3];
      this.loadSpendProgress();
      this.ionGraphLoad();
    });
  }

  gotoSpends(): any {
    this.navCtrl.push(SpendsPage, { yearMonth: this.yearMonth });
  }

  gotoIncomes(): any {
    this.navCtrl.push(IncomePage, { yearMonth: this.yearMonth });
  }


  gotoSpendsCategoryChart(): any {
    this.navCtrl.push(SpendChartPage, { yearMonth: this.yearMonth });
  }

  doTransaction(transactionType, transactionTitle, teansactionData) {
    this.navCtrl.push(TransactionPage, {
      transactionType: transactionType,
      transactionTitle: transactionTitle,
      teansactionData: teansactionData
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

  loadSpendProgress() {
    this.topSpend.forEach(element => {
      element.backgroundcolor = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
        + Math.floor(Math.random() * 255) + ")";
      element.Parcent = ((element.Total * 100) / this.budgetOverview[1].Value).toFixed(2).toString() + '%';
    });
  }

  ionGraphLoad() {
    var labels = [], data = [];
    this.budgetOverview.forEach(item => {
      labels.push(item.Key);
      data.push(item.Value);
    });
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Votes',
          data: data,
          backgroundColor: [
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB"
          ]
        }]
      }
    });
  }
}
