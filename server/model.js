var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

var pool = mysql.createPool({
    connectionlimit:100,
    host:'localhost',
    user:'root',
    password:'',
    database:'db_blog',
    debug:false
});

/*module.exports = {
      "facebook_api_key"      :     "676144459190221",
      "facebook_api_secret"   :     "bab6c4231d5fa4d3cb9d8e3945868767",
      "callback_url"          :     "http://localhost:5000/view/text.html",
      "use_database"          :     "false",
      "host"                  :     "localhost",
      "username"              :     "root",
      "password"              :     "",
      "database"              :     "db_blog"
}
*/
var BlogModel = {
    selectAllBlog: function(req, res, callback){
        pool.getConnection(function(err, connection){
            var jsonOut;
            if(err){
                connection.release();
                callback({"code":100,"Status":"Error In Connection"});
                return;
            }
            
            connection.query("select b_id, LEFT(b_title, 40) as b_title, b_img_url, b_desc from tbl_blog order by b_id asc limit 4", function(err, rows){
                connection.release();
                if(!err){
                    var JsonArr = rows;
                    callback(JsonArr);
                }
            });
            connection.on('error', function(err){
                callback({"code":100,"Status":"Error In Connection"});
            });
        });
    },
    selectOneBlog: function(req, res, callback){
        pool.getConnection(function(err, connection){
            var jsonOut;
            if(err){
                connection.release();
                callback({"code":100,"Status":"Error In Connection"});
                return;
            }
            
            connection.query('SELECT * FROM tbl_blog WHERE b_id=?', [ req ], function(err, rows){
                connection.release();
                if(!err){
                    var JsonArr = rows;
                    callback(JsonArr);
                }
            });
            connection.on('error', function(err){
                callback({"code":100,"Status":"Error In Connection"});
            });
        });
    },
    selectOverallBlogs: function(req, res, callback){
        pool.getConnection(function(err, connection){
            var jsonOut;
            if(err){
                connection.release();
                callback({"code":100,"Status":"Error In Connection"});
                return;
            }
            
            connection.query("select b_id, LEFT(b_title, 50) as b_title, b_desc from tbl_blog limit 4,10000", function(err, rows){
                connection.release();
                if(!err){
                    var JsonArr = rows;
                    callback(JsonArr);
                }
            });
            connection.on('error', function(err){
                callback({"code":100,"Status":"Error In Connection"});
            });
        });
    }
};

var CategoryModel = {
    selectAllCetegories: function(req, res, callback){
        pool.getConnection(function(err, connection){
            var jsonOut;
            if(err){
                connection.release();
                callback({"code":100,"Status":"Error In Connection"});
                return;
            }
            
            connection.query("select * from tbl_cetogory order by rand(cat_id)", function(err, rows){
                connection.release();
                if(!err){
                    var JsonArr = rows;
                    callback(JsonArr);
                }
            });
            connection.on('error', function(err){
                callback({"code":100,"Status":"Error In Connection"});
            });
        });
    }
}