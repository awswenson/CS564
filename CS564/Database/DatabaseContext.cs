using CS564.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CS564.Database
{
	public class DatabaseContext : DbContext
	{
		public DbSet<User> Users { get; set; }

		public DbSet<Trend> Trend { get; set; }

		public DbSet<Observation> Observations { get; set; }

		public DbSet<Location> Locations { get; set; }

		public DbSet<Animal> Animals { get; set; }

		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
		{

		}

        #region Search queries
		public IEnumerable<Trend> GetAllTrendsMatchingCriteria(DateTime date, Animal animal, string county, string state)
		{
			try
			{
				return this.Trend.FromSqlRaw("SELECT * FROM trn.Trends WHERE Date = {0} AND County = {1} AND State = {2}", date, county, state).ToList();
			}
			catch
			{
				return new List<Trend>();
			}
		}
        #endregion

        #region Observation queries
        public IEnumerable<Observation> GetAllObservations(int userID)
		{
			try
			{
				//return this.Observations.FromSqlRaw("SELECT * FROM trn.Observations WHERE UserID = {0}", userID).ToList();
				return this.Observations.Where(observations => observations.UserID == userID).Include(observations => observations.Animal).ToList();
			}
			catch
			{
				return new List<Observation>();
			}
		}

		public bool DeleteObservation(int observationID)
		{
			try
			{
				this.Observations.FromSqlRaw("DELETE FROM trn.Observations WHERE ObservationID = {0}", observationID);

				return true;
			}
			catch
			{
				return false;
			}
		}

		public int CreateObservation(Observation observation)
		{
			try
			{
				//this.Observations.FromSqlRaw("INSERT INTO trn.Observations (TaxonID, ObservationDate, LocationID, UserID, Comments, ObservationLatitude, ObservationLongitude) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})",
				//	observation.TaxonID, observation.ObservationDate, observation.LocationID, observation.UserID, observation.Comments, observation.ObservationLatitude, observation.ObservationLongitude);

				this.Observations.Add(observation);
				this.SaveChanges();

				return observation.ObservationID;
			}
			catch
			{
				return -1;
			}
		}
		#endregion

		#region User queries
		public User ValidateUser(int userID, string password)
		{
			try
			{
				return this.Users.FromSqlRaw("SELECT * FROM trn.Users WHERE UserID = {0} AND Password = {1}", userID, password).First();
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
				return this.Users.FromSqlRaw("SELECT * FROM trn.Users WHERE UserID = {0}", userID).First();
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
				//this.Users.FromSqlRaw("INSERT INTO trn.Users (UserID, FirstName, LastName, Password, Email) VALUES ({0}, {1}, {2}, {3}, {4})",
				//	user.UserID, user.FirstName, user.LastName, user.Password, user.Email);

				this.Users.Add(user);
				this.SaveChanges();

				return true;
			}
			catch
			{
				return false;
			}
		}
        #endregion
    }
}
