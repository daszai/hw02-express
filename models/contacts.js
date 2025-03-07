const fs = require("fs/promises");

const listContacts = async () => {
  return await fs
    .readFile("contacts.json")
    .then((data) => JSON.parse(data.toString()))
    .catch((err) => console.log(err.message));
};

const getById = async (contactId) => {
  return await fs
    .readFile("contacts.json")
    .then((data) =>
      JSON.parse(data.toString()).find((element) => {
        return element.id === contactId;
      })
    )
    .catch((err) => console.log(err.message));
};

const removeContact = async (contactId) => {
  let temp2 = false;
  return await fs
    .readFile("contacts.json")
    .then((data) => {
      const temp = JSON.parse(data.toString()).filter((element) => {
        if (!(element.id === contactId)) {
          return true;
        } else {
          temp2 = true;
          return false;
        }
      });
      fs.writeFile("contacts.json", JSON.stringify(temp));
      if (temp2) {
        return { status: 200, message: "contact deleted" };
      }
      return { status: 404, message: "Not found" };
    })
    .catch((err) => console.log(err.message));
};

const addContact = async (body) => {
  const temp = await fs.readFile("contacts.json");
  const temp2 = JSON.parse(temp.toString());
  temp2.push({
    id: body.id,
    name: body.name,
    email: body.email,
    phone: body.phone,
  });
  return await fs.writeFile("contacts.json", JSON.stringify(temp2));
};

const updateContact = async (contactId, body) => {
  let temp2 = false;
  let obj;
  return await fs
    .readFile("contacts.json")
    .then((data) => {
      const temp = JSON.parse(data.toString()).map((element) => {
        if (!(element.id === contactId)) {
          return element;
        } else {
          temp2 = true;
          if (body.name) {
            element.name = body.name;
          }
          if (body.email) {
            element.email = body.email;
          }
          if (body.phone) {
            element.phone = body.phone;
          }
          obj = element;
          return element;
        }
      });
      fs.writeFile("contacts.json", JSON.stringify(temp));
      if (temp2) {
        return { status: 200, message: obj };
      }
      return { status: 404, message: "Not found" };
    })
    .catch((err) => console.log(err.message));
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
