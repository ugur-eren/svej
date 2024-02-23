import express from 'express';
import {ErrorCodes, HTTPStatus, Zod} from 'common';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/post/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comments = await Prisma.comment.findMany({
    where: {post: {id}},
    include: PrismaIncludes.Comment(res.locals.user.id),
  });

  res.status(HTTPStatus.OK).send(comments);
});

Router.use('/:id', async (req, res, next) => {
  const {id} = req.params;

  const comment = await Prisma.comment.findUnique({where: {id}, select: {id: true}});

  if (!comment) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.CommentNotFound});
    return;
  }

  next();
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comment = await Prisma.comment.findUnique({
    where: {id},
    include: PrismaIncludes.Comment(res.locals.user.id),
  });

  res.status(HTTPStatus.OK).send(comment);
});

Router.get('/:id/reactions', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comment = await Prisma.comment.findUnique({
    where: {id},
    select: {
      _count: {
        select: {
          likes: true,
          dislikes: true,
        },
      },
    },
  });

  res.status(HTTPStatus.OK).send(comment?._count);
});

Router.post('/:id/reactions/:type(like|dislike|remove)', onlyAuthorized, async (req, res) => {
  const {id, type} = req.params as {id: string; type: 'like' | 'dislike' | 'remove'};

  if (type === 'remove') {
    const post = await Prisma.comment.update({
      where: {
        id,
      },
      data: {
        likes: {disconnect: {id: res.locals.user.id}},
        dislikes: {disconnect: {id: res.locals.user.id}},
      },
    });

    res.status(HTTPStatus.OK).send(post);
    return;
  }

  const comment = await Prisma.comment.update({
    where: {
      id,
    },
    data: {
      likes:
        type === 'like'
          ? {connect: {id: res.locals.user.id}}
          : {disconnect: {id: res.locals.user.id}},

      dislikes:
        type === 'dislike'
          ? {connect: {id: res.locals.user.id}}
          : {disconnect: {id: res.locals.user.id}},
    },
  });

  res.status(HTTPStatus.OK).send(comment);
});

Router.put('/', onlyAuthorized, async (req, res) => {
  const body = Zod.Comment.Create.safeParse(req.body);

  if (!body.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
    return;
  }

  const comment = await Prisma.comment.create({
    data: {
      post: {connect: {id: body.data.postId}},
      author: {connect: {id: res.locals.user.id}},
      text: body.data.text,
    },
  });

  res.status(HTTPStatus.OK).send(comment);
});

export default Router;
