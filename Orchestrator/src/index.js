import express from "express"
import "dotenv/config"

const app = express();

const port = process.env.PORT || "3000";

// to parse json data fron json.string to an object and inject that data into req.body (otherwise req.body will be undefined and you have to manually parse the incoming req data)

app.use(express.json());

//same as express.json but used for data submitted through HTML forms becuase their content type is different from application/json, their content type is application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: true }));

app.post("/api/nodes/register",(req,res)=>{
    console.log(req.body);
    res.send({"statusCode":"201"});
})

app.listen(port, (req,res) => {
    console.log(`server is running on port ${port}`);
})