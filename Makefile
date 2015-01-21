.PHONY: build test

install:
	npm install
	bower install

build:
	cd build && ${CURDIR}/node_modules/.bin/r.js -o build.js

test: build
	CHROME_BIN=`which chromium-browser` ${CURDIR}/node_modules/karma/bin/karma start test/karma.conf.js --single-run
