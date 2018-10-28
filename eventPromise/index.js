function eventPromise(target, eventType) {
  return new Promise(function(res, rej) {
    try {
      target.addEventListener(eventType, function f(e) {
        res(e);
        target.removeEventListener(eventType, f);
      });
    } catch (error) {
      rej(error);
    }
  });
}

export const eventPromiseWithCallback = (target, eventType, fn) => {
  return eventPromise(target, eventType)
    .then(e => {
      return fn.call(target, null, e);
    })
    .catch(err => {
      return fn.call(target, err);
    });
};

export default eventPromise;
