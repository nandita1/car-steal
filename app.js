const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//import routes
const policeRoutes = require("./routes/police")
const casesRoutes = require("./routes/cases")

//db
mongoose
    .connect('mongodb+srv://nandita:nandita@cluster0-i9csd.mongodb.net/car_steal?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("DB connected");
    });

//middlewares
app.use(bodyParser.json());
app.use(cors());

//routes middleware
app.use("/api", policeRoutes);
app.use("/api", casesRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});