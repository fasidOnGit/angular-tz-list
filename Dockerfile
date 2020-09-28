FROM trion/ng-cli-karma AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
#RUN npm run build
RUN npm run test
