using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CS564.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly DatabaseContext _context;
        private readonly IConfiguration _config;

        public UserController(IConfiguration config, ILogger<UserController> logger, DatabaseContext context)
        {
            _config = config;
            _logger = logger;
            _context = context;
        }

        [HttpPost]
        [Route("login")]
        public ActionResult<string> Login()
        {
            bool success = this.GetUsernamePasswordFromAuthHeader(HttpContext.Request.Headers["Authorization"], out int userID, out string password);

            if (!success)
            {
                return BadRequest();
            }

            User user = _context.ValidateUser(userID, password);

            if (user == null)
            {
                return Unauthorized();
            }
            else
            {
                return Ok(this.GenerateJSONWebToken(user));
            }
        }

        [HttpGet]
        [Authorize]
        [Route("profile")]
        public ActionResult<User> GetProfile()
        {
            User user = this.GetUserFromRequest(HttpContext.User);

            if (user == null)
            {
                return BadRequest();
            }
            else
            {
                return Ok(user);
            }
        }

        [HttpPost]
        [Route("create")]
        public async Task<ActionResult> CreateAccount()
        {
            User user = await GetUserFromBody(HttpContext.Request.Body);

            if (user == null)
            {
                return BadRequest("No user data specified!");
            }

            string authHeader = HttpContext.Request.Headers["Authorization"];

            bool success = this.GetUsernamePasswordFromAuthHeader(authHeader, out int userID, out string password);

            if (!success)
            {
                return BadRequest("There was an error retrieving the username and password from the request! Please try again.");
            }

            user.UserID = userID;
            user.Password = password;

            if (!this.ValidateUser(user, out string errorMessage))
            {
                return BadRequest(errorMessage);
            }

            if (_context.DoesUserExist(userID))
            {
                return BadRequest("The provided user ID is already in use. Please select another ID.");
            }

            _context.CreateUser(user);

            return Ok(this.GenerateJSONWebToken(user));
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

        private User GetUserFromRequest(ClaimsPrincipal principal)
        {
            if (principal.HasClaim(c => c.Type == ClaimTypes.NameIdentifier))
            {
                if (int.TryParse(principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value, out int userID))
                {
                    return _context.GetUser(userID);
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        private bool GetUsernamePasswordFromAuthHeader(string authHeader, out int userID, out string password)
        {
            userID = -1;
            password = string.Empty;

            if (authHeader != null && authHeader.StartsWith("Basic"))
            {
                string encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
                string usernamePassword = Encoding.GetEncoding("iso-8859-1").GetString(Convert.FromBase64String(encodedUsernamePassword));

                int seperatorIndex = usernamePassword.IndexOf(':');
                
                if (!int.TryParse(usernamePassword.Substring(0, seperatorIndex), out userID))
                {
                    return false;
                }
               
                password = usernamePassword.Substring(seperatorIndex + 1);

                return true;
            }
            else
            {
                return false;
            }
        }

        private string GenerateJSONWebToken(User user)
        {
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            Claim[] claims = new Claim[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString())
            };

            JwtSecurityToken token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Issuer"], claims, expires: DateTime.Now.AddDays(1), signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool ValidateUser(User user, out string errorMessage)
        {
            Regex emailRegex = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

            if (user == null)
            {
                errorMessage = "No user data specified!";
            }
            else if (string.IsNullOrEmpty(user.Email))
            {
                errorMessage = "An email address is required! Please provide an email address.";
            }
            else if (!emailRegex.IsMatch(user.Email.ToLower()))
            {
                errorMessage = "The format of the provided email is invalid!";
            }
            else if (string.IsNullOrEmpty(user.FirstName) || string.IsNullOrEmpty(user.LastName))
            {
                errorMessage = "The provided name is invalid! Make sure to specify both a first and last name.";
            }
            else if (user.UserID <= 0)
            {
                errorMessage = "The provided user ID is invalid! Please provide a positive user ID.";
            }
            else if (string.IsNullOrEmpty(user.Password))
            {
                errorMessage = "Please specify a password!";
            }
            else
            {
                errorMessage = string.Empty;
            }

            return string.IsNullOrEmpty(errorMessage);
        }
    }
}
