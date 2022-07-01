const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

//Config
dotenv.config({ path: "backend/config/config.env" });

//connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Unandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
