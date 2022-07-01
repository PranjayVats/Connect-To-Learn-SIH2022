const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const path = require("path");


// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(cookieParser());
app.use(errorMiddleware);
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false})); 


//config
dotenv.config({ path: "backend/config/config.env" });

//route import

const user = require("./routes/userRoute");
const blog = require("./routes/blogRoute");
const puppet = require("./routes/scrapperRoutes");

app.use("/api/v1", user);
app.use("/api/v1", blog);
app.use("/api/v1", puppet);



// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

module.exports = app;
