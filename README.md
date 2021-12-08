# Shorten-URL Nest Service

## database
* use postgresql docker
* docker run -d -p 15432:5432 --name postgres -e POSTGRES_PASSWORD=nest1234 -v pgdata:/var/lib/postgresql/data postgres
 
## yarn installation
* yarn global add @nestjs/cli
* yarn add @nestjs/typeorm pg
* yarn install

## run - default port 3000
* yarn start

## test
### health
* curl localhost:3000/health => return : ok
