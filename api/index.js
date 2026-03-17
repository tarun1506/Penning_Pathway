import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT) || 8080;


// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// add your endpoints below this line

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });
    const generalTag = await prisma.tagDetail.create({
      data: {
        tagName: "General",
        userId: newUser.id,
      },
    });

    res.json(newUser);
  }
});

app.get("/tags", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const tags = await prisma.tagDetail.findMany({
    where: {
      userId: user.id,
    },
  });
  res.json(tags);
});

app.post("/tags", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const { tagName } = req.body;

  const tag = await prisma.tagDetail.create({
    data: {
      tagName: tagName,
      userId: user.id,
    },
  });

  res.json(tag);
});

app.get("/journals", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const journals = await prisma.journalList.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tagDetail: true,
    },
  });
  res.json(journals);
});

app.post("/journals", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const { title, content, tagId } = req.body;

  const journal = await prisma.journalList.create({
    data: {
      title,
      content,
      tagDetailId: +tagId,
      userId: user.id,
    },
  });

  res.json(journal);
});

app.delete("/journals/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const { id } = req.params;

  const journal = await prisma.journalList.delete({
    where: {
      id: +id,
    },
  });

  res.json(journal);
});

app.get("/journals/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const { id } = req.params;
  console.log("id", id);

  const journal = await prisma.journalList.findUnique({
    where: {
      id: +id,
    },
    include: {
      tagDetail: true,
    },
  });

  res.json(journal);
});

app.put("/journals/:journalsId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const { journalsId } = req.params;
  const { tagDetailId, content } = req.body;
  const journal = await prisma.journalList.update({
    where: {
      id: +journalsId,
    },
    data: {
      tagDetail: { connect: { id: +tagDetailId } },
      content,
      updatedAt: new Date(),
    },
  });

  res.json(journal);
});

app.put("/journal/:journalId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const { journalId } = req.params;
  const { title, tagId } = req.body;

  const journal = await prisma.journalList.update({
    where: {
      id: +journalId,
    },
    data: {
      title,
      tagDetail: { connect: { id: +tagId } },
      updatedAt: new Date(),
    },
  });

  res.json(journal);
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT} 🎉 🚀");
});
