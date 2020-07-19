using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CS564.Models
{
    [Table("Observations", Schema = "trn")]
    public class Observation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ObservationID { get; set; }

        public int TaxonID { get; set; }

        [ForeignKey(nameof(TaxonID))]
        public virtual Animal Animal { get; set; }

        public int LocationID { get; set; }

        [ForeignKey(nameof(LocationID))]
        public virtual Location Location { get; set; }

        public int UserID { get; set; }

        [ForeignKey(nameof(UserID))]
        public virtual User User { get; set; }

        public DateTime ObservationDate { get; set; }

        [Column(TypeName = "numeric(19,12)")]
        public decimal ObservationLatitude { get; set; }

        [Column(TypeName = "numeric(19,12)")]
        public decimal ObservationLongitude { get; set; }

        public string Comments { get; set; }
    }
}
