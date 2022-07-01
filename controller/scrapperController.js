const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const puppeteer = require("puppeteer");
const fs = require("fs");

exports.getConferenceScrapper = catchAsyncErrors(async (req, res, next) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://allconferencealert.net/advanced-search.php?keyword=india", {timeout: 0}
  );
  const HackList = await page.evaluate(() => {
    let conf = document.querySelectorAll(".aevent");
    let results = [];
    conf.forEach((hack) => {
      results.push({
        Name: hack.querySelector("td.name").innerText.trim(),
        date: hack.querySelector("td.date").innerText.trim(),
        Location: hack.querySelector("td.venue").innerText.trim(),
        newurl: hack.querySelector("td.name a").href,
      });
    });

    return results;
  });

  res.json(HackList);

  await browser.close();
  
});
