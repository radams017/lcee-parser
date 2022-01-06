const  EmlParser = require('eml-parser');
const  fs = require('fs');
const { isRegExp } = require('util');

// Search through the HTML string and return the LCTG values. Probably should refactor this into more than one function.
const parseHTMLString = (str) => {
    let html = str;
    let srcUrls = html.match(/src\s*=\s*"(.+?)"/g);
    let lctg = html.match(/lctg=\S{26}/g);
    if(!lctg){
        console.log('LCTG Parameter Not Found\n\nCheck Outputted HTML File for potential redirect links')
        return
    } else {
    let arr = []
    for (urls of srcUrls) {
        // this needs to be refactored -- I am basically trying to remove the beginning and end quotes/src stuff but can't figure out how to chain it. This is also pretty hardcoded and relies on the URLS being the same format
        let urlFrontTrim = urls.substring(5);
        let finalUrls = urlFrontTrim.substring(0, urlFrontTrim.length - 1);
        arr.push(finalUrls);
    }
    let lctgArr = arr.filter(url => url.match(/.*lctg=([^&|\n|\t\s]+)/));
    console.log(lctgArr);
 }
}

// Decode from Quoted-Printable
new EmlParser(fs.createReadStream(process.argv[2]))
.getEmailBodyHtml()
.then(htmlString => {
    fs.writeFileSync('decoded_email.html',htmlString)
    parseHTMLString(htmlString)
})
.catch(err => {
    console.log(err);
})
