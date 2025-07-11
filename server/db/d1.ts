import { DatabaseAdapter, DatabasePreparedStatement, DatabaseResult } from './abstract';

class D1PreparedStatement implements DatabasePreparedStatement {
  constructor(private stmt: any) {}

  bind(...args: any[]): DatabasePreparedStatement {
    this.stmt = this.stmt.bind(...args);
    return this;
  }

  async run(...args: any[]): Promise<void> {
    await this.stmt.run(...args);
  }

  async all(): Promise<DatabaseResult> {
    return await this.stmt.all();
  }
}

export class D1Adapter extends DatabaseAdapter {
  private db: any;

  constructor(db: any) {
    super();
    this.db = db;
  }

  prepare(query: string): DatabasePreparedStatement {
    return new D1PreparedStatement(this.db.prepare(query));
  }
} 