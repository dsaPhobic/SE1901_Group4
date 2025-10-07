using MailKit.Net.Smtp;
using MimeKit;
using System.Text;

namespace WebAPI.ExternalServices
{
    public interface IEmailService
    {
        void SendOtpEmail(string email, string otpCode);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public void SendOtpEmail(string email, string otpCode)
        {
            try
            {
                _logger.LogInformation($"Attempting to send OTP email to {email}");
                
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("IELTS Learning Platform", _configuration["Email:FromEmail"]));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "Password Reset OTP - IELTS Learning Platform";

                var bodyBuilder = new BodyBuilder();
                bodyBuilder.HtmlBody = CreateOtpEmailTemplate(otpCode);

                message.Body = bodyBuilder.ToMessageBody();

                _logger.LogInformation($"Connecting to SMTP server: {_configuration["Email:SmtpServer"]}:{_configuration["Email:SmtpPort"]}");

                using var client = new SmtpClient();
                
                // Use STARTTLS for port 587, SSL for port 465
                var port = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var useSsl = bool.Parse(_configuration["Email:UseSsl"] ?? "true");
                
                if (port == 587)
                {
                    // Port 587 uses STARTTLS
                    client.Connect(_configuration["Email:SmtpServer"], port, MailKit.Security.SecureSocketOptions.StartTls);
                }
                else if (port == 465)
                {
                    // Port 465 uses direct SSL
                    client.Connect(_configuration["Email:SmtpServer"], port, MailKit.Security.SecureSocketOptions.SslOnConnect);
                }
                else
                {
                    // Fallback to configuration setting
                    client.Connect(_configuration["Email:SmtpServer"], port, useSsl ? MailKit.Security.SecureSocketOptions.SslOnConnect : MailKit.Security.SecureSocketOptions.None);
                }
                
                _logger.LogInformation("SMTP connection established, authenticating...");
                
                client.Authenticate(_configuration["Email:Username"], 
                    _configuration["Email:Password"]);
                
                _logger.LogInformation("Authentication successful, sending email...");
                
                client.Send(message);
                client.Disconnect(true);

                _logger.LogInformation($"OTP email sent successfully to {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send OTP email to {email}. Error: {ex.Message}");
                throw;
            }
        }

        private string CreateOtpEmailTemplate(string otpCode)
        {
            return $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Password Reset OTP</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }}
                        .container {{
                            background-color: #f9f9f9;
                            padding: 30px;
                            border-radius: 10px;
                            border: 1px solid #ddd;
                        }}
                        .header {{
                            text-align: center;
                            margin-bottom: 30px;
                        }}
                        .logo {{
                            font-size: 24px;
                            font-weight: bold;
                            color: #2c3e50;
                        }}
                        .otp-container {{
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                            margin: 20px 0;
                            border: 2px solid #3498db;
                        }}
                        .otp-code {{
                            font-size: 32px;
                            font-weight: bold;
                            color: #2c3e50;
                            letter-spacing: 5px;
                            margin: 10px 0;
                        }}
                        .warning {{
                            background-color: #fff3cd;
                            border: 1px solid #ffeaa7;
                            color: #856404;
                            padding: 15px;
                            border-radius: 5px;
                            margin: 20px 0;
                        }}
                        .footer {{
                            text-align: center;
                            margin-top: 30px;
                            color: #666;
                            font-size: 14px;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <div class='logo'>IELTS Learning Platform</div>
                        </div>
                        
                        <h2>Password Reset Request</h2>
                        <p>You have requested to reset your password. Please use the following OTP code to proceed:</p>
                        
                        <div class='otp-container'>
                            <p><strong>Your OTP Code:</strong></p>
                            <div class='otp-code'>{otpCode}</div>
                        </div>
                        
                        <div class='warning'>
                            <strong>Important:</strong>
                            <ul>
                                <li>This OTP code will expire in 10 minutes</li>
                                <li>Do not share this code with anyone</li>
                                <li>If you didn't request this password reset, please ignore this email</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions, please contact our support team.</p>
                        
                        <div class='footer'>
                            <p>© 2025 IELTS Learning Platform. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";
        }
    }
}
