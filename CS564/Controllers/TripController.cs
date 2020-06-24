using System;
using System.Collections.Generic;
using System.Linq;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CS564.Controllers
{
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly ILogger<TripController> _logger;

        public TripController(ILogger<TripController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("trips")]
        public IEnumerable<Trip> GetAllTrips()
        {
            return Enumerable.Range(1, 5).Select(index => new Trip
            {
                ID = index,
                StartDate = DateTime.Now.AddDays(index),
                EndDate = DateTime.Now.AddDays(index + 1),
                Location = "Madison, WI",
            })
            .ToArray();
        }
    }
}
