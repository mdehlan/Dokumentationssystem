//==================== Dependencies =========================================================================================================================================================================================================================================================

var mysql = require('mysql');
var error = require('./../helper/error');
var helper = require('./../helper/helper');
var config = require('./../config');
var exec = require('child_process').exec;

//==================== Konstanten ================================================================================================================================================================================================================================

//TABLE Names
const TABLE_NAME_INVENTARNUMMER= "inventarnummer";
const TABLE_NAME_UMZUG= "umzug";

//TABLE INVENTARNUMMER COLS
const COL_NAME_INVENTARNUMMER_ID=TABLE_NAME_INVENTARNUMMER+"."+"inventarnummer_id";
const COL_TABLE_NAME_INVENTARNUMMER_RAUM=TABLE_NAME_INVENTARNUMMER+"."+"raum";
const COL_TABLE_NAME_INVENTARNUMMER_REGDATUM=TABLE_NAME_INVENTARNUMMER+"."+"regdatum";
const COL_TABLE_NAME_INVENTARNUMMER_TYP=TABLE_NAME_INVENTARNUMMER+"."+"typ";

//TABLE UMZUG COLS
const COL_NAME_UMZUG_ID=TABLE_NAME_UMZUG+"."+"umzug_id";
const COL_NAME_UMZUG_ARAUM=TABLE_NAME_UMZUG+"."+"araum";
const COL_NAME_UMZUG_NRAUM=TABLE_NAME_UMZUG+"."+"nraum";
const COL_NAME_UMZUG_UMZUGDATUM=TABLE_NAME_UMZUG+"."+"umzugdatum";


//=============== ConnectionPool und Connection-Vergabe =====================================================================================================================================================================================================================================

/**
 * erstellt den ConnectionPool
 */
var pool = mysql.createPool({
    connectionLimit: config.mysql.connectionLimit,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port: config.mysql.port,
    debug: config.mysql.debug
});

/**
 * erstellt einen Datenbankverbindung oder gibt einen Fehler zurück und schreibt diesen Fehler ins Error Log
 * @param callback
 */
function createDatabseConnection(callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            if (connection) {
                connection.release();
            }
            callback(error.getInternalServerError(),null);
            error.writeErrorLog("createDatabaseConnection",err);
        }else{
            callback(null,connection);
        }
    });
}

//================ Queries und Funktionen ====================================================================================================================================================================================================================================

//---------------- Funktionen für Inventarnummern -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/

//TODO Erstelle Funktion createdInventarnummer

function saveInventarnummer(inventarnummer,callback){
    var query =
        "INSERT INTO " +
        TABLE_NAME_INVENTARNUMMER + " " +
        "SET ? ";
    var queryParams =[inventarnummer];
    executeQuery(query,queryParams,function(err, result){
        if(!err){
            var createdInventarnummer = inventarnummer;
            createdInventarnummer.inventarnummer_id = result.insertId;
            callback(null,createdInventarnummer);
        }else{
            callback(err,null);
        }
    });
}

function deleteInventarnummerById(inventarnummerId, callback){
    var query =
        "DELETE FROM "+
        TABLE_NAME_INVENTARNUMMER+" " +
        "WHERE " +
        COL_NAME_INVENTARNUMMER_ID+" = ?";
    var queryParams =[inventarnummerId];
    executeQuery(query,queryParams,callback);
}

function updateInventarnummer(inventarnummerId,inventarnummerValues,callback){
    var query =
        "UPDATE "+
        TABLE_NAME_INVENTARNUMMER+" " +
        "SET " +
        COL_TABLE_NAME_INVENTARNUMMER_RAUM+" = ?, " +
        COL_TABLE_NAME_INVENTARNUMMER_REGDATUM+" = ?, " +
        COL_TABLE_NAME_INVENTARNUMMER_TYP+" = ?, " +
        "WHERE " +
        COL_NAME_INVENTARNUMMER_ID+" = ?";
    var queryParams =[inventarnummerValues.raum, inventarnummerValues.regdatum, inventarnummerValues.typ, inventarnummerId];
    executeQuery(query,queryParams,function(err, result){
        if (!err){
            var updatedInventarnummer = inventarnummerValues;
            updatedProject.inventarnummer_id = inventarnummerId;
            callback(null, updatedInventarnummer)
        }else{
            callback(err,null)
        }
    });
}

function getInventarnummern(callback){
    var query = "SELECT * FROM " + TABLE_NAME_INVENTARNUMMER ;
    executeQuery(query,undefined,callback)
}

