using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MathTutor.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CompleteAssessmentProfileHistoryMvp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssessmentId",
                table: "LearningHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventType",
                table: "LearningHistories",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TopicId",
                table: "LearningHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "LearnerProfiles",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "RecommendedDifficultyLevel",
                table: "LearnerProfiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RecommendedNextTopic",
                table: "LearnerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StrongestTopic",
                table: "LearnerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TeachingApproach",
                table: "LearnerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WeakestTopic",
                table: "LearnerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CorrectAnswers",
                table: "Assessments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DifficultyLevel",
                table: "Assessments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IncorrectAnswers",
                table: "Assessments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Assessments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAt",
                table: "Assessments",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "TopicId",
                table: "Assessments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalQuestions",
                table: "Assessments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AssessmentQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssessmentId = table.Column<int>(type: "integer", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssessmentQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssessmentQuestions_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssessmentQuestions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssessmentId = table.Column<int>(type: "integer", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    SelectedAnswer = table.Column<string>(type: "text", nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentAnswers_Assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalTable: "Assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LearningHistories_AssessmentId",
                table: "LearningHistories",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_LearningHistories_TopicId",
                table: "LearningHistories",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_TopicId",
                table: "Assessments",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentQuestions_AssessmentId_QuestionId",
                table: "AssessmentQuestions",
                columns: new[] { "AssessmentId", "QuestionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentQuestions_QuestionId",
                table: "AssessmentQuestions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAnswers_AssessmentId_QuestionId",
                table: "StudentAnswers",
                columns: new[] { "AssessmentId", "QuestionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentAnswers_QuestionId",
                table: "StudentAnswers",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assessments_Topics_TopicId",
                table: "Assessments",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LearningHistories_Assessments_AssessmentId",
                table: "LearningHistories",
                column: "AssessmentId",
                principalTable: "Assessments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LearningHistories_Topics_TopicId",
                table: "LearningHistories",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assessments_Topics_TopicId",
                table: "Assessments");

            migrationBuilder.DropForeignKey(
                name: "FK_LearningHistories_Assessments_AssessmentId",
                table: "LearningHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_LearningHistories_Topics_TopicId",
                table: "LearningHistories");

            migrationBuilder.DropTable(
                name: "AssessmentQuestions");

            migrationBuilder.DropTable(
                name: "StudentAnswers");

            migrationBuilder.DropIndex(
                name: "IX_LearningHistories_AssessmentId",
                table: "LearningHistories");

            migrationBuilder.DropIndex(
                name: "IX_LearningHistories_TopicId",
                table: "LearningHistories");

            migrationBuilder.DropIndex(
                name: "IX_Assessments_TopicId",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "AssessmentId",
                table: "LearningHistories");

            migrationBuilder.DropColumn(
                name: "EventType",
                table: "LearningHistories");

            migrationBuilder.DropColumn(
                name: "TopicId",
                table: "LearningHistories");

            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "LearnerProfiles");

            migrationBuilder.DropColumn(
                name: "RecommendedDifficultyLevel",
                table: "LearnerProfiles");

            migrationBuilder.DropColumn(
                name: "RecommendedNextTopic",
                table: "LearnerProfiles");

            migrationBuilder.DropColumn(
                name: "StrongestTopic",
                table: "LearnerProfiles");

            migrationBuilder.DropColumn(
                name: "TeachingApproach",
                table: "LearnerProfiles");

            migrationBuilder.DropColumn(
                name: "WeakestTopic",
                table: "LearnerProfiles");

            migrationBuilder.DropColumn(
                name: "CorrectAnswers",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "DifficultyLevel",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "IncorrectAnswers",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "StartedAt",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "TopicId",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "TotalQuestions",
                table: "Assessments");
        }
    }
}
