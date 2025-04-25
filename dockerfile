FROM node:22
WORKDIR app/don-backend
COPY ./ ./
run npm install
CMD ["npm","start"]

