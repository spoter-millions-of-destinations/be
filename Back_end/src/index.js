const express   = require("express")
const app       = express()
const http      = require("http")
const server    = http.createServer(app)
const PORT      = 3000

// start testing server
app.get("/", (req, res)=>{
    res.send("Hello")
})

server.listen(PORT, ()=>{
    console.log(`App is listening at port ${PORT}`)
})
// end testing server
