using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CS564.Models
{
    [Table("Animals", Schema = "trn")]
    public class Animal
    {
        [Key]
        public int TaxonID { get; set; }

        public string ScientificName { get; set; }

        public string CommonName { get; set; }

        public string Order { get; set; }

        public string Family { get; set; }

        public string Genus { get; set; }

        public string Kingdom { get; set; }

        public string Phylum { get; set; }

        public string Class { get; set; }
    }
}
