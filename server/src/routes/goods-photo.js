import express from 'express';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
const router = express.Router();
const __dirname = path.resolve();

dotenv.config();

aws.config.loadFromPath(__dirname + '/src/config/awsconfig.json');
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'deal-13',
    limits: { fileSize: 5 * 1024 * 1024 },
    key: function (req, file, cb) {
      cb(
        null,
        `products/${Date.now().toString()}.${file.originalname
          .split('.')
          .pop()}`,
      );
    },
    acl: 'public-read',
  }),
});

router.post(
  '/',
  upload.fields([{ name: 'file', maxCount: 10 }]),
  function (req, res, next) {
    res.json({
      data: req.files.file.map((file) => file.location),
    });
  },
);

export default router;
