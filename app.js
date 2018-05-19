//A web server will be created that will use the fortunes data
//and give the server with the data when a get request is made.

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fortunes = require('./data/fortunes');


const app = express();


//this middleware functionality will allow us to receive and parse json data
//from incoming request
app.use(bodyParser.json());

app.get('/fortunes',(req,res)=>{
    //res.json is similar to res.send which is used to send data from the server to 
    //the client
res.json(fortunes);
});
app.get('/fortunes/random',(req,res)=>{
    const random_index = Math.floor(Math.random() * fortunes.length);
    //generating a random number and then trying to fetch fortune based on random index
    const get_fortunes = fortunes[random_index];
    res.json(get_fortunes);    
    
});



app.get('/fortunes/:id',(req,res)=>{
    console.log(req.params)
    //req.params will fetch the params from the url
    
    const match_id_with_id_in_json = fortunes.find(f=> f.id == req.params.id);
    res.json(match_id_with_id_in_json);
});

//adding a new fortune object to the fortunes data
//using the post request
app.post('/fortunes',(req,res)=>{
console.log(req.body);

const {message, lucky_number, spirit_animal} = req.body;
const fortune_ids = fortunes.map(f=> f.id);
const fortune = {
    id: (fortune_ids.length>0?Math.max(...fortune_ids):0)+1,
    message,
    lucky_number,
    spirit_animal
};

const new_fortunes = fortunes.concat(fortune);

//we need add this newly added to our data file
//for this we use the fs module
fs.writeFile('./data/fortunes.json', JSON.stringify(new_fortunes,null,4), err =>console.log(err));
res.json(new_fortunes);
});

//in order to test the post request, use command line and the curl command instead
//of making an entire app or u can also use postman

//in the put method, we update an existing record
//we are also overwriting the old data with the new one
//passed via postman onto the fortunes.json
app.put('/fortunes/:id',(req,res)=>{
const {id} =req.params;
const {message, lucky_number, spirit_animal} = req.body;
console.log('put');
const old_fortune = fortunes.find(f=> f.id == id);
old_fortune.message = message;
old_fortune.lucky_number = lucky_number;
old_fortune.spirit_animal = spirit_animal;

fs.writeFile('./data/fortunes.json', JSON.stringify(fortunes,null,4), err=>console.log(err));
res.json(fortunes);
});


//this will delete the object whose id is passed as the req parameter
//we filter the object and update a new object excluding the the one whose id
//is passed, we write the file again with updated objects
app.delete('/fortunes/:id',(req,res)=>{
    const {id} =req.params;
    const new_fortunes = fortunes.filter(f=>f.id != id);


fs.writeFile('./data/fortunes.json',JSON.stringify(fortunes,null,4),err=>console.log(err));
res.json(new_fortunes);
});

module.exports = app;