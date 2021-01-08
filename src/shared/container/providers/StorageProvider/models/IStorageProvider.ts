export default interface IStorageInterface {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}