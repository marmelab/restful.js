.PHONY: build test

install:
	npm install

build:
	${CURDIR}/node_modules/.bin/webpack --optimize-minimize --output-file=restful.min.js

build-dev:
	${CURDIR}/node_modules/.bin/webpack --output-file=restful.js

watch:
	${CURDIR}/node_modules/.bin/webpack -d --watch

test:
	NODE_ENV=test ${CURDIR}/node_modules/.bin/mocha --compilers js:babel/register --colors --reporter=spec --timeout=10000 test/{**,**/**,**/**/**}/*.js
