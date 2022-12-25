require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger_out.json");
const login = require("./controllers/user/login");
const user = require("./controllers/user/user");
const db = require("./database/db");
const { app } = require("./config/index");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/", login);
app.use("/", user);

db.connect((erro) => {
  if (erro) {
    console.log(erro);
  } else {
    console.log("Database connected!");
    app.listen(process.env.port_application, () =>
      console.log(`Port ${process.env.port_application} available!`)
    );
  }
});
