const express = require('express');
const app = express();
app.listen(process.env.PORT || 3000, () => {
    console.log("server is running now");
});

//to convert buffer into json
app.use(express.json());

//hash password
const bcrypt = require('bcrypt');


// node js knows static files
const path = require('path');
app.use(express.static(path.join(__dirname, "public")));


//validation

const { check, validationResult } = require('express-validator');
const validation = require('./validation/SignUp.validation');




// auth require in middleware
const auth = require('../p1 nodejs/middleware/auth');



//register page
//we delete end point in api



app.post('/SignUp', validation, async (req, res) => {

    const errorValidation = validationResult(req);
    console.log(errorValidation);
    console.log(errorValidation.isEmpty());
    const { name, email, password } = req.body;
    let data = await userModel.findOne({ email });
    if (data != null) {

        res.json({ message: "email exist" });

    }
    else {
        bcrypt.hash(password, 7, async function (err, hash) {
            // Store hash in your password DB.
            if (errorValidation.isEmpty()) {
                await userModel.insertMany({ name, email, password: hash });
                res.json({ message: "Insert operation is sucess in db" })
            }
            else {
                console.log("An errorrrrrrrrr !");
                //  res.json('error', errorValidation.array())
                res.status(201).json(errorValidation.array())
            }

        });
    }
})




//login page


app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    let userLogin = await userModel.findOne({ email });

    if (userLogin != null) {
        const match = await bcrypt.compare(password, userLogin.password);
        if (match) {
            res.json({ userLogin: userLogin._id });
            console.log("correct login");
        } else {

            res.json({ message: "incorrect password" });
            console.log("wrong password");
        }
    }
    else {
        res.json({ message: "email doesnt exsit" });
        console.log("undefind email");

    }
})

//home page

app.get('/home', async (req, res) => {
    console.log(req.header('userID'));
    let userID = req.header('userID')
    let notes = await noteModel.find({ userID });
    res.json(notes);
})



//addNotes

app.post('/addNote', async (req, res) => {

    console.log(req.body);
    const { title, desc, userID } = req.body;
    await noteModel.insertMany({ userID, title, desc })
    res.json({ message: "addNote sucess" });
})

//delete notes
app.delete('/delete', async (req, res) => {
    console.log(req.body);
    const { _id } = req.body;
    await noteModel.findByIdAndDelete({ _id });
    res.json({ message: "deleted success" });
})

//edit notes
app.put('/editNote', async (req, res) => {
    console.log(req.body);
    const { _id, title, desc } = req.body;
    await noteModel.findByIdAndUpdate({ _id }, { title, desc });
    res.json({ message: "updated success" });
})

// //page not found
app.use((req, res, next) => {
    res.status(404).send('Page not found');
})


//connection with DB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/p1_db', {
    useNewUrlParser: true, useUnifiedTopology: true
}, (e) => {
    if (e) console.log(e);
    else console.log("DB is sucessfully connected");
}
);

//create first collection (users)
const userSchema = mongoose.Schema({
    name: String, email: String, password: String
})
const userModel = mongoose.model('user', userSchema);

////create second collection (notes)
const noteSchema = mongoose.Schema({
    title: String, desc: String,
    userID: mongoose.Schema.Types.ObjectId
})
const noteModel = mongoose.model('note', noteSchema)


