.PHONY: build test

install:
	npm install
	bower install

build:
	${CURDIR}/node_modules/.bin/webpack --optimize-minimize --output-file=restful.min.js

watch:
	${CURDIR}/node_modules/.bin/webpack --watch

test: build
	CHROME_BIN=`which chromium-browser` ${CURDIR}/node_modules/karma/bin/karma start test/karma.conf.js --single-run
