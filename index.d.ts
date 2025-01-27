export default class Molidb<T = any> {
  public constructor(
    SERVER_URL?: string,
    SECRET_KEY?: string,
    API_TOKEN?: string
  )
  public getHeaders(): {
    'Authorization': string;
    'Content-Type': string;
  }
  public aesEncrypt(data: T): Buffer<ArrayBuffer>
  public aesDecrypt(data: T): Buffer<ArrayBufferLike>

  public gzipCompress(data: T): Buffer<ArrayBufferLike>
  public gzipDecompress(data: T): Buffer<ArrayBufferLike>

  public listCollection(): Promise<{[id: string | number]: T}>
  public getCollection(id: string | number): Promise<T>
  public updateCollection(id: string | number, data: T): Promise<T>
  public deleteCollection(id: string | number): Promise<T>
}
