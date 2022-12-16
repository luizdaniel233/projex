const { verifyJWT } = require("../../guard/auth");
const user = require("../../models/user");
module.exports = (app) => {
  app.post("/login", (req, res) => {
    const data = { ...req.body };
    user.login(data, res);
  });

  app.get("/", (req, res) => {
    res.status(200).send({ message: "Bem vindo!" });
  });
};
