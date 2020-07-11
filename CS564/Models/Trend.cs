using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CS564.Models
{

    public class Trend
    {
        [Key]
        public int TrendId { get; set; }
        public DateTime Date { get; set; }

        public string County { get; set; }

        public string State { get; set; }

        public string Animal { get; set; }

        public int Trending { get; set; }
    }
}
