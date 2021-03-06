﻿using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace CS564.Controllers
{
    [ApiController]
    [Route("animals")]
    public class AnimalController : ControllerBase
    {
        private readonly ILogger<AnimalController> _logger;
        private readonly DatabaseContext _context;

        public AnimalController(ILogger<AnimalController> logger, DatabaseContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("{searchValue}")]
        public ActionResult<IEnumerable<Animal>> GetAllAnimals(string searchValue)
        {
            return Ok(_context.GetAnimalsBySearchValue(searchValue));
        }
    }
}
