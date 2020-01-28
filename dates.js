function timeString(dat) {
    ///dat = new Date();
    var d = new Date(dat);
    var t = d.toISOString().substr(11, 8);//2020-01-28T09:12:37.628Z
    t = d.toISOString().substr(11, 8);//09:12:37
    t = d.toDateString();//Tue Jan 28 2020
    t = d.toString()//Tue Jan 28 2020 10:11:50 GMT+0100 (GMT+01:00)
    t = d.toLocaleDateString()//2020-1-28
    t = d.toString().substr(16,8);//10:19:23
    return t;
  }

var d = new Date().toISOString();
console.log(d);

console.log(timeString(d));
