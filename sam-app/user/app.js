const DynamoDB = require('./dynamodb')

exports.lambdaHandler = async (event, context) => {
    try {
      switch (event.httpMethod) {
        case "GET": {
          const dbOutput = await (new DynamoDB.DynamoDBClient).scan();

          return {
            "statusCode": 200,
            "body": JSON.stringify(dbOutput)
          };
        }
        case "PUT": {
          const dbOutput = await (new DynamoDB.DynamoDBClient).put(event.body);

          return {
            "statusCode": 200,
            "body": JSON.stringify(dbOutput)
          };
        }
        default:
          return {
            "statusCode": 501
          };
      }
    } catch (err) {
        console.log(err);
        return err;
    }
};
