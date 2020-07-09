export interface ReadableStreamEvents<T> {
  on(event: 'data', callback: (data: T) => void): void;

  on(event: 'error', callback: (err: Error) => void): void;

  on(event: 'end', callback: () => void): void;
}

export interface ReadableStream<T> extends ReadableStreamEvents<T> {
  pause(): void;

  resume(): void;

  destroy(): void;
}

export interface Readable<T> {
  read(): T | null;
}

export interface WriteableStream<T> extends ReadableStream<T> {
  write(data: T): void;

  error(error: Error): void;

  end(result?: T | Error): void;
}

export function isReadableStream<T>(obj: any): obj is ReadableStream<T> {
  const candidate: ReadableStream<T> = obj;

  return (
    candidate &&
    [candidate.on, candidate.pause, candidate.resume, candidate.destroy].every(
      fn => typeof fn === 'function'
    )
  );
}

export function newWriteableStream<T>(reducer: IReducer<T>): WriteableStream<T> {
  return new WriteableStreamImpl<T>(reducer);
}

export interface IReducer<T> {
  (data: T[]): T;
}

export interface IDataTransformer<Original, Transformed> {
  (data: Original): Transformed;
}

export interface IErrorTransformer {
  (error: Error): Error;
}

export interface ITransformer<Original, Transformed> {
  data: IDataTransformer<Original, Transformed>;
  error?: IErrorTransformer;
}

class WriteableStreamImpl<T> implements WriteableStream<T> {
  private readonly state = {
    flowing: false,
    ended: false,
    destroyed: false,
  };

  private readonly buffer = {
    data: [] as T[],
    error: [] as Error[],
  };

  private readonly listeners = {
    data: [] as { (data: T): void }[],
    error: [] as { (error: Error): void }[],
    end: [] as { (): void }[],
  };

  constructor(private reducer: IReducer<T>) {}

  public pause(): void {
    if (this.state.destroyed) {
      return;
    }

    this.state.flowing = false;
  }

  public resume(): void {
    if (this.state.destroyed) {
      return;
    }

    if (!this.state.flowing) {
      this.state.flowing = true;

      this.flowData();
      this.flowErrors();
      this.flowEnd();
    }
  }

  public write(data: T): void {
    if (this.state.destroyed) {
      return;
    }

    if (this.state.flowing) {
      this.listeners.data.forEach(listener => listener(data));
    } else {
      this.buffer.data.push(data);
    }
  }

  public error(error: Error): void {
    if (this.state.destroyed) {
      return;
    }

    if (this.state.flowing) {
      this.listeners.error.forEach(listener => listener(error));
    } else {
      this.buffer.error.push(error);
    }
  }

  public end(result?: T | Error): void {
    if (this.state.destroyed) {
      return;
    }

    if (result instanceof Error) {
      this.error(result);
    } else if (result) {
      this.write(result);
    }

    if (this.state.flowing) {
      this.listeners.end.forEach(listener => listener());

      this.destroy();
    } else {
      this.state.ended = true;
    }
  }

  on(event: 'data', callback: (data: T) => void): void;
  on(event: 'error', callback: (err: Error) => void): void;
  on(event: 'end', callback: () => void): void;
  on(event: 'data' | 'error' | 'end', callback: (arg0?: any) => void): void {
    if (this.state.destroyed) {
      return;
    }

    switch (event) {
      case 'data':
        this.listeners.data.push(callback);
        this.resume();

        break;

      case 'end':
        this.listeners.end.push(callback);
        if (this.state.flowing && this.flowEnd()) {
          this.destroy();
        }

        break;

      case 'error':
        this.listeners.error.push(callback);
        if (this.state.flowing) {
          this.flowErrors();
        }

        break;
    }
  }

  private flowData(): void {
    if (this.buffer.data.length > 0) {
      const fullDataBuffer = this.reducer(this.buffer.data);

      this.listeners.data.forEach(listener => listener(fullDataBuffer));

      this.buffer.data.length = 0;
    }
  }

