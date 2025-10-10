using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.ExternalServices;
using WebAPI.Repositories;
using WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    var timeout = builder.Configuration.GetValue<int>("Session:IdleTimeoutMinutes", 60);
    options.IdleTimeout = TimeSpan.FromMinutes(timeout);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;

    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpClient<DictionaryApiClient>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddScoped<IWordRepository, WordRepository>();
builder.Services.AddScoped<IWordService, WordService>();
builder.Services.AddScoped<IVocabGroupRepository, VocabGroupRepository>();
builder.Services.AddScoped<IVocabGroupService, VocabGroupService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IExamRepository, ExamRepository>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<IReadingRepository, ReadingRepository>();
builder.Services.AddScoped<IReadingService, ReadingService>();
builder.Services.AddScoped<IListeningRepository, ListeningRepository>();
builder.Services.AddScoped<IListeningService, ListeningService>();
builder.Services.AddScoped<IWritingRepository, WritingRepository>();
builder.Services.AddScoped<IWritingService, WritingService>();
builder.Services.AddScoped<ISignInHistoryService, SignInHistoryService>();
builder.Services.AddScoped<OpenAIService>();

// ====== Authentication ======
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = "Google";
})
.AddCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;      
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.LoginPath = "/api/auth/google/login";       
})
.AddGoogle("Google", options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    options.CallbackPath = "/api/auth/google/response";
});


builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowReactApp");

app.UseRouting();

app.UseCookiePolicy();

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
