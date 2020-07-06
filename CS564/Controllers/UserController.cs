using CS564.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

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

            if (!success)
            {
                return BadRequest();
            }

            // TODO - Check the username and password matches a user in the database

            return Ok("TOKEN");
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

        [HttpPost]
        [Route("create")]
        public async Task<ActionResult<string>> CreateAccount()
        {
            User user = await GetUserFromBody(HttpContext.Request.Body);

            if (user == null)
            {
                return BadRequest();
            }

            string authHeader = HttpContext.Request.Headers["Authorization"];

            string username, password;
            bool success = this.GetUsernamePasswordFromAuthHeader(authHeader, out username, out password);

            if (!success)
            {
                return BadRequest();
            }

            user.ID = username;
            user.Password = password;

            // TODO - Add the user to the database

            return Ok("TOKEN");
        }

        private async Task<User> GetUserFromBody(Stream body)
        {
            try
            {
                using (var streamReader = new HttpRequestStreamReader(body, Encoding.UTF8))
                {
                    using (var jsonReader = new JsonTextReader(streamReader))
                    {
                        JObject json = await JObject.LoadAsync(jsonReader);
                        return json.ToObject<User>();
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

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
