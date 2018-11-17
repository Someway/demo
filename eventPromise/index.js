const eventMap = new Map();
function eventPromise(target, eventType) {
  // not first
  let resolves = eventMap.get(target);
  if (Array.isArray(resolves)) {
    return new Promise((res) => {
      resolves.push(res);
    });
  }
  // first add
  resolves = [];
  eventMap.set(target, resolves);
  return new Promise(function(res, rej) {
    resolves.push(res);
    try {
      target.addEventListener(eventType, function f(e) {
        res = resolves.shift();
        res(e);
        if (resolves.length == 0) {
          eventMap.delete(target);
          target.removeEventListener(eventType, f);
        }
      });
    } catch (error) {
      rej(error);
    }
  });
}

export const eventPromiseWithCallback = (target, eventType, fn) => {
  return eventPromise(target, eventType)
    .then((e) => {
      return fn.call(target, null, e);
    })
    .catch((err) => {
      return fn.call(target, err);
    });
};

export default eventPromise;
