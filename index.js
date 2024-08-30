const express = require("express")
const  dotenv = require("dotenv")
const mongoose = require("mongoose")


dotenv.config()

const app = express()

// middleware
app.use(express.json())


// Setting up the server
const PORT = process.env.PORT || 8000

mongoose.connect( `${process.env.MONGODB_URL}`)
.then(()=> console.log("MondoDB connected...!") )

app.listen(PORT, ()=>{
    console.log(`Server started running on ${PORT}`);
});


// app.post("/register", (req, res) =>{
//     const {email, name, state, age, phoneNumber } = req.body
    
//     if(!email){
//         return res.status(400).json({message: "pls add ur email"})
//     }
//       if (age < 18){
//         return res.status(400).json({message: "pls u re under age"})
//       }  if(!name){
//         return res.json({message: "pls add ur name"})
//     }
//     const newUser = {email, name, state, age, phoneNumber}
//       return res.json({message: "Registration sucesful", newUser }) 
// })

app.post('/add-user', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        const user = new User({ name, email, age });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/update-email', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.findOneAndUpdate({ name }, { email }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.post('/add-users', async (req, res) => {
    const users = req.body;
    try {
        const savedUsers = await User.insertMany(users, { ordered: false });
        res.status(201).send(savedUsers);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


app.post('/add-users', async (req, res) => {
    const users = req.body;
    const invalidUsers = users.filter(user => !user.name || user.name.length < 3 || user.age < 18 || user.age > 99);
    
    if (invalidUsers.length > 0) {
        return res.status(400).send({ error: 'Some users failed validation', invalidUsers });
    }

    try {
        const savedUsers = await User.insertMany(users, { ordered: false });
        res.status(201).send(savedUsers);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

