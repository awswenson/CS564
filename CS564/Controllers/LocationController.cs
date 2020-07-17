using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace CS564.Controllers
{
    [ApiController]
    [Route("locations")]
    public class LocationController : ControllerBase
    {
        private readonly ILogger<LocationController> _logger;
        private readonly DatabaseContext _context;

        public LocationController(ILogger<LocationController> logger, DatabaseContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("{searchValue}")]
        public ActionResult<IEnumerable<Location>> GetLocationsBySearchValue(string searchValue)
        {
            IEnumerable<Location> locations = _context.Locations.FromSqlRaw("SELECT * FROM trn.Locations WHERE County LIKE {0} OR State LIKE {0} ORDER BY County ASC", searchValue + '%').ToList();

            return Ok(locations);
        }
    }
}
