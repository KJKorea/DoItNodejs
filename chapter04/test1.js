var url = require('url');

// make string to url object 
var curUrl = url.parse('http://search.naver.com?query=steve+jobs&where=&sm=mtp_hty');

// make url object to string
var curStr = url.format(curUrl);

console.log('string : %s', curStr);
console.dir(curUrl);

// seperate query string
var querystring = require('querystring');
var param = querystring.parse(curUrl.query);

console.log('query value of request parameters : %s', param.query);
console.log('original request parameter object : %o', param);
console.log('stringify original request paramater : %s', querystring.stringify(param));
