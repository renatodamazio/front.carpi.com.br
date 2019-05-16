const nodemailer = require('nodemailer');
const cache = require('../../db/redis/cache');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

module.exports = {

  send: async (request, error) => {

    setTimeout(async () => {

      if (process.env.MAIL_SENDER === 'null' || process.env.MAIL_SENDER_PW === 'null') {

        console.log(logSymbols.error, chalk.red('Não é possível enviar o e-mail pois o remetente (MAIL_SENDER) não foi configurado. Acesse config/.env e configure-o.'));
        return false;

      } else if (process.env.MAIL_RECEIVER === 'null') {

        console.log(logSymbols.error, chalk.red('Não é possível enviar o e-mail pois o destinatário (MAIL_RECEIVER) não foi configurado. Acesse config/.env e configure-o.'));
        return false;

      }

      const keyword = request.cache.keyword || request.uri;

      const cacheKeyword = 'request:error:' + keyword;
      const errorAlreadyOccur = await cache.get(cacheKeyword);
      const dateTime = new Date().toLocaleString();
      const date = dateTime.split(' ')[0].split('/').reverse().join('/');
      const time = dateTime.split(' ')[1];
      const subject = `Ocorreu um erro no site: ${request.req ? request.req.hostname : 'Site não especificado'}`;
      const text = `Ocorreu um erro com o status code
        <span style="font-weight: bold;">${error.status}</span>
        ao realizar chamada para
        <span style="font-weight: bold; color: #636363 !important;">${request.uri}.</span>
        Segue o erro detalhado abaixo:
        <br><br>
        <span style="color: red">${JSON.stringify(error.data)}</span>
        <br><br>`;

      if (!errorAlreadyOccur) {

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAIL_SENDER,
            pass: process.env.MAIL_SENDER_PW
          },
          tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
          from: process.env.MAIL_SENDER,
          to: process.env.MAIL_RECEIVER,
          subject: subject,
          html: `
            <p style="color: #636363; font-size: 14px;">${text}</p>
            <p style="font-size: 12px; color: #636363;">E-mail enviado no dia ${date} às ${time}</p>
            <div dir="ltr" class="m_1823361960575511154gmail_signature" data-smartmail="gmail_signature"><div dir="ltr"><table border="0" style="font-size:12px;font-family:Times"><tbody><tr><td><p style="font-family:Helvetica,Arial,sans-serif;font-size:10px;line-height:12px;margin-bottom:10px"><a href="http://www.owinteractive.com/" style="color:rgb(17,85,204)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.owinteractive.com/&amp;source=gmail&amp;ust=1553348578754000&amp;usg=AFQjCNH6SLL6l6pdhcvcCm6EuDHjMZdWqQ"><img src="https://ci5.googleusercontent.com/proxy/tSfduS6FlMwDW44xioOJdVWEBNiMXm8wBNdnK-evrQ5L0DgVhPF9aoAjmG_gJyPBcPqlgfVURORtd8hOwnWoeqK51deGTtLjMa_ir7lsD9o0Thgy9mrwhqLoIA=s0-d-e1-ft#http://www.owinteractive.com/email/signature-email/logo-ow-signature.gif" alt="OW Interactive" border="0" class="CToWUd"></a></p></td><td><p style="font-family:Helvetica,Arial,sans-serif;color:rgb(33,33,33)"><span style="font-weight:bold">&nbsp;Front-end</span><br>&nbsp;Monitor&nbsp;<span style="color:rgb(255,0,0)"></span><br><span style="color:rgb(255,0,0)">&nbsp;–</span></p></td></tr><tr><td colspan="2"><p style="font-family:Helvetica,Arial,sans-serif;font-size:10px;line-height:5px;margin-bottom:10px"><br></p></td></tr></tbody></table></div></div>
            `
        };

        transporter.sendMail(mailOptions, async function (_error, info) {

          if (_error) {

            console.log(logSymbols.error, chalk.red('Dispatch e-mail error: ' + _error));

          } else {

            console.log(logSymbols.success, chalk.green('Dispatch e-mail success: ' + info.response));

            await cache.set(cacheKeyword, {
              'url' : error.url,
              'data' : error.data,
              'status' : error.status,
              'date' : date,
              'time' : time
            }, 172800);

          }

        });

      }

    }, 500);

  }

}
