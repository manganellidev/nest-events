export abstract class BaseService<T, U> {
  abstract save(input: T): T;
  abstract findById(id: string): T;
  abstract findAll(filter: U): T[];
  abstract delete(id: string): void;
}
