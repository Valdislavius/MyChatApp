using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevOpsChatApp.Migrations
{
    /// <inheritdoc />
    public partial class AddDialogsAndParticipantAndFixMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DialogParticipant_Dialog_DialogId",
                table: "DialogParticipant");

            migrationBuilder.DropForeignKey(
                name: "FK_DialogParticipant_Users_UserId",
                table: "DialogParticipant");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Dialog_DialogId",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DialogParticipant",
                table: "DialogParticipant");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Dialog",
                table: "Dialog");

            migrationBuilder.RenameTable(
                name: "DialogParticipant",
                newName: "DialogsParticipants");

            migrationBuilder.RenameTable(
                name: "Dialog",
                newName: "Dialogs");

            migrationBuilder.RenameIndex(
                name: "IX_DialogParticipant_UserId",
                table: "DialogsParticipants",
                newName: "IX_DialogsParticipants_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DialogParticipant_DialogId",
                table: "DialogsParticipants",
                newName: "IX_DialogsParticipants_DialogId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Timestamp",
                table: "Messages",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "DialogId",
                table: "Messages",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DialogsParticipants",
                table: "DialogsParticipants",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Dialogs",
                table: "Dialogs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DialogsParticipants_Dialogs_DialogId",
                table: "DialogsParticipants",
                column: "DialogId",
                principalTable: "Dialogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DialogsParticipants_Users_UserId",
                table: "DialogsParticipants",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Dialogs_DialogId",
                table: "Messages",
                column: "DialogId",
                principalTable: "Dialogs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DialogsParticipants_Dialogs_DialogId",
                table: "DialogsParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_DialogsParticipants_Users_UserId",
                table: "DialogsParticipants");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Dialogs_DialogId",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DialogsParticipants",
                table: "DialogsParticipants");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Dialogs",
                table: "Dialogs");

            migrationBuilder.RenameTable(
                name: "DialogsParticipants",
                newName: "DialogParticipant");

            migrationBuilder.RenameTable(
                name: "Dialogs",
                newName: "Dialog");

            migrationBuilder.RenameIndex(
                name: "IX_DialogsParticipants_UserId",
                table: "DialogParticipant",
                newName: "IX_DialogParticipant_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DialogsParticipants_DialogId",
                table: "DialogParticipant",
                newName: "IX_DialogParticipant_DialogId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Timestamp",
                table: "Messages",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DialogId",
                table: "Messages",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DialogParticipant",
                table: "DialogParticipant",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Dialog",
                table: "Dialog",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DialogParticipant_Dialog_DialogId",
                table: "DialogParticipant",
                column: "DialogId",
                principalTable: "Dialog",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DialogParticipant_Users_UserId",
                table: "DialogParticipant",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Dialog_DialogId",
                table: "Messages",
                column: "DialogId",
                principalTable: "Dialog",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
