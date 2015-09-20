PATH := ${CURDIR}/node_modules/.bin:${PATH}

.PHONY: build test

install:
	npm install

build:
	webpack

watch:
	webpack -d --watch

test:
	NODE_ENV=test mocha --compilers js:babel/register --colors --reporter=spec --timeout=10000 test/{**,**/**,**/**/**}/*.js
