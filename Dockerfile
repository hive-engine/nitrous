FROM node:12.16.2 as development

WORKDIR /var/app

COPY package.json yarn.lock ./

RUN yarn install --non-interactive --frozen-lockfile --ignore-optional

COPY . .

RUN mkdir tmp && yarn build

CMD [ "yarn", "run", "start" ]

### REMOVE DEV DEPENDENCIES ##
FROM development as dependencies

RUN yarn install --non-interactive --frozen-lockfile --ignore-optional --production

### BUILD MINIFIED PRODUCTION ##
FROM node:12.16.2-alpine as production

WORKDIR /var/app

ARG SOURCE_COMMIT
ENV SOURCE_COMMIT ${SOURCE_COMMIT}
ARG DOCKER_TAG
ENV DOCKER_TAG ${DOCKER_TAG}

COPY --from=dependencies /var/app/package.json /var/app/package.json
COPY --from=dependencies /var/app/config /var/app/config
COPY --from=dependencies /var/app/dist /var/app/dist
COPY --from=dependencies /var/app/lib /var/app/lib
COPY --from=dependencies /var/app/src /var/app/src
COPY --from=dependencies /var/app/tmp /var/app/tmp
COPY --from=dependencies /var/app/webpack /var/app/webpack
COPY --from=dependencies /var/app/node_modules /var/app/node_modules

COPY --from=dependencies /var/app/healthcheck.js /var/app/healthcheck.js

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 CMD node /var/app/healthcheck.js

CMD [ "yarn", "run", "production" ]
