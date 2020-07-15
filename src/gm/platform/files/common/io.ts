import { URI } from '@/gm/base/common/uri';
import { CancellationToken } from '@/gm/base/common/async';
import {
  createFileSystemProviderError,
  ensureFileSystemProviderError,
  FileReadStreamOptions,
  FileSystemProviderErrorCode,
  IFileSystemProviderWithOpenReadWriteCloseCapability,
} from '@/gm/platform/files/common/files';

import { newWriteableBufferStream } from '@/gm/base/common/buffer';
import { canceled } from '@/gm/base/common/errors';
import { ReadableStream, WriteableStream } from '@/gm/base/common/stream';

export interface ICreateReadStreamOptions extends FileReadStreamOptions {
  /**
   * The size of the buffer to use before sending to the stream.
   */
  bufferSize: number;
}

export function createReadStream(
  provider: IFileSystemProviderWithOpenReadWriteCloseCapability,
  resource: URI,
  options: ICreateReadStreamOptions,
  token?: CancellationToken
): ReadableStream<any> {
  const stream = newWriteableBufferStream();

  let error: Error | undefined;

  doReadFileIntoStream(provider, resource, stream, options, token)
    .then(undefined, err => (error = err))
    .finally(() => stream.end(error));

  return stream;
}

async function doReadFileIntoStream(
  provider: IFileSystemProviderWithOpenReadWriteCloseCapability,
  resource: URI,
  stream: WriteableStream<Buffer>,
  options: ICreateReadStreamOptions,
  token?: CancellationToken | undefined
): Promise<void> {
  throwIfCancelled(token);

  const handle = await provider.open(resource, { create: false });

  throwIfCancelled(token);

  try {
    let totalBytesRead = 0;
    let bytesRead = 0;
    let allowedRemainingBytes =
      options && typeof options.length === 'number' ? options.length : undefined;

    let buffer = Buffer.alloc(
      Math.min(
        options.bufferSize,
        typeof allowedRemainingBytes === 'number' ? allowedRemainingBytes : options.bufferSize
      )
    );

    let posInFile = options && typeof options.position === 'number' ? options.position : 0;
    let posInBuffer = 0;
    do {
      bytesRead = await provider.read(
        handle,
        posInFile,
        buffer,
        posInBuffer,
        buffer.byteLength - posInBuffer
      );

      posInFile += bytesRead;
      posInBuffer += bytesRead;
      totalBytesRead += bytesRead;

      if (typeof allowedRemainingBytes === 'number') {
        allowedRemainingBytes -= bytesRead;
      }

      if (posInBuffer === buffer.byteLength) {
        stream.write(buffer);

        buffer = Buffer.alloc(
          Math.min(
            options.bufferSize,
            typeof allowedRemainingBytes === 'number' ? allowedRemainingBytes : options.bufferSize
          )
        );

        posInBuffer = 0;
      }
    } while (
      bytesRead > 0 &&
      (typeof allowedRemainingBytes !== 'number' || allowedRemainingBytes > 0) &&
      throwIfCancelled(token) &&
      throwIfTooLarge(totalBytesRead, options)
    );

    if (posInBuffer > 0) {
      let lastChunkLength = posInBuffer;
      if (typeof allowedRemainingBytes === 'number') {
        lastChunkLength = Math.min(posInBuffer, allowedRemainingBytes);
      }

      stream.write(buffer.slice(0, lastChunkLength));
    }
  } catch (error) {
    throw ensureFileSystemProviderError(error);
  } finally {
    await provider.close(handle);
  }
}

function throwIfCancelled(token?: CancellationToken): boolean {
  if (token && token.isCancellationRequested) {
    throw canceled();
  }

  return true;
}

function throwIfTooLarge(totalBytesRead: number, options: ICreateReadStreamOptions): boolean {
  // Return early if file is too large to load and we have configured limits
  if (options?.limits) {
    if (typeof options.limits.memory === 'number' && totalBytesRead > options.limits.memory) {
      throw createFileSystemProviderError(
        'To open a file of this size, you need to restart and allow it to use more memory',
        FileSystemProviderErrorCode.FileExceedsMemoryLimit
      );
    }

    if (typeof options.limits.size === 'number' && totalBytesRead > options.limits.size) {
      throw createFileSystemProviderError(
        'File is too large to open',
        FileSystemProviderErrorCode.FileTooLarge
      );
    }
  }

  return true;
}
