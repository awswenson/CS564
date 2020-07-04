using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CS564.Models
{
    public class SearchResult
    {
        public DateTime Date { get; set; }

        public string Location { get; set; }

        public string Animal { get; set; }

        public int Trending { get; set; }
    }
}
