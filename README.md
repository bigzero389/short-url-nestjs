# NestJS practical example
### Title : Shorten-URL Nest Service
### Purpose
* 기초적인 CRUD가 아닌 실제 현업에서 사용 가능한 수준의 Data Handling 예제
* DBMS 에 종속되지 않는 ORM 도구의 실질적 사용
* 라이브러리 최소화 및 검증된 라이브러리 사용을 통한 지속적 유지보수성
* 각각의 Layer별 일관된 에러처리 및 보안을 위한 최소한의 메시지처리
* 타 시스템과의 연계를 고려한 인터페이스 표준화 및 Validation처리
* OS, Docker등 제반 인프라 환경에 종속적이지 않은 Application 환경 독립성 제공
* 실질적인 Test Case 예제 구현

## Runtime environment
### build tool : yarn
* brew install yarn
### middleware : nodejs 
* v16.x - LTS
* nvm install v16.x
* nvm use v16.x
### database : postgres
* docker run -d -p 15432:5432 --name postgres -e POSTGRES_PASSWORD=nest1234 -v pgdata:/var/lib/postgresql/data postgres
 
## Runtime settings
### git clone
* git clone https://github.com/largezero/ShortURL.git
### yarn installation
* yarn global add @nestjs/cli
* yarn add @nestjs/typeorm pg
* yarn install
* yarn start // default port 3000

## Testing
### yarn run test
* yarn run test // all test run
* yarn run test -o --watch // use testing menu
* yarn run test -t \[testing name regexp] // ex) yarn run test -t AccoutService

### test - curl
```
// Get all data
curl --location --request GET 'localhost:3000/account' \
     --header 'shorten_api_key: bigzeroKey' |\
node -e "console.log( JSON.stringify( JSON.parse(require('fs').readFileSync(0) ), 0, 1 ))"

// Get data with conditions
curl --location --request GET 'localhost:3000/account?accountId=bigzero1&email=dy' \
     --header 'shorten_api_key: bigzeroKey' |\
node -e "console.log( JSON.stringify( JSON.parse(require('fs').readFileSync(0) ), 0, 1 ))"
     
// Delete one data
curl --location --request DELETE 'localhost:3000/account/bigzero' \
     --header 'shorten_api_key: bigzeroKey' |\
node -e "console.log( JSON.stringify( JSON.parse(require('fs').readFileSync(0) ), 0, 1 ))"

// Post account data
curl --location --request POST 'localhost:3000/account' \
     --header 'shorten_api_key: bigzeroKey' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "accountId": "testingId",
         "accountName": "dyheo1",
         "email": "dyheo@hist.co.kr",
         "tel": "1",
         "remark": "",
         "endDatetime": "20221231235959",
         "beginDatetime": "20000101010000"
     }' |\
node -e "console.log( JSON.stringify( JSON.parse(require('fs').readFileSync(0) ), 0, 1 ))"

// Put account data
curl --location --request PUT 'localhost:3000/account' \
     --header 'shorten_api_key: bigzeroKey' \
     --header 'Content-Type: application/json' \
     --data-raw '{
         "accountId" : "bigzero4-updated",
         "accountName" : "dyheo",
         "email" : "dyheo@hist.co.kr",
         "tel" : "01062889304",
         "remark" : "",
         "endDatetime" : "20221231235959",
         "beginDatetime" : "20000101010000",
         "updateWhereOptions": {
           "accountName": "dyheo1"
         }
     }' |\
node -e "console.log( JSON.stringify( JSON.parse(require('fs').readFileSync(0) ), 0, 1 ))"
```
