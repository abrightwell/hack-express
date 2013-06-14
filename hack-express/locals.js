module.exports.getLocals = function(req, res, next) {
	
	var userTemp = req.session.user;
	var username = "";
	
	//If session exists
	if(userTemp != undefined){
		//Truncate display name if needed
		if(userTemp.username.length > config.name.max_length){
			username = userTemp.username.substring(0,config.name.max_length)+"...";
		} else {
			username = userTemp.username;
		}
	}
		
    res.locals({
      user: req.session.user,
      displayName: username,
      messages: req.flash()
    });
    next();
  }
