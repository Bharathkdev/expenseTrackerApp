import * as SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase('expenseTracker.db');

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS expenseTracker;',
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                }
            )
        })
    })
}