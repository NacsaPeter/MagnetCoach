using Microsoft.EntityFrameworkCore.Migrations;

namespace MagnetCoach.EF.Migrations
{
    public partial class TacticName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Tactics",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Tactics");
        }
    }
}
