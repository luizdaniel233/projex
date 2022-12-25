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
          res.status(404).send({ message: "Usuário não encontrado." });
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

  listA(data, res) {
    let query = `SELECT * FROM projex.USER WHERE user_status = 1 `;
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

  listD(data, res) {
    let query = `SELECT * FROM projex.USER WHERE user_status = 0`;
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
              query = `INSERT INTO projex.USER(user_name,user_password,user_enrollment,user_status) VALUES ('${valide.capitalizeName(
                data.name
              )}','${await bcrypt.hash(data.password, 10)}','${
                data.enrollment
              }',1)`;
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

  edit(data, res) {
    let query = `SELECT * FROM projex.USER WHERE user_id = ${data.id} AND user_status = 1`;
    db.query(query, (err, ressult) => {
      if (err) res.status(500).send({ message: err });
      else {
        if (ressult.length == 0)
          res
            .status(404)
            .send({
              message: "Usuário não encontrado ou ele se encontra desativado!",
            });
        else if (!valide.validateName(data.name))
          res.status(400).send({ message: "Nome nao atende aos requisitos." });
        else if (!valide.validateEnrollment(data.enrollment))
          res
            .status(400)
            .send({ message: "Matricula nao atende os requisitos" });
        else {
          db.query(query, (err, ress) => {
            if (err) res.status(500).send({ message: err });
            else {
              if (
                ress.length != 0 &&
                ress[0].user_enrollment != data.enrollment
              ) {
                res.status(400).send({ message: "Matrícula ja utilizada." });
              } else {
                query = `UPDATE projex.USER SET user_name ='${data.name}',user_enrollment = '${data.enrollment}' WHERE user_id = ${data.id} `;
                db.query(query, (error) => {
                  if (error) res.status(400).send({ message: error });
                  else res.status(200).send({ message: "Usuário editado!" });
                });
              }
            }
          });
        }
      }
    });
  }

  activate(data, res) {
    let query = `SELECT * FROM projex.USER WHERE user_id = ${data.user_id}`;
    db.query(query, (err, resultado) => {
      if (err) res.status(500).send({ message: err });
      else {
        if (resultado.length == 0)
          res.status(404).send({ message: "Usuário não encontrado!" });
        else {
          query = ` UPDATE projex.USER SET user_status = 1 WHERE user_id = ${data.user_id}`;
          db.query(query, (err) => {
            if (err) res.status(500).send({ message: err });
            else res.status(200).send({ message: "Usuário editado!" });
          });
        }
      }
    });
  }

  deactivate(data, res) {
    let query = `SELECT * FROM projex.USER WHERE user_id = ${data.user_id}`;
    db.query(query, (err, resultado) => {
      if (err) res.status(500).send({ message: err });
      else {
        if (resultado.length == 0)
          res.status(404).send({ message: "Usuário não encontrado!" });
        else {
          query = ` UPDATE projex.USER SET user_status = 0 WHERE user_id = ${data.user_id}`;
          db.query(query, (err) => {
            if (err) res.status(500).send({ message: err });
            else res.status(200).send({ message: "Usuário editado!" });
          });
        }
      }
    });
  }

  logout(res) {
    res.status(200).send({ auth: false, token: false });
  }
}

module.exports = new User();
