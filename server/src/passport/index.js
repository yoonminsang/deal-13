import passport from 'passport';
import db from '../db/index.js';
import Strategy from 'passport-local';
import bcrypt from 'bcryptjs';
const LocalStrategy = Strategy.Strategy;
const passportConfig = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize', user.id);
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const [user] = await db.query(
      `select distinct user.id, r.region, r.id as region_id from region_list list, region r, user where user.id = '${id}' and user.id = list.user_id and list.region_id = r.id`,
    );
    if (user.length <= 2) {
      const region = user.map((v) => v.region);
      user[0].region = region;
      const region_id = user.map((v) => v.region_id);
      user[0].region_id = region_id;
      console.log('deserialize', user[0]);
    } else console.error('deserialize error! too many region');
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
            `SELECT * FROM user WHERE id='${id}'`,
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
