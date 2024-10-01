const express = require('express');
const router = express.Router();
const User = require('../models/User');

//post is a create part of crud
router.post("/createUser", (req, res) => {
    User.create(req.body)
        .then(User => res.json(User))
        .catch(err => res.status(500).json(err));
});

router.get("/showUserById/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId); // Find the user by userId
      if (user) {
        return res.status(200).json(user); // Send user details in the response
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put("/updateUser/:userId", async (req, res) => {
    const { userId } = req.params;
    const { username, email, password, contactNumber, address } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, {
            username,
            email,
            password,
            contactNumber,
            address
        }, { new: true });

        if (user) {
            return res.status(200).json({ message: 'User updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/deleteUser/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(userId); // Delete user by userId
      if (user) {
        return res.status(200).json({ message: 'User deleted successfully' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
