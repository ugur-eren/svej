import express from 'express';
import {Config, ErrorCodes, HTTPStatus, Zod} from 'common';
import {Prisma, PrismaTypes, PrismaIncludes, Upload} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import {ImageHandler} from '../Utils/ImageHandler';
import {VideoHandler} from '../Utils/VideoHandler';

const Router = express.Router();

Router.get('/', onlyAuthorized, async (req, res) => {
  const posts = await Prisma.post.findMany({include: PrismaIncludes.Post(res.locals.user.id)});

  res.status(HTTPStatus.OK).send(posts);
});

Router.get('/user/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const posts = await Prisma.post.findMany({
    where: {authorId: id},
    include: PrismaIncludes.Post(res.locals.user.id),
  });

  res.status(HTTPStatus.OK).send(posts);
});

Router.use('/:id', async (req, res, next) => {
  const {id} = req.params;

  const post = await Prisma.post.findUnique({where: {id}, select: {id: true}});

  if (!post) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.PostNotFound});
    return;
  }

  next();
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const post = await Prisma.post.findUnique({
    where: {id},
    include: PrismaIncludes.Post(res.locals.user.id),
  });

  res.status(HTTPStatus.OK).send(post);
});

Router.get('/:id/reactions', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const post = await Prisma.post.findUnique({
    where: {id},
    select: {
      _count: {
        select: {
          likes: true,
          dislikes: true,
          comments: true,
        },
      },
    },
  });

  res.status(HTTPStatus.OK).send(post?._count);
});

Router.post('/:id/reactions/:type(like|dislike|remove)', onlyAuthorized, async (req, res) => {
  const {id, type} = req.params as {id: string; type: 'like' | 'dislike' | 'remove'};

  if (type === 'remove') {
    await Prisma.post.update({
      where: {
        id,
      },
      data: {
        likes: {disconnect: {id: res.locals.user.id}},
        dislikes: {disconnect: {id: res.locals.user.id}},
      },
    });

    res.status(HTTPStatus.OK).send({ok: true});
    return;
  }

  await Prisma.post.update({
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

  res.status(HTTPStatus.OK).send({ok: true});
});

Router.put(
  '/',
  onlyAuthorized,
  Upload.array('medias', Config.maxMediasPerPost),
  async (req, res) => {
    const body = Zod.Post.Create.safeParse(req.body);

    if (!body.success) {
      res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: body.error});
      return;
    }

    const hasFiles = Array.isArray(req.files) && req.files.length > 0;

    if (!body.data.description && !hasFiles) {
      res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.PostDoesntHaveMediaOrDescription});
      return;
    }

    let files: PrismaTypes.MediaCreateManyPostInput[] = [];
    if (Array.isArray(req.files)) {
      try {
        files = (
          await Promise.all(
            req.files.map(async (file) => {
              if (file.size > Config.maxFileSize) return null;

              if (file.mimetype.startsWith('image/')) {
                return ImageHandler(file);
              }

              if (file.mimetype.startsWith('video/')) {
                return VideoHandler(file);
              }

              return null;
            }),
          )
        ).filter(<T>(file: T | null): file is T => file !== null);
      } catch (err) {
        res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FileProcessingError});
        return;
      }
    }

    const post = await Prisma.post.create({
      data: {
        description: body.data.description,
        author: {connect: {id: res.locals.user.id}},
        medias: {
          createMany: {data: files},
        },
      },
    });

    res.status(HTTPStatus.OK).send(post);
  },
);

export default Router;
