var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  url = 'https://www.iposen.dk/shop/display/products?offers=1&category_id=41';

  request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html),$header = $('title').html();
        var price= [], title = [], margin = [25,34,56,61,68,72,45,63,83],
        currentPrice = [6,7,5,8,5,6,21,26,29], newPrice = [4,5,4,6,4,3,18,17,18]
        outOftheDoor = [4,5,3,5,2,4,15,18,17];
        var data, data1, out=[],product_name=[],product_price_description=[];
        var product_price = [], companyName = [];
        var json = {name : "", price : ""};
      $('.product_list_name').filter(function(){
        data = $(this);
        var title = data.text().trim();
        product_name.push(title);
        json.name = product_name;
      })

      $('.product_list_price').filter(function(){
        data1 = $(this);
        var price = data1.first().text().trim();
        product_price_description.push(price);
      })

      $('.footer-iposen-title').filter(function(){
          data2 = $(this);
          var company = data2.text().trim();
          companyName.push(company);
      })

      product_price_description.map((item)=>{
        item = item.replace(/\r?\n|\r/g, " ");
        product_price.push(item.substr(0,6));
        json.price = product_price;
        // var href = $('img', this).attr('src');
      })
        json.company = companyName[0];
        product_name.map((item,key)=>{
          out.push({'productName':item,
          'productPrice':product_price[key],
          'companyName':companyName[0],
          'margin': margin[key],
          'currentPrice': currentPrice[key],
          'newPrice': newPrice[key],
          'outOftheDoor': outOftheDoor[key]
        });
        })
console.log(out);
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
  })
})

app.listen('8001')
console.log('Magic happens on port 8001');
exports = module.exports = app;
