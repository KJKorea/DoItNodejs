// write string after set size of buffer
var output = 'Hi 1!';
var buffer1 = new Buffer(8);
var len = buffer1.write(output, 'utf8');
console.log(len);
console.log('string of 1st buffer : %s', buffer1.toString());

// make string using buffer object
var buffer2 = new Buffer('Hi 2!', 'utf8');
console.log('string of 2nd buffer : %s', buffer2.toString());

// check type
console.log('type of buffer object : %s, %s', Buffer.isBuffer(buffer1), Buffer.isBuffer(buffer2));

// 
var byteLen = Buffer.byteLength(output);
var str1 = buffer1.toString('utf8', 0, byteLen);
var str2 = buffer2.toString('utf8');
console.log(str1, str2);

// 
buffer1.copy(buffer2, 0, 0, len);
console.log('string after copy to 2nd buffer : %s', buffer2.toString('utf8'));

// 
var buffer3 = Buffer.concat([buffer1, buffer2]);
console.log('string after concat two buffer : %s', buffer3.toString('utf8'));