const express = require('express') //importing express
const app = express() //creating app

//route for api
app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(3001, () => {console.log("Server started on port 3001")})