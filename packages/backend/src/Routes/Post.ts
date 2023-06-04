import express from 'express';
import {Config, ErrorCodes} from 'common';
import {z} from 'zod';
import {Prisma, PrismaTypes, Upload} from '../Services';
import {onlyAuthorized} from '../Middlewares';
import HTTPStatus from '../Utils/HTTPStatus';
import {ImageHandler} from '../Utils/ImageHandler';

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
      files = (
        await Promise.all(
          req.files.map(async (file) => {
            if (file.size > Config.maxFileSize) return null;

            if (file.mimetype.startsWith('image/')) {
              return ImageHandler(file);
            }

            // TODO: Handle video uploads

            return null;
          }),
        )
      ).filter(<T>(file: T | null): file is T => file !== null);
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
