using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagnetCoach.Application.Dtos.Tactic;
using MagnetCoach.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MagnetCoach.API.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
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
        public async Task CreateTactic([FromBody]CreateTacticDto tactic)
        {
            await tacticAppService.CreateTacticAsync(tactic);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserTacticListDto>> GetTactics(int userId)
        {
            return Ok(await tacticAppService.GetTacticsAsync(userId));
        }

        [HttpGet("{userId}/{tacticId}")]
        public async Task<ActionResult<TacticDto>> GetTactic(int userId, int tacticId)
        {
            return Ok(await tacticAppService.GetTacticAsync(tacticId));
        }
    }
}