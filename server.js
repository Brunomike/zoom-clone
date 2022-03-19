const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');



app.get("/", (req, res) => {
    res.status(200).render("room");
});



server.listen(port, (err) => {
  err
    ? console.log(err.message)
    : `Server listening on http://localhost:${port}`;
});
