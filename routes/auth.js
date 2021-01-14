var express = require('express');
var bcrypt = require("bcrypt-inzi");
var jwt = require('jsonwebtoken');
var { SERVER_SECRET } = require("../core/index");
var postmark = require("postmark");


var client = new postmark.Client("a3dadb6c-af11-47f8-9c86-6a7ca7c965c5");



var { userModel, otpModel } = require("../dbrepo/modles");
console.log("userModel", userModel);

var api = express.Router();

api.post('/signup', (req, res, next) => {

    if (!req.body.name
        || !req.body.email
        || !req.body.phone
        || !req.body.password) {
        res.status(403).send(`
        please send complete information
        e.g:
        {
            "name": "xyz",
            "email": "xyz@gmail.com",
            "password": "1234",
            "phone": "01312314",
        }`);
        return
    };



    userModel.findOne({ email: req.body.email }, function (err, data) {



        if (err) {
            console.log(err)
        } else if (!data) {

            bcrypt.stringToHash(req.body.userPassword).then(function (HashPassword) {
                var newUaser = new userModel({
                    "name": req.body.name,
                    "email": req.body.email,
                    "phone": req.body.phone,
                    "password": HashPassword,
                });

                newUaser.save((err, data) => {
                    if (!err) {
                        res.status(200).send({
                            message: "User created"
                        })
                    } else {
                        console.log(err)
                        res.status(403).send({
                            message: "user already exist"
                        })
                    };

                });

            })


        } else if (err) {
            res.status(500).send({
                message: "db error"
            })
        } else {

            res.status(403).send({
                message: "User already exist"
            })
        }
    })


});

api.post("/login", (req, res, next) => {

    console.log(req.body.email)
    console.log(req.body.password)

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
            please send email and passwod in json body.
            e.g:
            {
                "email": "malikasinger@gmail.com",
                "password": "abc",
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {

            if (err) {
                res.status(500).send({
                    message: 'an errer occured'
                })
                console.log(err)
            } else if (user) {

                console.log(user)

                bcrypt.varifyHash(req.body.password, user.password).then(match => {

                    if (match) {
                        console.log("matched")
                        var token = jwt.sign({
                            email: user.name,
                            email: user.email,
                            id: user.id,
                            ip: req.connection.remoteAddress

                        }, SERVER_SECRET);

                        res.cookie('jToken', token, {
                            maxAge: 86_400_000,
                            httpOnly: true
                        });

                        res.status(200).send({
                            message: "login success",

                            user: {
                                name: user.name,
                                email: user.email,
                                phone: user.phone
                            }
                        });

                    } else {
                        console.log('not matched')
                        res.status(404).send({
                            message: "Incorrect password"
                        })
                    }
                }).catch(e => {
                    console.log("errer : ", e)
                })

            } else {
                res.send({
                    message: "User not found",
                    status: 403
                })
            }

        })

});

api.post("/logout", (req, res, next) => {

    res.cookie('jToken', "", {
        maxAge: 86_400_000,
        httpOnly: true
    });

    res.send("logout success");
});

api.patch("/forget-password", (req, res, next) => {
    if (!req.body.email) {
        res.status(403).send(`
        pleas send email in json body
        e.g
        {
            "emai":"xyz@gmai.com"
        }
        
        `);

        return;
    }



    userModel.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            res.status(403).send({
                message: "an arror : " + JSON.stringify(err)
            });
        } else if (user) {
            const otp = math.floor(getRandomArbitrary(11111, 99999))
            otpModel.create({
                email: req.body.email,
                otpCode: otp
            }).then((doc) => {

                client.sendEmail({
                    "From": "zubair_student@sysborg.com",
                    "To": req.body.email,
                    "Subject": "reset your password",
                    "TextBody": `here is your reset password code ${otp}`,
                }).then((status) => {
                    console.log(status)
                    res.send("email sent with otp")
                });
            }).catch((err) => {
                console.log("error in creatin otp ", err)
                res.status(500).send("unexpected error")
            });

        } else {
            res.status(403).send({
                message: "user not found"
            });
        }
    });
});

api.patch("/forget-password-step-2", (req, res, next) => {
    if (!req.body.email && !req.body.otp && !req.body.password) {
        res.status(403).send(`
        pleas send email in json body
        e.g
        {
            "emai":"xyz@gmai.com"
            "otp":"xxxx"
            "password":"xxxxx"
        }     
        `);

        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(403).send({
                    message: "an arror : " + JSON.stringify(err)
                });
            } else if (user) {

                otpModel.findOne({ email: req.body.email },
                    function (err, otpData) {
                        if (err) {
                            res.status(500).send({
                                message: "an error occured: " + JSON.stringify(err)
                            });
                        } else if (otpData) {

                            otpData = otpData[otpData.length - 1]
                            console.log("otpData", otpData)
                            const now = new Date().getTime();
                            const optiat = new Date(otpData.createdOn).getTime();
                            const diff = now - optiat

                            console.log("diff", diff)
                            if (otpData.otpCode === req.body.otp && diff < 300000) {
                                otpData.remove();
                                bcrypt.stringToHash(req.body.password).then(function (hash) {
                                    user.update({ password: hash }, {}, function (err, data) {
                                        res.send("reset your password")
                                    });
                                });
                            } else {
                                res.status(401).send({
                                    message: "incorrect otp"
                                });
                            }

                        } else {
                            res.status(401).send({
                                message: "incorrect otp"
                            });
                        }
                    });
            }
             else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        });
});



module.exports = api

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
} 