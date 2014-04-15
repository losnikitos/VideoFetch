var VK = require('vk-api'),
    express = require('express'),
    open = require('open');

function startServer() {
    var app = express();
    app.get('/', function (req, res) {
        console.dir(req);
    });
    app.listen(3000);
};


function authVK() {
    var settings = {
        appID: 4298180,
        appSecret: 'o3GN8HyehKLbZUs6sRUm',
        permissions: 4 + 65536
    };

//    var vk = new VK(settings);

    var url = 'https://oauth.vk.com/authorize?client_id=' + settings.appID
        + '&scope=' + settings.permissions
//           +'&redirect_uri=' + 'localhost:3000/'
        + '&redirect_uri=https://oauth.vk.com/blank.html'
        + '&display=' + 'page'
        + '&v=' + '5.20'
        + '&response_type=token';

    open(url);


};

function request() {
    var vk = new VK({
        appID: 4298180,
        appSecret: 'o3GN8HyehKLbZUs6sRUm'});

    vk.api('users.get', {id: 1, lang: 'en'}, function(err,result) {
        console.log(err,result);
    });
}

request();
