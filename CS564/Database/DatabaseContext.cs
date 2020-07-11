using CS564.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace CS564.Database
{
	public class DatabaseContext : DbContext
	{
		public DbSet<User> Users { get; set; }

		public DbSet<Trend> Trend { get; set; }

		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
		{

		}

		public User ValidateUser(int userID, string password)
		{
			try
			{
				return this.Users.First(user => user.UserID == userID && user.Password == password);
			}
			catch
			{
				return null;
			}
		}

		public User GetUser(int userID)
		{
			try
			{
				return this.Users.First(user => user.UserID == userID);
			}
			catch
			{
				return null;
			}
		}

		public bool CreateUser(User user)
		{
			try
			{
				this.Users.Add(user);
				return this.SaveChanges() == 1;
			}
			catch
			{
				return false;
			}
		}
	}
}
