using Microsoft.AspNetCore.Mvc;

namespace PTO2306.Controllers;

[ApiController]
[Route("/")]
public class WeatherForecastController : ControllerBase
{

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public WeatherForecast Get()
    {
        return new WeatherForecast
        {
            test = "Hello! All is well."
        };
    }
}