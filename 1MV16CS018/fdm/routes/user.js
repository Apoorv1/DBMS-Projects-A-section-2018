exports.delete_credentials=function(req,res){
  var userId = req.session.userId;
  var stat_id = req.query.id;
  //console.log("product="+product_id);
  var sql="DELETE FROM `statistics` WHERE `id` ='"+ userId+"'"+" AND `stat_id` ='"+stat_id+"'";
  console.log(sql);
//console.log(sql);
  db.query(sql, function(err, result){
    if(err)
    console.log(err);
    //console.log(result);
    //console.log(result[0]);
// exports.product();
  });
  var sql="SELECT * FROM `statistics` WHERE `id`='"+userId+"'";
  db.query(sql, function(err, result){
   // //console.log(result);
   // //console.log(result[0]);
    ////console.log("length="+result.length);
    //if(result.length)
    ////console.log(result[0].product_id);
    res.render('credentials.ejs', {result:result});

  });

 if(userId == null){
  res.redirect("/login");
  return;
 }


};

exports.credentials = function(req, res){

   var user =  req.session.user,
   userId = req.session.userId;
   if(req.method == "POST")
   {
     var post=req.body;
     var month = post.month;
     var raw_material_cost = post.raw_material_cost;
     var electricity = post.electricity;
     var maintainence = post.maintainence;
     console.log(post);
     //console.log(data);
     month = month+'-01'


     var sql = "INSERT INTO `statistics`(`id`,`month`,`maintainence`,`raw_material_cost`, `electricity`) VALUES ('" + userId + "','" + month + "','" + maintainence + "','" + raw_material_cost + "','" + electricity + "')";
console.log(sql);
  var query = db.query(sql, function(err, result) {
      if(err)
      console.log(err);

  });

    }

  // //console.log('fact_user='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
   var sql1="SELECT * FROM `statistics` WHERE `id`='"+userId+"'";

   db.query(sql1, function(err, result){
     console.log("results="+result);
      res.render('credentials.ejs',{result:result});
   });


    //   res.render('credentials.ejs');

};


