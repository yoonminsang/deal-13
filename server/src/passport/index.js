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
  passport.deserializeUser(async (uuid, done) => {
    const [user] = await db.query(
      `select distinct users.uuid, users.id, r.region from region_list list, regions r, users where users.uuid = '${uuid}' and users.uuid = list.user_id and list.region_id = r.id`,
    );
    if (user.length <= 2) {
      const region = user.map((v) => v.region);
      user[0].region = region;
      console.log('deserialize', user[0]);
    } else console.error('deserialize error! too many regions');
    done(null, user[0]);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, done) => {
        try {
          console.log('local strategy', id, password);
          const [[user]] = await db.query(
            `SELECT * FROM users WHERE id='${id}'`,
          );
          if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) return done(null, user);
            return done(null, false);
          }
          return done(null, false);
        } catch (e) {
          console.error('local passport error', e);
        }
      },
    ),
  );
};
export default passportConfig;
