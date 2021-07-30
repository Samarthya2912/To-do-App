const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var todos = [];

mongoose.connect("mongodb://localhost:27017/todos", {useNewUrlParser: true, useUnifiedTopology: true});

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    }
})

const Message = mongoose.model('Message', messageSchema);

app.get("/", async (req, res) => {
    const readMessages = async () => {
        todos = await Message.find({});
        // await mongoose.connection.close();
    }

    await readMessages().catch(err => console.log(err));

    res.render('index', {todos: todos});
})

app.post("/add", (req, res) => {
    const todo_message = req.body;

    const message = new Message({message: todo_message.message})
    
    const addMessage = async () => {
        const response = await message.save();
        console.log(response);
        // await mongoose.connection.close();
    }

    addMessage().catch(err => console.log(err, 'err'))

    res.redirect("/");
})

app.post("/delete", (req, res) => {
    const id = req.body._id;

    const deleteMessage = async () => {
        const response = await Message.deleteOne({id: id});
        console.log(response);
    }
    
    deleteMessage().catch(err => console.log(err));
    
    res.redirect("/");
})

app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
})