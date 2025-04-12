import { 
  AutoIncrement,
  Column, 
  CreatedAt, 
  DataType, 
  ForeignKey, 
  Model, 
  NotNull, 
  PrimaryKey, 
  Table 
} from "sequelize-typescript";
import Lotes from "./lotes";

@Table({ tableName: 'boletos' })
class Boletos extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.STRING(255))
  nome_sacado: string;

  @ForeignKey(() => Lotes)
  @Column
  id_lote: number;

  @Column(DataType.DECIMAL(10, 2))
  valor: number;

  @Column(DataType.STRING(255))
  linha_digitavel: string;

  @Column(DataType.BOOLEAN)
  ativo: boolean;

  @CreatedAt
  criado_em: Date;
}

export default Boletos;