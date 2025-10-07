using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PTO2306.Migrations
{
    /// <inheritdoc />
    public partial class ChangedListingModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Availability",
                table: "Listings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Mode",
                table: "Listings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SkillLevel",
                table: "Listings",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Listings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Availability",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Mode",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "SkillLevel",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Listings");
        }
    }
}
