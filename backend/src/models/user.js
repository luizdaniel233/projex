require("dotenv").config();
const sea = require("../utils/search");
const pagination = require("../utils/pagination");
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const valide = require("../utils/regEx");
const bcrypt = require("bcrypt");

class User {
  login(data, res) {
    let query = `SELECT * FROM projex.USER WHERE user_enrollment = '${data.enrollment}'`;
    db.query(query, (err, ress) => {
      if (err) res.status(500).send({ message: err });
      else {
        if (ress.length == 0)
          res.status(404).send({ message: "Usuario nao encontrado." });
        else {
          const validate_password = bcrypt.compare(
            data.password,
            ress[0].user_password
          );
          if (data.enrollment == ress[0].user_enrollment) {
            if (validate_password) {
              const token = jwt.sign(
                {
                  user_id: ress[0].user_id,
                  name: ress[0].user_name,
                  enrollment: ress[0].enrollment,
                },
                process.env.secret,
                {
                  expiresIn: 1800,
                }
              );
              res.status(200).send({ auth: true, token: `${token}` });
            } else {
              res.status(400).send({ message: "Dados invalidos!" });
            }
          }
        }
      }
    });
  }

  list(data, res) {
    let query = `SELECT * FROM projex.USER`;
    db.query(query, (err, resultado) => {
      if (err) res.status(500).send({ message: err });
      else {
        resultado.forEach((element) => {
          delete element.password;
        });

        if (+data.search) {
          resultado = sea.searchListUser(data, resultado);
          res
            .status(200)
            .send(pagination.format(resultado, data.page, data.qtd));
        } else {
          res
            .status(200)
            .send(pagination.format(resultado, data.page, data.qtd));
        }
      }
    });
  }

  async create(data, res) {
    let query = ``;
    let list_data = [
      data.name,
      data.password,
      data.confirm_password,
      data.enrollment,
    ];
    if (!list_data.includes("")) {
      if (!valide.validateName(data.name))
        res.status(400).send({ message: "Nome nao atende aos requisitos." });
      else if (!valide.validatePassword(data.password))
        res.status(400).send({ message: "Senha nao atende aos requisitos." });
      else if (
        !valide.validateConfirmPassword(data.password, data.confirm_password)
      )
        res.status(400).send({ message: "As senhas nao estao iguais." });
      else if (!valide.validateEnrollment(data.enrollment))
        res.status(400).send({ message: "Matricula nao atende os requisitos" });
      else {
        query = `SELECT * FROM projex.USER WHERE user_enrollment = '${data.enrollment}'`;
        db.query(query, async (err, ress) => {
          if (err) res.status(500).send({ message: err });
          else {
            if (ress.length == 0) {
              query = `INSERT INTO projex.USER(user_name,user_password,user_enrollment) VALUES ('${valide.capitalizeName(
                data.name
              )}','${await bcrypt.hash(data.password, 10)}','${
                data.enrollment
              }')`;
              db.query(query, (err, resultado) => {
                if (err) res.status(500).send({ message: err });
                else {
                  res
                    .status(201)
                    .send({ message: "Usuario criado com sucesso." });
                }
              });
            } else {
              res.status(400).send({ message: "Matricula ja cadastrada!" });
            }
          }
        });
      }
    } else {
      res.status(400).send({ message: "Preencha todos os campos!" });
    }
  }
}

module.exports = new User();
