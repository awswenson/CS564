using System;
using System.ComponentModel.DataAnnotations;

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
