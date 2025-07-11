export interface DatabaseResult {
  results: any[];
}

export interface DatabasePreparedStatement {
  bind(...args: any[]): DatabasePreparedStatement;
  run(...args: any[]): Promise<void> | void;
  all(): Promise<DatabaseResult> | DatabaseResult;
}

export abstract class DatabaseAdapter {
  abstract prepare(query: string): DatabasePreparedStatement;
  
  // Helper methods for common operations
  async query(query: string, params: any[] = []): Promise<any[]> {
    const stmt = this.prepare(query);
    if (params.length > 0) {
      stmt.bind(...params);
    }
    const result = stmt.all();
    if (result instanceof Promise) {
      const asyncResult = await result;
      return asyncResult.results;
    }
    return result.results;
  }
  
  async execute(query: string, params: any[] = []): Promise<void> {
    const stmt = this.prepare(query);
    if (params.length > 0) {
      stmt.bind(...params);
    }
    const result = stmt.run();
    if (result instanceof Promise) {
      await result;
    }
  }
} 