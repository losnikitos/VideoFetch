var express = require('express'),
    request = require('request'),
    jar = request.jar(),
    fs = require('fs');

module.exports = function () {

//    var urls = ["http://www.jv.ru/video/show/436"];

    var intervals = [
//        {from: 436, to: 459},
        {from: 471, to: 480},
        {from: 504, to: 513},
        {from: 537, to: 546},
        {from: 2898, to: 2912}
    ];

    var urls = [];

    intervals.forEach(function(interval) {
        for (var i = interval.from; i <= interval.to; i++) {
            urls.push("http://www.jv.ru/video/show/" + i)
        }
    });

    var uri = 'http://www.jv.ru';
    var cookies = "_ga=GA1.2.1291619285.1397425474; _ym_visorc_958188=b; BLA=ti8q7rfbgergkrs6i67l5k2l27; hash4restore=d0739720e6f9d19c39c944679d2afe7c456ed4c6a4b31e6ed2756ce71cca37f6dcfa4a11; i=388854; kvs=d1c43413f97259c9f6f747d24cfd43a045f76b5e; openstat_test=1";

    // set cookies
    cookies.split(';').forEach(function (cookie) {
        jar.setCookie(cookie, uri);
    });

    // use cookie for requests
    request = request.defaults({jar: jar});

    var loadVideos = function (index) {
        if (index == null) index = 0;

        if (index == urls.length) {
            return;
        }

        var url = urls[index];

        loadVideo(url, function () {
            index++;
            loadVideos(index);
        })
    };

    var loadVideo = function (url, cb) {
        // url = 'http://www.jv.ru/video/show/436'
        request(url, function (err, res, body) {

            var id = body.match(/param name="id" value="(\d+)"/g)[0].match(/\d+/g)[0]; //id = 4796373

            request('http://cloud.tvigle.ru/api/play/video/' + id + '/', function (err, res, body) {

                var videoURL = JSON.parse(body).playlist.items[0].videos.mp4["480p"];
                var filename = JSON.parse(body).playlist.items[0].title.replace('/', '_') + '.mp4';

                filename = '/Users/losnikitos/Yandex.Disk/LexaYoga/' + filename;

                console.log(videoURL, '-->', filename);
                request(videoURL).pipe(fs.createWriteStream(filename).on('close', cb));

//                console.log('<a href="http://cloud.tvigle.ru/video/' + id + '/">' + JSON.parse(body).playlist.items[0].title + '</a>');
            });
        })
    };

    loadVideos();
}();