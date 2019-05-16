const http = require('./http');

module.exports = {

  request: async (req, res, params) => {

    const response = await http.request(params);

    res.json(response);
    res.end();

  }

}
