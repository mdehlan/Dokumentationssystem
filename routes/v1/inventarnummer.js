/**
 * Created by Martin on 13.10.2016.
 */

var express = require('express');
var database = require('./../../database/mySQL');
var helper = require('./../../helper/helper');
var error = require('./../../helper/error');
var router = express.Router();

router.get('/', function(req, res, next) {
    database.getInventarnummern(function(err,result){
        if(!err){
            res.json(result)
        }else{
            helper.sendResponse(res,err)
        }
    })
});

router.post('/', function(req, res, next) {
    var project = req.body.project;
    database.saveInventarnummer(project,function(err,result){
        if(!err){
            res.json(result)
        } else {
            helper.sendResponse(res,err)
        }
    })
});

router.get('/:inventarnummer_id', function(req, res, next) {
    try {
        var inventarnummerId = parseInt(req.params.project_id, 10);
    }catch (e){
        helper.sendResponse(res,error.getBadRequestError())
    }

    database.getInventarnummerById(projectId,function(err,result){
        if(!err){
            res.json(result)
        }else{
            helper.sendResponse(res,err)
        }
    })
});

router.put('/:inventarnummer_id', function(req, res, next) {
    var inventarnummerId = req.params.project_id;
    var inventarnummer_values = req.body.project;
    if (!isNaN(projectId)){
        database.updateInventarnummer(projectId,project_values,function(err,result){
            if(!err){
                res.json(result)
            } else {
                helper.sendResponse(res,err)
            }
        })
    } else {
        helper.sendResponse(res,error.getBadRequestError())
    }

});

router.delete('/:inventarnummer_id', function(req, res, next) {
    var inventarnummerId = req.params.project_id;
    if (!isNaN(inventarnummerId)) {
        database.deleteInventarnummerById(projectId, function (err, result) {
            if (!err) {
                res.json(result)
            } else {
                helper.sendResponse(res, err)
            }
        })
    } else {
        helper.sendResponse(res, error.getBadRequestError())
    }
});

module.exports = router;