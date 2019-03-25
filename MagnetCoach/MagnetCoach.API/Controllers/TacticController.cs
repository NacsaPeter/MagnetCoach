using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagnetCoach.Application.Dtos.Tactic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MagnetCoach.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TacticController : ControllerBase
    {
        [HttpPost]
        public ActionResult CreateTactic([FromBody]TacticCreateDto tactic)
        {
            throw new NotImplementedException();
        }
    }
}