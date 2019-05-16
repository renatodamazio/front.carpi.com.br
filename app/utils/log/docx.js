const client = require('../../db/redis/connection').connection();
const docx = require('docx');
const fs = require('fs');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

module.exports = {

  init: () => {

    const doc = new docx.Document();

    doc.Styles.createParagraphStyle("Heading1", "Heading 1")
      .basedOn("Normal")
      .next("Normal")
      .quickFormat()
      .font("Arial")
      .size(28)
      .bold()
      .color("000000")
      .spacing({ line: 340 })

    return doc;

  },

  generate: async () => {

    return new Promise((resolve, reject) => {

      let packer = new docx.Packer();
      let errors = [];

      client.keys('*', (err, keys) => {

        if (err) return console.log('get all keys from cache error: ', err);

        if (keys) {

          keys.forEach((keyword, i) => {

            client.ttl(keyword, (err, expireTime) => {

              client
                .getAsync(keyword)
                .then(response => {

                  if (keyword.match(/request:error:/)) {
                    errors.push({
                      'key': keyword,
                      'value': response,
                      'expire': expireTime
                    });
                  }

                  if (i === keys.length - 1) {

                    const doc = module.exports.init();
                    const dateNow = new Date().toLocaleString().split(' ');
                    const date = dateNow[0].split('-').reverse().join('-');
                    const time = dateNow[1];
                    const dateTime = date + ' às ' + time;
                    const title = new docx.Paragraph('Relatório de erros gerado em ' + dateTime).heading1().addRun(new docx.TextRun().break());

                    doc.addParagraph(title);

                    errors.forEach(function (key, index) {

                      const keys = JSON.parse(key.value);
                      const content = new docx.Paragraph();

                      if (index === 0) {
                        content.addRun(
                          new docx.TextRun('__________________________________________________________________________________________')
                        )
                      }

                      content.addRun(
                        new docx.TextRun()
                          .break()
                          .break()
                      )

                      content.addRun(
                        new docx.TextRun('Keyword (ID): ')
                          .font("Arial")
                          .size(24)
                          .bold()
                          .break()
                      );

                      content.addRun(
                        new docx.TextRun(key.key)
                          .font("Arial")
                          .size(24)
                      );

                      content.addRun(
                        new docx.TextRun('URL: ')
                          .font("Arial")
                          .size(24)
                          .bold()
                          .break()
                      );

                      content.addRun(
                        new docx.TextRun(keys.url)
                          .font("Arial")
                          .size(24)
                      );

                      content.addRun(
                        new docx.TextRun('Date: ')
                          .font("Arial")
                          .size(24)
                          .bold()
                          .break()
                      );

                      content.addRun(
                        new docx.TextRun(keys.date + ' as ' + keys.time)
                          .font("Arial")
                          .size(24)
                      );

                      content.addRun(
                        new docx.TextRun('Status: ')
                          .font("Arial")
                          .size(24)
                          .bold()
                          .break()
                      );

                      content.addRun(
                        new docx.TextRun(keys.status)
                          .font("Arial")
                          .size(24)
                      );

                      content.addRun(
                        new docx.TextRun('Message: ')
                          .font("Arial")
                          .size(24)
                          .bold()
                          .break()
                      )

                      content.addRun(
                        new docx.TextRun(JSON.stringify(keys.data))
                          .font("Arial")
                          .size(24)
                      );

                      content.addRun(
                        new docx.TextRun('Timestamp: ')
                          .font("Arial")
                          .size(24)
                          .bold()
                          .break()
                      )

                      content.addRun(
                        new docx.TextRun(Date.now())
                          .font("Arial")
                          .size(24)
                      );

                      content.addRun(
                        new docx.TextRun()
                          .break()
                      )

                      content.addRun(
                        new docx.TextRun('__________________________________________________________________________________________')
                      )

                      doc.addParagraph(content);

                    });

                    packer
                      .toBuffer(doc)
                      .then(buffer => {

                        const fileName = `log-error-${date + '_' + time}.docx`;

                        fs.writeFileSync(`./dist/logs/${fileName}`, buffer);

                        resolve({
                          status: 200,
                          file: {
                            buffer: buffer,
                            name: fileName
                          },
                          message: 'Relatório gerado com sucesso!'
                        });

                      }).catch(err => {

                        console.log(logSymbols.error, chalk.red('Log generate error: ' + err));

                        return reject(new Error({
                          status: 500,
                          data: err,
                          message: 'Erro ao salvar o relatório!'
                        }));

                      });

                  }

                }).catch((err) => {

                  console.log(logSymbols.error, chalk.red('Error in get key from redis: ' + err));

                  return reject(new Error({
                    status: 500,
                    data: err,
                    message: 'Erro ao salvar o relatório!'
                  }));

                });

            });

          });

        }

      });

    });

  }

}
