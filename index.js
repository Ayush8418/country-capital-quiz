import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "1234",
    port: 5432
});
db.connect();

const messages = ["Good😀","Great😆","Excellent😗","Marvelous🫡","Superb😯","Boss!😨","Ace!!😱","GOD!!!🫨"];
let userScore = 0;
let quiz;
let currentQuestion;
let message = "Lets Goo!!!";
db.query(`SELECT * FROM capitals` , (err,res)=>{
    if(err){
        console.error("error 1" , err.stack);
    }else{
        quiz = res.rows;
    }
    db.end();
})

app.get("/" , (req,res) =>{
    newQuestion();
    const response = {score:userScore , country:currentQuestion.country , messageRes:message}
    res.render("index.ejs", {data:  response});
});

app.post("/submit" , (req,res) => {

    const userAns = req.body.answer.toLowerCase();
    const capital = currentQuestion.capital.toLowerCase();
    console.log(userAns);
    if(capital === userAns){
        userScore++;
        if(userScore <= 8)
            message = messages[userScore-1];
        else
        message = messages[7];
    }
    else{
        userScore = 0;
        message = "Oops! wrong Answer!"
    }
    newQuestion();
    const response = {score:userScore , country:currentQuestion.country , messageRes:message};
    res.render("index.ejs", {data:  response});
})

function newQuestion(){
    const randomID = Math.floor(Math.random()*250);
    currentQuestion = quiz[randomID];
}

app.listen(port , () => {
    console.log("app running at port "+port);
});