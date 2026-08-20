import express from "express"
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/nodes/register",(req,res)=>{
    console.log(req.body);
    res.send({"statusCode":"201"});
})

app.listen(port, (req,res) => {
    console.log("server started on port: "+ String(port));
})