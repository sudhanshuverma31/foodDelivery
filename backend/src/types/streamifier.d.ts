declare module 'streamifier' {
  function createReadStream(buffer: Buffer): NodeJS.ReadableStream;
  export = { createReadStream };
}
