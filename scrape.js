var base_url = "https://oc.tc";
var request = require("request");
var fs = require("fs-extra");
var cheerio = require("cheerio");
var scrapes = require("./pages");

var exp = {};

console.log("Starting scraping...");

var count = scrapes.length;

var getScrape = function(c) {
	function next(timeout) {
		timeout = timeout || 1;
		setTimeout(function() {
			getScrape(c + 1);
		}, timeout);
	}

	if (c < scrapes.length) {
		var page = scrapes[c];

		var options = {
			method: "GET",
			url: base_url + page.path,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"
			}
		};

		var path = page.file;
		var file = path.match(/[^\/]+$/)[0];
		path = path.replace(file, "");

		fs.stat("./scraped/" + path + file, function(err, res) {
			if (res) {
				var comp = new Date() - res.mtime;
				var minutes = Math.floor((comp / 1000) / 60);
				if (minutes < 240) {
					console.log("Not downloading, file is still new.");
					return next();
				}
			}
			request(options, function(error, response, body) {
				if (error) {
					return console.error("request error", error);
				}

				var $ = cheerio.load(body);

				var garbage = $("script,link").remove();
				body = $.html();

				fs.mkdirp("./scraped/" + path, function(err) {
					if (err) {
						return console.error("mkdir error", err);
					}

					fs.writeFile("./scraped/" + path + file, body, function(writeErr) {
						if (writeErr) {
							return console.error("Write error", writeErr);
						}

						console.log("Successfully saved the path " + page.path);

						next(5000);
					});
				})

			});
		});
	}
}

exp.getScrape = getScrape;

module.exports = exp;

if (!module.parent) {
	getScrape(0);
}