const { stat } = require("fs");
const { verifyJWT } = require("../../guard/auth");
const user = require("../../models/user");
module.exports = (app) => {
  app.post("/create/user", verifyJWT, (req, res) => {
    const { name, password, confirm_password, enrollment } = req.body;
    const data = {
      name: name,
      password: password,
      confirm_password: confirm_password,
      enrollment: enrollment,
    };
    user.create(data, res);
    // #swagger.tags = ['User']
    // #swagger.description = 'Criar usuário'
    // #swagger.security = [{ "bearerAuth": []}]
  });

  app.put("/edit/user", verifyJWT, (req, res) => {
    const { id } = req.query;
    const { name, enrollment } = req.body;
    const data = {
      id: id,
      name: name,
      enrollment: enrollment,
    };
    user.edit(data, res);
    // #swagger.tags = ['User']
    // #swagger.description = 'Editar usuário'
    // #swagger.security = [{ "bearerAuth": []}]
  });

  app.patch("/status/user", verifyJWT, (req, res) => {
    const { status, user_id } = req.query;
    const data = {
      status: status,
      user_id: user_id,
    };
    if (status == "activate") {
      user.activate(data, res);
    } else if (status == "deactivate") {
      user.deactivate(data, res);
    }
    // #swagger.tags = ['User']
    // #swagger.description = 'Editar status do usuário'
    // #swagger.security = [{ "bearerAuth": []}]
  });

  app.get("/user/activate", verifyJWT, (req, res) => {
    const { page, qtd, search } = req.query;
    const data = { page: page, qtd: qtd, search: search };
    user.listA(data, res);
    // #swagger.tags = ['User']
    // #swagger.description = 'Listar usuários ativados'
    // #swagger.security = [{ "bearerAuth": []}]
  });

  app.get("/user/deactivate", verifyJWT, (req, res) => {
    const { page, qtd, search } = req.query;
    const data = { page: page, qtd: qtd, search: search };
    user.listD(data, res);
    // #swagger.tags = ['User']
    // #swagger.description = 'Listar usuários desativados'
    // #swagger.security = [{ "bearerAuth": []}]
  });
};
