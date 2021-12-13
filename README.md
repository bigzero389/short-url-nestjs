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

## test - jest
* Service Test 에서 Repository DI가 작동하지 않음, mockRepository로 대체 [mock] [mock repository website] 

## test - curl
### health
* curl localhost:3000/health => return : ok

### get account
* curl localhost:3000/account => return Account Entity Array

[mock repository website](https://velog.io/@1yongs_/NestJS-Testing-Jest)
