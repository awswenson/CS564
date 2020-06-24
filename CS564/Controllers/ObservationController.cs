using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CS564.Controllers
{
    [ApiController]
    [Route("observation")]
    public class ObservationController : ControllerBase
    {
        private readonly ILogger<ObservationController> _logger;

        public ObservationController(ILogger<ObservationController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("")]
        public IEnumerable<Observation> GetAllObservations()
        {
            return Enumerable.Range(1, 5).Select(index => new Observation
            {
                ID = index,
                ObservationDate = DateTime.Now.AddDays(-index),
                Latitude = "Here's the lattitude",
                Longitude = "Here's the longitude",
                Animal = "Whitetail Deer",
                Comments = "These are some comments",
            })
            .ToArray();
        }

        [HttpDelete]
        [Route("/{key:int}")]
        public HttpResponseMessage DeleteObservations(int key)
        {
            // TODO

            return new HttpResponseMessage();
        }

        [HttpPut]
        [Route("{key:int}")]
        public HttpResponseMessage UpdateObservation(int key, Observation observation)
        {
            // TOOD

            return new HttpResponseMessage();
        }

        [HttpPut]
        [Route("")]
        public HttpResponseMessage AddObservations(Observation observation)
        {
            // TOOD

            return new HttpResponseMessage();
        }
    }
}
