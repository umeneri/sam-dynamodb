'use strict'

const launchChrome = require('@serverless-chrome/lambda')
const CDP = require('chrome-remote-interface')
const puppeteer = require('puppeteer')

exports.lambdaHandler = async (event, context, callback) => {
  let slsChrome = null
  let browser = null
  let page = null

  try {
    slsChrome = await launchChrome()
    console.log('qiita chrome');
    browser = await puppeteer.connect({
      browserWSEndpoint: (await CDP.Version()).webSocketDebuggerUrl
    })
    console.log('qiita browser');
    const context = browser.defaultBrowserContext()
    const page = await context.newPage()
    console.log('qiita page');

    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ja' })
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36')
    await page.goto(`https://www.google.co.jp/`, { waitUntil: 'networkidle0' })

    const searchWord = encodeURIComponent(event.searchWord)
    await page.goto(`https://www.google.co.jp/search?q=${searchWord}`, { waitUntil: 'domcontentloaded' })

    await page.evaluate(() => {
        var style = document.createElement('style')
        style.textContent = `
            @import url('//fonts.googleapis.com/css?family=Source+Code+Pro');
            @import url('//fonts.googleapis.com/earlyaccess/notosansjp.css');
            div, input, a{ font-family: 'Noto Sans JP', sans-serif !important; };`
        document.head.appendChild(style)
    })
    await page.waitFor(1000) // Wait until the font is reflected
    const screenShot = await page.screenshot({fullPage: true})
    const searchResults = await page.evaluate(() => {
      const ret = []
      const nodeList = document.querySelectorAll("div#search h3")

      nodeList.forEach(node => {
        ret.push(node.innerText)
      })

      return ret
    })

    await page.waitFor(1000)

    const result = {result: 'OK', searchResults: searchResults, screenShot: screenShot.toString('hex').length };
    console.log(result);
    return callback(null, result);
    // return callback(null, {result: 'OK', searchResults: 'result', screenShot: 'shot'})
  } catch (err) {
    console.error(err)
    return callback(null, JSON.stringify({ result: 'NG' }))
  } finally {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.disconnect()
    }

    if (slsChrome) {
      await slsChrome.kill()
    }
  }
}


// exports.lambdaHandler = async (event, context) => {
//    let res;
//     try {
//         res = {
//             'statusCode': 200,
//             'body': JSON.stringify({
//                 message: 'hello world',
//                 location: 'location',
//             })
//         }
//     } catch (err) {
//         console.log(err);
//         return err;
//     }
//
//     return res;
// }
//
