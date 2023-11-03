const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require("../schema/User");
const serviceProvider = require("../schema/serviceProvider");



// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { userName:'', phoneNumber:'', email: '', password: '' };

  // incorrect email
  if (err.message === 'Incorrect E-mail') {
    errors.email = '! email is not registered';
  }

  // incorrect password
  if (err.message === 'Incorrect Password') {
    errors.password = '! Incorrect password';
  }

  if (err.code === 11000) {
    errors.userName = '! user name already taken';
    return errors;
  } 

  // duplicate e-mail error
  if (err.code === 11000) {
    errors.phoneNumber = '! phone number already been registered';
    return errors;
  }

  // duplicate e-mail error
  if (err.code === 11000) {
    errors.email = '! email is already registered';
    return errors;
  }
  
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}


// create json web token
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, 'chris north secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.signup_post = async (req, res) => {
  const { userName, phoneNumber, email, password } = req.body;

  try {
    const user = await User.create( { userName, phoneNumber, email, password } );
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json( { user: user._id } );
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login( email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  } 

} 

module.exports.createServiceProvider_get = (req, res) => {
  res.render("createServiceProvider");
};

module.exports.createServiceProvider_post = async (req, res) => {
  const { brandName, email, phoneNumber, location, specialization, service, } = req.body;

  try {
    const newServiceProvider = new serviceProvider({
      brandName,
      email,
      phoneNumber,
      location,
      specialization,
      service,
      profilePicture: req.files.profilePicture[0].filename,
      certificate: req.files.certificate[0].filename,
    });

    await newServiceProvider.save();

    res.redirect("/successfullyCreatedYourServiceProviderProfile");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};


// Route to view a service provider's 
module.exports.view_Profile_get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "can't find your profile" });
    }

    // Render the profile view template
    res.render('view_Profile', { user });
  } catch (error) {
    res.status(500).json({ message: 'There was an error while retrieving your  profile' });
    console.log(error);
  }
};


module.exports.contact_post =  async (req, res, next) => {
  const { name, email, message } = req.body;

  try {
    // Create a new contact document
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    res.redirect('/home'); // Redirect to the home page or a thank-you page
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the form.');
  }
};



module.exports.contact_get =  (req, res, next) => {
  res.render('contact');
} 

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
 
