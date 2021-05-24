import express from 'express';
import settings from '../config/server';

const staticMiddleware = express.static(process.env.RAZZLE_PUBLIC_DIR, {
      setHeaders: function (res, path) {
        const relpath = path.substr(process.env.RAZZLE_PUBLIC_DIR.length);
        settings.staticFiles.some((elem) => {
            if (relpath.match(elem.match)) {
                for (const name in elem.headers) {
                    res.setHeader(name, elem.headers[name] || 'undefined');
                }
                return true;
            }
            return false;
        });
      },
});
  
export default function () {
  const middleware = express.Router();
  middleware.all('*', staticMiddleware);
  middleware.id = 'staticResourcesProcessor';
  return middleware;
}
