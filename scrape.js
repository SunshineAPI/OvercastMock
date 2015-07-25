var base_url = "https://oc.tc";
var request = require("request");
var fs = require("fs-extra");

var scrapes = [{
	path: "/",
	file: "index.html"
}, {
	path: "/forums",
	file: "forums/index.html"
}];

fs.emptydirSync("./scraped");

console.log("Starting scraping...");

for (var scrape in scrapes) {
	var item = scrapes[scrape];

	(function(page) {
		var options = {
			method: "GET",
			url: base_url + page.path,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"
			}
		};

		request(options, function(error, response, body) {
			if (error) {
				return console.error("request error", error);
			}

			var path = page.file;
			var file = path.match(/[^\/]+$/)[0];
			path = path.replace(file, "");

			fs.mkdirp("./scraped/" + path, function(err) {
				if (err) {
					return console.error("mkdir error", err);
				}

				fs.writeFile("./scraped/" + path + file, body, function(writeErr) {
					if (writeErr) {
						return console.error("Write error", writeErr);
					}

					console.log("Successfully saved the path " + page.path);
				});
			})

		});
	})(item);
}