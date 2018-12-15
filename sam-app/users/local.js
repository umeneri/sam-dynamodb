const DynamoDB = require('./dynamodb')

async function main() {
  const ddc = new DynamoDB.DynamoDBClient();
  // const data = await ddc.put({Id: 5, Name: 'Fee3' });
  const data = await ddc.scan().catch(err => { console.log(err) });
  console.info(data);
};

main();

