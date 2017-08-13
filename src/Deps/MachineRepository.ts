import {Pool} from 'pg';
import {Logger} from 'pino';

export interface Machine {
  id: number;
  name: string;
}

export default class MachineRepository {
  constructor(readonly db: Pool, readonly logger: Logger) {
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  getAll() {
    return this.db.query('SELECT * FROM machines ORDER BY id desc')
      .then(res => res.rows as Machine[])
      .catch(this.handleError);
  }

  add(machine: Machine) {
    const query = 'INSERT INTO machines(name) VALUES($1)';
    const values = [machine.name];
    return this.db.query(query, values)
      .then(res => res.rows[0] as Machine)
      .catch(this.handleError);
  }

  update(id: number, machine: Machine) {
    const query = 'UPDATE machines SET name=$2 WHERE id=$1 RETURNING *';
    const values = [id, machine.name];
    return this.db.query(query, values)
      .then(res => res.rows[0] as Machine)
      .catch(this.handleError);
  }

  remove(id: number) {
    const query = 'DELETE FROM machines WHERE id=$1';
    const values = [id];
    return this.db.query(query, values)
      .then(() => Promise.resolve())
      .catch(this.handleError);
  }
}
