using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CS564.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CS564.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("login")]
        public ActionResult<string> Login()
        {
            string authHeader = HttpContext.Request.Headers["Authorization"];

            string username, password;
            bool success = this.GetUsernamePasswordFromAuthHeader(authHeader, out username, out password);

            if (success)
            {
                // TODO - Check the username and password matches a user in the database

                return Ok("TOKEN");
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("profile")]
        public User GetProfile()
        {
            return new User()
            {
                ID = "Digoramma",
                FirstName = "Alex",
                LastName = "Swenson",
                Email = "awswenson@wisc.edu",
            };
        }

        /// <summary>
        /// Given the
        /// </summary>
        /// <param name="authHeader"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        private bool GetUsernamePasswordFromAuthHeader(string authHeader, out string username, out string password)
        {
            username = string.Empty;
            password = string.Empty;

            if (authHeader != null && authHeader.StartsWith("Basic"))
            {
                string encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
                string usernamePassword = Encoding.GetEncoding("iso-8859-1").GetString(Convert.FromBase64String(encodedUsernamePassword));

                int seperatorIndex = usernamePassword.IndexOf(':');
                username = usernamePassword.Substring(0, seperatorIndex);
                password = usernamePassword.Substring(seperatorIndex + 1);

                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
