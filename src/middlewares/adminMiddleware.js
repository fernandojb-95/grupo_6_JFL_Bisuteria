function adminMiddleware(req,res,next){
    if(req.session.user.isAdmin == 1){
    next();
    }else{
    res.redirect('/');
    }
    }
    
    module.exports = adminMiddleware;