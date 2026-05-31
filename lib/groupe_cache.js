'use strict';

const { delay } = require('@whiskeysockets/baileys');

const MIN_FETCH_GAP_MS = 750;
const RATE_LIMIT_BASE_MS = 5000;
const MAX_RETRIES = 3;

const groupCache = {
  data: {},
  ttl: 300000,
  set(key, value) {
    this.data[key] = {
      value,
      expire: Date.now() + this.ttl,
    };
  },
  get(key) {
    const entry = this.data[key];
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expire) {
      return null;
    }
    return entry.value;
  },
  getStale(key) {
    const entry = this.data[key];
    return entry ? entry.value : null;
  },
  delete(key) {
    delete this.data[key];
  },
};

let lastFetchAt = 0;
const inflight = new Map();

function isRateLimitError(err) {
  return err?.message === 'rate-overlimit' || err?.data === 429;
}

async function waitForRateLimitSlot() {
  const wait = Math.max(0, MIN_FETCH_GAP_MS - (Date.now() - lastFetchAt));
  if (wait) {
    await delay(wait);
  }
  lastFetchAt = Date.now();
}

async function getGroupMetadata(sock, jid, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = groupCache.get(jid);
    if (cached) {
      return cached;
    }
  }

  if (inflight.has(jid)) {
    return inflight.get(jid);
  }

  const promise = (async () => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await waitForRateLimitSlot();
        const metadata = await sock.groupMetadata(jid);
        groupCache.set(jid, metadata);
        return metadata;
      } catch (err) {
        const stale = groupCache.getStale(jid);
        if (stale) {
          return stale;
        }
        if (isRateLimitError(err) && attempt < MAX_RETRIES) {
          await delay(RATE_LIMIT_BASE_MS * (attempt + 1));
          continue;
        }
        throw err;
      }
    }
    return null;
  })();

  inflight.set(jid, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(jid);
  }
}

module.exports = {
  groupCache,
  getGroupMetadata,
  isRateLimitError,
};
