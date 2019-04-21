using MagnetCoach.Application.Dtos;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

namespace MagnetCoach.Application.Interfaces
{
    public interface IUserAppService
    {
        Task<IdentityResult> Register(RegisterUserDto dto);
        Task<JwtSecurityToken> Login(LoginUserDto dto);
    }
}
