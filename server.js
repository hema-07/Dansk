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
        var price= [], title = [];
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
          out.push({'productName':item,'productPrice':product_price[key],'companyName':companyName[0]});
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
