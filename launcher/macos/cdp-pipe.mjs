// Chrome DevTools Protocol over the "--remote-debugging-pipe" transport: no network port is opened at all.
// The browser reads commands on its file descriptor 3 and writes replies/events on its descriptor 4, as JSON
// messages each ended by a NUL byte. Page targets are driven through "flattened" sessions (sessionId in each message).

export class CdpPipe {
  /**
   * @param {import("node:stream").Writable} toBrowser    our end of the browser's fd 3
   * @param {import("node:stream").Readable} fromBrowser  our end of the browser's fd 4
   */
  constructor(toBrowser, fromBrowser) {
    this.toBrowser = toBrowser;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Set();
    this.detached = new Map(); // sessionId -> resolve()
    this.buffer = Buffer.alloc(0);
    this.closed = new Promise((resolve) => {
      fromBrowser.once("close", resolve);
      fromBrowser.once("end", resolve);
    });
    this.closed.then(() => {
      for (const w of this.pending.values()) w.reject(new Error("pipe closed"));
      this.pending.clear();
      for (const r of this.detached.values()) r();
    });
    toBrowser.on("error", () => {});
    fromBrowser.on("error", () => {});
    fromBrowser.on("data", (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      let i;
      while ((i = this.buffer.indexOf(0)) !== -1) {
        const raw = this.buffer.subarray(0, i).toString("utf8");
        this.buffer = this.buffer.subarray(i + 1);
        if (!raw) continue;
        let msg;
        try { msg = JSON.parse(raw); } catch (_) { continue; }
        this._dispatch(msg);
      }
    });
  }

  _dispatch(msg) {
    if (msg.id !== undefined) {
      const w = this.pending.get(msg.id);
      if (!w) return;
      this.pending.delete(msg.id);
      if (msg.error) w.reject(new Error(msg.error.message));
      else w.resolve(msg.result);
      return;
    }
    if (msg.method === "Target.detachedFromTarget" && msg.params?.sessionId) this.detached.get(msg.params.sessionId)?.();
    for (const h of this.handlers) { try { h(msg); } catch (_) {} }
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const msg = { id, method, params };
      if (sessionId) msg.sessionId = sessionId;
      try { this.toBrowser.write(JSON.stringify(msg) + "\0"); } catch (e) { this.pending.delete(id); reject(e); }
    });
  }

  onEvent(handler) { this.handlers.add(handler); }

  /** An object with the same shape as the WebSocket client (send, closed) for one attached target. */
  session(sessionId) {
    const closed = new Promise((resolve) => this.detached.set(sessionId, resolve));
    return { send: (method, params) => this.send(method, params, sessionId), closed, sessionId };
  }
}
