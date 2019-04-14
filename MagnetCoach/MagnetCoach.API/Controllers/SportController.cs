using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagnetCoach.Application.Dtos.Sport;
using MagnetCoach.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MagnetCoach.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SportController : Controller
    {
        private readonly ISportAppService sportAppService;

        public SportController(ISportAppService sportAppService)
        {
            this.sportAppService = sportAppService;
        }

        [HttpGet]
        public async Task<ActionResult<SportsDto>> GetSports()
        {
            return Ok(await sportAppService.GetSportsAsync());
        }
    }
}
