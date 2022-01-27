const cheerio = require("cheerio");
const EmlParser = require("eml-parser");
const fs = require("fs");
const request = require("request");
const rp = require("request-promise");
const Promise = require("bluebird");
const inquirer = require("inquirer");

function parseHTML(str) {
  const $ = cheerio.load(str);
  const linkObjects = $("a");
  const links = [];
  linkObjects.each((index, element) => {
    links.push({
      href: $(element).attr("href"), // get the href attribute
    });
  });
  let result = links.map((a) => a.href);
  let hrefs = result.filter((url) => url.match(/http[s]?/));
  return Promise.map(hrefs, getRedirectedURL); // promise.map('array of promises') => resolve to a new array with answer to each promise
}

function retrieveURL(response, body) {
  let redURL = response.request.uri.href;
  // let lctgRedirectURL = lctgRedirect.match(/lctg?/)
  //   console.log(redURL, "\n");
  return redURL;
}

function getRedirectedURL(url) {
  const options = {
    uri: url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36",
    },
    resolveWithFullResponse: true,
  };
  return rp(options).then(retrieveURL);
}

function checkCongruency(arr) {
  return arr.every((c) => c === arr[0])
}

function getFinalUrls(ans) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "parameter",
        message: "What is the name of the LCEE URL Parameter?",
      },
    ])
    .then((response) => {
      let param = response.parameter;
      let paramExp = `${param}=(.{1,}?)&`;
      const paramReg = new RegExp(`${param}=(.{1,}?)&`, "i");
      let matchedUrls = ans.filter((a) => a.match(param));
      // console.log(matchedUrls);

      let paramValues = matchedUrls.map((b) => {
        let match = paramReg.exec(b);
        return match[1];
      });
      console.log(matchedUrls)
      console.log(paramValues);
      console.log("Values Are Congruent: ", checkCongruency(paramValues));

      // Keeping the below for now in case we want only unique urls to check -- might want to see every URL though.
      // let uniq = [...new Set(matchedUrls)];
    });
}

// getRedirectedURL('http://enews.newsletters.ocregister.com/q/FK8ps9rHfGQH0XS2aeoNHATJ4Lw9ntACpd2IZcOJY2hyaXN0ZW5sb2Jvc2NvQGdtYWlsLmNvbcOI2waCAOzNcrYk8oiIU4on290HgQ', function(err, response) {
//     let reURL = response.request.uri.href;
//     console.log(reURL)
// })

function init() {
  new EmlParser(fs.createReadStream(process.argv[2]))
    .getEmailBodyHtml()
    .then((htmlString) => {
      fs.writeFileSync("decoded_email.html", htmlString);
      return parseHTML(htmlString).then((answers) => {
        getFinalUrls(answers);
      });
    })
    .catch((err) => {
      console.log("Unhandled Error: ", err);
    });
}

init();
