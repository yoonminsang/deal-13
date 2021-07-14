import passport from 'passport';
import db from '../db/index.js';
import Strategy from 'passport-local';
import bcrypt from 'bcrypt';
const LocalStrategy = Strategy.Strategy;

const passportConfig = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize', user.uuid);
    done(null, user.uuid);
  });
  passport.deserializeUser((uuid, done) => {
    db.query(`SELECT uuid, id WHERE uuid=${uuid}`)
      .then((res) => {
        done(null, res[0][0]);
      })
      .error((e) => {
        console.error('deserialize error', e);
      });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      (id, password, done) => {
        console.log('local strategy', id);
        db.query(`SELECT * from users where id=${id})`)
          .then(([userRes]) => {
            const user = userRes && userRes[0];
            if (user) {
              bcrypt.compare(password, user.password).then((bcryRes) => {
                if (bcryRes) return done(null, user);
                return done(null, false);
              });
            }
            return done(null, false);
          })
          .error((e) => {
            console.error('local pasport error', e);
          });
      },
    ),
  );
};
export default passportConfig;
