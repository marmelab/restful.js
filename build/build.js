({
    baseUrl: "../src",
    name: "../bower_components/almond/almond.js",
    include: ['restClient'],
    insertRequire: ['restClient'],
    wrap: {
        startFile: '../build/start.frag',
        endFile: '../build/end.frag'
    },
    out: '../restClient.min.js'
})
