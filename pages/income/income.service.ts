import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class IncomeService {
    constructor(public db: Db) { }

    getIncomes(date): any {
        var sql;
        var params = [];
        sql = " SELECT I.RecordId, I.CategoryId, C.CategoryName, I.Date, I.Description, I.Amount, I.UpdateDate FROM Income I " +
            " JOIN " +
            " Category C ON I.CategoryId = C.CategoryId" +
            " WHERE strftime('%m-%Y', I.Date) = strftime('%m-%Y', '" + date + "')";

        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    deleteIncome(item): any {
        var sqls = [];
        var params = [];
        var sql = " DELETE FROM Income " +
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
