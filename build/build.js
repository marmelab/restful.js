({
    baseUrl: "../src",
    name: "../bower_components/almond/almond.js",
    include: ['restful'],
    insertRequire: ['restful'],
    wrap: {
        startFile: '../build/start.frag',
        endFile: '../build/end.frag'
    },
    out: '../restful.min.js'
})
