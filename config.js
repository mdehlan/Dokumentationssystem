/**
 * Created by Snare on 04.08.16.
 */

"use strict";

var mysql = {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb',
    port: '3306',
    debug: false
};

module.exports = {
    mysql:mysql
};