using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CS564.Controllers
{
    [ApiController]
    [Route("search")]
    public class SearchController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;
        private readonly DatabaseContext _context;

        public SearchController(ILogger<SearchController> logger, DatabaseContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("")]
        public IEnumerable<SearchResult> SearchObservations(DateTime date, string animal, string county, string state)
        {
            return Enumerable.Range(1, 5).Select(index => new SearchResult
            {
                Date = DateTime.Now.AddDays(-index),
                Animal = "Whitetail Deer",
                Location = "Madison, WI",
                Trending = index * 3,
            })
            .ToArray();
        }
    }
}
