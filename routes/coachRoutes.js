router.put("/set-goals/:userId", async (req,res)=>{

  try{

    const {weight,focus,notes} = req.body;

    const user = await User.findByIdAndUpdate(

      req.params.userId,

      {
        goals:{
          weight,
          focus,
          notes
        }
      },

      {new:true}

    );

    res.json(user);

  }catch(err){

    res.status(500).json({message:"Error updating goals"});

  }

});