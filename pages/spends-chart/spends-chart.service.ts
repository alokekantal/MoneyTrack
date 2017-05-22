import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class SpendsChartService {
    constructor(public db: Db) { }

    getBudgetOverview(date): any {
        var sql;
        var params = [];
        sql = " SELECT 'Income' Key, SUM(I.Amount) Value FROM Income I" +
            " WHERE strftime('%m-%Y', I.Date) = strftime('%m-%Y', '" + date + "') " +
            " UNION " +
            " SELECT 'Spend' Key, SUM(E.Amount) Value FROM Expenses E" +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "') ";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    getTopSpends(date): any {
        var sql;
        var params = [];
        sql = " SELECT E.CategoryId, C.CategoryName, SUM( E.Amount) AS Total FROM Expenses E" +
            " JOIN " +
            " Category C ON E.CategoryId = C.CategoryId" +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "') " +
            " GROUP BY C.CategoryId ORDER BY C.CategoryName ";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }
}