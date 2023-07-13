const request = require('request')
const cheerio = require('cheerio')
var data =[]
var search_data = "jeans"
var  i = 1;
while(i!==7){
  var url = `https://www.amazon.in/s?k=${search_data}&page=${i}`
request(url,cb)
function cb(err,response,body){
  if(err){
    console.log(err)
  }
  else{
    getData(body)
  }
}
function getData(body){
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
  console.log(data)

}
i++
}
function strtonum(string){
  return parseInt(string.replace(/,/g,'').replace('₹',"").replace('.','')) 
}
function rate(string){
  return parseFloat(string.split(" ")[0])
}

