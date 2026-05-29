const groupCache = {
  data: {},
  ttl: 300000,
  set(key, value) {
    this.data[key] = {
      value: value,
      expire: Date.now() + this.ttl
    };
  },
  get(key) {
    const entry = this.data[key];
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expire) {
      delete this.data[key];
      return null;
    }
    return entry.value;
  },
  delete(key) {
    delete this.data[key];
  }
};
module.exports = {
  groupCache: groupCache
};
