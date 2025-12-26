var builder = WebApplication.CreateBuilder(args);

// Controller'ları ekle
builder.Services.AddControllers();

var app = builder.Build();

// HTTPS yönlendirme (istersen sonra açarız)
app.UseHttpsRedirection();

// 🔴 EN ÖNEMLİ SATIR
app.MapControllers();

app.Run();
