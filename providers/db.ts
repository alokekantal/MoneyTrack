import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';


@Injectable()
export class Db {
     db = new SQLite();
     resp: Array<Object>;
   
    constructor() { }

    getInstance(){
        return this.db.openDatabase({
                name: "data.db",
                location: "default",
                createFromLocation: 1
            });
    }

    getRow (sql, param): any {
        return new Promise<any>((resolve, reject) => {
            this.getInstance().then(()=>{
                this.db.executeSql(sql, param).then((data) => {
                    var objs = {};
                    if (data.rows.length && data.rows.length > 0) {                       
                        objs = data.rows.item(0);                       
                    }
                   resolve(objs);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                    console.log("error: "+ sql);
                    reject(error);
                })
            }, (error) => {
                console.error("Unable to open database", error);
                reject(error);
            });
        });
    }

    getRows (sql, param): any {
        return new Promise<any>((resolve, reject) => {
            this.getInstance().then(()=>{
                this.db.executeSql(sql, param).then((data) => {
                    var objs = [];
                    if (data.rows.length && data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            objs.push(data.rows.item(i));
                        }
                    }
                   resolve(objs);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                    console.log("error: "+ sql);
                    reject(error);
                })
            }, (error) => {
                console.error("Unable to open database", error);
                reject(error);
            });
        });
    }

    runMultyStatement (sqls, params): any {
        return new Promise<any>((resolve, reject) => {
            this.getInstance().then(()=>{
                var errorMsg = '',
                lastSql = '',
                lastParam = [],

                errorRollBack = function (err) {
                    errorMsg += err.message;
                    return true;
                };
               
                return this.db.transaction((tx) => {
                    for (var i = 0; i < sqls.length; i++) {
                        lastSql = sqls[i];
                        lastParam = params[i];
                        if (i == sqls.length - 1) {
                            tx.executeSql(sqls[i], params[i], function () { }, errorRollBack);
                        } else {
                            tx.executeSql(sqls[i], params[i], function () { }, errorRollBack);
                        }
                    }
                    resolve("success");
                });
            });
        });
    }
}