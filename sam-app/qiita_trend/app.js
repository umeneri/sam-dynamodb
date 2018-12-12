'use strict'

const launchChrome = require('@serverless-chrome/lambda')
const CDP = require('chrome-remote-interface')
const puppeteer = require('puppeteer')
const qiitaTrend = require('./qiitaTrend')

exports.lambdaHandler = async (event, context, callback) => {
  let slsChrome = null
  let browser = null
  let page = null

  try {
    slsChrome = await launchChrome()
    browser = await puppeteer.connect({
      browserWSEndpoint: (await CDP.Version()).webSocketDebuggerUrl
    })
    const page = await browser.defaultBrowserContext().newPage()

    await page.setExtraHTTPHeaders({ 'Accept-Language': 'ja' })
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36')

    const articles = await qiitaTrend.getTrendArticles(page)
    const result = {result: 'OK', articles: articles };

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }

    return response;
  } catch (err) {
    console.error(err)
    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'NG' })
    }
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
