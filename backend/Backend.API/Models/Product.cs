namespace Backend.API.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; }
        public int Stock { get; set; }
        public int MinStock { get; set; }
    }
}
