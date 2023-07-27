import multer from "multer";

export const fileValidation = {
  image: ["image/jpeg", "image/jif", "image/png"],
  pdf: ["application/pdf"],
};
export const HME = (customPath) => {
  return (err, req, res, next) => {
    if (err) {
      req.flash("MulterErr", err);
      res.redirect(customPath);
    } else {
      next();
    }
  };
};
export function myMulter(customValidation) {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (!customValidation.includes(file.mimetype)) {
      cb("In-valid Format", false);
    } else {
      cb(null, true);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}