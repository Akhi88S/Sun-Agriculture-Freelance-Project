var express = require("express");
var router = express.Router();

/* Mail */

var nodemailer = require("nodemailer");
var app = express();
const { google } = require("googleapis");

// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   "21979576699-gknr4jtpoh3hti14114ovhdjkfad96oi.apps.googleusercontent.com", // ClientID
//   "43k_18gXRAjJZDAj-InvUXoI", // Client Secret
//   "https://developers.google.com/oauthplayground" // Redirect URL
// );
// oauth2Client.setCredentials({
//   refresh_token:
//     "1//04HEpRVsZfmS3CgYIARAAGAQSNwF-L9IrsADrW9tSP2fpeu80RZPnp-plGVit5NseVnGOmv_MnTFnZkTosJUw1rSnUvZfq-7wwv8",
// });
// const accessToken = oauth2Client.getAccessToken();

/* Mail */

// get Page model
var Page = require("../models/page");

/*
 * GET /
 */

var count = 0;
router.get("/", function (req, res, next) {
  /* Mail */

  if (typeof req.session.count == "undefined") {
    req.session.count = 1;

    //   var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       type: "OAuth2",
    //       user: 'weirdzombies',
    //       clientId: "21979576699-gknr4jtpoh3hti14114ovhdjkfad96oi.apps.googleusercontent.com",
    //       clientSecret: "43k_18gXRAjJZDAj-InvUXoI",
    //       refreshToken: "1//04HEpRVsZfmS3CgYIARAAGAQSNwF-L9IrsADrW9tSP2fpeu80RZPnp-plGVit5NseVnGOmv_MnTFnZkTosJUw1rSnUvZfq-7wwv8",
    //       accessToken: accessToken
    //       //pass: 'Weirdzombiegmail33$'
    //     },
    //     tls: {
    //       rejectUnauthorized: false
    //     }
    //   });

    //   var mailOptions2 = {
    //     from: ['weirdzombies@gmail.com'],
    //     to:['akhilkanapala@gmail.com','weirdzombies@gmail.com'],
    //     subject: 'New Visitor For Sun Farmer Veggies',
    //     html: `<h3>There's a new visitor</h3>`,
    //     headers: {
    //       'priority': 'high',
    //   },

    //     };
    // transporter.sendMail(mailOptions2, function(error, info){
    //   if (error) {
    //     console.log("This is an error "+error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // });

    this.setTimeout(function () {
      delete req.session.destroy();
    }, 300000);
  }

  /* Mail */

  Page.findOne({ slug: "home" }, function (err, page) {
    if (err) console.log(err);

    res.render("index", {
      title: "Sun Farmer Veggies",
      content: "AA",
    });
  });
});

/*
 * GET a page
 */
router.get("/:slug", function (req, res, next) {
  var slug = req.params.slug;

  Page.findOne({ slug: slug }, function (err, page) {
    if (err) console.log(err);

    if (!page) {
      res.redirect("/");
    } else {
      res.render("index", {
        title: page.title,
        content: page.content,
        slug: page.slug,
      });
    }
  });
});

module.exports = router;
