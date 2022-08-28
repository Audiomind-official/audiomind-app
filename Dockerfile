FROM node:14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --global cross-env

USER node

RUN npm install
RUN npm uninstall --save-dev sass-loader
RUN npm install --save-dev sass-loader@7.1.0
RUN npm run build --no-cache

COPY --chown=node:node . .

EXPOSE 3031

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3031

CMD [ "npm", "run", "start" ]
