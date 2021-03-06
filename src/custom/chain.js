function chain(self, value, index) {
  return new Promise(
    function (resolve, reject) {

      function each(i, value) {
        var callback = self.queue[i]
          ? self.queue[i][1]
          : false;

        var method = self.queue[i]
          ? self.queue[i][0]
          : false;

        if (callback) {
          maybePromise(callback(value, index))
            .then(function (result) {
              if ((
                method === 'filter' && result
              ) || (
                method === 'forEach'
              )) {
                each(i + 1, value);
              } else if (method === 'filter') {
                resolve(REJECT_VALUE);
              } else {
                each(i + 1, result);
              }
            }).catch(reject);
        } else {
          resolve(value);
        }
      }

      each(0, value);
    }
  );
}
