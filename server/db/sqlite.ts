import Database from 'better-sqlite3';
import { DatabaseAdapter, DatabasePreparedStatement, DatabaseResult } from './abstract';

class SQLitePreparedStatement implements DatabasePreparedStatement {
  constructor(private stmt: Database.Statement) {}

  bind(...args: any[]): DatabasePreparedStatement {
    this.stmt.bind(...args);
    return this;
  }

  run(...args: any[]): void {
    this.stmt.run(...args);
  }

  all(): DatabaseResult {
    return { results: this.stmt.all() };
  }
}

export class SQLiteAdapter extends DatabaseAdapter {
  private db: Database.Database;

  constructor(dbPath: string = 'data.db') {
    super();
    this.db = new Database(dbPath);
  }

  prepare(query: string): DatabasePreparedStatement {
    return new SQLitePreparedStatement(this.db.prepare(query));
  }
} 