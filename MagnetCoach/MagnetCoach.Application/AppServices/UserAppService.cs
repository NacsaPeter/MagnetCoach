using MagnetCoach.Application.Dtos;
using MagnetCoach.Application.Interfaces;
using MagnetCoach.Domain.Models;
using MagnetCoach.EF;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MagnetCoach.Application.AppServices
{
    public class UserAppService : IUserAppService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> loginManager;
        private readonly ApplicationDbContext context;

        public UserAppService(
            UserManager<User> userManager,
            SignInManager<User> loginManager,
            ApplicationDbContext context)
        {
            this.userManager = userManager;
            this.loginManager = loginManager;
            this.context = context;
        }

        public async Task<IdentityResult> Register(RegisterUserDto dto)
        {
            var createdUser = await userManager.CreateAsync(new User
            {
                Name = $"{dto.Prefix} {dto.FirstName} {dto.LastName}",
                Email = dto.Email,
                UserName = dto.UserName,
                BirthDay = dto.BirthDay
            }, dto.Password);

            return createdUser;
        }

        public async Task<JwtSecurityToken> Login(LoginUserDto dto)
        {
            var login = await loginManager.PasswordSignInAsync(dto.UserName, dto.Password, false, false);
            if (login.Succeeded)
            {
                var user = await userManager.FindByNameAsync(dto.UserName);

                return CreateToken(user);
            }
            else
            {
                return null;
            }
        }

        private JwtSecurityToken CreateToken(User user)
        {
            var claims = new[]
                {
                    new Claim("userName", user.UserName),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("userId", user.Id.ToString())
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("kYp3s6v9y$B?E(H+MbQeThWmZq4t7w!z%C*F)J@NcRfUjXn2r5u8x/A?D(G+KaPd"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                "https://localhost:5001",
                "https://localhost:5001",
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
                );

            return token;
        }
    }
}
