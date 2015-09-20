PATH := ${CURDIR}/node_modules/.bin:${PATH}

.PHONY: build test

install:
	npm install

build:
	webpack --optimize-minimize --output-file=restful.min.js

build-dev:
	webpack --output-file=restful.js

watch:
	webpack -d --watch

test:
	NODE_ENV=test mocha --compilers js:babel/register --colors --reporter=spec --timeout=10000 test/{**,**/**,**/**/**}/*.js
