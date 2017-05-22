import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class HomeService {
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

    getIncome(date): any {
        var sql;
        var params = [];
        sql = " SELECT I.RecordId, I.CategoryId, C.CategoryName, I.Date, I.Description, I.Amount, I.UpdateDate FROM Income I" +
            " JOIN " +
            " Category C" +
            " ON I.CategoryId = C.CategoryId " +
            " WHERE strftime('%m-%Y', I.Date) = strftime('%m-%Y', '" + date + "') ORDER BY I.Date LIMIT 3";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    getLatestTransaction(date): any {
        var sql;
        var params = [];
        sql = " SELECT E.RecordId, E.CategoryId, C.CategoryName, E.Date, E.Description, E.Amount, E.UpdateDate FROM Expenses E" +
            " JOIN " +
            " Category C" +
            " ON E.CategoryId = C.CategoryId " +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "') ORDER BY E.Date LIMIT 3";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    getTopSpend(date): any {
        var sql;
        var params = [];
        sql = " SELECT E.CategoryId, C.CategoryName, SUM( E.Amount) AS Total FROM Expenses E" +
            " JOIN " +
            " Category C ON E.CategoryId = C.CategoryId" +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "') " +
            " GROUP BY C.CategoryId ORDER BY Total DESC LIMIT 3";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }
}
