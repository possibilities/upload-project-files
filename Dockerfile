FROM node:8-alpine

ADD . /code
RUN cd /code && yarn install

EXPOSE 3000
WORKDIR /code
CMD ["yarn","start"]
