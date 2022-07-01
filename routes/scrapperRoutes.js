const express = require("express");
const { getConferenceScrapper } = require("../controller/scrapperController");
const router = express.Router();

router.route("/conference").get(getConferenceScrapper);

module.exports = router