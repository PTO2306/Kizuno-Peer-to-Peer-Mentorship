using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace PTO2306.Services;

public class MailService(IConfiguration config) : IEmailSender
{
    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        using var client = new SmtpClient("smtp.gmail.com", 587);
        client.Credentials = new NetworkCredential(
            config["Smtp:Gmail:Email"],
            config["Smtp:Gmail:AppPassword"] 
        );
        client.EnableSsl = true;

        var mail = new MailMessage
        {
            From = new MailAddress(config["Smtp:Gmail:Email"], "SkillTrade"),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        mail.To.Add(to);

        await client.SendMailAsync(mail);
    } 
}