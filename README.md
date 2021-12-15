# NestJS practical example
### Title : Shorten-URL Nest Service

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
