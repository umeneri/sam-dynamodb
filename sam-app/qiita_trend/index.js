const app = require('./app.js')

const event = {
  searchWord: 'hoge'
};

const context = {
};

const callback = () => {
  return 'return callback';
};

(async () => {
  const res =  await app.lambdaHandler(event, context, callback);
})();
