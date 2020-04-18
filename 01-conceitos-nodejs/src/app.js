const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', verifyRepoExists);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repo);

  return response.status(201).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { repoIndex, body: { title, url, techs } } = request;

  repositories[repoIndex] = { 
    ...repositories[repoIndex], 
    title, 
    url, 
    techs 
  };

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { repoIndex } = req;

  repositories.splice(repoIndex, 1);

  return res.sendStatus(204);
});

app.post("/repositories/:id/like", verifyRepoExists, (request, response) => {
  const { repoIndex } = request;

  const likes = repositories[repoIndex].likes + 1;

  repositories[repoIndex] = { 
    ...repositories[repoIndex], 
    likes
  };  

  return response.status(201).json(repositories[repoIndex]);
});

function verifyRepoExists(req, res, next) {
  const { id } = req.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if(repoIndex < 0)
    return res.status(400).json({error: 'Repository not found'});

  req.repoIndex = repoIndex;
  return next();
}

module.exports = app;
