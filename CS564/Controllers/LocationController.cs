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
            return Ok(_context.GetLocationsBySearchValue(searchValue));
        }
    }
}
