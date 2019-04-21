using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using MagnetCoach.Application.Dtos;
using MagnetCoach.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MagnetCoach.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserAppService userAppService;

        public UserController(IUserAppService userAppService)
        {
            this.userAppService = userAppService;
        }

        [HttpPost("signup")]
        public async Task<ActionResult> CreateUser([FromBody]RegisterUserDto user)
        {
            var createdUser = await userAppService.Register(user);
            if (!createdUser.Succeeded)
            {
                return BadRequest(createdUser.Errors.Select(e => e.Description));
            }
            else
            {
                return Ok();
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody]LoginUserDto user)
        {
            var loginToken = await userAppService.Login(user);
            if (loginToken != null)
            {
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(loginToken) });
            }
            else
            {
                return BadRequest();
            }

        }
    }
}