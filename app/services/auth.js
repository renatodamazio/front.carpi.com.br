module.exports = {

  authorizationToken: (req, res) => {

    const token = 'YOUR AUTHORIZATION TOKEN HERE';

    return token ? 'Bearer ' + token : null;

  }

}
