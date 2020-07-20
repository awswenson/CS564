using System;
using System.ComponentModel.DataAnnotations;
using System.Numerics;

namespace CS564.Models
{
    public class Trend
    {
        public DateTime Date { get; set; }

        public string County { get; set; }

        public string State { get; set; }

        public string Animal { get; set; }

        public int Trending { get; set; }

        public string Class { get; set; }

    }
}
