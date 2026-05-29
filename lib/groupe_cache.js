const groupCache = {
  data: {},
  ttl: 300000,
  set(_0x364662, _0x443e8f) {
    this.data[_0x364662] = {
      value: _0x443e8f,
      expire: Date.now() + this.ttl
    };
  },
  get(_0x257352) {
    const _0x204867 = this.data[_0x257352];
    if (!_0x204867) {
      return null;
    }
    if (Date.now() > _0x204867.expire) {
      delete this.data[_0x257352];
      return null;
    }
    return _0x204867.value;
  },
  delete(_0x5ba147) {
    delete this.data[_0x5ba147];
  }
};
module.exports = {
  groupCache: groupCache
};