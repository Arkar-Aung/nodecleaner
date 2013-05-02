function checkExistParent(url,db,callback){
	var collection = db.collection("url");
	collection.find({parent:url},function(err, cursor){	
		cursor.toArray(function(err, items) {
			if(err || !items){
				callback(err);
			}else{		
	    		callback(null,items);
			}
		})
	});
};

function checkExistTarget(uri,db,callback){
	var collection = db.collection("url");
	collection.find({target:uri},function(err, cursor){	
		cursor.toArray(function(err, items) {
			if(err || !items){
				callback(err);
			}else{		
	    		callback(null,items);
			}
		})
	});
};

function hasher() {
	str = '';
	key = new Date().getTime(); // Get timestamp
	key = key.toString(); // Change to string
	leng = key.length/3; // Get segment of string
	j = key.length-1;
	seg = Math.floor(leng);
	for(i=0;i<seg;i++){
		temp = key[j--] + key[j--];	// Get two char from the end of string
		temp = parseInt(temp);
		if(temp > 90){
			temp = temp - 90;
		}			
		code = 90-temp;
		if(code<65){
			code = checkGreater(code); // Check char code is greater thant 26
			code = code+65;
		}
		ch = String.fromCharCode(code); // Convert char code to char
		if(key[j--]%2 != 0){ // Check third char of segment is even or odd
			ch = ch.toLowerCase();
			
		}else{
			ch = ch+key[j]; 
		}	
		str += ch; 

	}
	return str.split("").reverse().join(""); // return result string in reverse order
}

function checkGreater(code){
	temp = code;
	if(code >= 26){
		temp = code-26;
		checkGreater(temp);
	}
	return temp;
}

exports.getUrl = function(url,db,callback){	
	checkExistParent(url,db,function(err,existUrl){
		if(!err && existUrl.length > 0){
			console.log(existUrl);
			callback(null,existUrl);
		}else{
			cleaner = hasher();
			var collection = db.collection("url");
			collection.insert({parent:url,target:cleaner},function(err, urls){
				if(err){
					callback(err);
				}else{
					callback(null,urls);
				}		
			});
		}
	});
};

exports.getParentUrl = function(target,db,callback){
	checkExistTarget(target,db,function(err,url){
		if(err){
			callback(err);
		}else{
			callback(null,url);
		}
	});
};

