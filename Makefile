PATH := ${CURDIR}/node_modules/.bin:${PATH}

.PHONY: build es5 test

install:
	npm install
	npm install whatwg-fetch
	npm install request

build:
	NODE_ENV=production webpack

build-dev:
	webpack

es5:
	${CURDIR}/node_modules/.bin/babel --out-dir=dist/es5 --stage=0 src

watch:
	webpack -d --watch

test:
	NODE_ENV=test mocha --compilers js:babel/register --colors --reporter=spec --timeout=10000 test/{**,**/**,**/**/**}/*.js
