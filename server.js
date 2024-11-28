const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

// Use the built-in Express JSON parser instead of body-parser
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      password: hashedPassword,
    };

    users.push(user);
    res.status(201).send();
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const user = users.find((user) => user.name === req.body.name);

    if (user === null) return res.status(400).send("Cannot find User.");

    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).send(`${error}`);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
