using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CS564.Controllers
{
    [ApiController]
    [Route("api/trend")]
    public class TrendController : ControllerBase
    {
        private readonly ILogger<TrendController> _logger;
        private readonly DatabaseContext _context;

        public TrendController(ILogger<TrendController> logger, DatabaseContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("")]
        public ActionResult<IEnumerable<Trend>> TrendObservations(DateTime date, string animal, string county, string state)
        {
            return Ok(_context.Trend.FromSqlRaw("SELECT * FROM [TuneUp-dev].[trn].[Trends] WHERE Date = {0} and county = {1} and state = {2}", date, county, state).ToArray());
        }
    }
}
