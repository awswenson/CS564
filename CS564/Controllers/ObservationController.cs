using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS564.Controllers
{
    [ApiController]
    [Route("observation")]
    public class ObservationController : ControllerBase
    {
        private readonly ILogger<ObservationController> _logger;
        private readonly DatabaseContext _context;

        public ObservationController(ILogger<ObservationController> logger, DatabaseContext context)
        {
            _logger = logger;
            _context = context;
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
        [Route("{id:int}")]
        public ActionResult DeleteObservations(int id)
        {
            // TODO
            // We should return NotFound() if we cannot find the observation in the database

            return Ok();
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<ActionResult> UpdateObservation(int id)
        {
            Observation observation = await GetObservationFromBody(HttpContext.Request.Body);

            if (observation == null)
            {
                return BadRequest();
            }

            // TODO
            // We should return NotFound() if we cannot find the observation in the database

            return Ok();
        }

        [HttpPut]
        [Route("")]
        public async Task<ActionResult<int>> AddObservations()
        {
            Observation observation = await GetObservationFromBody(HttpContext.Request.Body);

            if (observation == null)
            {
                return BadRequest();
            }

            // TODO

            return Ok(45);
        }

        private async Task<Observation> GetObservationFromBody(Stream body)
        {
            try
            {
                using (var streamReader = new HttpRequestStreamReader(body, Encoding.UTF8))
                {
                    using (var jsonReader = new JsonTextReader(streamReader))
                    {
                        JObject json = await JObject.LoadAsync(jsonReader);
                        return json.ToObject<Observation>();
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
