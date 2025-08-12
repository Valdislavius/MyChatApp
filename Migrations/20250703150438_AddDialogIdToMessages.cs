using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevOpsChatApp.Migrations
{
    /// <inheritdoc />
    public partial class AddDialogIdToMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DialogId",
                table: "Messages",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Dialog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dialog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DialogParticipant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DialogId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DialogParticipant", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DialogParticipant_Dialog_DialogId",
                        column: x => x.DialogId,
                        principalTable: "Dialog",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DialogParticipant_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_DialogId",
                table: "Messages",
                column: "DialogId");

            migrationBuilder.CreateIndex(
                name: "IX_DialogParticipant_DialogId",
                table: "DialogParticipant",
                column: "DialogId");

            migrationBuilder.CreateIndex(
                name: "IX_DialogParticipant_UserId",
                table: "DialogParticipant",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Dialog_DialogId",
                table: "Messages",
                column: "DialogId",
                principalTable: "Dialog",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Dialog_DialogId",
                table: "Messages");

            migrationBuilder.DropTable(
                name: "DialogParticipant");

            migrationBuilder.DropTable(
                name: "Dialog");

            migrationBuilder.DropIndex(
                name: "IX_Messages_DialogId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "DialogId",
                table: "Messages");
        }
    }
}
