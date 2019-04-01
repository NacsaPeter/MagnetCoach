using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MagnetCoach.EF.Migrations
{
    public partial class SeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Colors",
                columns: new[] { "Id", "NumberColor", "ShirtColor" },
                values: new object[,]
                {
                    { 1, "White", "Red" },
                    { 2, "White", "Blue" },
                    { 3, "White", "Green" },
                    { 4, "Black", "Yellow" },
                    { 5, "White", "Purple" },
                    { 6, "Black", "Wihte" },
                    { 7, "White", "Black" }
                });

            migrationBuilder.InsertData(
                table: "Sports",
                columns: new[] { "Id", "HasEmptyGoal", "HasGoalkeeper", "MaxPlayers", "Name", "Sports" },
                values: new object[,]
                {
                    { 1, false, true, 11, "Football", 0 },
                    { 2, true, true, 7, "Handball", 1 },
                    { 3, false, false, 5, "Basketball", 3 },
                    { 4, true, true, 6, "Ice Hockey", 2 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "BirthDay", "Email", "Name", "PasswordHash", "Salt", "UserName" },
                values: new object[] { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "testuser@test.com", "Test User", "hash123", "salt123", "TestUser1" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Sports",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Sports",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Sports",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Sports",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
