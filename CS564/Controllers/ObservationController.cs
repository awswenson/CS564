using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
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
        [Authorize]
        [Route("")]
        public ActionResult<IEnumerable<Observation>> GetAllObservations()
        {
            User user = this.GetUserFromRequest(HttpContext.User);

            if (user == null)
            {
                return BadRequest();
            }

            IEnumerable<Observation> observations = _context.GetAllObservations(user.UserID);

            return Ok(observations);
        }

        [HttpDelete]
        [Authorize]
        [Route("{id:int}")]
        public ActionResult DeleteObservations(int id)
        {
            User user = this.GetUserFromRequest(HttpContext.User);

            if (user == null)
            {
                return BadRequest();
            }

            bool success = _context.DeleteObservation(id);

            if (success)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPut]
        [Authorize]
        [Route("{id:int}")]
        public async Task<ActionResult> UpdateObservation(int id)
        {
            User user = this.GetUserFromRequest(HttpContext.User);

            if (user == null)
            {
                return BadRequest();
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
        [Authorize]
        [Route("")]
        public async Task<ActionResult<int>> AddObservations()
        {
            User user = this.GetUserFromRequest(HttpContext.User);

            if (user == null)
            {
                return BadRequest();
            }

            Observation observation = await GetObservationFromBody(HttpContext.Request.Body);

            if (observation == null)
            {
                return BadRequest();
            }

            observation.UserID = user.UserID;
            observation.LocationID = 1; // TODO 

            int observationID = _context.CreateObservation(observation);

            if (observationID == -1)
            {
                return BadRequest();
            }
            else
            {
                return Ok(observationID);
            }
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

        public User GetUserFromRequest(ClaimsPrincipal principal)
        {
            if (principal.HasClaim(c => c.Type == ClaimTypes.NameIdentifier))
            {
                if (int.TryParse(principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value, out int userID))
                {
                    return _context.GetUser(userID);
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
    }
}