  private flowErrors(): void {
    if (this.listeners.error.length > 0) {
      for (const error of this.buffer.error) {
        this.listeners.error.forEach(listener => listener(error));
      }

      this.buffer.error.length = 0;
    }
  }

  private flowEnd(): boolean {
    if (this.state.ended) {
      this.listeners.end.forEach(listener => listener());

      return this.listeners.end.length > 0;
    }

    return false;
  }

  destroy(): void {
    if (!this.state.destroyed) {
      this.state.destroyed = true;
      this.state.ended = true;

      this.buffer.data.length = 0;
      this.buffer.error.length = 0;

      this.listeners.data.length = 0;
      this.listeners.error.length = 0;
      this.listeners.end.length = 0;
    }
  }
}

export function consumeStreamWithLimit<T>(
  stream: ReadableStream<T>,
  reducer: IReducer<T>,
  maxChunks: number
): Promise<T | ReadableStream<T>> {
  return new Promise((resolve, reject) => {
    const chunks: T[] = [];

    let wrapperStream: WriteableStream<T> | undefined;

    stream.on('data', data => {
      if (!wrapperStream && chunks.length === maxChunks) {
        wrapperStream = newWriteableStream(reducer);
        while (chunks.length) {
          wrapperStream.write(chunks.shift()!);
        }

        wrapperStream.write(data);

        return resolve(wrapperStream);
      }

      if (wrapperStream) {
        wrapperStream.write(data);
      } else {
        chunks.push(data);
      }
    });

    stream.on('error', error => {
      if (wrapperStream) {
        wrapperStream.error(error);
      } else {
        return reject(error);
      }
    });

    stream.on('end', () => {
      if (wrapperStream) {
        while (chunks.length) {
          wrapperStream.write(chunks.shift()!);
        }

        wrapperStream.end();
      } else {
        return resolve(reducer(chunks));
      }
    });
  });
}

export function transform<Original, Transformed>(
  stream: ReadableStreamEvents<Original>,
  transformer: ITransformer<Original, Transformed>,
  reducer: IReducer<Transformed>
): ReadableStream<Transformed> {
  const target = newWriteableStream<Transformed>(reducer);

  stream.on('data', data => target.write(transformer.data(data)));
  stream.on('end', () => target.end());
  stream.on('error', error => target.error(transformer.error ? transformer.error(error) : error));

  return target;
}

export function consumeStream<T>(stream: ReadableStream<T>, reducer: IReducer<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: T[] = [];

    stream.on('data', data => chunks.push(data));
    stream.on('error', error => reject(error));
    stream.on('end', () => resolve(reducer(chunks)));
  });
}

export function toStream<T>(t: T, reducer: IReducer<T>): ReadableStream<T> {
  const stream = newWriteableStream<T>(reducer);

  stream.end(t);

  return stream;
}

export function consumeReadableWithLimit<T>(
  readable: Readable<T>,
  reducer: IReducer<T>,
  maxChunks: number
): T | Readable<T> {
  const chunks: T[] = [];

  let chunk: T | null | undefined;
  // tslint:disable-next-line:no-conditional-assignment
  while ((chunk = readable.read()) !== null && chunks.length < maxChunks) {
    chunks.push(chunk);
  }

  if (chunk === null && chunks.length > 0) {
    return reducer(chunks);
  }

  return {
    read: () => {
      if (chunks.length > 0) {
        return chunks.shift()!;
      }

      if (typeof chunk !== 'undefined') {
        const lastReadChunk = chunk;

        chunk = undefined;

        return lastReadChunk;
      }

      return readable.read();
    },
  };
}

export function consumeReadable<T>(readable: Buffer, reducer: IReducer<T>): T {
  const chunks: T[] = [];

  let chunk: T | null;
  // tslint:disable-next-line:no-conditional-assignment
  // @ts-ignore
  while ((chunk = readable.read()) !== null) {
    chunks.push(chunk);
  }

  return reducer(chunks);
}

export function toReadable<T>(t: T): Readable<T> {
  let consumed = false;

  return {
    read: () => {
      if (consumed) {
        return null;
      }

      consumed = true;

      return t;
    },
  };
}
