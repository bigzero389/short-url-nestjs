# NestJS practical example
## System overview
### Title : Shorten URL API Service Application (NestJS)
### Purpose
* 사용자계정(account)을 관리를 한다.
* 계정별 apikey 를 관리한다. 한개의 계정은 여러개의 apikey 를 가질수 있다.(1대다 관계)
* 1개의 apikey 는 여러개의 short url 을 가진다. (1대다 관계)
* 모든 정보는 DB 에서 관리한다.
* short url 에 대한 처리는 속도를 위해서 redis 를 cache 로 사용한다.

### To-Do
* (완료) 기초적인 CRUD 가 아닌 실제 현업에서 사용 가능한 수준의 Data Handling 예제
* (완료) 실질적인 Test Case 예제 구현
* (완료) DBMS 에 종속되지 않는 ORM 도구의 실질적 사용
* (완료) 라이브러리 최소화 및 검증된 라이브러리 사용을 통한 지속적 유지보수성
* (완료) 각각의 Layer 별 일관된 에러처리 및 보안을 위한 최소한의 메시지처리
* (완료) 타 시스템과의 연계를 고려한 인터페이스 표준화 및 Validation 처리
* (진행전) OS, Docker 등 제반 인프라 환경에 종속적이지 않은 Application 환경 독립성 제공

### Module
* shared : common, util
* account : 사용자/계정 관리
* apikey : apikey 관리
* shorter : short url 관리, redis cache

## Runtime environment
### build tool : yarn
* using npm : npm install --global yarn
* using brew : brew install yarn
* using windows installer : https://classic.yarnpkg.com/en/docs/install#windows-stable
### middleware : nodejs 
* nvm ls-remote --lts v16.x // node LTS version 조회
* nvm install v16.13.1  // node v16.13.1 설치.
* nvm use v16.x  // node version 이 여러개 인 경우 선택
### database : postgres
* docker run -d -p 15432:5432 --name postgres -e POSTGRES_PASSWORD=nest1234 -v pgdata:/var/lib/postgresql/data postgres
### cache : redis 
* docker volume create --name redis_data
* docker run --name redis-svr -d -p 6379:6379 -v redis_data:/data redis redis-server --appendonly yes

## Runtime settings
### git clone
* git clone https://github.com/largezero/ShortURL.git
### yarn installation
* yarn global add @nestjs/cli
* yarn add @nestjs/config @nestjs/typeorm pg object-hash cache-manager cache-manager-ioredis moment moment-timezone
* yarn install
* yarn start // default port 3000

## Testing
### swagger
* http://localhost:3000/swagger
### yarn run test
* yarn run test // all test run
* yarn run test -o --watch // use testing menu
* yarn run test -t \[testing name regexp] // ex) yarn run test -t AccoutService
### test - curl sample
```
// application health check
curl -X 'GET' 'http://localhost:3000/health' -H 'accept: */*'

// Get account info
curl -X 'GET' 'http://localhost:3000/account/shortUser01' -H 'accept: */*' -H 'short_auth_key: bigzero-auth-key-01'    
```
