public class ImageSaveHelper
{
    public static string SaveImage(IFormFile image)
    {


        string path = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, "wwwroot/img"));
        //1.jpg -> новое_имя.jpg
        string ext = Path.GetExtension(image.FileName);

        string newName = Guid.NewGuid().ToString() + ext;

        using (var fileStream = new FileStream(Path.Combine(path, newName), FileMode.Create))
        {
            image.CopyTo(fileStream);
        }
        return newName;
    }
}