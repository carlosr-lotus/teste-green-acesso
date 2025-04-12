import { 
  Table, 
  Column, 
  Model, 
  PrimaryKey, 
  AutoIncrement,
  DataType,
  CreatedAt,
} from "sequelize-typescript";

@Table({ tableName: 'lotes' })
class Lotes extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column(DataType.STRING(100))
  nome: string;

  @Column(DataType.BOOLEAN)
  ativo: boolean;

  @CreatedAt
  criado_em: Date;
}

export default Lotes;