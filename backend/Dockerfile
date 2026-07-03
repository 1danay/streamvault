FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

USER node

COPY --chown=node:node --from=builder /app/package.json /app/yarn.lock ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/main.js"]