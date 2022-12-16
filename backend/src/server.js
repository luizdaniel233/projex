require("dotenv").config()
const db = require("./database/db")
const { app } = require("./config/index");

db.connect(erro => {
    if(erro){
        console.log(erro)
    }else{
        console.log("Database connected!")
        app.listen(process.env.port_application,() => console.log(`Port ${process.env.port_application} available!`))
    }
})

