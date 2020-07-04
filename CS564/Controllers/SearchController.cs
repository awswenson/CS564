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
    [Route("search")]
    public class SearchController : ControllerBase
    {
        private readonly ILogger<SearchController> _logger;

        public SearchController(ILogger<SearchController> logger)
        {
            _logger = logger;
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
