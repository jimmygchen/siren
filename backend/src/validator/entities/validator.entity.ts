import {Table, Column, Model, PrimaryKey, AutoIncrement} from 'sequelize-typescript'


@Table({
  tableName: 'validator',
})
export class Validator extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  index: number;

  @Column
  pubkey: string;

  @Column
  withdrawal_credentials: string;
}
