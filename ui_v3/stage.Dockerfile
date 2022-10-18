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
ENV REACT_APP_FDS_ENDPOINT https://stage.datafacade.io/fds/v1
ENV REACT_APP_AUTH0_CLIENT_ID coI8Q8LGjdCRqDe6XkE82CmZNcOKOHL1
ENV APPLICATION_RUNNING_MODE staging
RUN PUBLIC_URL=https://stage.datafacade.io npm run-script build
EXPOSE 3000
# start app
CMD ["serve", "-l", "3000", "-s", "build"]
# CMD ["npm","start"]
