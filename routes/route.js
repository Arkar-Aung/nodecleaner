var dbDriver = require("../module/db.js");
var cleaner = require("../module/cleaner.js");
exports.home = function(req,res){
	
	res.render('home', { title: 'NodeCleaner', title: 'NodeCleaner', parent: '', target: ''});
};


exports.getUrl = function(req,res){
	url = req.body.url;
	if(checkURL(url)){
		dbDriver.openAndAuthDatabase(dbDriver,function(err,db){
			if(err){
				res.send(err);
				res.end();
			}else{
				cleaner.getUrl(url,db,function(err,url) {
					dbDriver.closeDatabase();
					if(!err)
					{
						res.render('home', { title: 'NodeCleaner', parent: url[0].parent, target: req.host+'/'+url[0].target});
						res.end();
					}			
				});
			}
		});// end of dbDriver	
	}else{
		res.send('Not Ok');
	}
};

exports.redirect = function(req,res){
	target = req.params.url;	
	if(target == '') {
		res.send('Can\'t redirect');
		res.end();
	}else{
		dbDriver.openAndAuthDatabase(dbDriver,function(err,db){	
			if(err){
				res.send(err);
				res.end();
			}else{
				cleaner.getParentUrl(target,db,function(err,url) {
					if(!err){
						dbDriver.closeDatabase();
						res.redirect(url[0].parent);
					}else{
						res.send(err);
					}
					res.end();
				});
			}
		});
	}
};


function checkURL(url) {
    var urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\d\%\c \.-][\u1000-\u1097]*)*\/?$/;
    if (url.match(urlPattern) != null) {
        return (true);
    }
    return (false);
}
