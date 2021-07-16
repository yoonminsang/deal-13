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
    const [[user]] = await db.query(
      `SELECT uuid, id FROM users WHERE uuid='${uuid}' LIMIT 1`,
    );
    // console.log(user);
    const [region_list] = await db.query(
      `SELECT region_id FROM region_list WHERE user_id='${user.uuid}'`,
    );
    // console.log(region_list);
    const regionList = region_list.map((v) => v.region_id + '').join(',');
    // console.log(regionList);
    const [regions] = await db.query(
      `SELECT region FROM regions WHERE id IN ('${regionList}')`,
    );
    // console.log(regions);
    user.region = regions.map((v) => v.region);
    // console.log(user);
    // 일단 임시방편...방법 주말에 알아볼것 join
    // const [[user]] = await db.query(
    //   `SELECT uuid, id FROM users WHERE uuid='${uuid}' LIMIT 1`,
    // );
    done(null, user);
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
