import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class SpendsService {
    constructor(public db: Db) { }

    getLatestTransaction(date): any {
        var sql;
        var params = [];
        sql = " SELECT E.RecordId, E.CategoryId, C.CategoryName, E.Date, E.Description, E.Amount, E.UpdateDate FROM Expenses E" +
            " JOIN " +
            " Category C ON E.CategoryId = C.CategoryId" +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "')";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    deleteTransaction(item): any {
        var sqls = [];
        var params = [];
        var sql = " DELETE FROM Expenses " +
                  " WHERE RecordId = ? ";

        sqls.push(sql);
        params.push ([ item.RecordId ]);

        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((response) => {
                resolve(response);
            });
        });
    }
}
