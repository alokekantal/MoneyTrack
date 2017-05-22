import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CategorySpendChartService } from './category-spend-chart.service'

import { Chart } from 'chart.js';
import moment from 'moment';

@Component({
  selector: 'page-category-spend-chart',
  templateUrl: 'category-spend-chart.html',
})
export class CategorySpendChart {
  categoryId: any;
  yearMonth: any;
  total: any = 0;
  spendCategoryForCurrentYear: any;
  spendCategoryForCurrentMonth: any;
  barChart: any;

  @ViewChild('barCanvas') barCanvas;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public categorySpendChartService: CategorySpendChartService) {
    this.yearMonth = this.navParams.get("yearMonth");
    this.categoryId = this.navParams.get("categoryId");
    this.init();
  }

  init(): any {
    var spendCategoryForCurrentMonth = new Promise<any>((resolve, reject) => {
      this.categorySpendChartService.getSpendCategoryForCurrentMonth(this.yearMonth, this.categoryId).then((response) => {
        resolve(response);
      });
    });

    var spendCategoryForCurrentYear = new Promise<any>((resolve, reject) => {
      this.categorySpendChartService.getSpendCategoryForCurrentYear(this.yearMonth, this.categoryId).then((response) => {
        resolve(response);
      });
    });

    Promise.all([spendCategoryForCurrentMonth, spendCategoryForCurrentYear]).then(response => {
      this.spendCategoryForCurrentMonth = response[0];
      this.spendCategoryForCurrentYear = response[1];
      this.spendCategoryForCurrentMonth.forEach(element => {
        this.total += element.Amount;
      });
      this.loadBarChart();
    });
  }

  loadBarChart() {
    var labels = [], data = [];
    this.spendCategoryForCurrentYear.forEach(item => {
      labels.push(moment(item.Date).format('MMM-YY'));
      data.push(item.Amount);
    });
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "",
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorySpendChart');
  }

}
