import express from 'express';
import {ErrorCodes} from 'common';
import {Prisma, PrismaTypes} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import HTTPStatus from '../Utils/HTTPStatus';

const Router = express.Router();

const authorInclude: PrismaTypes.UserInclude = {
  profilePhoto: true,
  tags: true,
};

const postInclude: PrismaTypes.PostInclude = {
  _count: true,
  medias: true,
  author: {include: authorInclude},
};

const postWithCommentsInclude: PrismaTypes.PostInclude = {
  ...postInclude,
  comments: {
    include: {
      author: {include: authorInclude},
    },
  },
};

Router.get('/', onlyAuthorized, async (req, res) => {
  const posts = await Prisma.post.findMany({include: postInclude});

  res.status(HTTPStatus.OK).send(posts);
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const post = await Prisma.post.findUnique({
    where: {id},
    include: postWithCommentsInclude,
  });

  if (!post) {
    res.status(HTTPStatus.NotFound).send(ErrorCodes.PostNotFound);
    return;
  }

  res.status(HTTPStatus.OK).send(post);
});

Router.get('/user/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const posts = await Prisma.post.findMany({where: {authorId: id}, include: postInclude});

  res.status(HTTPStatus.OK).send(posts);
});

export default Router;
