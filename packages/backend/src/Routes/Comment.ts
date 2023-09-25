import express from 'express';
import {Config, ErrorCodes} from 'common';
import {z} from 'zod';
import {Prisma, PrismaIncludes} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import HTTPStatus from '../Utils/HTTPStatus';

const Router = express.Router();

Router.get('/post/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comments = await Prisma.comment.findMany({
    where: {post: {id}},
    include: PrismaIncludes.Comment,
  });

  res.status(HTTPStatus.OK).send(comments);
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const comment = await Prisma.comment.findUnique({
    where: {id},
    include: PrismaIncludes.Comment,
  });

  if (!comment) {
    res.status(HTTPStatus.NotFound).send(ErrorCodes.CommentNotFound);
    return;
  }

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
