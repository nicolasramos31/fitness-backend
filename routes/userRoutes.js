const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.put("/update/:id", async (req,res)=>{

  try{

    const {name,avatar} = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {name,avatar},
      {new:true}
    );

    res.json(user);

  }catch(err){
    res.status(500).json({message:"Error updating user"});
  }

});

module.exports = router;