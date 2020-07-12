using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CS564.Models
{
    [Table("Observations", Schema = "trn")]
    public class Observation
    {
        [Key]
        public int ObservationID { get; set; }

        [ForeignKey(nameof(Animal))]
        public int TaxonID { get; set; }

        [ForeignKey(nameof(Location))]
        public int LocationID { get; set; }

        [ForeignKey(nameof(User))]
        public int UserID { get; set; }

        public DateTime ObservationDate { get; set; }

        public string ObservationLatitude { get; set; }

        public string ObservationLongitude { get; set; }

        public string Comments { get; set; }
    }
}
