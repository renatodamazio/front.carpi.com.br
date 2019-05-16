// Libraries
const axios = require('axios');
const chalk = require('chalk');
const cache = require('../db/redis/cache');
const mail = require('../utils/mail/nodemailer');
const Promise = require("bluebird");

module.exports = {

  requestAll: async (requests) => {

    return await Promise.map(requests, async (request, i) => {

      let params = {
        ...request,
        method: 'GET',
        uri: request.url
      }

      return await module.exports.request(params);

    }).then(result => {

      let obj = {};

      if (result) {

        result
          .map((item, i) => obj[requests[i].key] = item);

        return obj;

      }

    });

  },

  request: async (params) => {

    const keyword = params.cache.keyword || params.uri;

    let opts = {
      headers: {
        "Accept": "application/json"
      },
      method: params.method,
      url: params.uri
    }

    if (params.data) opts.data = params.data;
    if (params.auth) opts.headers.authorization = params.auth;
    if (params.cache.enable && process.env.NODE_ENV === 'production') {
      const hasCache = await cache.get(keyword, params);
      if (hasCache) return hasCache;
    }

    return await axios(opts)
      .then(async (response) => {

        const data = response.data;

        if (process.env.NODE_ENV === 'production') {
          const requestErrorKeyword = 'request:error:' + keyword;
          const requestErrorInCache = await cache.get(requestErrorKeyword);

          if (params.cache) await cache.set(keyword, data, params.cache.expireTime);
          if (requestErrorInCache) await cache.delete(requestErrorKeyword);
        }

        return data;

      }).catch(error => {

        if (error.response) {

          const errorObject = {
            error: true,
            status: error.response.status,
            url: opts.url,
            data: error.response.data
          }

          if (process.env.NODE_ENV === 'production') {
            mail.send(params, errorObject);
          }

          return errorObject;

        } else if (error.request) {

          console.log(chalk.white.bgRed.bold(`
              Request error:
              method: ${params.method},
              url: ${params.uri},
              error: ${error.message}
            `));

        } else {

          console.log(chalk.white.bgRed.bold(`
              Something going wrong:
              method: ${params.method},
              url: ${params.uri},
              error: ${error.message}
            `));

        }

      });

  }

}
