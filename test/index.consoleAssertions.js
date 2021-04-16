const puppeteer = require('puppeteer'),
    express = require('express'),
    app = express(),
    port = 4325;

app.use(express.static('public'));

const server = app.listen(port, () => console.log(`AR Server listening on port: ${port}`));

module.exports = (async () => {
    const url = 'http://localhost:' + port;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const resultArr = [];
    page.on('console', async e => {
        const args = await Promise.all(e.args().map(a => a.jsonValue()));
        if (e.type() === ('assert' || 'error')) {
            resultArr.push(e);
        }
    });
    page.on("pageerror", function(err) {  
        resultArr.push(err);
    });
    await page.goto('http://localhost:' + port);
    await page.close();
    await browser.close();
    server.close();
    return resultArr;
})();