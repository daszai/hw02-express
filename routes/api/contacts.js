const express = require("express");
const router = express.Router();
const func = require("../../models/contacts");
const id = require("uniqid");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  name: Joi.string().alphanum(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

router.get("/", async (req, res, next) => {
  const temp = await func.listContacts();
  res.status(200).json(temp);
});

router.get("/:id", async (req, res, next) => {
  const temp = await func.getById(req.params.id);
  if (temp) {
    res.status(200).json(temp);
  } else res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const error3 = schema.validate({ email: email });
  const error2 = schema.validate({ phone: phone });
  const error1 = schema.validate({ name: name });
  if (!error1.error && !error2.error && !error3.error) {
    if (name && email && phone) {
      req.body.id = id();
      await func.addContact(req.body);
      res.status(201).json({ id: req.body.id, name, email, phone });
    } else {
      res.status(400).json({ message: "missing required name - field" });
    }
  } else {
    if (error1.error) res.status(400).json(error1.error);
    if (error2.error) res.status(400).json(error2.error);
    if (error3.error) res.status(400).json(error3.error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const temp = await func.removeContact(req.params.id);
  res.status(temp.status).json({ message: temp.message });
});

router.put("/:id", async (req, res, next) => {
  const { name, email, phone } = req.body;
  let error3 = { error: undefined };
  let error2 = { error: undefined };
  let error1 = { error: undefined };
  console.log(phone);
  if (email !== undefined) error3 = schema.validate({ email: email });
  if (phone !== undefined) error2 = schema.validate({ phone: phone });
  if (name !== undefined) error1 = schema.validate({ name: name });

  if (!error1.error && !error2.error && !error3.error) {
    if (name || email || phone) {
      const { message, status } = await func.updateContact(
        req.params.id,
        req.body
      );
      if (message === "Not found")
        res.status(status).json({ message: message });
      else
        res.status(status).json({
          id: message.id,
          name: message.name,
          email: message.email,
          phone: message.phone,
        });
    } else {
      res.status(400).json({ message: "missing fields" });
    }
  } else {
    if (error1.error) res.status(400).json(error1.error);
    if (error2.error) res.status(400).json(error2.error);
    if (error3.error) res.status(400).json(error3.error);
  }
});

module.exports = router;
