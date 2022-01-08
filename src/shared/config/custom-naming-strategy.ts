import { DefaultNamingStrategy, Table, NamingStrategyInterface } from "typeorm";
// import crypto from "crypto";

// TODO : PK constraint 와 FK constraint 등의 이름 지정시 Custom Naming Strategy 를 사용해야 된다고 함.
export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const name = columnNames.reduce(
      (name, column) => `${name}_${column}`,
      `${tableOrName}_${referencedTablePath}`,
    );

    // return`fk_${crypto.createHash('md5').update(name).digest("hex")}`
    return `fk_${name}`;
  }

  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const name = columnNames.reduce(
      (name, column) => `${name}_${column}`,`${tableOrName}`,
    );

    return `pk_${name}`;
  }
}
