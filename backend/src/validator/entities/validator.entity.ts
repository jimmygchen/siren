import {Table, Column, Model, PrimaryKey, AutoIncrement, Unique} from 'sequelize-typescript'


@Table({
  tableName: 'validator',
})
export class Validator extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique('compositeIndex')
  @Column
  index: number;

  @Unique('compositeIndex')
  @Column
  pubkey: string;

  @Unique('compositeIndex')
  @Column
  withdrawal_credentials: string;
}
