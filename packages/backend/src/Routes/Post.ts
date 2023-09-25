import express from 'express';
import {Config, ErrorCodes} from 'common';
import {z} from 'zod';
import {Prisma, PrismaTypes, PrismaIncludes, Upload} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import HTTPStatus from '../Utils/HTTPStatus';
import {ImageHandler} from '../Utils/ImageHandler';
import {VideoHandler} from '../Utils/VideoHandler';

const Router = express.Router();

Router.get('/', onlyAuthorized, async (req, res) => {
  const posts = await Prisma.post.findMany({include: PrismaIncludes.Post});

  res.status(HTTPStatus.OK).send(posts);
});

Router.get('/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const post = await Prisma.post.findUnique({
    where: {id},
    include: PrismaIncludes.PostWithComments,
  });

  if (!post) {
    res.status(HTTPStatus.NotFound).send(ErrorCodes.PostNotFound);
    return;
  }

  res.status(HTTPStatus.OK).send(post);
});

Router.get('/user/:id', onlyAuthorized, async (req, res) => {
  const {id} = req.params;

  const posts = await Prisma.post.findMany({where: {authorId: id}, include: PrismaIncludes.Post});

  res.status(HTTPStatus.OK).send(posts);
});

Router.put(
  '/',
  onlyAuthorized,
  Upload.array('medias', Config.maxMediasPerPost),
  async (req, res) => {
    const Post = z.object({
      description: z
        .string()
        .trim()
        .max(Config.postDescriptionMaxLength)
        .refine((desc) => desc.split(/\r\n|\r|\n/).length <= Config.postDescriptionMaxLines, {
          message: `Description must have less than ${Config.postDescriptionMaxLines} lines`,
        })
        .optional(),
    });

    const post = Post.safeParse(req.body);

    if (!post.success) {
      res.status(HTTPStatus.BadRequest).send(post.error);
      return;
    }

    const hasFiles = Array.isArray(req.files) && req.files.length > 0;

    if (!post.data.description && !hasFiles) {
      res.status(HTTPStatus.BadRequest).send(ErrorCodes.PostDoesntHaveMediaOrDescription);
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

    const createdPost = await Prisma.post.create({
      data: {
        description: post.data.description,
        author: {connect: {id: res.locals.user.id}},
        medias: {
          createMany: {data: files},
        },
      },
    });

    res.status(HTTPStatus.OK).send(createdPost);
  },
);

export default Router;
