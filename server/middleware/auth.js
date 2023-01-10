const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json('No token found');
    }
    try {
      const data = jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if (err){
          return res.status(403).json('Invalid Token');
        }
        req.user={
          id:user
        }
        next();
      });
    } catch {
      return res.sendStatus(403);
    }
  };
  