const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://admin:admin@clubsync-db.04whpr6.mongodb.net/clubsync');
const userSchema= new mongoose.Schema({
    name:String,
    age:Number
})
const userModel= mongoose.model("emp", userSchema);
app.listen('3000', ()=>{
    console.log('running!!!');
})