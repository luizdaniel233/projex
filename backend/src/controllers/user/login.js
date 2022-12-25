const { verifyJWT } = require("../../guard/auth");
const user = require("../../models/user");
module.exports = (app) => {
  app.post("/login", (req, res) => {
    const { enrollment, password } = req.body;
    const data = { enrollment: enrollment, password: password };
    user.login(data, res);
    // #swagger.tags = ['Login']
    // #swagger.description = 'Auth User'
    // #swagger.security = [{ "bearerAuth": []}]
  });

  app.post("/logout", (req, res) => {
    user.logout(res);
    // #swagger.tags = ['Login']
    // #swagger.description = 'Logout User'
    // #swagger.security = [{ "bearerAuth": []}]
  });

  app.get("/", (req, res) => {
    res.redirect("/swagger");
  });
};
