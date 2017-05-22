import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class CategorySpendChartService {
    constructor(public db: Db) { }

    getSpendCategoryForCurrentMonth(date, categoryId): any {
        var sql;
        var params = [];
        sql = " SELECT E.RecordId, E.CategoryId, C.CategoryName, E.Date, E.Description, E.Amount, E.UpdateDate FROM Expenses E" +
            " JOIN " +
            " Category C ON E.CategoryId = C.CategoryId" +
            " WHERE strftime('%m-%Y', E.Date) = strftime('%m-%Y', '" + date + "') AND E.CategoryId = ? ";

        params.push(categoryId);

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                console.log(response);
                resolve(response);
            });
        });
    }

    getSpendCategoryForCurrentYear(date, categoryId): any {
        var sql;
        var params = [];
        sql = " SELECT E.Date, SUM(E.Amount) Amount FROM Expenses E" +
            " JOIN " +
            " Category C ON E.CategoryId = C.CategoryId" +
            " WHERE strftime('%Y', E.Date) = strftime('%Y', '" + date + "') AND E.CategoryId = ?  " +
            " GROUP BY strftime('%m', E.Date) ORDER BY E.Date ";

        params.push(categoryId);

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }
}
