# pull official base image
FROM node:16.13.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
# COPY package-lock.json ./
RUN npm install
# RUN npm install react-scripts@3.4.1 -g --silent
# RUN npm install serve -g --silent
# add app
COPY . ./

ARG endpoint
ARG client_id
ARG fds_endpoint

ENV ENDPOINT="https://${endpoint}"
ENV REACT_APP_FDS_ENDPOINT="https://${fds_endpoint}/fds/v1"
ENV REACT_APP_AUTH0_CLIENT_ID="${client_id}"
ENV APPLICATION_RUNNING_MODE="production"
RUN PUBLIC_URL="${ENDPOINT}" npm run-script build

EXPOSE 3000
# start app
CMD ["npx", "serve", "-l", "3000", "-s", "build"]
# CMD ["npm","start"]