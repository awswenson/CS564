using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CS564.Models
{
    [Table("Locations", Schema = "trn")]
    public class Location
    {
        [Key]
        public int LocationID { get; set; }

        public string County { get; set; }

        public string State { get; set; }
    }
}
