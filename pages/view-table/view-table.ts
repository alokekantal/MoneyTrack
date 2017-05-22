import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Db } from '../../providers/db';

@Component({
  selector: 'page-view-table',
  templateUrl: 'view-table.html'
})

export class ViewTablePage {
  tables : Array<Object>;
  selectrdTable: string;
  tableData = [];
  headers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: Db) {
    var sql;
    var params = [];
    sql = "SELECT name FROM sqlite_master WHERE type='table'";
      this.db.getRows(sql, params).then((tables) => {
            console.log(tables);
            this.tables = tables;
          }
        );
  }

getTableData(){
      var sql;    
      sql = "select * from "+this.selectrdTable;

      this.db.getRows(sql, []).then((tableData) => {
        this.tableData = tableData;
        this.headers = [];
        for (let key in this.tableData[0]) {
          this.headers.push({key: key});
        }
      });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTablePage');
  }

}
