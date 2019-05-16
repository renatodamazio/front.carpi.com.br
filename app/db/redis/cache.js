const client = require('./connection').connection();
const { parse, stringify } = require('flatted/cjs');

module.exports = {

  get: async (keyword, request) => {
    return await client
      .getAsync(keyword)
      .then(async (response) => {

        if (request) module.exports.update(keyword, request);

        return response ? JSON.parse(response) : false;

      })
      .catch((err) => err)

  },

  set: (keyword, data, expireTime = 2000) => {

    client.set(keyword, JSON.stringify(data));
    client.expire(keyword, expireTime);

    return true;

  },

  info: () => {
    return client.server_info;
  },

  update: async (keyword, request) => {

    setTimeout(async () => {

      let intervalObject = {};

      const http = require('./../../services/http');
      const params = {
        ...request
      }

      params.cache.enable = false;

      if (request.cache.watch) {

        const watchTime = request.cache.watchTime || 3600;

        client
          .getAsync('cache:watch')
          .then(async (response) => {

            let routes = response ? parse(response) : [];
            let founded = false;

            for (let i = 0; i < routes.length; i++) {

              const route = routes[i];

              if (route.cache) {

                if (route.cache.keyword == keyword || route.uri == keyword) {

                  founded = true;
                  break;

                }

              }

            }

            if (!founded) {

              routes.push(request);
              client.set('cache:watch', stringify(routes));

              intervalObject[keyword] = setInterval(async () => {

                const data = await http.request(params);

                if (data && data.error) {

                  clearInterval(intervalObject[keyword]);
                  delete intervalObject[keyword];

                  module.exports.delete(keyword);

                }

              }, watchTime);

            }

          });

      } else {

        const data = await http.request(params);

        if (data && data.error) {

          module.exports.delete(keyword);

        }

      }

    }, 5000 + Math.floor(Math.random() * 1000));

  },

  delete: (keyword) => {

    return client.del(keyword, (err, response) => {
      return response == 1 ? true : false;
    });

  }

}
