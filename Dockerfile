FROM node:16.10.0

RUN npm install -g npm@8.1.3
RUN npm install -g @vue/cli@4.5.15

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app

CMD npm run dev -- --host