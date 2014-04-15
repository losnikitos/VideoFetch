var fs = require('fs'),
    http = require('http'),
    Flickr = require("flickrapi"),
    flickrOptions = { api_key: 'db8f097481a15bc8205944de815cf744',
        secret: 'd4cb8762aba6a398',
        callback: 'oob',
        oauth_timestamp: '1396387854971',
        oauth_nonce: '609ba8a8745e3c28beba9e34a23ac663',
        oauth_callback_confirmed: 'true',
        oauth_token: '72157643278768833-f3a70cc6cb1873e4',
        oauth_token_secret: '9d117e60ea49ecce',
        permissions: 'read',
        oauth_verifier: '368-972-777',
        user_id: '66003218%40N07',
        access_token: '72157643278816724-12c2b9bbb09a613a',
        access_token_secret: 'cbf1c3488a2903e2' };

var self = this;

self.download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() { file.close(); cb(); });
    });
};

Flickr.authenticate(flickrOptions, function (error, flickr) {
    var photos = flickr.photosets.getPhotos({photoset_id: '72157643255383375', page: '2'}, function (err, res) {
        var photos = res.photoset.photo;
        photos.forEach(function (photo) {
            flickr.photos.getInfo({photo_id: photo.id}, function (err, res) {
                var url = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + res.photo.originalsecret + "_o_d.jpg";
                var filename = process.cwd() + "/photos/" + photo.title + ".jpg";
                console.log(url, ' -> ', filename);
                self.download(url, filename, function () {
                    console.log('callback')
                });
            });
        })
    });
});