import { Injectable } from '@angular/core';
import { Db } from '../../providers/db';

@Injectable()
export class TransactionService {
    constructor(public db: Db) { }

    getCategory(categoryType): any {
        var sql;
        var params = [];
        sql = "select * from Category WHERE CategoryType = ? ORDER By CategoryName";
        params.push(categoryType);
        return new Promise<any>((resolve, reject) => {
            this.db.getRows(sql, params).then((response) => {
                resolve(response);
            });
        });
    }

    saveSpend(transaction): any {
        var sqls = [];
        var params = [];
        var sql = " INSERT INTO Expenses(CategoryId, Date, Description, Amount, UpdateDate) " +
            " SELECT ?, ?, ?, ?,?";

        sqls.push(sql);
        params.push([
            transaction.CategoryId,
            transaction.Date,
            transaction.Description,
            transaction.Amount,
            new Date()
        ]);

        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((resp) => {
                var sql = " SELECT MAX(RecordId) RecordId FROM Expenses WHERE CategoryId = ? AND Date = ? ";
                var param = [transaction.CategoryId, transaction.Date];
                this.db.getRow(sql, param).then((response) => {
                    resolve(response);
                });
            });
        });
    }

    updateSpend(transaction): any {
        var sqls = [];
        var params = [];
        var sql = " UPDATE Expenses SET CategoryId = ?, Date = ?, Description = ?, Amount = ?, UpdateDate = ? WHERE RecordId = ? ";
        sqls.push(sql);
        params.push([
            transaction.CategoryId,
            transaction.Date,
            transaction.Description,
            transaction.Amount,
            new Date(),
            transaction.RecordId
        ]);
        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((response) => {
                resolve(response);
            });
        });

    }


    saveIncome(transaction): any {
        var sqls = [];
        var params = [];
        var sql = " INSERT INTO Income(CategoryId, Date, Description, Amount, UpdateDate) " +
            " SELECT ?, ?, ?, ?,?";

        sqls.push(sql);
        params.push([
            transaction.CategoryId,
            transaction.Date,
            transaction.Description,
            transaction.Amount,
            new Date()
        ]);

        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((resp) => {
                var sql = " SELECT MAX(RecordId) RecordId FROM Income WHERE CategoryId = ? AND Date = ? ";
                var param = [transaction.CategoryId, transaction.Date];
                this.db.getRow(sql, param).then((response) => {
                    resolve(response);
                });
            });
        });
    }

    updateIncome(transaction): any {
        var sqls = [];
        var params = [];
        var sql = " UPDATE Income SET CategoryId = ?, Date = ?, Description = ?, Amount = ?, UpdateDate = ? WHERE RecordId = ? ";
        sqls.push(sql);
        params.push([
            transaction.CategoryId,
            transaction.Date,
            transaction.Description,
            transaction.Amount,
            new Date(),
            transaction.RecordId
        ]);
        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((response) => {
                resolve(response);
            });
        });
    }

    saveCategory(data, transactionType): any {
        var sqls = [];
        var params = [];
        var sql = " INSERT OR REPLACE INTO Category(CategoryName, CategoryType, UpdateDate) " +
            " SELECT ?, ?, ?";

        sqls.push(sql);
        params.push([
            data.CategoryName,
            transactionType,
            new Date()
        ]);

        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((response) => {
                var sql = " SELECT CategoryID, CategoryName FROM Category WHERE CategoryName = ? AND CategoryType = ? ";
                var param = [data.CategoryName, transactionType];
                this.db.getRow(sql, param).then((response) => {
                    resolve(response);
                });
            });
        });
    }

    deleteCategory(data): any {
        var sqls = [];
        var params = [];
        var sql = " DELETE FROM Category WHERE CategoryId= ? " +
            " AND (NOT EXISTS (SELECT * FROM Expenses WHERE CategoryId= ?)) " +
            " AND (NOT EXISTS (SELECT * FROM Income WHERE CategoryId= ?)) ";

        sqls.push(sql);
        params.push([
            data.CategoryId,
            data.CategoryId,
            data.CategoryId
        ]);

        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((response) => {
                resolve(response);
            });
        });
    }

    editCategory(data, category): any {
        var sqls = [];
        var params = [];
        var sql = " UPDATE Category SET CategoryName ='" + data.CategoryName + "' WHERE CategoryId = " + category.CategoryId;

        sqls.push(sql);
        return new Promise<any>((resolve, reject) => {
            this.db.runMultyStatement(sqls, params).then((response) => {
                resolve(response);
            });
        });
    }
}