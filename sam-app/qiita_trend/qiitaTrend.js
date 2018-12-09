exports.getTrendArticles = async (page) => {
  await page.goto('https://qiita.com')
  await page.waitFor(2000)
  return await page.evaluate(scrapeTrendArticles)
}

function scrapeTrendArticles() {
  const items = [...document.querySelectorAll('.tr-Item_body')]

  const articles = items.map( item => {
    const a = item.querySelector('a')
    const href = a.href
    const title = a.textContent
    const author = item.querySelector('.tr-Item_author').textContent
    const time = item.querySelector('time').textContent
    const like = item.querySelector('.tr-Item_likeCount').textContent
    console.log(href, title, author, time, like)

    return { href, title, author, time, like }
  })

  return articles;
}


