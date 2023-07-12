

//home page
module.exports.home =  async(req,res)=>{

   console.log(req.header('userID'));
    //let notes = await noteModel.find({userID});
    // res.render('home.ejs',{isLoggedIn:req.session.isLoggedIn , notes});
   //res.json(notes);  
}

//addNotes
module.exports.addNotes = async (req,res)=>{
    res.redirect('/home')
    console.log(req.body);
    const{title , desc}=req.body;
   await noteModel.insertMany({userID:req.session.userID,title,desc})
}