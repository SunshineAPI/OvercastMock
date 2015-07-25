#!/bin/bash


if ! git remote | grep mock > /dev/null; then
  git remote add mock git@github.com:SunshineAPI/sunshine-mock.github.io.git  
fi

git add scraped/
now=`date '+%m-%d-%Y'`;
mkdir tmp/
git clone git@github.com:SunshineAPI/sunshine-mock.github.io.git tmp/
cp scraped/* tmp/ -rf
cd tmp/
git add *.html
git commit -m "Update scraped pages ${now}"
git push origin gh-pages
cd ..
rm -rf tmp/