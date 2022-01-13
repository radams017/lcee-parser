const EmlParser = require("eml-parser");
const fs = require("fs");
const { isRegExp } = require("util");

// Search through the HTML string and return the LCTG values. Probably should refactor this into more than one function.
const parseLCTGUrls = (str) => {
  let html = str;
  let srcUrls = html.match(/src\s*=\s*"(.+?)"/g);
  let lctg = html.match(/lctg=\S{26}/g);
  if (!lctg) {
    console.log(
      "LCTG Parameter Not Found\n\nCheck Outputted HTML File for potential redirect links/Different Parameter"
    );
    return;
  } else {
    let arr = [];
    for (urls of srcUrls) {
      // removing "src=" & trailing " from urls
      let trimmedUrls = urls.substring(5).substring(0, urls.length - 1);
      // push all the trimmed URLs into an array
      arr.push(trimmedUrls);
    }
    // filter only the LCTG related URLs into the Array
    let lctgArr = arr.filter((url) => url.match(/.*lctg=([^&|\n|\t\s]+)/));
    console.log("Image Source URLs\n")
    console.log(lctgArr);
  }
};

// Decode from Quoted-Printable
new EmlParser(fs.createReadStream(process.argv[2]))
  .getEmailBodyHtml()
  .then((htmlString) => {
    fs.writeFileSync("decoded_email.html", htmlString);
    parseLCTGUrls(htmlString);
  })
  .catch((err) => {
    console.log(err);
  });

  