function getInventarnummerById(inventarnummerId,callback){
    var query =
        "SELECT * FROM " +
        TABLE_NAME_INVENTARNUMMER + " " +
        "WHERE " +
        COL_NAME_INVENTARNUMMER_ID+" = ?" ;
    var queryParams =[inventarnummerId];
    executeQuery(query,queryParams,function(err, result){
        if(!err){
            callback(null,result[0])
        }else{
            callback(err,null);
        }
    });
}

//---------------- Funktionen für Umzüge -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/

function addUmzug(umzug,callback){
    var query =
        "INSERT INTO " +
        TABLE_NAME_UMZUG + " " +
        "SET ?";
    var queryParams =[umzug];
    executeQuery(query,queryParams,function(err, result){
        if(!err){
            var createdUmzug = umzug;
            createdUmzug.umzug_id = result.insertId;
            createdUmzug.achieved = 0;
            callback(null,createdUmzug);
        }else{
            callback(err,null);
        }
    });
}

function deleteMilestoneById(projectId, milestoneId,callback){
    var query =
        "DELETE FROM "+
        TABLE_NAME_MILESTONE+" " +
        "WHERE " +
        COL_NAME_MILESTONE_ID+" = ? AND " +
        COL_NAME_MILESTONE_FK_PROJECT+" = ?";
    var queryParams =[milestoneId,projectId];
    executeQuery(query,queryParams,callback);
}

function updateMilestone(projectId, milestoneId, milestoneValues,callback){
    var query =
        "UPDATE "+
        TABLE_NAME_MILESTONE+" " +
        "SET " +
        COL_NAME_MILESTONE_NAME+" = ?, " +
        COL_NAME_MILESTONE_DEADLINE+" = ?, " +
        COL_NAME_MILESTONE_DESCRIPTION+" = ? " +
        "WHERE " +
        COL_NAME_MILESTONE_ID+ " = ? AND " +
        COL_NAME_MILESTONE_FK_PROJECT+" = ? ";
    var queryParams =[milestoneValues.name, milestoneValues.deadline, milestoneValues.description, milestoneId, projectId];
    executeQuery(query,queryParams,function(err, result){
        if (!err){
            var updatedMilestone = milestoneValues;
            updatedMilestone.fk_project_id = projectId;
            updatedMilestone.milestone_id = milestoneId;
            callback(null, updatedMilestone)
        }else{
            callback(err,null)
        }
    });
}

function getMilestones(projectId, callback){
    var query =
        "SELECT * FROM " +
        TABLE_NAME_MILESTONE + " " +
        "WHERE " +
        COL_NAME_MILESTONE_FK_PROJECT+" = ?" ;
    var queryParams =[projectId];
    executeQuery(query,queryParams,function(err, result){
        if(!err){
            callback(null,result)
        }else{
            callback(err,null);
        }
    });
}

function getMilestoneById(projectId, milestoneId, callback){
    var query =
        "SELECT * FROM " +
        TABLE_NAME_MILESTONE + " " +
        "WHERE " +
        COL_NAME_MILESTONE_FK_PROJECT+" = ? " +
        "AND " +
        COL_NAME_MILESTONE_ID+" = ?" ;
    var queryParams =[projectId,milestoneId];
    executeQuery(query,queryParams,function(err, result){
        if(!err){
            callback(null,result[0])
        }else{
            callback(err,null);
        }
    });
}


//==================================================================================== Standard Array und Object Getter ================================================================================================================================================================

/**
 * Führt die Query aus und gibt das ergebnis zurück, entweder ein Object oder ein Array, abhängig von der Query
 * gibt beim Error null als result
 * @param query SQL Query
 * @param queryParams SQL Query-Parameters
 * @param callback Callback to deliver (error,result)
 */
function executeQuery(query, queryParams, callback){
    createDatabseConnection(function (err, connection) {
        if (!err){
            connection.query(query,queryParams,function(err, result){
                if (!err){
                    callback(null,result);
                }else{
                    switch (err.errno){
                        case 1062: // duplicate entry of unique key
                            callback(error.getBadRequestError(),null);
                            break;
                        case 1452: // now referenced row for FK
                            callback(error.getBadRequestError(),null);
                            break;
                        case 1054: // unknown column
                            callback(error.getBadRequestError(),null);
                            break;
                        default:
                            error.writeErrorLog("executeObjectQuery",{error:err, query:query, queryParams:queryParams});
                            callback(error.getInternalServerError(),null);
                            break;
                    }
                }
            });
            connection.release();
        }else{
            callback(err,null);
        }
    })
}

//==================================================================================== Export ================================================================================================================================================================

module.exports = {
    saveInventarnummer:saveInventarnummer,
    deleteInventarnummerById:deleteInventarnummerById,
    updateInventarnummer:updateInventarnummer,
    getInventarnummern:getInventarnummern
};