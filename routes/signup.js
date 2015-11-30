var crypto = require('crypto');

exports.index = function (req, res) {
    res.render('signup', {title: req.gf.titleString});
};

exports.create = function (req, res) {
    req.gf.User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, user) {
        if (!err) {
            if (!user) {
                console.log('SUCCESS -> No User found');

                var new_user = new req.gf.User({
                    username: req.body.username,
                    email: req.body.email,
                    password: crypto.createHash('sha1').update(req.body.password).digest('hex')
                });

                new_user.save(function (err) {
                    if (err) {
                        res.render('signup', {title: req.gf.titleString, result: 'save_error'});
                    } else {
                        res.render('signup', {title: req.gf.titleString, result: 'success'});
                    }
                });

            } else {
                console.log('FAILURE -> User already existing!');
                res.render('signup', {title: req.gf.titleString, result: 'user_existing'});
            }
        } else {
            res.render('signup', {title: req.gf.titleString, result: 'server_error'});
        }
    });
};
