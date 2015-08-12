.PHONY: build test

install:
	npm install
	bower install

build: jshint
	${CURDIR}/node_modules/.bin/webpack --output-file=restful.js
	${CURDIR}/node_modules/.bin/webpack --optimize-minimize --output-file=restful.min.js

watch:
	${CURDIR}/node_modules/.bin/webpack --watch

jshint:
	./node_modules/jshint/bin/jshint src/**/*.js
	./node_modules/jshint/bin/jshint test/**/*.js

test: build
	CHROME_BIN=`which chromium-browser` ${CURDIR}/node_modules/karma/bin/karma start test/karma.conf.js --single-run
