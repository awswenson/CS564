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
        public ActionResult<IEnumerable<Trend>> TrendObservations(DateTime date, int locationID)
        {
            IEnumerable<Trend> allTrends = _context.GetAllTrendsMatchingCriteria(date, locationID);

            List<Trend> top5Animals = new List<Trend>();
            List<Trend> mammals = new List<Trend>();
            List<Trend> birds = new List<Trend>();
            List<Trend> reptiles = new List<Trend>();

            int Top5Counter = 5; 
            Trend currentTrend = null; 
            for (int i = 0; i < allTrends.Count(); i++)
            {
                currentTrend = allTrends.ElementAt(i);

                if (Top5Counter > 0)
                {
                    top5Animals.Add(currentTrend);
                    Top5Counter--;
                }

                if (currentTrend.Class.Equals("Mammalia"))
                {
                    mammals.Add(currentTrend);
                }
                else if (currentTrend.Class.Equals("Aves"))
                {
                    birds.Add(currentTrend); 
                } 
                else if (currentTrend.Class.Equals("Reptilia"))
                {
                    reptiles.Add(currentTrend); 
                }
            }

            return Ok( new
            {
                top5Animals ,
                mammals , 
                birds ,
                reptiles
            }   
                );
        }
    }
}
