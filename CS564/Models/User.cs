using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CS564.Models
{
    [Table("Users", Schema = "trn")]
    public class User
    {
        public int UserID { get; set; }

        public string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }
    }
}
