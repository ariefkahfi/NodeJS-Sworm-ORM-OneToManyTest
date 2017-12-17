var sworm = require("sworm");




function CRUD(){
    this.initDB = function(){
        return sworm.db({
            driver : "mysql",
            config : {
               user :"arief",
               password : "arief",
               host : "localhost",
               database :"sworm_db3"
            }
        });
    }




    this.employeeModel = function(){
        return this.initDB().model({table : "employee"});
    }
    this.divisionModel = function(){
        return this.initDB().model({table : "division"});
    }
}

module.exports = new CRUD();