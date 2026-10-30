export const isAuthenticate=(req,res,next)=>{
    try{
        const token =req.headers.authorization;
    if(!token){
       return res.status(405).json({
        "error":"No Auth token"
       })

    }
    next();
}
catch(error){
    console.error("Error while finding token",error);
}
    
}