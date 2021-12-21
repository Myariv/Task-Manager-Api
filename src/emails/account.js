const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendingWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'malcayariv@gmail.com',
        subject: 'Welcome To Yarivs App',
        text: `Hello ${name} We Want Thank you Join Us!`,
    }

    sgMail.send(msg)

}


const sendingGoodByeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'malcayariv@gmail.com',
        subject: 'GoodBye Email For Left Us!',
        text: `Hello ${name} Wee Fell Sorry About You Left Us, Stay In Touch! `
    }

    sgMail.send(msg)
} 


module.exports = {
    sendingWelcomeEmail,
    sendingGoodByeEmail,
}
