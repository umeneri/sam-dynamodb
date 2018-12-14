const AWS = require('aws-sdk')

var dynamoOpt = {
  // apiVersion: '2012-08-10',
  endpoint: "http://127.0.0.1:8000",
  // region: 'ap-northeast-1',
};
var documentClient = new AWS.DynamoDB.DocumentClient(dynamoOpt);
documentClient.scan({ TableName: 'User'}, (err, data) => {
  console.log(err);
  console.log(data);
})

documentClient.get({ TableName: 'User', Key: { 'Id': 1 } }, (err, data) => {
  console.log(err);
  console.log(data);
})

const params = {
  TableName: 'User',
    "Item": {
      "Id": 4,
      "Name": "Foo2",
    }
}

documentClient.put(params, (err, data) => {
  console.log(err);
  console.log(data);
})

