var base_url = "https://oc.tc";
var request = require("request");
var fs = require("fs-extra");
var cheerio = require("cheerio");

var scrapes = [{
	path: "/",
	file: "index.html"
}, {
	path: "/forums",
	file: "forums/index.html"
}, {
	path: "/stats/Jake_0",
	file: "stats/Jake_0/index.html"
}, {
	path: "/forums/4fc17119c463751492000018",
	file: "forums/4fc17119c463751492000018/index.html"
}, {
	path: "/forums/topics/531a511512ca956f8700a54d",
	file: "forums/topics/531a511512ca956f8700a54d/index.html"
}, {
	path: "/maps",
	file: "maps/playing/index.html"
}, {
	path: "/maps/all",
	file: "maps/all/index.html"
}, {
	path: "/maps/blockblock",
	file: "maps/blockblock/index.html",
}, {
	path: "/punishments",
	file: "punishments/index.html"
}, {
	path: "/punishments/527fca2f0cf276a317ca74b0",
	file: "punishments/527fca2f0cf276a317ca74b0/index.html"
}, {
	path: "/maps",
	file: "maps/index.html"
}, {
	path: "/maps/rotation/4f77c9bfc463750586000001",
	file: "maps/rotation/4f77c9bfc463750586000001/index.html"
}];

console.log("Starting scraping...");

var count = scrapes.length;

function getScrape(c) {
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
				if (minutes < 30) {
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

						next();
					});
				})

			});
		});
	}
}

getScrape(0);