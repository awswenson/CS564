﻿using System;

namespace CS564.Models
{
    public class Observation
    {
        public int ID { get; set; }

        public DateTime ObservationDate { get; set; }

        public string Latitude { get; set; }

        public string Longitude { get; set; }

        public string Animal { get; set; }

        public string Comments { get; set; }
    }
}
