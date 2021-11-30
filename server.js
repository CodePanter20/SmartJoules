const express = require('express')
const app = express()
const mongoose = require('mongoose');


const { v4: uuidv4 } = require('uuid');
console.log(uuidv4());

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/smart';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
    console.log("Connection Successful!"); 
});


var IdSchema = mongoose.Schema({uuid: String});


var UUID = mongoose.model('UUID', IdSchema, 'UUID');

app.get('/generateUuid', function(req, res) {
    var id = uuidv4();
    res.send(id);

    const sign1 = new UUID(id);
    sign1.save(function (err, ) {
        if (err) return console.error(err);
        console.log(` saved to collection. ${id}`);
    });

    console.log(id);
});


app.get('/check-balance', function(req, res) {
    console.log('Body', req.body);
    const id =req.body;

    const collection = db.collection('UUID');

    if(collection.find({id}) ){
        res.send(id);
    }
    else{
        res.send("UUID is not recognised.");
    }
});

let port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})