using Backend.API.Data;
using Backend.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            if (string.IsNullOrWhiteSpace(loginUser.FirstName) || string.IsNullOrWhiteSpace(loginUser.LastName))
            {
                return BadRequest("İsim ve Soyisim gereklidir.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.FirstName == loginUser.FirstName && u.LastName == loginUser.LastName);

            if (user == null)
            {
                user = new User
                {
                    FirstName = loginUser.FirstName,
                    LastName = loginUser.LastName
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(user);
        }
    }
}
