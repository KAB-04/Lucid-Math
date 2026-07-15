using AutoMapper;
using Microsoft.AspNetCore.Identity;
using MathTutor.Application.DTOs.Authentication;
using MathTutor.Application.Interfaces.Repositories;
using MathTutor.Application.Interfaces.Services;
using MathTutor.Domain.Entities;
using MathTutor.Domain.Identity;

namespace MathTutor.Application.Services;


public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IStudentRepository _studentRepository;
    private readonly IMapper _mapper;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthenticationService(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IStudentRepository studentRepository,
    IMapper mapper,
    IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _studentRepository = studentRepository;
        _mapper = mapper;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthenticationResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser != null)
        {
            return new AuthenticationResponse
            {
                Success = false,
                Message = "Email is already registered."
            };
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return new AuthenticationResponse
            {
                Success = false,
                Message = string.Join(" ", result.Errors.Select(e => e.Description))
            };
        }

        var student = new Student
        {
            UserId = user.Id,
            User = user,
            FullName = request.FullName,
            Email = request.Email,
            EducationLevel = request.EducationLevel
        };

        await _studentRepository.CreateAsync(student);

        var token = await _jwtTokenService.GenerateTokenAsync(user);

        return new AuthenticationResponse
        {
            Success = true,
            Message = "Registration successful.",
            Token = token,
            Expires = DateTime.UtcNow.AddMinutes(60)
        };
    }

    public async Task<AuthenticationResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            return new AuthenticationResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var validPassword = await _userManager.CheckPasswordAsync(
            user,
            request.Password);

        if (!validPassword)
        {
            return new AuthenticationResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var token = await _jwtTokenService.GenerateTokenAsync(user);

        return new AuthenticationResponse
        {
            Success = true,
            Message = "Login successful.",
            Token = token,
            Expires = DateTime.UtcNow.AddMinutes(60)
        };
    }
}