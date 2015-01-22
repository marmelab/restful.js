.PHONY: build test

install:
	npm install
	bower install

build:
	${CURDIR}/node_modules/.bin/browserify --standalone restful src/restful.js | ${CURDIR}/node_modules/.bin/uglifyjs -c > dist/restful.min.js

watch:
	${CURDIR}/node_modules/.bin/watchify src/restful.js -d --s restful -o dist/restful.js -v

test: build
	CHROME_BIN=`which chromium-browser` ${CURDIR}/node_modules/karma/bin/karma start test/karma.conf.js --single-run
