import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {MomentModule} from 'angular2-moment';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';

import { TabsPage } from '../pages/tabs/tabs';

import { HomePage } from '../pages/home/home';
import { HomeService } from '../pages/home/home.service';

import { TransactionPage } from '../pages/transaction/transaction';
import { TransactionService } from '../pages/transaction/transaction.service';
import { SearchCategoryModalPage } from '../pages/transaction/searchCategoryModal';

import { SpendsPage } from '../pages/spends/spends';
import { SpendsService } from '../pages/spends/spends.service';

import { IncomePage } from '../pages/income/income';
import { IncomeService } from '../pages/income/income.service';

import { SpendChartPage } from '../pages/spends-chart/spends-chart';
import { SpendsChartService } from '../pages/spends-chart/spends-chart.service';

import { CategorySpendChart } from '../pages/category-spend-chart/category-spend-chart';
import { CategorySpendChartService } from '../pages/category-spend-chart/category-spend-chart.service';

import { ReportPage } from '../pages/report/report';
import { ReportService } from '../pages/report/report.service';

import { ViewTablePage } from '../pages/view-table/view-table';

import { Db } from '../providers/db';
import { KeysPipe } from '../providers/keys';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TransactionPage,
    SearchCategoryModalPage,
    SpendsPage,
    IncomePage,
    SpendChartPage,
    CategorySpendChart,
    ReportPage,
    ViewTablePage,
    TabsPage,
    KeysPipe
  ],
  imports: [
    MomentModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TransactionPage,
    SearchCategoryModalPage,
    SpendsPage,
    IncomePage,
    SpendChartPage,
    CategorySpendChart,
    ReportPage,
    ViewTablePage,
    TabsPage
  ],
  providers: [
    TransactionService,
    HomeService,
    SpendsService,
    IncomeService,
    SpendsChartService,
    CategorySpendChartService,
    ReportService,
    Db,
    KeysPipe,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
