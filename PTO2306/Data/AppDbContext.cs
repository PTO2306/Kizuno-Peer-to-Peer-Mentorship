using Microsoft.EntityFrameworkCore;
using PTO2306.Data.Models;

namespace PTO2306.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
   public DbSet<User> Users { get; set; } 
}