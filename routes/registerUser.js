let AuthenticateResult = require('./../authenticate/Result'),
    db = require('./../db/db')

const login = (req,res) => {
    let response;
    console.log(req.body)
    if(!req.body.username || !req.body.password) {
        response = new AuthenticateResult('fail', null, {'message': "Invalid username or password"});
        res.send(JSON.stringify(response));
    }
    else {
        let dataObj = {
                username: req.body.username,
                password: req.body.password
            },
            success = (result) => {
                console.log('Result is : ', result);
                if (result) {
                    if (result.valid === null) {
                        result = new AuthenticateResult('fail', null, {
                            'message': "Please verify the email ID",
                            'code': '1234'
                        });
                    } else {
                        result = new AuthenticateResult('success', result[0], null);
                    }
                } else {
                    result = new AuthenticateResult('fail', null, {'message': "Wrong credentials"});
                }

                res.success = true
                res.token = result.token
                res.send(JSON.stringify(result));
            },
            error = (error) => {
                response = new AuthenticateResult('fail', null, error);
                res.send(JSON.stringify(response));
            };
        db.login(dataObj, success, error);
    }
};

module.exports = {
    login ,
};