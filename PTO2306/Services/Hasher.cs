using System.Security.Cryptography;

namespace PTO2306.Services;

public static class Hasher
{
   public record HasherRecord(string Hash, string Salt);

   public static HasherRecord Hash(string password)
   {
      var salt = GetRandomNumber(64);
      var derivedKey = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 64);
      
      var hash = Convert.ToBase64String(derivedKey);
      var saltHash = Convert.ToBase64String(salt);
      
      return new HasherRecord(hash, saltHash);
   }

   public static bool VerifyHash(string password, string hash, string salt)
   {
      var saltByte = Convert.FromBase64String(salt);
      var derivedKey = Rfc2898DeriveBytes.Pbkdf2(password, saltByte, 100000, HashAlgorithmName.SHA256, 64);
      
      return CryptographicOperations.FixedTimeEquals(derivedKey, Convert.FromBase64String(hash));
   }

   public static byte[] GetRandomNumber(int count)
   {
      return RandomNumberGenerator.GetBytes(count);
   }
   
}