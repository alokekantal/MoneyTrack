import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Toast } from 'ionic-native';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Chart } from 'chart.js';
import moment from 'moment';

import { ReportService } from './report.service';

@Component({
    selector: 'page-report',
    templateUrl: 'report.html',
    providers: [Transfer, TransferObject, File]
})
export class ReportPage {
    yearMonth: any;
    LedgerMonthleyCategory: any;
    LedgerMonthleyDetail: any;
    ledger: any;
    barChart: any;

    @ViewChild('barCanvas') barCanvas;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private transfer: Transfer,
        private file: File,
        public actionSheetCtrl: ActionSheetController,
        public reportService: ReportService, ) {
        this.yearMonth = this.getDate();
        this.init();
    }

    init(): any {
        var LedgerMonthleyCategory = new Promise<any>((resolve, reject) => {
            this.reportService.getLedgerMonthleyCategory(this.yearMonth).then((response) => {
                resolve(response);
            });
        });

        var LedgerMonthleyDetail = new Promise<any>((resolve, reject) => {
            this.reportService.getLedgerMonthleyDetail(this.yearMonth).then((response) => {
                resolve(response);
            });
        });

        var ledger = new Promise<any>((resolve, reject) => {
            this.reportService.getledger(this.yearMonth).then((response) => {
                resolve(response);
            });
        });


        Promise.all([LedgerMonthleyCategory, LedgerMonthleyDetail, ledger]).then(response => {
            this.LedgerMonthleyCategory = response[0];
            this.LedgerMonthleyDetail = response[1];
            this.ledger = response[2];

            this.loadBarChart();
        });
    }

    ConvertToCSV(objArray): any {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";

        for (var index in objArray[0]) {
            //Now convert each value to string and comma-separated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
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

    loadBarChart() {
        var labels = [], data = [];
        this.ledger.forEach(item => {
            labels.push(moment(item.YearMonth).format('MMM-YY'));
            data.push(item.Spend);
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

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Download record',
            buttons: [
                {
                    text: 'Yearly',
                    handler: () => {
                        this.downloadLedgerYearly();
                    }
                }, {
                    text: 'Monthley Category',
                    handler: () => {
                        this.downloadLedgerMonthleyCategory();
                    }
                }, {
                    text: 'Monthley Detail',
                    handler: () => {
                        this.downloadLedgerMonthleyDetail();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    downloadLedgerYearly() {
        var csvDataSpend = this.ConvertToCSV(this.ledger);
        var blob = new Blob([csvDataSpend], { type: 'text/csv' });

        this.file.createDir(this.file.externalDataDirectory, 'attachment', false).then(function () {
            console.log("created");
        }, function (error) {
            console.log("Folder not created." + error);
        });

        const fileLocation = this.file.externalDataDirectory + "attachment";

        this.file.writeFile(fileLocation, 'LedgerLearly-' + moment(this.yearMonth).format("YYYY") + '.csv', blob, { replace: true })
            .then(function (success) {
                Toast.show("Download successfully", "short", "center").subscribe(
                    toast => {
                        console.log(toast);
                    });;
            }, function (error) {
                Toast.show("Download fail", "short", "center").subscribe(
                    toast => {
                        console.log(toast);
                    });;
            });
    }

    downloadLedgerMonthleyCategory() {
        var csvDataSpend = this.ConvertToCSV(this.LedgerMonthleyCategory);
        var blob = new Blob([csvDataSpend], { type: 'text/csv' });
        this.file.createDir(this.file.externalDataDirectory, 'attachment', false).then(function () {
            console.log("created");
        }, function (error) {
            console.log("Folder not created." + error);
        });
        const fileLocationSpend = this.file.externalDataDirectory + "attachment";

        this.file.writeFile(fileLocationSpend, 'loadLedgerMonthleyCategory-' + moment(this.yearMonth).format("MMMM") + '.csv', blob, { replace: true })
            .then(function (success) {
                Toast.show("Download successfully", "short", "center").subscribe(
                    toast => {
                        console.log(toast);
                    });;
            }, function (error) {
                Toast.show("Download fail", "short", "center").subscribe(
                    toast => {
                        console.log(toast);
                    });;
            });
    }

    downloadLedgerMonthleyDetail() {
        var csvDataSpend = this.ConvertToCSV(this.LedgerMonthleyDetail);
        var blob = new Blob([csvDataSpend], { type: 'text/csv' });
        this.file.createDir(this.file.externalDataDirectory, 'attachment', false).then(function () {
            console.log("created");
        }, function (error) {
            console.log("Folder not created." + error);
        });
        const fileLocationSpend = this.file.externalDataDirectory + "attachment";

        this.file.writeFile(fileLocationSpend, 'LedgerMonthleyDetail-' + moment(this.yearMonth).format("MMMM") + '.csv', blob, { replace: true })
            .then(function (success) {
                Toast.show("Download successfully", "short", "center").subscribe(
                    toast => {
                        console.log(toast);
                    });;
            }, function (error) {
                Toast.show("Download fail", "short", "center").subscribe(
                    toast => {
                        console.log(toast);
                    });;
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Report');
    }

}
