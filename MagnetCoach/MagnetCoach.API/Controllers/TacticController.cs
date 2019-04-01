using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagnetCoach.Application.Dtos.Tactic;
using MagnetCoach.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MagnetCoach.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TacticController : ControllerBase
    {
        private readonly ITacticAppService tacticAppService;

        public TacticController(ITacticAppService tacticAppService)
        {
            this.tacticAppService = tacticAppService;
        }

        [HttpPost]
        public ActionResult CreateTactic([FromBody]TacticCreateDto tactic)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{userId}")]
        public ActionResult<UserTacticListDto> GetTactics(int userId)
        {
            return Ok(tacticAppService.GetTacticsAsync(userId));
        }
    }
}