var mongodb = require('mongodb'),
  server = new mongodb.Server('10.180.0.173', 25295, {
    auto_reconnect: true
  }),
  db1 = new mongodb.Db('url', server);

var db_username = "6d8874ba-6e08-4c48-9f79-5ac55dab89e8"; // username
var db_password = "f985d0f0-ff8a-4eb5-a440-0c9d93da0fbf"; // password
var openDb= false; //database is already open or not. To recover the too much open database connection

// callback: (err, db)
function openDatabase(callback) {

  if(openDb) {
    //if already open, callback current database
    return callback(null,db1);
  }
  else {

    db1.open(function(err, db) {
      
      if (err)
      {
        db1.close();
        return callback(err);
      }
      openDb = true;
      return callback(null, db);
    });  
  }
  
}

function closeDatabase()
{
  openDb = false;
  db1.close();
}

function authenticate(db, username, password, callback) {


  db.authenticate(username, password, function(err, result) {
    if (err) {
      return callback (err);
    }
    return callback(null,result);

  });
}

//db drive is self db.js. it will intilize from app

function openAndAuthDatabase(dbDriver,callback)
{
  dbDriver.openDatabase(function(err,db){

    if(err)
    {
      console.log("ERROR CONNECTION TO DATABASE");
      console.log(err);
      dbDriver.closeDatabase();
	  return callback(err);
    }
	return callback(null,db);
	//exit, without auth
    //db is a mongb database
   /* 
   dbDriver.authenticate(db,db_username,db_password,function(err,response){
      //after auth
      if(err)
      {      
        dbDriver.closeDatabase();
        callback(err);
      }
      else {
        //db is authorize database
        return callback(null,db);
      }

    });// close db driver auth
	*/
  });//close open db
}


//intilize function

exports.openDatabase = openDatabase;
exports.closeDatabase = closeDatabase;
exports.authenticate = authenticate;
exports.openAndAuthDatabase = openAndAuthDatabase;