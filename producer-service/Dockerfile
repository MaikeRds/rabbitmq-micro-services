FROM node:14.18 AS build

LABEL version="1.0.0" maintainer="Maike Rodrigues <maikerodrigues@cialne.com.br>"

WORKDIR /home/node/app

COPY . /home/node/app

RUN npm i -g @nestjs/cli@8.1.2

RUN npm install

RUN npm run build

# CMD [ "npm", "run" , "start:dev" ]

FROM node:14.18-alpine AS production

WORKDIR /home/node/app

RUN mkdir -p /home/node/app/dist

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app/node_modules

# RUN chown -R node:node /home/node/app/node_modules && chmod -R 770 /home/node/app/node_modules

RUN mkdir -p /home/node/app/logs && chown -R node:node /home/node/app/logs

# RUN chown -R node:node /home/node/app/logs && chmod -R 770 /home/node/app/logs

USER node

COPY --chown=node:node --from=build /home/node/app/package.json /home/node/app/package.json

COPY --chown=node:node --from=build /home/node/app/package-lock.json /home/node/app/package-lock.json

COPY --chown=node:node --from=build /home/node/app/dist /home/node/app/dist

RUN npm install --production

# RUN sudo chmod -R 777 /home/node/app/node_modules

CMD [ "npm", "run" , "start:prod" ]



