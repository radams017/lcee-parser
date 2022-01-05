const  EmlParser = require('eml-parser');
const  fs = require('fs');

// Search through the HTML string and return the LCTG values
const parseHTMLString = (str) => {
    let html = str;
    let lctg = html.match(/lctg=\S{26}/g);
    if(!lctg){
        console.log('LCTG Not Found')
    } else {
    console.log(lctg)
    }
}

// Decode from Quoted-Printable
new EmlParser(fs.createReadStream('./test.eml'))
.getEmailBodyHtml()
.then(htmlString => {
    parseHTMLString(htmlString)
})
.catch(err => {
    console.log(err);
})
