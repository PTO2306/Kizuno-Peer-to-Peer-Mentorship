using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PTO2306.Migrations
{
    /// <inheritdoc />
    public partial class AddedProfilePicCol : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "UserProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "UserProfiles");
        }
    }
}