//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   //console.log("in signup");
   if(req.method == "POST"){
      var post  = req.body;
      var email= post.email;
      var pass= post.password;
      var fname= post.fact_name;
      var name= post.name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `factory_table`(`fact_name`,`name`,`mob_no`,`email`, `password`) VALUES ('" + fname + "','" + name + "','" + mob + "','" + email + "','" + pass + "')";
//console.log(sql);
      var query = db.query(sql, function(err, result) {
        if(err)
        console.log(err);

         message = "Succesfull! Your account has been created.Please login";
	////console.log(result);
         res.render('index.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   //console.log("in signin");
   var sess = req.session;

   if(req.method == "POST"){
      var post  = req.body;
      var email= post.email;
      var pass= post.password;

      var sql="SELECT id, fact_name, name, email FROM `factory_table` WHERE `email`='"+email+"' and password = '"+pass+"'";
      db.query(sql, function(err, results){
        if(err) throw err;
      //  //console.log(results)
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
          //  //console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }

      });
   } else {
      res.render('index.ejs',{message: message});
   }

};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function(req, res, next){

   var user =  req.session.user,
   userId = req.session.userId;
   if(req.method == "POST")
   {
     var post=req.body;
     var data= post.text;
     //console.log(data);
   }
  // //console.log('fact_user='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `factory_table` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});
   });
};
exports.graph = function(req, res){


   var user =  req.session.user,
   userId = req.session.userId;
  // //console.log('fact_user='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }
var mdata='{';
var check=0;

 var sql="SELECT YEAR(month) AS year FROM `statistics` WHERE `id`='"+userId+"' GROUP BY YEAR(month)";
var data=[];
 db.query(sql, function(err, result){
   console.log(result);
   for(i=0;i<result.length;i++)
   {
     var sql1="SELECT * FROM `statistics` WHERE YEAR(month) = '"+result[i].year+"'";
     curr_year = result[i].year;
     console.log(sql1);
     db.query(sql1, function(err, year_result){
     console.log(year_result);
     var stat_tot=0;
     for(j=0;j<year_result.length;j++)
     {
       stat_tot=stat_tot+year_result[j].maintainence + year_result[j].raw_material_cost + year_result[j].electricity;
     }
     var cust_sql="SELECT * FROM `customers` WHERE YEAR(month) = '"+curr_year+"'";
     db.query(cust_sql, function(err, cust_result){
       console.log(cust_result);
       var sp=0;
       var tot_quantity=0;

       for(k=0;k<cust_result.length;k++)
       {
         stat_tot = stat_tot + cust_result[k].transportation_cost;
         sp= sp + cust_result[k].bill_amount;
         cust_id = cust_result[k].customer_id;

         ord_sql="SELECT * FROM `orders` WHERE `customer_id` = '"+cust_id+"'";
         db.query(ord_sql, function(err, ord_result){
           console.log(ord_result);
           for(y=0;y<ord_result.length;y++)
           {
             tot_quantity = tot_quantity + ord_result[y].product_quantity;
             console.log("tot_quantity="+tot_quantity);




           }







        });
        ///////






        }
        ////
        console.log("k="+k);

        if(k==cust_result.length)
        {
          console.log("=======tot_quantity"+tot_quantity);


        }
        console.log("stat_tot="+stat_tot);
        console.log("sp="+sp);
        console.log("tot_quantity="+tot_quantity);
        console.log("mdata="+mdata);
         mdata=mdata+'{ "stat_tot":"'+stat_tot+'" , "sp":"'+sp+'",  "tot_quantity":"'+tot_quantity+'"},';
         //check=1;
         console.log("i="+i);
         console.log("len"+result.length);

         if(i== result.length)
         {
         mdata = mdata +'}';
         console.log("-------");

         }
         console.log("mdata="+mdata);






     });




     });

   }
   //console.log(result[0]);
// exports.product();
 });

console.log(mdata);
      res.render('graph.ejs',{data:data});
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
exports.delete_customer=function(req,res){
  var userId = req.session.userId;
  var customer_id = req.query.id;
//  //console.log("product="+product_id);
  var sql="DELETE FROM `customers` WHERE `customer_id` ='"+ customer_id+"'";
//console.log(sql);
  db.query(sql, function(err, result){
    //console.log(result);
    //console.log(result[0]);
// exports.product();
  });
  var sql="SELECT * FROM `customers` WHERE `id`='"+userId+"'";
  var pro_sql="SELECT * FROM `products` WHERE `id`='"+userId+"'";
  var tab_result,prod_result;
  db.query(sql, function(err, result1){
 //   //console.log(result);
 //   //console.log(result[0]);
 //   //console.log("length="+result.length);
    //if(result.length)
    ////console.log(result[0].product_id);
    //res.render('customers.ejs', {result:result});

    tab_result = result1;

    db.query(pro_sql, function(err, result){
      prod_result = result;

      console.log(prod_result);
      console.log(tab_result);
        res.render('customers.ejs', {result:tab_result,prod_result:prod_result});
   });
  });

 //res.render('customers.ejs', {result:tab_result});
if(userId == null){
  res.redirect("/login");
  return;
}

};

exports.delete_product=function(req,res){
  var userId = req.session.userId;
  var product_id = req.query.id;
  //console.log("product="+product_id);
  var sql="DELETE FROM `products` WHERE `product_id` ='"+ product_id+"'";
//console.log(sql);
  db.query(sql, function(err, result){
    //console.log(result);
    //console.log(result[0]);
// exports.product();
  });
  var sql="SELECT * FROM `products` WHERE `id`='"+userId+"'";
  db.query(sql, function(err, result){
   // //console.log(result);
   // //console.log(result[0]);
    ////console.log("length="+result.length);
    //if(result.length)
    ////console.log(result[0].product_id);
    res.render('product.ejs', {result:result});

  });

 if(userId == null){
  res.redirect("/login");
  return;
 }


};
exports.product=function(req,res){
var userId = req.session.userId;
if(req.method == "POST")
{
    var post  = req.body;
  var product_name = post.product_name;
  var cost = post.cost;
  //console.log("posted");
  var sql = "INSERT INTO `products`(`id`,`product_name`,`cost`) VALUES ('" + userId + "','" + product_name + "','" + cost + "')";
  //console.log(sql);
  var query = db.query(sql, function(err, result) {
  //  if(err)
    ////console.log(err);
});
//     message = "Succesfull! Your account has been created.Please login";
//  //console.log(result);
  //  res.render('dashboard.ejs');
    //exports.product();
}


     var sql="SELECT * FROM `products` WHERE `id`='"+userId+"'";
     db.query(sql, function(err, result){
      // //console.log(result);
      // //console.log(result[0]);
       ////console.log("length="+result.length);
       //if(result.length)
       ////console.log(result[0].product_id);
       res.render('product.ejs', {result:result});

     });
  if(userId == null){
     res.redirect("/login");
     return;
  }

  };

//----------------------------customers-------------------------------------------------------------
  exports.customers=function(req,res){
  var userId = req.session.userId;
  /*   var sql2="SELECT * FROM `products` WHERE `id`='"+userId+"'";
     var resu=[];
     db.query(sql2, function(err, result1){
       //console.log("1length="+result1.length);

       for(i=0;i<result1.length;i++)
       this.resu[i] = result1[i].product_id;

       //console.log("reslength="+this.resu.length);

  });
  //console.log("outlength="+resu.length);
  for(i=0;i<resu.length;i++)
     //console.log("res="+resu[i]);
  */
  if(req.method == "POST")
  {
      var post  = req.body;
      //console.log(post);
      var pro_id=[],pro_val=[],first;
      length = Object.keys(post).length;
      //console.log(length)
      for(i=0;i<length-4;i++)
      {
       pro_id[i]= Object.keys(post)[i];
       pro_val[i]=post[pro_id[i]];
       //console.log(pro_val[i]);

      }




    var customer_name = post.customer_name;
    var product_quantity = post.product_quantity;
    var month  = post.month;
    var transportation_cost = post.transportation_cost;
    var bill_amount = post.bill_amount;



    //console.log("posted");
    var sql = "INSERT INTO `customers`(`id`,`customer_name`,`month`,`transportation_cost`,`bill_amount`) VALUES ('" + userId + "','" + customer_name + "','" + month  + "','"+transportation_cost + "','" + bill_amount+"')";
    //console.log(sql);
    var query = db.query(sql, function(err, result) {
    //  if(err)
      ////console.log(err);
  });
  //     message = "Succesfull! Your account has been created.Please login";
  //  //console.log(result);
    //  res.render('dashboard.ejs');
      //exports.product();
      if(userId == null){
         res.redirect("/login");
         return;
      }
      var sql="SELECT * FROM `customers` WHERE `customer_name`='"+customer_name+"'";

      db.query(sql, function(err, result1){
        cust_id = result1[0].customer_id;
        for(i=0;i<pro_id.length;i++)
        {

        var sql3 = "INSERT INTO `orders`(`customer_id`,`product_id`,`product_quantity`) VALUES ('" + cust_id + "','" + pro_id[i] + "','" + pro_val[i]+"')";
        //console.log(sql3);
        db.query(sql3, function(err, result1){
        });

      }
    });






  }


       var sql="SELECT * FROM `customers` WHERE `id`='"+userId+"'";
       var pro_sql="SELECT * FROM `products` WHERE `id`='"+userId+"'";
       var tab_result,prod_result;
       db.query(sql, function(err, result1){
      //   //console.log(result);
      //   //console.log(result[0]);
      //   //console.log("length="+result.length);
         //if(result.length)
         ////console.log(result[0].product_id);
         //res.render('customers.ejs', {result:result});

         tab_result = result1;

         db.query(pro_sql, function(err, result){
           prod_result = result;

           console.log(prod_result);
           console.log(tab_result);
             res.render('customers.ejs', {result:tab_result,prod_result:prod_result});
        });
       });

      //res.render('customers.ejs', {result:tab_result});
    if(userId == null){
       res.redirect("/login");
       return;
    }

    };

//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `factory_table` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, result){
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit factory_table details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `factory_table` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};
