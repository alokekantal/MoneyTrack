import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class ReportService {
    constructor(public db: Db) { }

    spend(date): any {
        var sql;
        var params = [];
        sql = " SELECT * FROM Expenses S" +
            " WHERE strftime('%m-%Y', S.Date) = strftime('%m-%Y', '" + date + "') ";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    income(date): any {
        var sql;
        var params = [];
        sql = " SELECT * FROM Income I" +
            " WHERE strftime('%m-%Y', I.Date) = strftime('%m-%Y', '" + date + "') ";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    getledger(date): any {
        var sql;
        var params = [];

        sql = " SELECT Date AS YearMonth, Opening, Income,  Opening + Income AS TotalRevenue, Spend, (Opening + Income) -Spend AS Balance " +
            " FROM " +
            " ( " +
            "    SELECT X.Date AS Date, " +
            "     ( " +
            "         select sum(ifnull(Amount,0)) As Op " +
            "         from " +
            "         ( " +
            "             SELECT SUM(ifnull(Amount,0)) Amount " +
            "            FROM Income " +
            "             WHERE strftime('%Y-%m', Date) < X.Date  " +
            "             union all " +
            "             SELECT -1* SUM(ifnull(Amount,0)) Amount  " +
            "             FROM Expenses  " +
            "             WHERE strftime('%Y-%m', Date) < X.Date " +
            "         )m " +
            "     ) AS Opening, " +
            "     X.Amount AS Income,Y.Amount AS Spend " +
            "     FROM " +
            "     ( " +
            "         SELECT STRFTIME('%Y-%m', Date) AS Date, SUM(Amount) AS Amount  " +
            "         FROM Income  " +
            "         WHERE  strftime('%Y', Date) = strftime('%Y', '" + date + "') " +
            "        GROUP BY STRFTIME('%m', Date) " +
            "     )X " +
            "     JOIN " +
            "     ( " +
            "         SELECT STRFTIME('%Y-%m', Date) AS Date, SUM(Amount) AS Amount  " +
            "         FROM Expenses  " +
            "         WHERE  strftime('%Y', Date) = strftime('%Y', '" + date + "') " +
            "         GROUP BY STRFTIME('%m', Date) " +
            "     )Y " +
            "     ON X.Date = Y.Date " +
            "  )Z ";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    getLedgerMonthleyDetail(date): any {
        var sql;
        var params = [];
        sql = " SELECT E.Date, C.CategoryName, E.Description, E.Amount FROM Expenses E" +
            " JOIN " +
            " Category C ON E.CategoryId = C.CategoryId" +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "')";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    getLedgerMonthleyCategory(date): any {
        var sql;
        var params = [];
        sql = " SELECT C.CategoryName, SUM( E.Amount) AS Total FROM Expenses E" +
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



// SELECT X.Date AS Date, X.Amount AS Income,Y.Amount AS Spend, (X.Amount - Y.Amount) AS Balance FROM
// (SELECT strftime('%m', Date) AS Date,SUM(Amount) Amount FROM Income WHERE strftime('%Y', Date) = strftime('%Y', '2017-01-09') GROUP BY strftime('%m', Date))X
// JOIN
// (SELECT strftime('%m', Date) AS Date, SUM(Amount) Amount FROM Expenses WHERE strftime('%Y', Date) = strftime('%Y', '2017-01-09') GROUP BY strftime('%m', Date))Y
// ON X.Date = Y.Date