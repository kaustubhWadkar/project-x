
FROM node:18-alpine AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --only=production


COPY index.js ./

FROM node:18-alpine AS runtime


RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app


COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/index.js ./index.js

USER appuser

EXPOSE 3000
ENV PORT=3000
CMD ["node", "index.js"]
