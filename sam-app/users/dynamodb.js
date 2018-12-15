const AWS = require('aws-sdk')

class DynamoDBClient {
  constructor() {
    this.documentClient = new AWS.DynamoDB.DocumentClient({ endpoint: process.env.DYNAMODB_ENDPOINT });
    this.tableName = 'User';
  }

  scan() {
    return this.documentClient.scan({ TableName: this.tableName }).promise();
  }

  put(itemParams) {
    const dbParams = {
      TableName: this.tableName,
      Item: itemParams,
    }

    return this.documentClient.put(dbParams).promise();
  }
}

exports.DynamoDBClient = DynamoDBClient;
