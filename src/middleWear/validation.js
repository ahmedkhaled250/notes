const dataMethod = ["body", "params", "query", "headers"];

export const validation = (Schema, redirectPath = "/auth/signin") => {
  return (req, res, next) => {
    const validationErrArr = [];
    dataMethod.forEach((key) => {
      if (Schema[key]) {
        const validationResult = Schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult?.error) {
          for (const detail of validationResult.error.details) {
            validationErrArr.push(detail.context.label);
          }
        }
      }
    });
    if (validationErrArr.length) {
      req.flash("validationErr", validationErrArr);
      console.log(validationErrArr);
      req.flash("oldInput", req.body);
      res.redirect(`/api/v1${redirectPath}`);
      //   res.status(400).json({ message: "Validation error", validationErrArr });
    } else {
      next();
    }
  };
};
