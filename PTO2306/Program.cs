using Microsoft.EntityFrameworkCore;
using PTO2306;
using PTO2306.Data;
using PTO2306.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.RegisterServices();
builder.RegisterSwagger();

var app = builder.Build();

app.RegisterMiddlewares();
app.MapGet("/hello", () => "Hello world!");

app.Run();