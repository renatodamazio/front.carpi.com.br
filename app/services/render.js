const http = require('./http');

const render = async (req, res, params) => {

  let extension = ".ejs";
  let opts = {
    layout: params.layout ? params.layout : 'site/layout',
    template: params.page,
    title: params.title,
    resp: params.resp,
    description: params.description,
    environment: process.env.NODE_ENV,
    canonical: req.protocol + '://' + req.get('host') + req.originalUrl,
    data: params.data ? params.data : false,
    info: params.info ? params.info : false,
  }

  if (params.uri && !params.data) {

    const data = await http.requestAll(params.uri);
    opts.data = JSON.stringify(data);

  };

  res.render(params.page + extension, opts);

};

module.exports = render;
