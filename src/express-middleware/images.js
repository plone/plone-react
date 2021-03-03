import express from 'express';
import getCache from './image-proxy/cache';
import ImageProxy from './image-proxy/ImageProxy';

async function imageMiddleware(req, res, next) {
  const { errorHandler } = req.app.locals;
  const cache = getCache();

  const proxy = new ImageProxy(req, cache, errorHandler);
  try {
    const output = await proxy.getData();

    // copy headers coming from the backend
    Object.keys(output.headers).forEach((h) => {
      const v = output.headers[h];
      if (v) res.setHeader(h, v);
    });

    res.setHeader('Content-Type', `image/${output.format}`);

    res.status(200).send(output.data);
  } catch (err) {
    errorHandler(err);
  }
}

export default function () {
  const middleware = express.Router();
  middleware.all(['**/@@images/*'], imageMiddleware);
  middleware.id = 'imageResourcesProcessor';
  return middleware;
}
