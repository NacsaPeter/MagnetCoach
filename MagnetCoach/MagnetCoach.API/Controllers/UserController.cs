using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagnetCoach.Application.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MagnetCoach.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        public ActionResult CreateUser([FromBody]RegisterUserDto user)
        {
            throw new NotImplementedException();
        }
    }
}