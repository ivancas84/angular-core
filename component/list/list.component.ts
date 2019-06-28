import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { Field } from '../../class/field';


export abstract class ListComponent  {

  rows = [];
  entity: string; //entidad principal de la lista

  constructor(protected dd: DataDefinitionService) { }

  getData(): void {
    //this.dd.ids(this.entity, {search:"mat"});
    /*
    this.dd.all(this.entity)
      .then(
        (data) => {
          this.temp = data;
          console.log(this.data);
          console.log(typeof this.data);
          console.log("test");
          console.log(this);
        }
      )
      .catch((err) => console.error(err));*/
  }
}
