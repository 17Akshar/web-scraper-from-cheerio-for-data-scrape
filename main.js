const request = require('request')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
app.listen(5000)
var data = []
function strtonum(string){
  return parseInt(string.replace(/,/g,'').replace('₹',"").replace('.','')) 
}
function rate(string){
  return parseFloat(string.split(" ")[0])
}
app.get('/',async (req,res)=>{
  data = []
  console.log('server is running!!')
  request(`https://www.amazon.in/s?k=${req.query.item}&page=${req.query.page}&ref=sr_pg_${req.query.page}`,cb)
  function cb(err,response,body){
    if(err){
      console.log(err)
    }
    else{
      getData(body).then(resd=>res.send(resd))
    }
  }
  async function getData(body){
    data = []
    let $ = cheerio.load(body)
    $('.s-asin').each((i,product)=>{ 
    const brand = $(product).find('h2>.a-size-base-plus').text()
    const title = $(product).find('h2 > a > span').text()
    const asin = $(product).attr('data-asin')
    const price = $(product).find('.a-price > span>.a-price-whole').text()
    const rating = $(product).find('.a-icon > .a-icon-alt').text()
    const mrp = $(product).find('.a-text-price>.a-offscreen').text()
    const image = $(product).find('.s-image').attr('src')
    data.push({
      product_brand:brand,
      product_title:title,
      product_asin:asin,
      product_price:strtonum(price),
      product_mrp:strtonum(mrp),
      product_rating:rate(rating),
      product_url:'https://www.amazon.in/dp/'+asin,
      product_image:image,
      product_discount:(100-((strtonum(price)/strtonum(mrp))*100))|0
    })
  })
  return data;
  }

})
