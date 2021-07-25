FROM nginx:latest
RUN mkdir -p /home/www-data/static
WORKDIR /home/www-data
RUN apt-get update -y
RUN apt-get install npm -y
RUN npm install -g webpack-cli
RUN npm install -g webpack
