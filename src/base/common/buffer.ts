import * as streams from '@/base/common/stream';

export function newWriteableBufferStream(): streams.WriteableStream<Buffer> {
  return streams.newWriteableStream<Buffer>(chunks => Buffer.concat(chunks));
}

export function streamToBuffer(stream: streams.ReadableStream<Buffer>): Promise<Buffer> {
  return streams.consumeStream<Buffer>(stream, chunks => Buffer.concat(chunks));
}

export function bufferToStream(buffer: Buffer): streams.ReadableStream<Buffer> {
  return streams.toStream<Buffer>(buffer, chunks => Buffer.concat(chunks));
}

export function readableToBuffer(readable: Buffer): Buffer {
  return streams.consumeReadable<Buffer>(readable, (chunks: Uint8Array[]) => Buffer.concat(chunks));
}

export function bufferToReadable(buffer: Buffer): streams.Readable<Buffer> {
  return streams.toReadable<Buffer>(buffer);
}
