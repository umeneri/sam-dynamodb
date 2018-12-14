exports.lambdaHandler = async (event, context) => {
    try {
      switch (event.httpMethod) {
        case "GET":
          return {
            "statusCode": 200,
            "body": JSON.stringify({
              users: [{
                id: "1",
                name: "foo",
              }, {
                id: "2",
                name: "bar",
              }]
            })
          }
        default:
          return {
            "statusCode": 501
          }
      }
    } catch (err) {
        console.log(err);
        return err;
    }
};

