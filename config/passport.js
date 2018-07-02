const bcrypt = require('bcrypt-nodejs')

const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    database: 'passport_demo',
    username: 'root',
    dialect: 'mysql'
});

const LocalStrategy = require('passport-local').Strategy;

const User = sequelize.import('../app/models/user.js')

User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

User.validPassword = function(password, localpassword) {
    return bcrypt.compareSync(password, localpassword)
}

User.sync();

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            //  Whether we're signing up or connecting an account, we'll need
            //  to know if the email address is in use.

            User.findOne({
                    where: {
                        localemail: email
                    }
                })
                .then(function(existingUser) {

                    // check to see if there's already a user with that email
                    if (existingUser)
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));

                    //  If we're logged in, we're connecting a new local account.
                    if (req.user) {
                        var user = req.user;
                        user.localemail = email;
                        user.localpassword = User.generateHash(password);
                        user.save().catch(function(err) {
                            throw err;
                        }).then(function() {
                            done(null, user);
                        });
                    }
                    //  We're not logged in, so we're creating a brand new user.
                    else {
                        // create the user
                        var newUser = User.build({
                            localemail: email,
                            localpassword: User.generateHash(password)
                        });
                        newUser.save().then(function() {
                            done(null, newUser);
                        }).catch(function(err) {
                            done(null, false, req.flash('loginMessage', err));
                        });
                    }
                })
                .catch(function(e) {
                    console.log('@#%@#$%@#$@ ERROR: ', e)
                    done(null, false, req.flash('loginMessage', e.name + " " + e.message));
                })

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                    where: {
                        localemail: email
                    }
                })
                .then(function(user) {
                    if (!user) {
                        console.log('not user')
                        done(null, false, req.flash('loginMessage', 'Unknown user'));
                    } else if (!User.validPassword(password, user.dataValues.localpassword)) {
                        console.log('Password is: ', password)
                        done(null, false, req.flash('loginMessage', 'Wrong password'));
                    } else if (User.validPassword(password, user.dataValues.localpassword)) {
                        done(null, user);
                        console.log('DONE ', done)
                    }
                })
                .catch(function(e) {
                    console.log('@#$%@#$%@#$% ERROR AGAIN: ', e)
                    done(null, false, req.flash('loginMessage', e.name + " " + e.message));
                });
        }));
};