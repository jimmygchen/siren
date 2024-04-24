import {Table, Column, Model, PrimaryKey, AutoIncrement} from 'sequelize-typescript'


@Table({
  tableName: 'specs',
})
export class Spec extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  data: string;
}
