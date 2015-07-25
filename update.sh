#!/bin/bash


if ! git remote | grep mock > /dev/null; then
  git remote add mock git@github.com:SunshineAPI/sunshine-mock.github.io.git  
fi

git add scraped/
today=`date '+%Y_%m_%d'`;
git commit -m "Update scraped pages ${today}"
git subtree push --prefix scraped mock gh-pages