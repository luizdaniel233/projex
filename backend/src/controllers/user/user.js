const { verifyJWT } = require("../../guard/auth");
const user = require("../../models/user");
module.exports = (app) => {
  app.post("/create/user", verifyJWT,(req, res) => {
    const { name, password, confirm_password, enrollment } = req.body;
    const data = {
      "name": name,
      "password": password,
      "confirm_password": confirm_password,
      "enrollment": enrollment,
    };
    user.create(data, res);
  });

  app.get("/user",verifyJWT,(req,res) => {
    const query = require("url").parse(req.url,true).query;
    const data = {...query}
    user.list(data,res);
  })
};
