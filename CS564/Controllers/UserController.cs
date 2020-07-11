using CS564.Database;
using CS564.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
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
        public async Task<ActionResult<string>> CreateAccount()
        {
            User user = await GetUserFromBody(HttpContext.Request.Body);

            if (user == null)
            {
                return BadRequest();
            }

            string authHeader = HttpContext.Request.Headers["Authorization"];

            bool success = this.GetUsernamePasswordFromAuthHeader(authHeader, out int userID, out string password);

            if (!success)
            {
                return BadRequest();
            }

            user.UserID = userID;
            user.Password = password;

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
    }
}
