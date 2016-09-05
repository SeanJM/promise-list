function PromiseArray(list) {
  var self = this;
  var index = 0;
  var result = {};

  function r(method, value) {
    self.method[method]
      .forEach(function (c) {
        c(value);
      });
    self.method = { resolve : [], reject : [] };
  }

  function reject(value) {
    r('reject', value);
  }

  function resolve(value) {
    r('resolve', value);
  }

  function thenChain(i) {
    return function (value) {
      chain(self, value, i)
        .then(function (value) {
          if (value !== REJECT_VALUE) {
            result[i] = value;
          }

          if (index === list.length - 1) {
            resolve(toArray(result));
          }

          index++;
        })
        .catch(reject);
    };
  }

  if (!isPromiseArray(list)) {
    throw 'Your array must be filled with Promises';
  }

  this.queue = [];

  this.method = {
    resolve : [],
    reject : []
  };

  list.forEach(function (promise, i) {
    promise
      .then(thenChain(i))
      .catch(reject);
  });
}

PromiseArray.prototype.forEach = function (callback) {
  this.queue.push(['forEach', callback]);
  return this;
};

PromiseArray.prototype.filter = function (callback) {
  this.queue.push(['filter', callback]);
  return this;
};

PromiseArray.prototype.map = function (callback) {
  this.queue.push(['map', callback]);
  return this;
};

PromiseArray.prototype.catch = function (callback) {
  this.method.reject.push(callback);
  return this;
};

PromiseArray.prototype.then = function (callback) {
  this.method.resolve.push(callback);
  return this;
};