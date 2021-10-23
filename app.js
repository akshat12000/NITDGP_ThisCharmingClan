const express = require("express");
const app = express();

app.get("/", function(req, res){
    res.send("Myntra Page");
})

app.listen(3000, function(){
    console.log(" Started server on port 3000");
})