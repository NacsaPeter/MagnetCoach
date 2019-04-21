using MagnetCoach.Application.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MagnetCoach.Application.Dtos
{
    public class RegisterUserDto
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Prefix { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime BirthDay { get; set; }
    }
}
