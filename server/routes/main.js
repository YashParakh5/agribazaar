
exports.login_signup_render= function(req,res,next){
    console.log("Login ",req.session.username);
    if(req.session.username==null)
    {
        var sess = req.session; 
        var message=req.session.message;
        console.log("Message "+req.session.message);
        if(req.session.message!=null)
        {
            var level=req.session.level;
            console.log("Recieving "+message);
            res.render('main/auth', { title: 'AgriBazaar',message:message,level:level });
            delete res.session.message;
            delete res.session.level;
        }
        else
        {
            res.render('main/auth', { title: 'AgriBazaar' });
        }
    }
    else
    {
        res.redirect('/');
    }
}

exports.logout = function(req,res,next){
    console.log("Auth: Trying to logout.");
    var sess = req.session; 
    console.log("Auth: "+req.session.username+" is trying to logout.");
    req.session.destroy(function(err){
        if(err){
            console.log("Auth:"+err);
        }else{
            console.log("Auth: Logged Out!");
            res.clearCookie('userId');
            res.clearCookie('username');
            res.clearCookie('role');
            res.redirect('/');
        }
    });
}
exports.login = function(req, res){
    var message = '';
    var sess = req.session; 
    
    if(req.method == "POST"){
    var post  = req.body;
    console.log("Remember",post.remember)
    var email_username= post.user_email;
    var pass= post.user_password;
    console.log("auth","Recieved "+email_username+" w/ Password: "+pass);
    var sql="CALL Users_verify('"+email_username+"',SHA('"+pass+"'));";
    //var sql="select id,email,fullname,username,role from `Users` where (`email`='"+email_username+"' OR `username`='"+email_username+"') AND password='"+pass+"'";
    db.query(sql, function(err, results){ 
        if (err) {
            return console.error("SQL Error",err);
        }
        var json=JSON.parse(JSON.stringify(results[0]));
        if(json[0]!=null){
            req.session.userId=json[0].id;
            req.session.role=json[0].role;
            req.session.username=json[0].username;
            console.info("auth",json[0].fullname+" just logged in!");
            if(post.remember=="on")
                res.cookie('username',json[0].username,{maxAge: 2630000})
                res.cookie('role',json[0].role,{maxAge: 2630000});
                res.cookie('userId',json[0].id,{maxAge: 2630000})
            if(json[0].role=="shopper")
            {
                res.redirect('/');
            }
            else
            {
                res.redirect('/profile/'+req.session.username);
            }
        }
        else
        {
            var sess = req.session; 
            console.warn("auth","Incorrect Username "+email_username+" /Password "+pass);
            req.session.message="Incorrect credentials. Please try again.";
            req.session.level="danger";
            res.redirect('/auth');
        }
    })}
    else{
        res.redirect('/')
    }
};
exports.signup = function(req, res){
    message = '';
    if(req.method == "POST"){
        var post  = req.body;
        var name= post.Rusername;
        var pass= post.Rpassword;
        var fname= post.Rfullname;
        var address= post.Raddress;
        var email=post.Remail;
        var role=post.Rrole;
        console.log("Role "+role);
        var sql = "call Users_register('"+name+"',sha('"+pass+"'),'"+fname+"','"+email+"','"+role+"','"+address+"');";
        var query = db.query(sql, function(err, result) {
            if (err) {
                return console.error(err);
            }
            message = "Succesfull! Your account has been created.";

            res.render('index',{title:"India's Biggest Farmer-to-Consumer Marketplace",accname: name,message: message,level: "info"});
        });
        

    } else {
        res.render('signup');
    }
};
exports.getItemSeller = function(req,res,next){
    //FIXME This API doesnt work
    console.log("HI");
    var sql="call search_getSellers("+req.params.item+");";
    console.log(db.query(sql));
};
exports.search = function(req,res,next){
    let sql="call search_All('"+req.params.search+"');"
    db.query(sql,function(err,answ){
        if(err)
        {
            throw console.error("SQL Error",err);
        }
        let ans=JSON.stringify(answ[0]);
        res.end(ans);
    });
};