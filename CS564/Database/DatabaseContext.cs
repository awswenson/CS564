using CS564.Models;
using Microsoft.EntityFrameworkCore;

namespace CS564.Database
{
	public class DatabaseContext : DbContext
	{
		public DbSet<User> Users { get; set; }

		public DbSet<Trend> Trend { get; set; }
		//protected override void OnModelCreating(ModelBuilder modelBuilder)
		//{
		//	modelBuilder.Entity<Trend>().HasNoKey();
		//}
		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
		{

		}
	}
}
