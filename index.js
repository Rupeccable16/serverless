const {SecretsManagerClient, GetSecretValueCommand} = require('@aws-sdk/client-secrets-manager');
const sgMail = require('@sendgrid/mail')
const client = new SecretsManagerClient({
  region: "us-east-1"
})


console.log('Loading function');

async function getSendGridApiKey() {
  const secretName = "sendgrid_api_key"
  try{
    const command = GetSecretValueCommand({SecretId: secretName});
    const result = await client.send(command);

    if ("SecretString" in data){
      console.log('Found secret')
      return JSON.parse(data.SecretString)
    }

  } catch(error){
    console.log(error)
  }
}


//sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const handler = async (event, context) => {
  const apiKey = await getSendGridApiKey();
  sgMail.setApiKey(apiKey)
  console.log('Connected to sendgrid successfully');
  var message = JSON.parse(event.Records[0].Sns.Message);

  var email = message.email
  var url = message.url

  const msg = {
    to: email, // Change to your recipient
    from: 'noreply@rupeshrokade.me', // Change to your verified sender
    subject: 'Activate your account',
    text: 'Hello user',
    html: `<!DOCTYPE html>
        <html lang="en"><head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
          <style>         
            body {
               font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;             
              margin: 0;             
              color: #333;         
            }    
            .container{
            background-color: #ffffff;
             padding: 40px;             
           border-radius: 8px;
           
            max-width: 600px;    
            }
            .content {   
             border-top: 2px solid black;
                    border-left: 2px solid black;
                    border-right: 2px solid black;
                    border-bottom: 2px solid #E3F4F4;
            background-color: #F8F6F4;
            padding: 40px;             
           border-radius: 8px 8px 0 0;           
            max-width: 600px;             
                       
            text-align: center;
             }         
            .button {             
            background-color: #C4DFDF;            	
           color: black;             
            padding: 16px;             
            text-decoration: none;             
            border-radius: 8px;             
            display: inline-block;
            border: none;          
                   
            }         
            .footer {        
             border-top: none;
                    border-left: 2px solid black;
                    border-right: 2px solid black;
                    border-bottom: 2px solid black;
             padding: 20px 40px;             
              background: #C4DFDF;             
              border-bottom-left-radius: 8px;             
              border-bottom-right-radius: 8px;
             text-align: center;             
              font-size: 12px;         
            }         
            .footer a {             
            color: #1C63EE;             
            text-decoration: none;
             }         
            .security-notice {             
            font-size: 12px;            
          color: #666;            
            margin-top: 20px;         }         
            .no-reply {
                 font-size: 10px;             
              color: #999;         }     
          </style>
        </head> 
          <body>     
            <div class="container">
            <div class="content">         
            <h2>A very warm welcome from us!</h2>
            <p>Thank you for signing up with our application!</p> 
            <p>Before you can start using our services, please verify your email address:</p>
                <button class="button"><a href=${url}>Verification</a></button>
        
        <p class="security-notice">If you cannot access your verification, use this:<br><a href=${url}>${url}</a></p>
              <p class="security-notice">Didn't create an account on our platform? please ignore this email.</p>
            </div>
            <div class="footer">
              <p>This email is automated, please <b> do not reply</b> to this.
                <p>You may contact us at <a href="mailto:support@rupeshrokade.me">support</a> for any assistance
           
                
                
        
                <h4>
                Regards,<br>
                TheTeam@rupeshrokade.me
            </h4>
            
          </body>
         </html> 
        
        `,
  }
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })


  console.log('The token is ', url);
  console.log('The email was ', email)
  

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Message processed successfully' }),
  };
};

module.exports = { handler };