import { SessionStorageService } from 'src/app/core/service/storage/session-storage.service';
import { DataDefinitionService } from 'src/app/core/service/data-definition/data-definition.service';
import { ParserService } from 'src/app/core/service/parser/parser.service';

export abstract class DataDefinition {
  entity: string;

  constructor(protected stg: SessionStorageService, protected parser: ParserService){ }

  abstract storage(row: { [index: string]: any }): void;

  label (row: { [index: string]: any }, dd: DataDefinitionService): string {
    /**
     * etiqueta de identificacion
     * sobrescribir si la entidad se identifica con campos diferentes de id
     * si se sobrescribe, cuidado con las recursiones infinitas
     * es necesario pasar como parametro a dd para evitar dependencia ciclica
     * analizar la posibilidad de descartar el uso de dd
     */
    let ret = "";
    if (row["id"]) ret = ret + " " + row["id"];
    return ret;
  }

}
