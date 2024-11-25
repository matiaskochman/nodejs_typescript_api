// import {
//   MigrationInterface,
//   QueryRunner,
//   TableColumn,
//   TableForeignKey,
// } from "typeorm";

// export class AddPostIdToComment1682579463000 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Añadir la columna postId a la tabla comment
//     await queryRunner.addColumn(
//       "comment",
//       new TableColumn({
//         name: "postId",
//         type: "int",
//         isNullable: false, // Ajusta según tus necesidades
//       })
//     );

//     // Crear la clave foránea hacia la tabla post
//     await queryRunner.createForeignKey(
//       "comment",
//       new TableForeignKey({
//         columnNames: ["postId"],
//         referencedColumnNames: ["id"],
//         referencedTableName: "post",
//         onDelete: "CASCADE", // Ajusta según tus necesidades
//       })
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Obtener la tabla comment
//     const table = await queryRunner.getTable("comment");
//     if (!table) {
//       throw new Error("La tabla 'comment' no existe");
//     }

//     // Encontrar la clave foránea creada
//     const foreignKey = table.foreignKeys.find(
//       (fk) => fk.columnNames.indexOf("postId") !== -1
//     );
//     if (foreignKey) {
//       await queryRunner.dropForeignKey("comment", foreignKey);
//     }

//     // Eliminar la columna postId
//     await queryRunner.dropColumn("comment", "postId");
//   }
// }
