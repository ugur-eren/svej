import express from 'express';
import {Config, ErrorCodes, HTTPStatus} from 'common';
import {z} from 'zod';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';

const Router = express.Router();

Router.get('/post/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comments = await Prisma.comment.findMany({
    where: {post: {id}},
    include: PrismaIncludes.Comment,
  });

  res.status(HTTPStatus.OK).send(comments);
});

Router.use('/:id', async (req, res, next) => {
  const {id} = req.params;

  const comment = await Prisma.comment.findUnique({where: {id}, select: {id: true}});

  if (!comment) {
    res.status(HTTPStatus.NotFound).send(ErrorCodes.CommentNotFound);
    return;
  }

  next();
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comment = await Prisma.comment.findUnique({
    where: {id},
    include: PrismaIncludes.Comment,
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

Router.post('/:id/reactions/:type(like|dislike)', onlyAuthorized, async (req, res) => {
  const {id, type} = req.params as {id: string; type: 'like' | 'dislike'};

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
  const Comment = z.object({
    postId: z.string().uuid(),
    text: z
      .string()
      .trim()
      .max(Config.commentMaxLength)
      .refine((comment) => comment.split(/\r\n|\r|\n/).length <= Config.commentMaxLines, {
        message: `Comment must have less than ${Config.commentMaxLines} lines`,
      }),
  });

  const comment = Comment.safeParse(req.body);

  if (!comment.success) {
    res.status(HTTPStatus.BadRequest).send(comment.error);
    return;
  }

  const createdComment = await Prisma.comment.create({
    data: {
      post: {connect: {id: comment.data.postId}},
      author: {connect: {id: res.locals.user.id}},
      text: comment.data.text,
    },
  });

  res.status(HTTPStatus.OK).send(createdComment);
});

export default Router;
