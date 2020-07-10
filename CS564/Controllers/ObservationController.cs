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
        public ActionResult<IEnumerable<Observation>> GetAllObservations()
        {
            if (!this.GetUserFromAuthHeader(HttpContext.Request.Headers["Authorization"], out User user))
            {
                return Unauthorized();
            }

            IEnumerable<Observation> observations = Enumerable.Range(1, 5).Select(index => new Observation
            {
                ID = index,
                ObservationDate = DateTime.Now.AddDays(-index).Date,
                Latitude = "Here's the lattitude",
                Longitude = "Here's the longitude",
                Animal = "Whitetail Deer",
                Comments = "These are some comments",
            })
            .ToArray();

            return Ok(observations);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public ActionResult DeleteObservations(int id)
        {
            if (!this.GetUserFromAuthHeader(HttpContext.Request.Headers["Authorization"], out User user))
            {
                return Unauthorized();
            }

            // TODO
            // We should return NotFound() if we cannot find the observation in the database

            return Ok();
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<ActionResult> UpdateObservation(int id)
        {
            if (!this.GetUserFromAuthHeader(HttpContext.Request.Headers["Authorization"], out User user))
            {
                return Unauthorized();
            }

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
            if (!this.GetUserFromAuthHeader(HttpContext.Request.Headers["Authorization"], out User user))
            {
                return Unauthorized();
            }

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

        private bool GetUserFromAuthHeader(string authHeader, out User user)
        {
            user = null;

            if (!string.IsNullOrEmpty(authHeader))
            {
                string token = authHeader.Substring("Token ".Length).Trim();

                // TOKEN Get the user from the database using the token

                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
