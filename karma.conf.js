// Karma configuration
// Generated on Sun Jul 31 2016 18:14:21 GMT+0800 (CST)

module.exports = function(config) {
    var customLaunchers = {
        // the cool kids
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7'
        },
        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox'
        },
        sl_mac_safari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.10'
        },
        // ie family
        sl_ie_8: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '8'
        },
        sl_ie_9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },
        sl_ie_10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8',
            version: '10'
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },
        // mobile
        sl_ios_safari: {
            base: 'SauceLabs',
            browserName: 'iphone',
            platform: 'OS X 10.9',
            version: '8.1'
        },
        sl_android: {
            base: 'SauceLabs',
            browserName: 'android',
            platform: 'Linux',
            version: '4.2'
        }
    };

    if (!process.env.SAUCE_USERNAME) {
        process.env.SAUCE_USERNAME = 'leolin';
        process.env.SAUCE_ACCESS_KEY = '2d69d455-a8ff-45bd-8a93-5ba373ddf6a3';
    }

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        client: {
            mocha: {
                timeout: 6000
            }
        },

        // mobile emulators are really slow
        captureTimeout: 300000,
        browserNoActivityTimeout: 300000,

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            'test/**/*.test.js'
        ],


        // list of files to exclude
        exclude: [
            '**/*.swp'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.test.js': ['webpack']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['coverage', 'mocha', 'saucelabs'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        sauceLabs: {
            testName: 'bugReport unit tests',
            public: 'public',
            startConnect : false
        },

        customLaunchers: customLaunchers,

        browsers: Object.keys(customLaunchers),

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity

        // customLaunchers: {
        //     Chrome_travis_ci: {
        //         base: 'Chrome',
        //         flags: ['--no-sandbox']
        //     }
        // }
    });

    // if(process.env.TRAVIS){
    //     config.browsers = ['Chrome_travis_ci'];
    // }
}
