﻿using CS564.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CS564.Database
{
	public class DatabaseContext : DbContext
	{
		public DbSet<User> Users { get; set; }

		public DbSet<Trend> Trends { get; set; }

		public DbSet<Observation> Observations { get; set; }

		public DbSet<Location> Locations { get; set; }

		public DbSet<Animal> Animals { get; set; }

		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
		{

		}

        #region Search queries
		public IEnumerable<Trend> GetAllTrendsMatchingCriteria(DateTime date, int locationID)
		{
			try
			{
				if (locationID <= 0)
				{
					return this.GetAllTrendsMatchingCriteria(date);
				}

				Location location = this.Locations.FromSqlRaw("SELECT * FROM trn.Locations WHERE LocationID = {0}", locationID).First();

				if (location == null)
				{
					return this.GetAllTrendsMatchingCriteria(date);
				}
				else
				{
					return this.Trends.FromSqlRaw("SELECT * FROM trn.TopFiveTrends1 WHERE Date = {0} AND County = {1} AND State = {2}", date, location.County, location.State).ToList();
				}
			}
			catch
			{
				return new List<Trend>();
			}
		}

		public IEnumerable<Trend> GetAllTrendsMatchingCriteria(DateTime date)
		{
			try
			{
				return this.Trends.FromSqlRaw("SELECT * FROM trn.TopFiveTrends1 WHERE Date = {0}", date).ToList();
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
				//return this.Observations.FromSqlRaw("SELECT * FROM trn.Observations o, trn.Animals a, trn.Locations l WHERE o.UserID = {0} AND o.TaxonID = a.TaxonID AND o.LocationID = l.LocationID", userID).ToList();

				return this.Observations.Where(observations => observations.UserID == userID).Include(observation => observation.Animal).Include(observation => observation.Location).ToList();
			}
			catch
			{
				return new List<Observation>();
			}
		}

		public bool DeleteObservation(int observationID)
		{
			if (observationID <= 0)
			{
				return false;
			}

			try
			{
				// this.Observations.FromSqlRaw("DELETE FROM trn.Observations WHERE ObservationID = {0}", observationID);

				Observation observation = new Observation { ObservationID = observationID };

				this.Observations.Attach(observation);
				this.Observations.Remove(observation);

				return this.SaveChanges() == 1;
			}
			catch
			{
				return false;
			}
		}

		public bool AddObservation(Observation observation)
		{
			if (observation == null)
			{
				return false;
			}

			observation.Animal = null;
			observation.Location = null;
			observation.Location = null;
			observation.User = null;

			try
			{
				//this.Observations.FromSqlRaw("INSERT INTO trn.Observations (TaxonID, ObservationDate, LocationID, UserID, Comments, ObservationLatitude, ObservationLongitude) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})",
				//	observation.TaxonID, observation.ObservationDate, observation.LocationID, observation.UserID, observation.Comments, observation.ObservationLatitude, observation.ObservationLongitude);

				this.Observations.Add(observation);
				bool success = this.SaveChanges() == 1;

				// At this point, observationID will be populated with the ID that was used when inserting into the database

				if (success) 
				{
					this.Entry(observation).Reference(o => o.Animal).Load(); // Loads the animal into the observation object
					this.Entry(observation).Reference(o => o.Location).Load(); // Loads the location into the observation object
				}

				return success;
			}
			catch
			{
				return false;
			}
		}

		public bool UpdateObservation(Observation observation)
		{
			if (observation == null)
			{
				return false;
			}

			observation.Animal = null;
			observation.Location = null;
			observation.Location = null;
			observation.User = null;

			try
			{
				//this.Observations.FromSqlRaw("INSERT INTO trn.Observations (TaxonID, ObservationDate, LocationID, UserID, Comments, ObservationLatitude, ObservationLongitude) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6})",
				//	observation.TaxonID, observation.ObservationDate, observation.LocationID, observation.UserID, observation.Comments, observation.ObservationLatitude, observation.ObservationLongitude);

				this.Observations.Update(observation);
				bool success = this.SaveChanges() == 1;

				if (success)
				{
					this.Entry(observation).Reference(o => o.Animal).Load(); // Loads the animal into the observation object
					this.Entry(observation).Reference(o => o.Location).Load(); // Loads the location into the observation object
				}

				return success;
			}
			catch
			{
				return false;
			}
		}
		#endregion

		#region User queries
		public User ValidateUser(int userID, string password)
		{
			if (userID <= 0 || string.IsNullOrEmpty(password))
			{
				return null;
			}

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
			if (userID <= 0)
			{
				return null;
			}

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

				return this.SaveChanges() == 1;
			}
			catch
			{
				return false;
			}
		}
        #endregion
    }
}
