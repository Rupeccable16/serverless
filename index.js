const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//above is the code to send emails, check transform it, paste it inside if(!user) block and first comment and check if proper url is being created in CW logs. Test that url and then proceed to sending emails
console.log('Loading function');
// const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: "postgres",
// });

// const Verification = sequelize.define(
//   "Verification",
//   {
//     user_id: {
//       type: DataTypes.UUID,
//       allowNull: false
//     },
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//     },
//     url: {
//       type: DataTypes.TEXT,
//       allowNull: false, 
//     },
//     url_created: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       allowNull: false     
//     },
//     expire_time: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }, 
//   },
//   {
//     timestamps: false
//   }
// )



const handler = async (event, context) => {
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


//Code for sequelize using the pooling fixes

// console.log("Loading function");
// const { Sequelize, DataTypes } = require("sequelize");

// let sequelize = null;

// async function initSequelize() {
//   return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     pool: {
//       max: 2, // Allow up to 2 connections per invocation
//       min: 0, // Clean up all connections after use
//       idle: 0, // Connections are eligible for cleanup immediately
//       acquire: 3000, // Fail fast if a connection cannot be established quickly
//       evict: parseInt(process.env.LAMBDA_FUNCTION_TIMEOUT || "60000"), // Clean up after Lambda timeout
//     },
//   });
// }

// const Verification = (sequelizeInstance) =>
//   sequelizeInstance.define(
//     "Verification",
//     {
//       user_id: {
//         type: DataTypes.UUID,
//         allowNull: false,
//       },
//       id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         allowNull: false,
//         primaryKey: true,
//       },
//       url: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       url_created: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         allowNull: false,
//       },
//       expire_time: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     },
//     {
//       timestamps: false,
//     }
//   );

// export const handler = async (event, context) => {
//   // Reuse or initialize Sequelize instance
//   if (!sequelize) {
//     sequelize = await initSequelize();
//   } else {
//     // Reinitialize the pool for warm containers
//     sequelize.connectionManager.initPools();
//     if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
//       delete sequelize.connectionManager.getConnection;
//     }
//   }

//   const VerificationModel = Verification(sequelize);

//   try {
//     // Authenticate the connection
//     await sequelize.authenticate();

//     var message = JSON.parse(event.Records[0].Sns.Message);

//     // Check for existing user
//     const user = await VerificationModel.findOne({ where: { user_id: message.user_id } });

//     if (!user) {
//       // Create a new token if user does not exist
//       const new_token = await VerificationModel.create({
//         user_id: message.user_id,
//         url: `http://localhost:5000/v1/user/activate?token=${message.user_id}`,
//         expire_time: "180000", // in milliseconds (3 min)
//       });

//       console.log("The token is", new_token.url);

//       // TODO: Send Email
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Message processed successfully" }),
//     };
//   } catch (error) {
//     console.error("Error processing event:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal Server Error", error }),
//     };
//   } finally {
//     // Close connections at the end of the invocation
//     await sequelize.connectionManager.close();
//   }
// };
