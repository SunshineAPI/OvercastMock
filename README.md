# OvercastMock

OvercastMock is a web scraper written in node.js for downloading web pages from the Overcast Network in order to test the SunshineWeb API against.

## About
Due the Sunshine being based on a 3rd party website, we are unable to make rapid requests to Overcast, which may result in consequences against Sunshine or its developers. Instead, we designed a system to scrape pages from Overcast that are used in Sunshine, and host them on Github Pages. We are able to direct the tests towards the website, and test the API without ever making a request to Overcast, except to update the scraped pages. 

## Installing
0. Run ```npm install```

## Usage
0. Run ```update.sh``` to run the scraper and push results to the mock website.
  * Alternatively run ```node scrape.js``` to only scrape the web pages.

## License
OvercastMock is licensed under the MIT license.