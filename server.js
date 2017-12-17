var path =require("path");
var express = require("express");
var app  = express();
var databaseModel = require("./model");

var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended : true}));

var empModel = databaseModel.employeeModel();
var divModel = databaseModel.divisionModel();



app.get("/emp/delete/:id",function (req,res) {
    databaseModel
        .initDB()
        .statement("delete from employee where id = @id",
            {id : req.params.id})
        .then(function () {
           res.json({message : "Delete data success" , statusCode : 200});
        }).catch(function (reason) {
           res.json(reason);
        });
})                                         ;

app.get("/div",function(req,res){
   databaseModel
       .initDB()
       .query("select * from division")
       .then(function (value) {
         res.json(value);
       })
       .catch(function (reason) {
          res.json(reason);
       });
});

app.post("/data",function (req,res) {
   databaseModel
       .initDB()
       .query("select e.name , e.id , d.division_name from employee e " +
           " inner join division d on e.division_id = d.id where d.id = @id"
           ,{id : req.body.id})
       .then(function (value) {
          res.json(value);
       })
       .catch(function (reason) {
          res.json(reason);
       });
})                               ;


app.get("/list",function (req,res) {
   res.sendFile(path.join(__dirname+"/public_html","list.html"));
});


app.post("/div",function(req,res){
   divModel({
       division_name : req.body.division_name
   }).save().then(function () {
       console.log("division is saved to database");
       res.json({message : "division is saved to database" , statusCode : 200});
   }).catch(function (reason) {
      console.log(reason);
      res.json(reason);
   });
});

app.post("/emp",function(req,res){
    console.log(req.body);
    divModel.query("select * from division where id = @id "
        ,{id : req.body.division_id})
        .then(function (value) {
           empModel({
               id : req.body.id,
               name : req.body.name,
               division : value[0]
           }).save().then(function () {
               res.json({message : "data saved" , statusCode : 200});
           }).catch(function (reason) {
               res.json(reason);
           });
        })
        .catch(function (reason) {
           res.json(reason);
        });
});


app.get("/",function(req,res){
   res.sendFile(path.join(__dirname+"/public_html","index.html"));
});

app.listen(9600,function(){
   console.log("listening on port 9600");
});
