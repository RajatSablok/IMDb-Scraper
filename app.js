const request = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const json2csv = require('json2csv').Parser

const movieURL = "https://www.imdb.com/title/tt0816692/?ref_=tt_sims_tt";

(
    async() => {
    const imdbData = []
    
        const response = await request({
            uri : movieURL,
            headers : {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
            },
            gzip : true
        })
        
        let $ = cheerio.load(response)
        let title = $('div[class="title_wrapper"] > h1').text().trim()
        let rating = $('div[class="ratingValue"] > strong > span').text()
        let runTime = $('div[class="subtext"] > time').text().trim()
        let releaseDate = $('a[title="See more release dates"]').text().trim()
        let summary = $('div[class="summary_text"]').text().trim()
    
        imdbData.push({
            title,
            rating,
            runTime,
            releaseDate,
            summary
        });
    
    const j2cp = new json2csv()
    const csv = j2cp.parse(imdbData)
    
    fs.writeFileSync("./imdb.csv", csv, "utf-8")

})()